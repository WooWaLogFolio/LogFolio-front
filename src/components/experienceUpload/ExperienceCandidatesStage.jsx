import { useEffect, useState } from "react";
import { getCandidates, decideCandidate, finalizeAnalysis } from "../../apis/analysisApi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CandidateCard from "./CandidateCard";
import SegmentedProgress from "./SegmentedProgress";
import { NextButton } from "../common/Button";

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

const ErrorText = styled.p`
  margin: 0;
  color: #e5484d;
  font-size: 14px;
  text-align: center;
`;

export default function ExperienceCandidatesStage({ runId }) {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [includedCount, setIncludedCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!runId) return;
    getCandidates(runId)
      .then(({ data }) => setCandidates(data))
      .catch(() => setError("경험 후보를 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [runId]);

  const total = candidates.length;

  const decide = async (decision) => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      await decideCandidate(candidates[currentIndex].id, decision);
      if (decision === "CREATE_NEW") setIncludedCount((prev) => prev + 1);

      if (currentIndex >= total - 1) {
        await finalizeAnalysis(runId);
        setDone(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch {
      setError("저장하지 못했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Description>경험 후보를 불러오는 중이에요...</Description>;
  }

  if (done || total === 0) {
    return (
      <CompleteWrap>
        <CompleteHeading>
          {total === 0 ? "찾은 경험 후보가 없어요" : "경험 정리가 완료됐어요!"}
        </CompleteHeading>
        {error && <ErrorText>{error}</ErrorText>}
        {total > 0 && (
          <CompleteDescription>
            총 {total}개의 경험 후보 중 {includedCount}개를 아카이브에 추가했어요.
          </CompleteDescription>
        )}
        <CompleteButton type="button" onClick={() => navigate("/archive")}>
          아카이브로 이동
        </CompleteButton>
      </CompleteWrap>
    );
  }

  const candidate = candidates[currentIndex];

  return (
    <Wrapper>
      <Heading>이 프로젝트에서 {total}개의 경험을 찾았어요.</Heading>
      <Description>하나씩 확인하고 포함할 경험을 선택해주세요.</Description>
      <ProgressWrap>
        <SegmentedProgress total={total} currentIndex={currentIndex} label="경험 후보 확인 진행률" />
      </ProgressWrap>
      {error && <ErrorText>{error}</ErrorText>}
      <CardWrap>
        <CandidateCard
          index={currentIndex}
          total={total}
          title={candidate.title}
          description={candidate.summary}
          tags={candidate.draftContent?.tags ?? []}
          sections={candidate.draftContent?.sections ?? []}
          onExclude={() => decide("EXCLUDED")}
          onNext={() => decide("CREATE_NEW")}
        />
      </CardWrap>
    </Wrapper>
  );
}