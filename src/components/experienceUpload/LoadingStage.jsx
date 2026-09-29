import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import spinnerIcon from "../../assets/icons/experienceUpload/spinner.svg";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 108px 40px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primaryLight};
`;

const SpinnerImg = styled.img`
  width: 32px;
  height: 32px;
  animation: ${spin} 1s linear infinite;
`;

const Heading = styled.h2`
  margin-top: 28px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  text-align: center;
`;

const Description = styled.p`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
  line-height: 27.2px;
  text-align: center;
`;

const ProgressTrack = styled.div`
  width: 300px;
  max-width: 100%;
  height: 6px;
  margin-top: 36px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $progress }) => $progress}%;
  transition: width 0.2s ease-out;
`;

const Caption = styled.p`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  text-align: center;
`;

export default function LoadingStage({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 12 + 4, 100));
    }, 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const timeout = setTimeout(() => onComplete?.(), 400);
    return () => clearTimeout(timeout);
  }, [progress, onComplete]);

  return (
    <Wrapper>
      <IconCircle>
        <SpinnerImg src={spinnerIcon} alt="" />
      </IconCircle>
      <Heading>LogFolio가 자료를 읽고 있어요</Heading>
      <Description>
        자료에서 경험과 역할을 파악하고 있어요.
        <br />
        잠시만 기다려주세요.
      </Description>
      <ProgressTrack
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <ProgressFill $progress={progress} />
      </ProgressTrack>
      <Caption>경험 후보 발견 중...</Caption>
    </Wrapper>
  );
}
