import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import { AddFileModal, ExperienceCreateModal, FolderQuickRecordModal } from "../components/folder/FolderModals";
import { createQuickLog, getAllQuickLogs } from "../apis/archiveApi";
import { createExperience, getProjectExperiences } from "../apis/experienceApi";
import { getProject, getProjectFiles, uploadProjectFile } from "../apis/projectApi";

const Page=styled.div`min-height:100vh;color:${({theme})=>theme.colors.textDark};background:white;`;
const CrumbBar=styled.div`border-bottom:1px solid ${({theme})=>theme.colors.border};`;
const Crumbs=styled.div`width:calc(100% - 80px);max-width:1280px;margin:auto;padding:12px 0;color:${({theme})=>theme.colors.textGray};font-size:12px;button{color:${({theme})=>theme.colors.textGray};font-weight:600;}@media(max-width:720px){width:calc(100% - 32px);}`;
const Main=styled.main`width:calc(100% - 80px);max-width:1280px;margin:auto;padding:20px 0 70px;@media(max-width:720px){width:calc(100% - 32px);}`;
const Head=styled.div`display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:72px;@media(max-width:700px){align-items:flex-start;flex-direction:column;}`;
const Title=styled.h1`font-size:22px;line-height:26px;letter-spacing:-.5px;`;
const Meta=styled.p`margin-top:5px;color:${({theme})=>theme.colors.textGray};font-size:12px;`;
const Actions=styled.div`display:flex;gap:8px;`;
const Action=styled.button`height:36px;padding:0 14px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;font-size:13px;font-weight:600;`;
const More=styled(Action)`width:36px;padding:0;font-size:18px;`;
const Layout=styled.div`display:grid;grid-template-columns:minmax(0,892px) 248px;gap:44px;margin-top:20px;@media(max-width:1000px){grid-template-columns:1fr;}`;
const Cards=styled.section`display:flex;flex-direction:column;gap:12px;`;
const Card=styled.button`width:100%;min-height:156px;padding:20px 22px;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;text-align:left;transition:.15s;&:hover{border-color:${({theme})=>theme.colors.primary};box-shadow:0 4px 14px rgba(2,175,105,.08);}`;
const CardHead=styled.div`display:flex;justify-content:space-between;gap:16px;`;
const CardTitle=styled.h2`font-size:15px;line-height:23px;`;
const Status=styled.span`flex:none;padding:4px 10px;border:1px solid ${({$done,theme})=>$done?theme.colors.primaryLight:theme.colors.border};border-radius:100px;background:${({$done,theme})=>$done?theme.colors.primaryLight:"white"};color:${({$done,theme})=>$done?theme.colors.primary:theme.colors.textGray};font-size:11px;font-weight:700;`;
const Summary=styled.p`margin-top:6px;color:${({theme})=>theme.colors.textGray};font-size:13px;line-height:22px;`;
const Tags=styled.div`display:flex;gap:6px;margin-top:12px;span{padding:4px 9px;border:1px solid ${({theme})=>theme.colors.border};border-radius:100px;color:${({theme})=>theme.colors.textGray};font-size:11px;}`;
const CardBottom=styled.div`display:flex;justify-content:space-between;margin-top:15px;color:${({theme})=>theme.colors.textGray};font-size:12px;span:last-child{color:${({theme})=>theme.colors.textDark};}`;
const Side=styled.aside`display:flex;flex-direction:column;gap:34px;`;
const SideSection=styled.section``;
const SideHead=styled.div`display:flex;justify-content:space-between;margin-bottom:14px;font-size:13px;font-weight:700;button{color:${({theme})=>theme.colors.textGray};font-size:11px;font-weight:400;}`;
const Record=styled.div`padding:12px 0;border-bottom:1px solid ${({theme})=>theme.colors.border};p{font-size:12px;line-height:19px;}span{display:block;margin-top:6px;color:${({theme})=>theme.colors.textGray};font-size:11px;}em{color:${({theme})=>theme.colors.primary};font-style:normal;}`;
const File=styled.div`display:grid;grid-template-columns:34px 1fr 16px;align-items:center;gap:6px;padding:7px 0;color:${({theme})=>theme.colors.textGray};font-size:11px;b{padding:3px;border:1px solid ${({theme})=>theme.colors.border};border-radius:3px;font-size:9px;text-align:center;}button{color:${({theme})=>theme.colors.textGray};}`;
const AddFile=styled.button`margin-top:8px;color:${({theme})=>theme.colors.primary};font-size:12px;font-weight:700;`;
const Feedback=styled.div`display:grid;min-height:calc(100vh - 100px);place-items:center;color:${({theme})=>theme.colors.textGray};text-align:center;button{display:block;margin:18px auto 0;padding:10px 16px;border-radius:8px;background:${({theme})=>theme.colors.primary};color:white;font-weight:700;}`;

const statusLabel={ORGANIZING:"정리 중",REVIEW_REQUIRED:"검토 필요",SUPPLEMENT_REQUIRED:"보완 필요",SAVED:"완료"};
const formatPeriod=(start,end)=>{const a=start?.slice(0,7).replace("-",".");const b=end?.slice(0,7).replace("-",".");return a?(b?`${a} — ${b}`:`${a} — 진행 중`):"기간 미정";};
const formatDate=(value)=>{const date=new Date(value);return Number.isNaN(date.getTime())?"":date.toLocaleDateString("ko-KR");};

export default function ExperienceFolderPage(){
 const navigate=useNavigate(); const {projectId}=useParams();
 const [project,setProject]=useState(null); const [experiences,setExperiences]=useState([]); const [records,setRecords]=useState([]); const [files,setFiles]=useState([]);
 const [quick,setQuick]=useState(false); const [upload,setUpload]=useState(false); const [creating,setCreating]=useState(false); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 const load=useCallback(async()=>{setError("");try{const [projectResponse,experienceResponse,recordItems,fileResponse]=await Promise.all([getProject(projectId),getProjectExperiences(projectId),getAllQuickLogs(projectId),getProjectFiles(projectId)]);setProject(projectResponse.data);setExperiences(experienceResponse.data??[]);setRecords(recordItems??[]);setFiles(fileResponse.data??[]);}catch(requestError){if(requestError.response?.status===401){navigate("/login",{replace:true});return;}setError(requestError.response?.data?.detail??"프로젝트를 불러오지 못했습니다.");}finally{setLoading(false);}},[navigate,projectId]);
 useEffect(()=>{
  // oxlint-disable-next-line react/set-state-in-effect
  load();
 },[load]);
 const saveRecord=async(content)=>{try{const {data}=await createQuickLog({content,projectId});setRecords(p=>[data,...p]);setQuick(false);}catch(requestError){setError(requestError.response?.data?.detail??"30초 기록을 저장하지 못했습니다.");}};
 const saveFile=async(file)=>{try{const {data}=await uploadProjectFile(projectId,file);setFiles(p=>[data,...p]);setUpload(false);}catch(requestError){setError(requestError.response?.data?.detail??"자료를 업로드하지 못했습니다.");}};
 const saveExperience=async(payload)=>{try{const {data}=await createExperience(projectId,payload);setExperiences(p=>[data,...p]);setCreating(false);return true;}catch(requestError){setError(requestError.response?.data?.detail??"경험 카드를 추가하지 못했습니다.");return false;}};
 if(loading)return <Page><AppHeader onArchiveClick={()=>navigate("/archive")}/><Feedback>프로젝트를 불러오는 중입니다.</Feedback></Page>;
 if(error&&!project)return <Page><AppHeader onArchiveClick={()=>navigate("/archive")}/><Feedback><div>{error}<button type="button" onClick={()=>{setLoading(true);load();}}>다시 시도</button></div></Feedback></Page>;
 if(!project)return null;
 return <Page><AppHeader onArchiveClick={()=>navigate("/archive")}/><CrumbBar><Crumbs><button onClick={()=>navigate("/archive")}>경험 아카이브</button>　/　<strong>{project.name}</strong></Crumbs></CrumbBar>
  <Main>{error&&<Record><p>{error}</p></Record>}<Head><div><Title>{project.name}</Title><Meta>{formatPeriod(project.startedAt,project.endedAt)} · {[project.activityType,project.userRole].filter(Boolean).join(" · ")||"정보 미지정"}</Meta></div><Actions><Action onClick={()=>setCreating(true)}>＋ 경험 카드</Action><Action onClick={()=>setQuick(true)}>＋ 30초 기록</Action><Action onClick={()=>setUpload(true)}>＋ 자료 추가</Action><More aria-label="프로젝트 메뉴">···</More></Actions></Head>
   <Layout><Cards>{experiences.map(e=><Card key={e.id} onClick={()=>navigate(`/archive/${project.id}/experiences/${e.id}`)}><CardHead><CardTitle>{e.title}</CardTitle><Status $done={e.status==="SAVED"}>{statusLabel[e.status]??e.status}</Status></CardHead><Summary>{e.summary||"아직 요약이 없습니다."}</Summary><Tags>{(project.tags??[]).map(t=><span key={t}>{t}</span>)}</Tags><CardBottom><span>근거 {e.evidenceCount}개</span><span>상세 보기 →</span></CardBottom></Card>)}</Cards>
    <Side><SideSection><SideHead><span>최근 30초 기록</span><button onClick={()=>navigate("/archive")}>전체 보기 →</button></SideHead>{records.slice(0,3).map(r=><Record key={r.id}><p>{r.content}</p><span>{formatDate(r.createdAt)}　<em>→ 프로젝트 연결 완료</em></span></Record>)}</SideSection><SideSection><SideHead><span>자료 {files.length}개</span><span>전체</span></SideHead>{files.map(f=><File key={f.id}><b>{f.originalName?.split(".").pop()?.toUpperCase()||"FILE"}</b><span>{f.originalName}</span><span>{f.processingStatus}</span></File>)}<AddFile onClick={()=>setUpload(true)}>＋ 자료 추가</AddFile></SideSection></Side>
   </Layout></Main>{creating&&<ExperienceCreateModal onClose={()=>setCreating(false)} onSave={saveExperience}/>} {quick&&<FolderQuickRecordModal projectName={project.name} onClose={()=>setQuick(false)} onSave={saveRecord}/>} {upload&&<AddFileModal onClose={()=>setUpload(false)} onSave={saveFile}/>}</Page>;
}
