import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import Stage from "../components/experienceUpload/Stage";
import ProjectInfoForm from "../components/experienceUpload/ProjectInfoForm";
import MaterialUploadForm from "../components/experienceUpload/MaterialUploadForm";
import LoadingStage from "../components/experienceUpload/LoadingStage";
import AiReviewStage from "../components/experienceUpload/AiReviewStage";
import ExperienceCandidatesStage from "../components/experienceUpload/ExperienceCandidatesStage";
import { createProject, updateProject, uploadProjectFile } from "../apis/projectApi";
import { startAnalysis } from "../apis/analysisApi";

const Page = styled.div`
  min-height: 100vh;
  background: white;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 720px;
  margin: 0 auto;
  padding: 12px 40px 60px;

  @media (max-width: 720px) {
    padding: 12px 20px 60px;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: #e5484d;
  font-size: 14px;
  text-align: center;
`;

const STATUS_MAP = {
  "진행 중": "IN_PROGRESS",
  완료: "COMPLETED",
};

// "2024.03" → "2024-03-01" -- 형식이 다르면 null
function toDate(value) {
  const match = value.trim().match(/^(\d{4})\.(\d{1,2})$/);
  return match ? `${match[1]}-${match[2].padStart(2, "0")}-01` : null;
}

export default function ExperienceUploadPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadPhase, setUploadPhase] = useState("form");
  const [projectId, setProjectId] = useState(null);
  const [runId, setRunId] = useState(null);
  const [error, setError] = useState("");

  const handleProjectInfoNext = async (data) => {
    setError("");
    const body = {
      name: data.projectName,
      status: STATUS_MAP[data.status],
      activityType: data.activityType,
      userRole: data.role,
      startedAt: toDate(data.periodStart),
      endedAt: toDate(data.periodEnd),
      description: data.summary || null,
    };

    try {
      if (projectId) {
        await updateProject(projectId, body);
      } else {
        const { data: project } = await createProject(body);
        setProjectId(project.id);
      }
      setCurrentStep(2);
      setUploadPhase("form");
    } catch {
      setError("프로젝트를 저장하지 못했어요. 다시 시도해주세요.");
    }
  };

  const handleMaterialsNext = async (files) => {
    setError("");
    setUploadPhase("loading");

    try {
      const fileIds = [];
      for (const file of files) {
        const { data: uploaded } = await uploadProjectFile(projectId, file);
        fileIds.push(uploaded.id);
      }
      const { data: run } = await startAnalysis(projectId, fileIds);
      console.log("분석 runId:", run.id);
      setRunId(run.id);
    } catch {
      setUploadPhase("form");
      setError("자료를 올리지 못했어요. 다시 시도해주세요.");
    }
  };

  const handleSkipMaterials = () => {
    navigate(`/archive/${projectId}`);
  };

  const handleLoadingComplete = () => {
    setCurrentStep(3);
    setUploadPhase("form");
  };

  const handleLoadingError = () => {
    setUploadPhase("form");
    setError("자료 분석에 실패했어요. 다시 시도해주세요.");
  };

  return (
    <Page>
      <AppHeader pageTitle="경험 정리하기" />
      <Main>
        <Stage currentStep={currentStep} />

        {error && <ErrorText>{error}</ErrorText>}

        {currentStep === 1 && <ProjectInfoForm onNext={handleProjectInfoNext} />}
        {currentStep === 2 && uploadPhase === "form" && (
          <MaterialUploadForm
            onPrev={() => setCurrentStep(1)}
            onNext={handleMaterialsNext}
            onSkip={handleSkipMaterials}
          />
        )}
        {currentStep === 2 && uploadPhase === "loading" && (
          <LoadingStage
            runId={runId}
            onComplete={handleLoadingComplete}
            onError={handleLoadingError}
          />
        )}
        {currentStep === 3 && (
          <AiReviewStage onComplete={() => setCurrentStep(4)} />
        )}
        {currentStep === 4 && <ExperienceCandidatesStage runId={runId} />}
      </Main>
    </Page>
  );
}