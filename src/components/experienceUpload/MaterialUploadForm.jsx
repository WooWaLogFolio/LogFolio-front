import { useRef, useState } from "react";
import styled from "styled-components";
import { SecondaryButton, NextButton } from "../common/Button";
import uploadIcon from "../../assets/icons/experienceUpload/upload.svg";

const ACCEPTED_EXTENSIONS = ["pdf", "pptx", "docx"];
const MAX_FILES = 3;

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
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
  line-height: 25.6px;
`;

const Dropzone = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 28px;
  padding: 52px;
  border: 2px dashed
    ${({ $dragOver, theme }) => ($dragOver ? theme.colors.primary : theme.colors.border)};
  border-radius: 12px;
  background: ${({ $dragOver, theme }) => ($dragOver ? theme.colors.primaryLight : theme.colors.white)};
  text-align: center;
`;

const DropzoneIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;

  img {
    width: 18px;
    height: 18px;
  }
`;

const DropzoneTitle = styled.p`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 16px;
  font-weight: 600;
`;

const DropzoneHint = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
`;

const FileBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  font-weight: 600;
`;

const FileName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const PrevButton = styled(SecondaryButton)`
  flex: 1;
`;

const SubmitButton = styled(NextButton)`
  flex: 3;
  width: auto;
`;

const SkipLink = styled.button`
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: underline;
`;

const Footnote = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
  line-height: 19.8px;
  text-align: center;
`;

function getExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export default function MaterialUploadForm({ onPrev, onNext, onSkip }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    setFiles((prev) => {
      const next = [...prev];
      for (const file of fileList) {
        if (next.length >= MAX_FILES) break;
        const extension = getExtension(file.name);
        if (!ACCEPTED_EXTENSIONS.includes(extension)) continue;
        if (next.some((f) => f.name === file.name)) continue;
        next.push(file);
      }
      return next;
    });
  };

  const handleInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <Wrapper>
      <Heading>자료를 추가해주세요</Heading>
      <Description>
        지원하는 파일을 추가해주세요.
        <br />
        많을수록 더 정확하게 정리해드려요.
      </Description>

      <Dropzone
        type="button"
        $dragOver={dragOver}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <DropzoneIcon>
          <img src={uploadIcon} alt="" />
        </DropzoneIcon>
        <DropzoneTitle>파일을 드래그하거나 클릭해서 올려주세요</DropzoneTitle>
        <DropzoneHint>PDF, PPTX, DOCX · 최대 {MAX_FILES}개</DropzoneHint>
      </Dropzone>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.pptx,.docx"
        multiple
        hidden
        onChange={handleInputChange}
      />

      {files.length > 0 && (
        <FileList aria-label="첨부한 파일">
          {files.map((file) => (
            <FileRow key={file.name}>
              <FileBadge>{getExtension(file.name).toUpperCase()}</FileBadge>
              <FileName>{file.name}</FileName>
              <RemoveButton
                type="button"
                aria-label={`${file.name} 삭제`}
                onClick={() => removeFile(file.name)}
              >
                ×
              </RemoveButton>
            </FileRow>
          ))}
        </FileList>
      )}

      <ButtonRow>
        <PrevButton type="button" onClick={onPrev}>
          이전
        </PrevButton>
        <SubmitButton
          type="button"
          disabled={files.length === 0}
          onClick={() => onNext?.(files)}
        >
          자료 정리 시작하기 →
        </SubmitButton>
      </ButtonRow>

      <SkipLink type="button" onClick={onSkip}>
        자료 없이 시작
      </SkipLink>
      <Footnote>
        지금 자료가 없어도 괜찮아요.
        <br />
        프로젝트를 먼저 만들고, 자료를 추가하거나 30초 기록을 남기면
        <br />
        나중에 경험을 정리할 수 있어요.
      </Footnote>
    </Wrapper>
  );
}
