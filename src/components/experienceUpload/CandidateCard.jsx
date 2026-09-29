import styled from "styled-components";
import { SecondaryButton, NextButton } from "../common/Button";

const Card = styled.div`
  width: 100%;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const HeaderSection = styled.div`
  padding: 24px 28px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(234, 248, 242, 0.5);
`;

const Counter = styled.p`
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.72px;
`;

const Title = styled.h3`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: 27px;
`;

const Description = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  line-height: 21px;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
`;

const Tag = styled.span`
  padding: 3px 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
`;

const DetailSection = styled.div`
  padding: 18px 28px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailLabel = styled.p`
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.39px;
`;

const DetailText = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  line-height: 23.8px;
`;

const FooterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 20px 0 0;
`;

const ExcludeButton = styled(SecondaryButton)`
  flex: none;
  width: calc((100% - 8px) * 0.345);
`;

const NextCandidateButton = styled(NextButton)`
  flex: none;
  width: calc((100% - 8px) * 0.655);
`;

export default function CandidateCard({
  index,
  total,
  title,
  description,
  tags,
  sections,
  onExclude,
  onNext,
}) {
  return (
    <>
      <Card>
        <HeaderSection>
          <Counter>
            {index + 1} / {total}
          </Counter>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <TagRow>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagRow>
        </HeaderSection>

        {sections.map((section, sectionIndex) => (
          <DetailSection key={`${section.label}-${sectionIndex}`}>
            <DetailLabel>{section.label}</DetailLabel>
            <DetailText>{section.text}</DetailText>
          </DetailSection>
        ))}
      </Card>

      <FooterRow>
        <ExcludeButton type="button" onClick={onExclude}>
          제외
        </ExcludeButton>
        <NextCandidateButton type="button" onClick={onNext}>
          다음 →
        </NextCandidateButton>
      </FooterRow>
    </>
  );
}
