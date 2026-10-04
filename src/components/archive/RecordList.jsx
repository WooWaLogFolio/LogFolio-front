import { useState } from "react";
import styled from "styled-components";
import closeIcon from "../../assets/icons/archive/close.svg";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.article`
  position: relative;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: white;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-right: 32px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  line-height: 18px;
`;

const Project = styled.button`
  color: ${({ $unassigned, theme }) =>
    $unassigned ? "#f79009" : theme.colors.textGray};
  font-weight: 700;
`;

const Content = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  line-height: 23px;
`;

const More = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textGray};
`;

const Menu = styled.div`
  position: absolute;
  z-index: 3;
  top: 34px;
  right: 12px;
  display: flex;
  flex-direction: column;
  width: 150px;
  padding: 8px 0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.13);

  button {
    padding: 9px 16px;
    color: ${({ theme }) => theme.colors.textDark};
    text-align: left;
    font-size: 14px;
  }

  button:last-child {
    color: #d92d20;
  }
`;

const EditArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px 20px;
  resize: vertical;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font: inherit;
  font-size: 14px;
  line-height: 23px;
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;

  button {
    height: 36px;
    padding: 0 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.textGray};
    font-size: 14px;
  }

  button:first-child {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ProjectPopup = styled.div`
  position: absolute;
  z-index: 4;
  top: 42px;
  right: 16px;
  width: 300px;
  padding: 20px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;

  img {
    width: 16px;
    height: 16px;
  }
`;

const ProjectOption = styled.button`
  width: 100%;
  margin-top: 6px;
  padding: 9px 12px;
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.textDark};
  text-align: left;
  font-size: 13px;
`;

export default function RecordList({ records, projects, onUpdate, onDelete }) {
  const [menuId, setMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [projectPopupId, setProjectPopupId] = useState(null);

  const getProject = (id) => projects.find((project) => project.id === id);

  return (
    <List>
      {records.map((record) => {
        const project = getProject(record.projectId);
        const editing = editingId === record.id;
        return (
          <Card key={record.id}>
            {editing ? (
              <>
                <EditArea value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                <EditActions>
                  <button type="button" onClick={async () => {
                    if (!editValue.trim()) return;
                    const saved = await onUpdate(record.id, { content: editValue.trim() });
                    if (saved) setEditingId(null);
                  }}>저장</button>
                  <button type="button" onClick={() => setEditingId(null)}>취소</button>
                </EditActions>
              </>
            ) : (
              <>
                <Meta>
                  <span>{record.date} {record.time}</span>
                  <Project
                    type="button"
                    $unassigned={!project}
                    onClick={() => setProjectPopupId(record.id)}
                  >
                    → {project?.title ?? "프로젝트 미지정"}
                  </Project>
                </Meta>
                <Content>{record.content}</Content>
                <More type="button" aria-label="기록 메뉴" onClick={() => setMenuId(menuId === record.id ? null : record.id)}>···</More>
              </>
            )}

            {menuId === record.id && (
              <Menu>
                <button type="button" onClick={() => {
                  setEditValue(record.content);
                  setEditingId(record.id);
                  setMenuId(null);
                }}>수정</button>
                <button type="button" onClick={() => {
                  setProjectPopupId(record.id);
                  setMenuId(null);
                }}>프로젝트 연결/변경</button>
                <button type="button" onClick={async () => {
                  const deleted = await onDelete(record.id);
                  if (deleted) setMenuId(null);
                }}>삭제</button>
              </Menu>
            )}

            {projectPopupId === record.id && (
              <ProjectPopup>
                <PopupHeader>
                  <span>프로젝트 연결/변경</span>
                  <button type="button" onClick={() => setProjectPopupId(null)}>
                    <img src={closeIcon} alt="닫기" />
                  </button>
                </PopupHeader>
                <ProjectOption
                  type="button"
                  $selected={!record.projectId}
                  onClick={async () => {
                    const saved = await onUpdate(record.id, { projectId: null });
                    if (saved) setProjectPopupId(null);
                  }}
                >
                  {!record.projectId ? "✓ " : ""}프로젝트 미지정
                </ProjectOption>
                {projects.map((option) => (
                  <ProjectOption
                    key={option.id}
                    type="button"
                    $selected={option.id === record.projectId}
                    onClick={async () => {
                      const saved = await onUpdate(record.id, { projectId: option.id });
                      if (saved) setProjectPopupId(null);
                    }}
                  >
                    {option.id === record.projectId ? "✓ " : ""}{option.title}
                  </ProjectOption>
                ))}
              </ProjectPopup>
            )}
          </Card>
        );
      })}
    </List>
  );
}
