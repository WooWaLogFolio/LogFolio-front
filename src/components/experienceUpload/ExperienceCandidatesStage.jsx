import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CandidateCard from "./CandidateCard";
import SegmentedProgress from "./SegmentedProgress";
import { NextButton } from "../common/Button";

const CANDIDATES = [
  {
    id: 1,
    title: "사용자 문제를 재정의한 경험",
    description:
      "사용자 인터뷰에서 반복되는 문제를 발견해 기존 서비스 방향과 MVP 우선순위를 다시 정의한 경험",
    tags: ["문제정의", "사용자 리서치"],
    sections: [
      {
        label: "핵심 판단",
        text: "사용자에게 새로운 기록을 더 요구하기보다, 이미 존재하는 자료에서 경험을 먼저 찾아주는 것이 핵심 가치가 되어야 한다고 판단했다.",
      },
      {
        label: "결과와 변화",
        text: "서비스 핵심 Flow가 직접 기록 → AI 질문 중심에서 자료 업로드 → AI 선분석 → 사용자 확인 중심으로 변경됐다.",
      },
      {
        label: "결과와 변화",
        text: "서비스 핵심 Flow가 직접 기록 → AI 질문 중심에서 자료 업로드 → AI 선분석 → 사용자 확인 중심으로 변경됐다.",
      },
    ],
  },
  {
    id: 2,
    title: "MVP 기능 우선순위를 정한 경험",
    description:
      "MVP 기능 후보 8개 중 사용자 핵심 문제 해결 여부와 개발 가능성을 기준으로 핵심 기능을 선정한 경험",
    tags: ["기획", "우선순위 결정"],
    sections: [
      {
        label: "핵심 판단",
        text: "모든 기능을 다 구현하기보다, 5주 안에 검증 가능한 핵심 기능에 집중하는 것이 중요하다고 판단했다.",
      },
      {
        label: "결과와 변화",
        text: "8개 후보 기능에서 핵심 3개 기능으로 범위를 좁혀 개발 일정과 리소스를 집중할 수 있었다.",
      },
    ],
  },
  {
    id: 3,
    title: "공모전 발표를 기획하고 진행한 경험",
    description: "기획 담당으로서 문제 정의부터 발표까지 전체 스토리라인을 설계하고 팀을 이끈 경험",
    tags: ["발표 기획", "팀 리딩"],
    sections: [
      {
        label: "핵심 판단",
        text: "심사위원이 발표 초반에 문제의 심각성을 체감하게 만드는 것이 핵심이라고 판단했다.",
      },
      {
        label: "결과와 변화",
        text: "발표 구성을 문제 → 검증 → 해결 순으로 재구성해 팀 프로젝트가 공모전 본선에 진출했다.",
      },
    ],
  },
];

const Wrapper = styled.div`
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Description = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
`;

const ProgressWrap = styled.div`
  margin-top: 24px;
`;

const CardWrap = styled.div`
  margin-top: 28px;
`;

const CompleteWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  text-align: center;
`;

const CompleteHeading = styled.h2`
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

const CompleteDescription = styled.p`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
  line-height: 27px;
`;

const CompleteButton = styled(NextButton)`
  width: 240px;
  margin-top: 32px;
`;

export default function ExperienceCandidatesStage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [includedCount, setIncludedCount] = useState(0);
  const [done, setDone] = useState(false);

  const total = CANDIDATES.length;

  const advance = () => {
    if (currentIndex >= total - 1) {
      setDone(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleExclude = () => advance();
  const handleNext = () => {
    setIncludedCount((prev) => prev + 1);
    advance();
  };

  if (done) {
    return (
      <CompleteWrap>
        <CompleteHeading>경험 정리가 완료됐어요!</CompleteHeading>
        <CompleteDescription>
          총 {total}개의 경험 후보 중 {includedCount}개를 아카이브에 추가했어요.
        </CompleteDescription>
        <CompleteButton type="button" onClick={() => navigate("/archive")}>
          아카이브로 이동
        </CompleteButton>
      </CompleteWrap>
    );
  }

  const candidate = CANDIDATES[currentIndex];

  return (
    <Wrapper>
      <Heading>이 프로젝트에서 {total}개의 경험을 찾았어요.</Heading>
      <Description>하나씩 확인하고 포함할 경험을 선택해주세요.</Description>

      <ProgressWrap>
        <SegmentedProgress total={total} currentIndex={currentIndex} label="경험 후보 확인 진행률" />
      </ProgressWrap>

      <CardWrap>
        <CandidateCard
          index={currentIndex}
          total={total}
          title={candidate.title}
          description={candidate.description}
          tags={candidate.tags}
          sections={candidate.sections}
          onExclude={handleExclude}
          onNext={handleNext}
        />
      </CardWrap>
    </Wrapper>
  );
}
