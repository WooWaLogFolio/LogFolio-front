import { useState } from "react";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import Stage from "../components/experienceUpload/Stage";
import ProjectInfoForm from "../components/experienceUpload/ProjectInfoForm";
import MaterialUploadForm from "../components/experienceUpload/MaterialUploadForm";
import LoadingStage from "../components/experienceUpload/LoadingStage";
import AiReviewStage from "../components/experienceUpload/AiReviewStage";
import ExperienceCandidatesStage from "../components/experienceUpload/ExperienceCandidatesStage";

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

export default function ExperienceUploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadPhase, setUploadPhase] = useState("form");
  const [, setProjectInfo] = useState(null);
  const [, setMaterials] = useState([]);

  const handleProjectInfoNext = (data) => {
    setProjectInfo(data);
    setCurrentStep(2);
    setUploadPhase("form");
  };

  const handleMaterialsNext = (files) => {
    setMaterials(files);
    setUploadPhase("loading");
  };

  const handleSkipMaterials = () => {
    setMaterials([]);
    setCurrentStep(3);
    setUploadPhase("form");
  };

  const handleLoadingComplete = () => {
    setCurrentStep(3);
    setUploadPhase("form");
  };

  return (
    <Page>
      <AppHeader pageTitle="경험 정리하기" />
      <Main>
        <Stage currentStep={currentStep} />

        {currentStep === 1 && <ProjectInfoForm onNext={handleProjectInfoNext} />}
        {currentStep === 2 && uploadPhase === "form" && (
          <MaterialUploadForm
            onPrev={() => setCurrentStep(1)}
            onNext={handleMaterialsNext}
            onSkip={handleSkipMaterials}
          />
        )}
        {currentStep === 2 && uploadPhase === "loading" && (
          <LoadingStage onComplete={handleLoadingComplete} />
        )}
        {currentStep === 3 && (
          <AiReviewStage onComplete={() => setCurrentStep(4)} />
        )}
        {currentStep === 4 && <ExperienceCandidatesStage />}
      </Main>
    </Page>
  );
}
