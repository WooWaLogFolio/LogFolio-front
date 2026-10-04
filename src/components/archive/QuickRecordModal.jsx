import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(23, 27, 21, 0.4);
`;

const Modal = styled.div`
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
`;

const Title = styled.h2`
  font-size: 18px;
  line-height: 25px;
  letter-spacing: -0.4px;
`;

const Description = styled.p`
  margin: 6px 0 16px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  line-height: 22px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 16px;
  resize: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font: inherit;
  font-size: 16px;
  line-height: 28px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Label = styled.label`
  display: block;
  margin: 18px 0 6px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  font-weight: 700;

  span {
    color: ${({ theme }) => theme.colors.textGray};
    font-weight: 400;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: white;
  color: ${({ theme }) => theme.colors.textGray};
  font: inherit;
  font-size: 16px;
`;

const Help = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  line-height: 18px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.95fr;
  gap: 8px;
  margin-top: 18px;
`;

const Action = styled.button`
  height: 44px;
  border: ${({ $primary, theme }) =>
    $primary ? "none" : `1px solid ${theme.colors.border}`};
  border-radius: 8px;
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.white};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.white : theme.colors.textDark};
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textGray};
    opacity: 0.5;
  }
`;

export default function QuickRecordModal({ projects, onClose, onSave }) {
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || saving) return;

    setSaving(true);
    const saved = await onSave({
      content: content.trim(),
      projectId: projectId || null,
    });
    if (!saved) setSaving(false);
  };

  return (
    <Overlay role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="quick-record-title">
        <form onSubmit={handleSubmit}>
          <Title id="quick-record-title">30초 기록</Title>
          <Description>방금 한 일이나 느낀 점을 짧게 남겨주세요.</Description>
          <Textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예) 오늘 팀 회의에서 와이어프레임 2차 피드백 반영 완료."
          />
          <Label htmlFor="record-project">
            프로젝트 연결 <span>(선택)</span>
          </Label>
          <Select
            id="record-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">프로젝트 선택 안 함</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </Select>
          <Help>선택하지 않으면 “프로젝트 미지정”으로 저장돼요.</Help>
          <Actions>
            <Action type="button" onClick={onClose} disabled={saving}>취소</Action>
            <Action type="submit" $primary disabled={!content.trim() || saving}>
              {saving ? "저장 중..." : "저장"}
            </Action>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}
