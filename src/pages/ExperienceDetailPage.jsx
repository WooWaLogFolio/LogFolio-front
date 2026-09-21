import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import AICoachPanel from "../components/folder/AICoachPanel";
import { evidenceItems, experienceDetail, folderProject } from "../data/folderMockData";

const Page=styled.div`min-height:100vh;color:${({theme})=>theme.colors.textDark};background:white;`;
const CrumbBar=styled.div`border-bottom:1px solid ${({theme})=>theme.colors.border};`;
const Crumbs=styled.div`width:calc(100% - 80px);max-width:1280px;margin:auto;padding:12px 0;color:${({theme})=>theme.colors.textGray};font-size:12px;button{color:${({theme})=>theme.colors.textGray};font-weight:600;}@media(max-width:720px){width:calc(100% - 32px);}`;
const Layout=styled.main`display:grid;grid-template-columns:minmax(0,840px) 312px;gap:48px;width:calc(100% - 80px);max-width:1280px;margin:0 auto;padding:46px 0 80px;@media(max-width:980px){grid-template-columns:1fr;width:calc(100% - 32px);}`;
const Title=styled.h1`font-size:24px;line-height:34px;letter-spacing:-.5px;`;
const Subtitle=styled.p`margin-top:8px;color:${({theme})=>theme.colors.textGray};font-size:13px;line-height:21px;`;
const HeadActions=styled.div`display:flex;gap:8px;margin-top:18px;button{height:34px;padding:0 12px;border:1px solid ${({theme})=>theme.colors.border};border-radius:7px;color:${({theme})=>theme.colors.textGray};font-size:12px;}`;
const SummaryTitle=styled.p`margin-top:44px;padding-bottom:12px;border-bottom:1px solid ${({theme})=>theme.colors.border};font-size:12px;font-weight:700;letter-spacing:.04em;`;
const Section=styled.section`position:relative;padding:24px 0;border-bottom:1px solid ${({theme})=>theme.colors.border};h2{font-size:13px;line-height:20px;}h2 span{margin-left:6px;color:${({theme})=>theme.colors.textFooter};font-size:11px;font-weight:400;}p{margin-top:12px;font-size:13px;line-height:24px;white-space:pre-line;}&:hover .section-actions,&:focus-within .section-actions{opacity:1;pointer-events:auto;}`;
const AiNote=styled.span`float:right;color:${({theme})=>theme.colors.primary}!important;font-size:11px!important;font-weight:600!important;`;
const HoverActions=styled.div`position:absolute;top:22px;right:0;display:flex;gap:4px;opacity:0;pointer-events:none;transition:opacity .15s;button{font-size:12px;font-weight:700;}button:first-child{color:${({theme})=>theme.colors.primary};}button:last-child{color:${({theme})=>theme.colors.textGray};font-weight:400;}`;
const EditArea=styled.textarea`width:100%;min-height:108px;margin-top:12px;padding:12px 14px;resize:vertical;border:1.5px solid ${({theme})=>theme.colors.primary};border-radius:8px;color:${({theme})=>theme.colors.textDark};font:inherit;font-size:13px;line-height:24px;&:focus{outline:none;}`;
const EditActions=styled.div`display:flex;justify-content:flex-end;gap:7px;margin-top:8px;button{height:32px;padding:0 13px;border:1px solid ${({theme})=>theme.colors.border};border-radius:7px;color:${({theme})=>theme.colors.textGray};font-size:12px;}button:first-child{border-color:${({theme})=>theme.colors.primary};background:${({theme})=>theme.colors.primary};color:white;}`;
const DrawerOverlay=styled.div`position:fixed;inset:0;z-index:30;background:rgba(23,27,21,.4);`;
const Drawer=styled.aside`position:absolute;top:0;right:0;width:min(490px,100%);height:100%;padding-bottom:30px;overflow-y:auto;background:white;box-shadow:-8px 0 24px rgba(0,0,0,.08);`;
const DrawerHead=styled.div`display:flex;justify-content:space-between;padding:20px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};h2{font-size:16px;}button{font-size:20px;}`;
const Evidence=styled.article`margin:18px 24px 0;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;overflow:hidden;`;
const FileHead=styled.div`display:flex;align-items:center;gap:8px;padding:14px;font-size:12px;font-weight:700;b{padding:3px 5px;border:1px solid ${({theme})=>theme.colors.border};border-radius:4px;color:${({theme})=>theme.colors.textGray};font-size:9px;}span:last-child{margin-left:auto;color:${({theme})=>theme.colors.textGray};font-weight:400;}`;
const EvidenceBlock=styled.div`padding:12px 14px;border-top:1px solid ${({theme})=>theme.colors.border};font-size:11px;line-height:19px;&.quote{background:${({theme})=>theme.colors.primaryLight};}strong{display:block;margin-bottom:5px;color:${({theme})=>theme.colors.textGray};font-size:10px;}`;
const LinkTags=styled.div`display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;span{padding:3px 7px;border:1px solid ${({theme})=>theme.colors.border};border-radius:100px;color:${({theme})=>theme.colors.textGray};font-size:10px;}`;

function EditableSection({ label, english, value, onSave, onAI, applied }) {
 const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(value);
 const beginEdit=()=>{setDraft(value);setEditing(true);};
 return <Section><h2>{label} <span>{english}</span>{applied&&<AiNote>AI로 다듬기 · 반영 완료</AiNote>}</h2>
  {!editing&&<HoverActions className="section-actions"><button type="button" onClick={onAI}>AI로 다듬기</button><span>·</span><button type="button" onClick={beginEdit}>직접 수정</button></HoverActions>}
  {editing?<><EditArea autoFocus value={draft} onChange={e=>setDraft(e.target.value)}/><EditActions><button type="button" onClick={()=>{onSave(draft.trim());setEditing(false);}}>저장</button><button type="button" onClick={()=>setEditing(false)}>취소</button></EditActions></>:<p>{value}</p>}
 </Section>;
}

export default function ExperienceDetailPage(){
 const navigate=useNavigate(); const [drawer,setDrawer]=useState(false); const [fields,setFields]=useState({role:experienceDetail.role,decisions:experienceDetail.decisions,outcome:experienceDetail.outcome,context:experienceDetail.context,actions:experienceDetail.actions,learning:experienceDetail.learning}); const [applied,setApplied]=useState(false); const [coachVersion,setCoachVersion]=useState(0); const [coachStage,setCoachStage]=useState("questions");
 const updateField=(key,value)=>setFields(prev=>({...prev,[key]:value}));
 const openCoach=()=>{setCoachStage("complete");setCoachVersion(v=>v+1);};
 return <Page><AppHeader onArchiveClick={()=>navigate("/archive")}/><CrumbBar><Crumbs><button onClick={()=>navigate("/archive")}>경험 아카이브</button>　/　<button onClick={()=>navigate(`/archive/${folderProject.id}`)}>{folderProject.title}</button>　/　<strong>{experienceDetail.title}</strong></Crumbs></CrumbBar>
  <Layout><article><Title>{experienceDetail.title}</Title><Subtitle>{experienceDetail.subtitle}</Subtitle><HeadActions><button onClick={()=>setDrawer(true)}>⚑ 근거 자료 {experienceDetail.evidenceCount}개</button><button aria-label="경험 메뉴">···</button></HeadActions><SummaryTitle>핵심 요약</SummaryTitle>
   <EditableSection label="나의 역할" english="My Role" value={fields.role} onSave={v=>updateField("role",v)} onAI={openCoach} applied={applied}/>
   <EditableSection label="핵심 판단" english="Key Decisions" value={fields.decisions} onSave={v=>updateField("decisions",v)} onAI={openCoach}/>
   <EditableSection label="결과와 변화" english="Outcome" value={fields.outcome} onSave={v=>updateField("outcome",v)} onAI={openCoach}/>
   <SummaryTitle>상세 내용</SummaryTitle><EditableSection label="상황과 문제" english="Context" value={fields.context} onSave={v=>updateField("context",v)} onAI={openCoach}/><EditableSection label="실행" english="Actions" value={fields.actions} onSave={v=>updateField("actions",v)} onAI={openCoach}/><EditableSection label="이 경험 이후 달라진 판단" english="Learning" value={fields.learning} onSave={v=>updateField("learning",v)} onAI={openCoach}/>
  </article><AICoachPanel key={coachVersion} roleText={fields.role} startStage={coachStage} onApply={(suggestion)=>{updateField("role",suggestion);setApplied(true);}}/></Layout>
  {drawer&&<DrawerOverlay onMouseDown={e=>e.target===e.currentTarget&&setDrawer(false)}><Drawer><DrawerHead><h2>근거 자료</h2><button onClick={()=>setDrawer(false)}>×</button></DrawerHead>{evidenceItems.map((e,i)=><Evidence key={i}><FileHead><b>{e.type}</b><span>{e.name}</span><span>{e.page}</span></FileHead><EvidenceBlock className="quote"><strong>근거 원문</strong>“{e.quote}”</EvidenceBlock><EvidenceBlock><strong>이 근거로 정리한 내용</strong>→ {e.summary}</EvidenceBlock><EvidenceBlock><strong>연결된 항목</strong><LinkTags>{e.links.map(x=><span key={x}>{x}</span>)}</LinkTags></EvidenceBlock></Evidence>)}</Drawer></DrawerOverlay>}
 </Page>;
}
