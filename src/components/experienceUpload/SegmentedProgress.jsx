import styled from "styled-components";

const Row = styled.div`
  display: flex;
  gap: 6px;
`;

const Segment = styled.span`
  flex: 1;
  height: 4px;
  border-radius: 100px;
  background: ${({ $done, theme }) => ($done ? theme.colors.primary : theme.colors.border)};
`;

export default function SegmentedProgress({ total, currentIndex, label }) {
  return (
    <Row aria-label={label}>
      {Array.from({ length: total }, (_, index) => (
        <Segment key={index} $done={index <= currentIndex} />
      ))}
    </Row>
  );
}
