import { useState } from "react";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import Stage from "../components/experienceUpload/Stage";
import ProjectInfoForm from "../components/experienceUpload/ProjectInfoForm";

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

const ComingSoon = styled.div`
  padding: 80px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
`;

export default function ExperienceUploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setProjectInfo] = useState(null);

  const handleProjectInfoNext = (data) => {
    setProjectInfo(data);
    setCurrentStep(2);
  };

  return (
    <Page>
      <AppHeader pageTitle="경험 정리하기" />
      <Main>
        <Stage currentStep={currentStep} />

        {currentStep === 1 && <ProjectInfoForm onNext={handleProjectInfoNext} />}
        {currentStep === 2 && (
          <ComingSoon>자료 추가 단계는 준비 중입니다.</ComingSoon>
        )}
        {currentStep === 3 && (
          <ComingSoon>AI 해석 확인 단계는 준비 중입니다.</ComingSoon>
        )}
        {currentStep === 4 && (
          <ComingSoon>경험 후보 단계는 준비 중입니다.</ComingSoon>
        )}
      </Main>
    </Page>
  );
}
