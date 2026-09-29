import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const SummarySection = styled.div`
  padding: 24px 24px 20px;
`;

const SectionLabel = styled.p`
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  font-weight: 600;
`;

const SummaryText = styled.p`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
`;

const SummaryTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  margin-top: 12px;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: inherit;
  font-size: 16px;
  line-height: 28px;
  resize: vertical;

  &:focus {
    outline: none;
  }
`;

const EvidenceSection = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EvidenceBox = styled.div`
  margin-top: 10px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const EvidenceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EvidenceBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 7px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  font-weight: 600;
`;

const EvidenceFileName = styled.span`
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  font-weight: 600;
`;

const EvidencePage = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
`;

const EvidenceQuote = styled.p`
  margin-top: 8px;
  padding-left: 10px;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  line-height: 22.4px;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RejectLink = styled.button`
  padding: 4px 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  padding: 10px 18px;
  border: 1px solid
    ${({ $editing, theme }) => ($editing ? theme.colors.primary : theme.colors.border)};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ $editing, theme }) => ($editing ? theme.colors.primary : theme.colors.textDark)};
  font-size: 15px;
  font-weight: 600;
`;

const ApproveButton = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  font-weight: 600;
`;

export default function ReviewCard({
  summary,
  evidence,
  editing,
  draftSummary,
  onDraftChange,
  onStartEdit,
  onSaveEdit,
  onReject,
  onApprove,
}) {
  return (
    <Card>
      <SummarySection>
        <SectionLabel>LogFolio가 이렇게 이해했어요</SectionLabel>
        {editing ? (
          <SummaryTextarea
            value={draftSummary}
            onChange={(e) => onDraftChange(e.target.value)}
            aria-label="AI 해석 내용 수정"
          />
        ) : (
          <SummaryText>{summary}</SummaryText>
        )}
      </SummarySection>

      <EvidenceSection>
        <SectionLabel>근거 자료</SectionLabel>
        <EvidenceBox>
          <EvidenceHeader>
            <EvidenceBadge>{evidence.badge}</EvidenceBadge>
            <EvidenceFileName>{evidence.fileName}</EvidenceFileName>
            <EvidencePage>{evidence.pageLabel}</EvidencePage>
          </EvidenceHeader>
          <EvidenceQuote>{evidence.quote}</EvidenceQuote>
        </EvidenceBox>
      </EvidenceSection>

      <ActionRow>
        <RejectLink type="button" onClick={onReject}>
          거절
        </RejectLink>
        <ActionGroup>
          {editing ? (
            <EditButton type="button" $editing onClick={onSaveEdit}>
              수정 반영
            </EditButton>
          ) : (
            <EditButton type="button" onClick={onStartEdit}>
              수정
            </EditButton>
          )}
          <ApproveButton type="button" onClick={onApprove}>
            승인
          </ApproveButton>
        </ActionGroup>
      </ActionRow>
    </Card>
  );
}
