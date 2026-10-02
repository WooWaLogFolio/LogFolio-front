import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import iconDoc from "../../assets/images/icon-onboarding-doc.svg";
import iconPerson from "../../assets/images/icon-onboarding-person.svg";
import iconChat from "../../assets/images/icon-onboarding-chat.svg";
import { PrimaryButton, TextLinkButton } from "../common/Button";

const steps = [
  {
    icon: iconDoc,
    heading: "경험은 쌓이는데, 정리할 시간이 없죠?",
    description: [
      "LogFolio는 내 프로젝트 자료를",
      "AI가 읽고 경험카드로 편리하게 정리해 드려요.",
    ],
  },
  {
    icon: iconPerson,
    heading: "자료를 올리면 AI가 경험을 찾아요",
    description: [
      "발표자료, 회의록, 기획서, 문서 등을 올리면",
      "LogFolio가 내 경험을 분석해요",
    ],
  },
  {
    icon: iconChat,
    heading: "경험카드로 언제든 꺼낼 수 있어요",
    description: [
      "자소서, 포트폴리오, 면접 준비까지",
      "내 경험을 빠르게 찾고 활용할 수 있어요.",
    ],
  },
];

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bgOverlay};
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  padding: 48px 40px 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;

  img {
    width: 22px;
    height: 22px;
  }

  span {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 40px;

  img {
    width: 56px;
    height: 56px;
  }
`;

const Heading = styled.h2`
  padding-top: 28px;
  font-size: ${({ theme }) => theme.fonts.h2.fontSize};
  font-weight: ${({ theme }) => theme.fonts.h2.fontWeight};
  letter-spacing: ${({ theme }) => theme.fonts.h2.letterSpacing};
  color: ${({ theme }) => theme.colors.textDark};
  text-align: center;
`;

const Description = styled.div`
  padding-top: 14px;
  font-size: 16px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.textGray};
  text-align: center;

  p {
    margin: 0;
  }
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 40px 0 28px;
`;

const Dot = styled.span`
  height: 6px;
  width: ${({ $active }) => ($active ? "20px" : "6px")};
  border-radius: 100px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
`;

const ButtonArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export default function OnboardingModal() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex === steps.length - 1;
  const step = steps[stepIndex];

  const goToApp = () => navigate("/experience-upload");

  const handleNext = () => {
    if (isLastStep) {
      goToApp();
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  return (
    <Overlay>
      <ModalBox>
        <LogoRow>
          <img src={logo} alt="LogFolio" />
          <span>LogFolio</span>
        </LogoRow>

        <IconWrapper>
          <img src={step.icon} alt="" />
        </IconWrapper>

        <Heading>{step.heading}</Heading>

        <Description>
          {step.description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Description>

        <Dots>
          {steps.map((s, index) => (
            <Dot key={s.heading} $active={index === stepIndex} />
          ))}
        </Dots>

        <ButtonArea>
          <PrimaryButton type="button" onClick={handleNext}>
            {isLastStep ? "첫 프로젝트 정리해보기 →" : "다음"}
          </PrimaryButton>
          {!isLastStep && (
            <TextLinkButton type="button" onClick={goToApp}>
              건너뛰기
            </TextLinkButton>
          )}
        </ButtonArea>
      </ModalBox>
    </Overlay>
  );
}
