import { useState } from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import SegmentedProgress from "./SegmentedProgress";

const CANDIDATES = [
  {
    id: 1,
    summary:
      '사용자 인터뷰를 통해 "경험을 다시 설명하기 어려운 문제"를 발견하고, 이를 서비스의 핵심 문제로 재정의한 것으로 보여요.',
    evidence: {
      badge: "DOCX",
      fileName: "사용자인터뷰_정리.docx",
      pageLabel: "P.3",
      quote:
        '"10명 중 7명이 활동 경험 기록보다 지원 시점에 경험을 다시 정리하는 과정에서 더 큰 어려움을 느꼈다."',
    },
  },
  {
    id: 2,
    summary:
      '사용자 인터뷰를 통해 "경험을 다시 설명하기 어려운 문제"를 발견하고, 이를 서비스의 핵심 문제로 재정의한 것으로 보여요.',
    evidence: {
      badge: "PDF",
      fileName: "기획서_v3.pdf",
      pageLabel: "P.1–2",
      quote:
        '"MVP 기능 후보 8개 중 핵심 3개 선정. 기준: 사용자 핵심 Pain Point 해결 여부 + 5주 개발 가능성."',
    },
  },
  {
    id: 3,
    summary:
      '사용자 인터뷰를 통해 "경험을 다시 설명하기 어려운 문제"를 발견하고, 이를 서비스의 핵심 문제로 재정의한 것으로 보여요.',
    evidence: {
      badge: "PPT",
      fileName: "공모전_최종발표자료.pptx",
      pageLabel: "Slide 2",
      quote: '"기획 담당: 문제정의, 사용자 인터뷰 설계·진행, 기능 우선순위 결정, 발표 기획 전반."',
    },
  },
];

const Wrapper = styled.div`
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeadingGroup = styled.div``;

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

const Counter = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  font-weight: 600;
`;

const ProgressWrap = styled.div`
  margin-top: 12px;
`;

const CardWrap = styled.div`
  margin-top: 28px;
`;

export default function AiReviewStage({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draftSummary, setDraftSummary] = useState("");
  const [overrides, setOverrides] = useState({});

  const total = CANDIDATES.length;
  const candidate = CANDIDATES[currentIndex];
  const summary = overrides[candidate.id] ?? candidate.summary;

  const goNext = () => {
    setEditing(false);
    if (currentIndex >= total - 1) {
      onComplete?.();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleStartEdit = () => {
    setDraftSummary(summary);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    setOverrides((prev) => ({ ...prev, [candidate.id]: draftSummary }));
    setEditing(false);
  };

  return (
    <Wrapper>
      <HeaderRow>
        <HeadingGroup>
          <Heading>AI 해석 확인</Heading>
          <Description>LogFolio가 자료에서 이렇게 이해했어요. 확인해주세요.</Description>
        </HeadingGroup>
        <Counter>
          {currentIndex + 1} / {total}
        </Counter>
      </HeaderRow>

      <ProgressWrap>
        <SegmentedProgress total={total} currentIndex={currentIndex} label="경험 후보 검토 진행률" />
      </ProgressWrap>

      <CardWrap>
        <ReviewCard
          summary={summary}
          evidence={candidate.evidence}
          editing={editing}
          draftSummary={draftSummary}
          onDraftChange={setDraftSummary}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onReject={goNext}
          onApprove={goNext}
        />
      </CardWrap>
    </Wrapper>
  );
}
