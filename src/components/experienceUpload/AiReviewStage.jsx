import { useEffect, useState } from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import SegmentedProgress from "./SegmentedProgress";
import { NextButton } from "../common/Button";
import { decideCandidate, getCandidates } from "../../apis/analysisApi";

// 후보 API가 근거 원문(aiClaims)을 응답에 주지 않아서, 이번 분석에 넣은 파일 목록을 근거로 보여줍니다.
function toEvidences(files) {
  return files.map((file) => {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
    return {
      key: file.id,
      badge: extension.toUpperCase(),
      fileName: file.name,
    };
  });
}

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

const ErrorText = styled.p`
  margin-top: 16px;
  color: #e5484d;
  font-size: 14px;
  text-align: center;
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  text-align: center;
`;

const EmptyButton = styled(NextButton)`
  width: 240px;
  margin-top: 32px;
`;

export default function AiReviewStage({ runId, files = [], onComplete }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draftSummary, setDraftSummary] = useState("");
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    if (!runId) return;
    getCandidates(runId)
      .then(({ data }) => setCandidates(data.filter((c) => c.status === "PENDING")))
      .catch(() => setError("AI 해석을 불러오지 못했어요. 새로고침 후 다시 시도해주세요."))
      .finally(() => setLoading(false));
  }, [runId]);

  const total = candidates.length;
  const candidate = candidates[currentIndex];
  const summary = candidate ? (overrides[candidate.id] ?? candidate.summary ?? candidate.title) : "";

  // 승인·수정한 요약은 다음 단계(경험 후보)에서 결정과 함께 서버에 저장합니다.
  const goNext = (nextOverrides = overrides) => {
    setEditing(false);
    if (currentIndex >= total - 1) {
      onComplete?.(nextOverrides);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleStartEdit = () => {
    setDraftSummary(summary);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    const text = draftSummary.trim();
    if (!text) return;
    setOverrides((prev) => ({ ...prev, [candidate.id]: text }));
    setEditing(false);
  };

  const handleReject = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await decideCandidate(candidate.id, "EXCLUDED", {
        title: candidate.title,
        summary,
        draftContent: candidate.draftContent,
      });
      const { [candidate.id]: _removed, ...rest } = overrides;
      setOverrides(rest);
      goNext(rest);
    } catch {
      setError("저장하지 못했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Description>AI 해석을 불러오는 중이에요...</Description>;
  }

  if (total === 0) {
    return (
      <EmptyWrap>
        <Heading>{error ? "AI 해석을 불러오지 못했어요" : "확인할 AI 해석이 없어요"}</Heading>
        <Description>{error || "자료에서 경험 후보를 찾지 못했어요."}</Description>
        {!error && (
          <EmptyButton type="button" onClick={() => onComplete?.(overrides)}>
            다음
          </EmptyButton>
        )}
      </EmptyWrap>
    );
  }

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
        <SegmentedProgress total={total} currentIndex={currentIndex} label="AI 해석 검토 진행률" />
      </ProgressWrap>

      {error && <ErrorText>{error}</ErrorText>}

      <CardWrap>
        <ReviewCard
          summary={summary}
          evidences={toEvidences(files)}
          editing={editing}
          disabled={submitting}
          draftSummary={draftSummary}
          onDraftChange={setDraftSummary}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onReject={handleReject}
          onApprove={() => goNext()}
        />
      </CardWrap>
    </Wrapper>
  );
}
