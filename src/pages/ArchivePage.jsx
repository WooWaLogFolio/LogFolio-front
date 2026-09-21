import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import QuickRecordModal from "../components/archive/QuickRecordModal";
import RecordList from "../components/archive/RecordList";
import { initialProjects, initialRecords } from "../data/archiveMockData";
import clockIcon from "../assets/icons/archive/clock.svg";
import plusWhiteSmallIcon from "../assets/icons/archive/plus-white-small.svg";
import plusGrayIcon from "../assets/icons/archive/plus-gray.svg";
import arrowIcon from "../assets/icons/archive/arrow-right.svg";
import emptyDocumentIcon from "../assets/icons/archive/empty-document.svg";
import plusWhiteIcon from "../assets/icons/archive/plus-white.svg";

const filters = ["전체", "정리 중", "검토 필요", "보완 필요", "저장 완료"];

const Page = styled.div`
  min-height: 100vh;
  background: white;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Main = styled.main`
  width: calc(100% - 80px);
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 0;

  @media (max-width: 720px) {
    width: calc(100% - 32px);
    padding: 36px 0;
  }
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  line-height: 36px;
  letter-spacing: -0.6px;
`;

const Subtitle = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  line-height: 22px;
`;

const TopActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TopButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 41px;
  padding: 0 16px;
  border: ${({ $primary, theme }) =>
    $primary ? "none" : `1px solid ${theme.colors.border}`};
  border-radius: 12px;
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.white};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.white : theme.colors.textLabel};
  font-size: 16px;
  font-weight: 700;

  img {
    width: 11px;
    height: 11px;
  }
`;

const Divider = styled.hr`
  margin: 20px 0 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 54px;
  padding-top: 24px;
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const FilterButton = styled.button`
  height: 30px;
  padding: 0 13px;
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  border-radius: 100px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textGray};
  font-size: 12px;
`;

const Count = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textFooter};
  font-size: 12px;
`;

const ProjectGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px 24px;
  margin-top: 20px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: white;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 14px rgba(2, 175, 105, 0.08);
  }
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -0.2px;
`;

const Status = styled.span`
  flex-shrink: 0;
  padding: 4px 8px;
  border: 1px solid ${({ $complete, theme }) =>
    $complete ? theme.colors.primaryLight : theme.colors.border};
  border-radius: 100px;
  background: ${({ $complete, theme }) =>
    $complete ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $complete, theme }) =>
    $complete ? theme.colors.primary : theme.colors.textGray};
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`;

const ProjectMeta = styled.p`
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
  line-height: 23px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  padding: 4px 9px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 12px;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;

  img {
    width: 14px;
    height: 14px;
  }
`;

const AddProjectCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;

  img {
    width: 36px;
    height: 36px;
    margin-bottom: 8px;
  }
`;

const RecentSection = styled.section`
  margin-top: 40px;
  padding-top: 36px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    font-size: 16px;
  }

  button {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    font-weight: 600;
  }
`;

const RecentItem = styled.div`
  padding: 13px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  p {
    font-size: 14px;
    line-height: 23px;
  }

  span {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.textGray};
    font-size: 12px;
  }
`;

const RecordsMain = styled.main`
  width: calc(100% - 80px);
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px;

  @media (max-width: 720px) {
    width: 100%;
    padding: 36px 16px;
  }
`;

const RecordsTitle = styled.h1`
  font-size: 22px;
  line-height: 33px;
  letter-spacing: -0.5px;
`;

const RecordsSubtitle = styled.p`
  margin: 4px 0 24px;
  color: ${({ theme }) => theme.colors.textGray};
  font-size: 14px;
`;

const EmptyState = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 57px);
  padding: 80px 40px;
  text-align: center;

  > img {
    width: 72px;
    height: 72px;
    padding: 20px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  h1 {
    margin-top: 28px;
    font-size: 22px;
    line-height: 33px;
    letter-spacing: -0.5px;
  }

  p {
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.textGray};
    font-size: 16px;
    line-height: 27px;
  }

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 48px;
    margin-top: 32px;
    padding: 0 28px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 15px;
    font-weight: 600;
  }

  button img {
    width: 12px;
    height: 12px;
  }
`;

function ProjectCards({ projects, filter, onOpenProject }) {
  const visible = filter === "전체"
    ? projects
    : projects.filter((project) => project.status === filter);

  return (
    <ProjectGrid aria-label="프로젝트 목록">
      {visible.map((project) => (
        <ProjectCard key={project.id} type="button" onClick={() => onOpenProject(project.id)}>
          <div>
            <CardTitleRow>
              <CardTitle>{project.title}</CardTitle>
              <Status $complete={project.status === "저장 완료"}>{project.status}</Status>
            </CardTitleRow>
            <ProjectMeta>{project.period}</ProjectMeta>
            <ProjectMeta>{project.role}</ProjectMeta>
            <Tags>
              {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </Tags>
          </div>
          <CardBottom>
            <span>경험카드 {project.cardCount}개</span>
            <img src={arrowIcon} alt="" />
          </CardBottom>
        </ProjectCard>
      ))}
      {filter === "전체" && (
        <AddProjectCard type="button">
          <img src={plusGrayIcon} alt="" />
          새 프로젝트 추가
        </AddProjectCard>
      )}
    </ProjectGrid>
  );
}

export default function ArchivePage() {
  const navigate = useNavigate();
  const projects = initialProjects;
  const [filter, setFilter] = useState("전체");
  const [records, setRecords] = useState(initialRecords);
  const [quickRecordOpen, setQuickRecordOpen] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);

  const cardCount = useMemo(
    () => initialProjects.reduce((sum, project) => sum + project.cardCount, 0),
    [],
  );

  const addRecord = ({ content, projectId }) => {
    const now = new Date();
    const date = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, ".").replace(/\.$/, "");
    const time = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setRecords((prev) => [{ id: Date.now(), date, time, projectId, content }, ...prev]);
    setQuickRecordOpen(false);
  };

  const updateRecord = (id, updates) => {
    setRecords((prev) => prev.map((record) => (
      record.id === id ? { ...record, ...updates } : record
    )));
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const findProjectTitle = (id) =>
    projects.find((project) => project.id === id)?.title ?? "프로젝트 미지정";

  if (projects.length === 0) {
    return (
      <Page>
        <AppHeader />
        <EmptyState>
          <img src={emptyDocumentIcon} alt="" />
          <h1>첫 프로젝트를 시작해볼게요</h1>
          <p>프로젝트 자료를 올리면 LogFolio가<br />폴더와 경험 카드를 자동으로 만들어 드려요.</p>
          <button type="button">
            <img src={plusWhiteIcon} alt="" />
            새 프로젝트 추가
          </button>
        </EmptyState>
      </Page>
    );
  }

  if (showAllRecords) {
    return (
      <Page>
        <AppHeader onArchiveClick={() => setShowAllRecords(false)} />
        <RecordsMain>
          <RecordsTitle>전체 기록</RecordsTitle>
          <RecordsSubtitle>총 {records.length}개의 30초 기록</RecordsSubtitle>
          <RecordList
            records={records}
            projects={projects}
            onUpdate={updateRecord}
            onDelete={deleteRecord}
          />
        </RecordsMain>
      </Page>
    );
  }

  return (
    <Page>
      <AppHeader onArchiveClick={() => setShowAllRecords(false)} />
      <Main>
        <HeadingRow>
          <div>
            <Title>경험 아카이브</Title>
            <Subtitle>총 {projects.length}개 프로젝트 · 경험카드 {cardCount}개</Subtitle>
          </div>
          <TopActions>
            <TopButton type="button" onClick={() => setQuickRecordOpen(true)}>
              <img src={clockIcon} alt="" />
              30초 기록
            </TopButton>
            <TopButton type="button" $primary>
              <img src={plusWhiteSmallIcon} alt="" />
              새 프로젝트
            </TopButton>
          </TopActions>
        </HeadingRow>
        <Divider />
        <FilterRow>
          <FilterButtons aria-label="프로젝트 상태 필터">
            {filters.map((item) => (
              <FilterButton
                key={item}
                type="button"
                $active={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </FilterButton>
            ))}
          </FilterButtons>
          <Count>{filter === "전체" ? projects.length : projects.filter((p) => p.status === filter).length}개 프로젝트</Count>
        </FilterRow>
        <ProjectCards projects={projects} filter={filter} onOpenProject={(id) => navigate(`/archive/${id}`)} />

        <RecentSection>
          <SectionHeader>
            <h2>최근 30초 기록</h2>
            <button type="button" onClick={() => setShowAllRecords(true)}>전체 30초 기록 보기 →</button>
          </SectionHeader>
          {records.slice(0, 3).map((record) => (
            <RecentItem key={record.id}>
              <p>{record.content}</p>
              <span>{record.date} · → {findProjectTitle(record.projectId)}</span>
            </RecentItem>
          ))}
        </RecentSection>
      </Main>

      {quickRecordOpen && (
        <QuickRecordModal
          projects={projects}
          onClose={() => setQuickRecordOpen(false)}
          onSave={addRecord}
        />
      )}
    </Page>
  );
}
