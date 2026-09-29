import { useState } from "react";
import styled from "styled-components";
import TextField from "../common/TextField";
import { ToggleButton, TagButton, NextButton } from "../common/Button";

const STATUS_OPTIONS = ["진행 중", "완료"];

const ACTIVITY_TYPES = [
  "팀 프로젝트",
  "공모전·해커톤",
  "대외활동",
  "동아리",
  "수업",
  "인턴·아르바이트",
  "개인 프로젝트",
  "기타",
];

const ROLE_OPTIONS = ["서비스 기획", "UX 디자인", "개발", "마케팅", "데이터 분석", "리서치"];

const Wrapper = styled.div`
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Description = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
  line-height: 28px;
`;

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 36px 0;
`;

const FieldLabel = styled.span`
  display: block;
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const RequiredMark = styled.span`
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
`;

const PlainInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textDark};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PeriodInputWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const PeriodDash = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
`;

const PeriodStatic = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
`;

const CustomRoleInput = styled(PlainInput)`
  margin-top: 8px;
`;

export default function ProjectInfoForm({ onNext }) {
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState("");
  const [activityType, setActivityType] = useState("");
  const [role, setRole] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [summary, setSummary] = useState("");

  const isOngoing = status === "진행 중";
  const isValid = Boolean(
    projectName.trim() && status && activityType && role.trim(),
  );

  const handleNext = () => {
    if (!isValid) return;
    onNext?.({
      projectName,
      status,
      activityType,
      role,
      periodStart,
      periodEnd: isOngoing ? "" : periodEnd,
      summary,
    });
  };

  return (
    <Wrapper>
      <Heading>프로젝트 기본 정보</Heading>
      <Description>LogFolio가 경험을 더 잘 정리할 수 있도록 간단히 알려주세요.</Description>

      <FieldList>
        <TextField
          id="projectName"
          label="프로젝트명"
          requiredMark
          placeholder="예) 스타트업 공모전 서비스 기획"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <div>
          <FieldLabel>
            진행 상태
            <RequiredMark aria-hidden="true">*</RequiredMark>
          </FieldLabel>
          <ButtonRow role="group" aria-label="진행 상태">
            {STATUS_OPTIONS.map((option) => (
              <ToggleButton
                key={option}
                type="button"
                $active={status === option}
                aria-pressed={status === option}
                onClick={() => setStatus(option)}
              >
                {option}
              </ToggleButton>
            ))}
          </ButtonRow>
        </div>

        <div>
          <FieldLabel>
            활동 유형
            <RequiredMark aria-hidden="true">*</RequiredMark>
          </FieldLabel>
          <ButtonRow role="group" aria-label="활동 유형">
            {ACTIVITY_TYPES.map((option) => (
              <TagButton
                key={option}
                type="button"
                $active={activityType === option}
                aria-pressed={activityType === option}
                onClick={() => setActivityType(option)}
              >
                {option}
              </TagButton>
            ))}
          </ButtonRow>
        </div>

        <div>
          <FieldLabel>
            내 역할
            <RequiredMark aria-hidden="true">*</RequiredMark>
          </FieldLabel>
          <ButtonRow role="group" aria-label="내 역할">
            {ROLE_OPTIONS.map((option) => (
              <TagButton
                key={option}
                type="button"
                $active={role === option}
                aria-pressed={role === option}
                onClick={() => setRole(option)}
              >
                {option}
              </TagButton>
            ))}
          </ButtonRow>
          <CustomRoleInput
            type="text"
            placeholder="직접 입력 (예: PM, 기획자)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>기간</FieldLabel>
          <PeriodRow>
            <PeriodInputWrap>
              <PlainInput
                type="text"
                placeholder="2024.03"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </PeriodInputWrap>
            <PeriodDash>—</PeriodDash>
            {isOngoing ? (
              <PeriodStatic>진행 중</PeriodStatic>
            ) : (
              <PeriodInputWrap>
                <PlainInput
                  type="text"
                  placeholder="2024.06"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </PeriodInputWrap>
            )}
          </PeriodRow>
        </div>

        <TextField
          id="summary"
          label="프로젝트 한 줄 설명"
          placeholder="예) 대학생 대상 경험 정리 서비스 기획 공모전 (선택)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </FieldList>

      <NextButton type="button" disabled={!isValid} onClick={handleNext}>
        다음: 자료 추가 →
      </NextButton>
    </Wrapper>
  );
}
