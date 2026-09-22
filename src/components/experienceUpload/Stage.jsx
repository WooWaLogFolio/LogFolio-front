import styled from "styled-components";

const steps = [
  { step: 1, label: "프로젝트 정보" },
  { step: 2, label: "자료 추가" },
  { step: 3, label: "AI 해석 확인" },
  { step: 4, label: "경험 후보" },
];

const StageBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 0;
`;

const StepItem = styled.div`
  display: flex;
  flex: ${({ $withLine }) => ($withLine ? "1 1 auto" : "0 0 auto")};
  align-items: center;
  gap: 6px;
`;

const StepNumber = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background: ${({ $done, theme }) => ($done ? theme.colors.primary : theme.colors.border)};
  color: ${({ $done, theme }) => ($done ? theme.colors.white : theme.colors.textGray)};
  font-size: 12px;
  font-weight: 700;
`;

const StepLabel = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, $completed, theme }) =>
    $active || $completed ? theme.colors.textDark : theme.colors.textGray};
`;

const StepLine = styled.span`
  flex: 1 1 auto;
  height: 1px;
  min-width: 16px;
  margin: 0 8px;
  background: ${({ $completed, theme }) => ($completed ? theme.colors.primary : theme.colors.border)};
`;

export default function Stage({ currentStep = 1 }) {
  return (
    <StageBar aria-label="진행 단계">
      {steps.map(({ step, label }, index) => {
        const completed = step < currentStep;
        const active = step === currentStep;
        const withLine = index < steps.length - 1;
        return (
          <StepItem key={step} $withLine={withLine}>
            <StepNumber $done={completed || active}>{completed ? "✓" : step}</StepNumber>
            <StepLabel $active={active} $completed={completed}>
              {label}
            </StepLabel>
            {withLine && <StepLine $completed={completed} />}
          </StepItem>
        );
      })}
    </StageBar>
  );
}
