import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 20; display: flex; align-items: center;
  justify-content: center; padding: 20px; background: rgba(23, 27, 21, 0.4);
`;
const Modal = styled.div`
  width: min(440px, 100%); padding: 28px; border-radius: 16px; background: white;
  box-shadow: 0 8px 16px rgba(0,0,0,.12);
`;
const Title = styled.h2`font-size: 18px; line-height: 25px; letter-spacing: -.4px;`;
const Copy = styled.p`margin: 6px 0 16px; color: ${({theme})=>theme.colors.textGray}; font-size: 14px; line-height: 22px;`;
const Textarea = styled.textarea`
  width: 100%; min-height: 100px; padding: 16px; resize: none; border: 1px solid ${({theme})=>theme.colors.border};
  border-radius: 8px; font: inherit; font-size: 16px; line-height: 28px;
  &:focus { outline: none; border-color: ${({theme})=>theme.colors.primary}; }
`;
const Dropzone = styled.label`
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 140px;
  border: 1px dashed ${({theme})=>theme.colors.border}; border-radius: 12px; color: ${({theme})=>theme.colors.textGray};
  font-size: 13px; cursor: pointer;
  strong { margin-top: 10px; padding: 8px 14px; border: 1px solid ${({theme})=>theme.colors.border}; border-radius: 8px; color: ${({theme})=>theme.colors.textDark}; }
  input { display: none; }
`;
const FileName = styled.p`margin-top: 10px; color: ${({theme})=>theme.colors.primary}; font-size: 13px; text-align: center;`;
const Hint = styled.p`margin-top: 10px; color: ${({theme})=>theme.colors.textGray}; font-size: 11px; text-align: center;`;
const Actions = styled.div`display: grid; grid-template-columns: 1fr 1.95fr; gap: 8px; margin-top: 18px;`;
const Button = styled.button`
  height: 44px; border: ${({$primary,theme})=>$primary?"none":`1px solid ${theme.colors.border}`}; border-radius: 8px;
  background: ${({$primary,theme})=>$primary?theme.colors.primary:"white"}; color: ${({$primary,theme})=>$primary?"white":theme.colors.textDark}; font-weight: 700;
  &:disabled { background: ${({theme})=>theme.colors.border}; color: ${({theme})=>theme.colors.textGray}; opacity: .55; }
`;

export function FolderQuickRecordModal({ projectName, onClose, onSave }) {
  const [value,setValue]=useState("");
  return <Overlay onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><Modal role="dialog" aria-modal="true">
    <Title>30초 기록</Title><Copy>{projectName} 프로젝트에 기록을 남겨요.</Copy>
    <Textarea autoFocus value={value} onChange={(e)=>setValue(e.target.value)} placeholder="방금 한 일이나 느낀 점을 짧게 남겨주세요." />
    <Actions><Button onClick={onClose}>취소</Button><Button $primary disabled={!value.trim()} onClick={()=>onSave(value.trim())}>저장</Button></Actions>
  </Modal></Overlay>;
}

export function ExperienceCreateModal({ onClose, onSave }) {
  const [title,setTitle]=useState("");
  const [summary,setSummary]=useState("");
  const [saving,setSaving]=useState(false);
  const submit=async()=>{if(!title.trim()||saving)return;setSaving(true);const saved=await onSave({title:title.trim(),summary:summary.trim(),context:"",contribution:"",decisionReason:"",action:"",result:"",learning:"",status:"ORGANIZING"});if(!saved)setSaving(false);};
  return <Overlay onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><Modal role="dialog" aria-modal="true">
    <Title>경험 카드 추가</Title><Copy>프로젝트에서 정리할 경험을 직접 추가해요.</Copy>
    <Textarea autoFocus value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="경험 제목" />
    <Textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="경험을 한두 문장으로 요약해 주세요." />
    <Actions><Button onClick={onClose} disabled={saving}>취소</Button><Button $primary disabled={!title.trim()||saving} onClick={submit}>{saving?"저장 중...":"경험 카드 추가"}</Button></Actions>
  </Modal></Overlay>;
}

export function AddFileModal({ onClose, onSave }) {
  const [file,setFile]=useState(null);
  return <Overlay onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><Modal role="dialog" aria-modal="true">
    <Title>자료 추가</Title><Copy>새 자료를 올리면 기존 경험에 추가 내용이 있는지 분석해드려요.</Copy>
    <Dropzone>파일을 드래그하거나<strong>파일 선택</strong><input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e)=>setFile(e.target.files?.[0]??null)} /></Dropzone>
    {file&&<FileName>{file.name}</FileName>}<Hint>PDF, PPTX, DOCX · 최대 50MB</Hint>
    <Actions><Button onClick={onClose}>취소</Button><Button $primary disabled={!file} onClick={()=>onSave(file)}>추가한 자료 정리하기</Button></Actions>
  </Modal></Overlay>;
}
