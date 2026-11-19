import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  answerGapQuestion, completeReviewSession, decideReviewItem,
  getGapQuestions, getReviewSession, startReviewSession,
} from "../../apis/experienceApi";
import aiDocument from "../../assets/icons/folder/ai-document.svg";
import checkIcon from "../../assets/icons/folder/check.svg";

const Panel = styled.aside`position:sticky;top:24px;width:312px;height:663px;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;background:white;overflow:hidden;@media(max-width:980px){position:static;width:100%;}`;
const Header = styled.h2`padding:18px 16px;border-bottom:1px solid ${({theme})=>theme.colors.border};font-size:13px;line-height:20px;`;
const Body = styled.div`height:480px;padding:14px 16px;overflow-y:auto;`;
const StepHead = styled.div`display:flex;align-items:center;justify-content:space-between;padding:8px 0 12px;font-size:12px;font-weight:700;img{width:24px;height:24px;}span{display:flex;align-items:center;gap:8px;}em{color:${({theme})=>theme.colors.textGray};font-style:normal;font-weight:400;}`;
const Progress = styled.div`display:flex;gap:3px;margin-bottom:16px;i{display:block;flex:1;height:2px;background:${({theme})=>theme.colors.border};}i.done{background:${({theme})=>theme.colors.primary};}`;
const Question = styled.p`font-size:13px;font-weight:600;line-height:20px;`;
const Sub = styled.p`margin-top:5px;color:${({theme})=>theme.colors.textGray};font-size:11px;line-height:18px;`;
const Option = styled.button`width:100%;margin-top:6px;padding:9px 11px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;text-align:left;font-size:12px;&:hover,&:focus-visible{border-color:${({theme})=>theme.colors.primary};}&:disabled{cursor:wait;opacity:.55;}`;
const Complete = styled.div`display:flex;align-items:center;gap:6px;padding:9px 11px;border-radius:7px;background:${({theme})=>theme.colors.primaryLight};color:${({theme})=>theme.colors.primary};font-size:12px;font-weight:600;img{width:11px;height:11px;}`;
const ReviewCard = styled.section`padding:12px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;h3{font-size:12px;margin-bottom:7px;}p{color:${({theme})=>theme.colors.textGray};font-size:12px;line-height:19px;white-space:pre-wrap;}textarea{width:100%;height:92px;margin-top:8px;padding:9px;resize:none;border:1px solid ${({theme})=>theme.colors.border};border-radius:7px;font:inherit;font-size:12px;line-height:18px;&:focus{outline:none;border-color:${({theme})=>theme.colors.primary};}}`;
const ReviewActions = styled.div`display:flex;gap:5px;margin-top:10px;button{flex:1;height:30px;border:1px solid ${({theme})=>theme.colors.border};border-radius:6px;font-size:11px;&:hover{border-color:${({theme})=>theme.colors.primary};}button:first-child{background:${({theme})=>theme.colors.primary};border-color:${({theme})=>theme.colors.primary};color:white;}button:disabled{cursor:wait;opacity:.55;}}`;
const FinishButton = styled.button`width:100%;height:36px;margin-top:12px;border-radius:7px;background:${({theme})=>theme.colors.primary};color:white;font-size:12px;font-weight:700;&:disabled{background:${({theme})=>theme.colors.border};}`;
const Composer = styled.div`position:absolute;left:0;right:0;bottom:0;padding:12px 14px;border-top:1px solid ${({theme})=>theme.colors.border};background:white;textarea{width:100%;height:59px;padding:10px 11px;resize:none;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;font:inherit;font-size:13px;&:focus{outline:none;border-color:${({theme})=>theme.colors.primary};}&:disabled{background:#f8f9fa;}}`;
const ComposerActions = styled.div`display:flex;justify-content:space-between;margin-top:10px;button{height:28px;padding:0 10px;border:1px solid ${({theme})=>theme.colors.border};border-radius:6px;color:${({theme})=>theme.colors.textGray};font-size:11px;}button:last-child{border:0;background:${({theme})=>theme.colors.primary};color:white;&:disabled{background:${({theme})=>theme.colors.border};}}`;
const Picker = styled.div`position:absolute;z-index:2;left:16px;right:16px;top:175px;max-height:310px;overflow:auto;padding:14px;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;background:white;box-shadow:0 5px 18px rgba(0,0,0,.12);h3{font-size:13px;margin-bottom:8px;}label{display:flex;gap:8px;margin:10px 0;font-size:12px;line-height:18px;}button{width:100%;height:34px;margin-top:8px;border-radius:7px;background:${({theme})=>theme.colors.primary};color:white;font-size:12px;&:disabled{background:${({theme})=>theme.colors.border};color:${({theme})=>theme.colors.textGray};}}`;
const State = styled.div`display:grid;min-height:260px;place-items:center;color:${({theme})=>theme.colors.textGray};font-size:12px;line-height:20px;text-align:center;button{display:block;margin:12px auto 0;color:${({theme})=>theme.colors.primary};font-weight:700;}`;
const ErrorText = styled.p`margin-top:10px;color:#d92d20;font-size:11px;line-height:18px;`;

const POLL_INTERVAL = 2500;
const POLL_ATTEMPTS = 24;
const READY_STATUS = "REVIEW_READY";
const FAILED_STATUSES = new Set(["FAILED", "ERROR"]);
const COMPLETED_STATUSES = new Set(["COMPLETED", "DONE"]);
const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
const hasAnswer = (question) => (question.answers?.length ?? 0) > 0;
const hasDecision = (item) => Boolean(item.decision);
const sortByOrder = (items) => [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

export default function AICoachPanel({ experienceId, records = [] }) {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [picker, setPicker] = useState(false);
  const [selected, setSelected] = useState([]);
  const [input, setInput] = useState("");
  const requestVersion = useRef(0);
  const storageKey = `logfolio-review-session:${experienceId}`;

  const loadReviewData = useCallback(async (sessionId) => {
    const [sessionResponse, questionResponse] = await Promise.all([
      getReviewSession(sessionId), getGapQuestions(experienceId),
    ]);
    setSession(sessionResponse.data);
    setQuestions(sortByOrder(Array.isArray(questionResponse.data) ? questionResponse.data : []));
    return sessionResponse.data;
  }, [experienceId]);

  const prepareReview = useCallback(async ({ restart = false } = {}) => {
    const version = requestVersion.current + 1;
    requestVersion.current = version;
    setLoading(true); setGenerating(false); setError("");
    try {
      let sessionId = restart ? null : sessionStorage.getItem(storageKey);
      let reviewSession = null;
      if (sessionId) {
        try { reviewSession = await loadReviewData(sessionId); }
        catch (requestError) {
          if (![404, 410].includes(requestError.response?.status)) throw requestError;
          sessionStorage.removeItem(storageKey); sessionId = null;
        }
      }
      if (!sessionId || COMPLETED_STATUSES.has(reviewSession?.status)) {
        const { data } = await startReviewSession(experienceId);
        sessionId = data.id; reviewSession = data;
        setSession(data); setQuestions([]); sessionStorage.setItem(storageKey, sessionId);
      }
      if (requestVersion.current !== version) return;
      if (FAILED_STATUSES.has(reviewSession?.status)) {
        sessionStorage.removeItem(storageKey); throw new Error("AI 경험 분석에 실패했습니다.");
      }
      // REVIEW_READY means an empty question list or an item-only result is final too.
      if (reviewSession?.status === READY_STATUS) { await loadReviewData(sessionId); return; }

      setGenerating(true);
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        if (attempt > 0) await wait(POLL_INTERVAL);
        if (requestVersion.current !== version) return;
        reviewSession = await loadReviewData(sessionId);
        if (reviewSession?.status === READY_STATUS) return;
        if (FAILED_STATUSES.has(reviewSession?.status)) {
          sessionStorage.removeItem(storageKey); throw new Error("AI 경험 분석에 실패했습니다.");
        }
        if (COMPLETED_STATUSES.has(reviewSession?.status)) { sessionStorage.removeItem(storageKey); return; }
      }
      throw new Error("AI 분석이 지연되고 있습니다. 잠시 후 다시 확인해 주세요.");
    } catch (requestError) {
      if (requestVersion.current !== version) return;
      setError(requestError.response?.data?.detail ?? requestError.message ?? "AI 검토 내용을 준비하지 못했습니다.");
    } finally {
      if (requestVersion.current === version) { setLoading(false); setGenerating(false); }
    }
  }, [experienceId, loadReviewData, storageKey]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    prepareReview();
    return () => { requestVersion.current += 1; };
  }, [prepareReview]);

  const reviewItems = useMemo(() => sortByOrder(session?.items ?? []), [session?.items]);
  const pendingItems = reviewItems.filter((item) => !hasDecision(item));
  const pendingQuestions = questions.filter((question) => !hasAnswer(question));
  const currentItem = pendingItems[0];
  const currentQuestion = pendingQuestions[0];
  const ready = session?.status === READY_STATUS;
  const completed = COMPLETED_STATUSES.has(session?.status);
  const canComplete = ready && pendingItems.length === 0 && pendingQuestions.length === 0;
  const totalTasks = reviewItems.length + questions.length;
  const finishedTasks = totalTasks - pendingItems.length - pendingQuestions.length;
  const progress = totalTasks > 0 ? `${finishedTasks} / ${totalTasks}` : "검토 완료";

  const refreshData = async () => { if (session?.id) await loadReviewData(session.id); };

  const decideItem = async (decision, confirmedContent) => {
    if (!currentItem || submitting || (decision === "EDITED" && !confirmedContent)) return;
    setSubmitting(true); setError("");
    try {
      await decideReviewItem(currentItem.id, decision, confirmedContent);
      setEditingItemId(null); setEditContent(""); await refreshData();
    } catch (requestError) { setError(requestError.response?.data?.detail ?? "AI 제안을 처리하지 못했습니다."); }
    finally { setSubmitting(false); }
  };

  const submitAnswer = async (answer, answerType) => {
    const normalized = answer.trim();
    if (!currentQuestion || !normalized || submitting) return;
    setSubmitting(true); setError("");
    try {
      await answerGapQuestion(currentQuestion.id, normalized, answerType);
      setInput(""); setSelected([]); setPicker(false); await refreshData();
    } catch (requestError) { setError(requestError.response?.data?.detail ?? "답변을 저장하지 못했습니다."); }
    finally { setSubmitting(false); }
  };

  const finishReview = async () => {
    if (!session?.id || !canComplete || submitting) return;
    setSubmitting(true); setError("");
    try {
      const { data } = await completeReviewSession(session.id);
      setSession(data); sessionStorage.removeItem(storageKey);
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? "최종 검토를 완료하지 못했습니다.");
      await refreshData();
    } finally { setSubmitting(false); }
  };

  const toggleRecord = (id) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const addSelectedRecords = () => {
    const references = records.filter((record) => selected.includes(record.id)).map((record) => record.content).filter(Boolean);
    if (references.length) setInput((value) => [value.trim(), ...references].filter(Boolean).join("\n"));
    setPicker(false);
  };

  return (
    <Panel>
      <Header>AI로 경험 다듬기</Header>
      <Body>
        {loading && <State>{generating ? "AI가 경험을 분석하고 있습니다." : "검토 내용을 불러오는 중입니다."}</State>}
        {!loading && error && !ready && <State><div>{error}<button type="button" onClick={() => prepareReview()}>다시 시도</button><button type="button" onClick={() => prepareReview({ restart: true })}>새로 시작</button></div></State>}
        {!loading && completed && <Complete><img src={checkIcon} alt="" />AI 검토를 완료했어요.</Complete>}
        {!loading && ready && currentItem && <>
          <StepHead><span><img src={aiDocument} alt="" />AI 수정 제안</span><em>{progress}</em></StepHead>
          <ReviewCard>
            <h3>{currentItem.itemType || "수정 제안"}</h3><p>{currentItem.proposedContent}</p>
            {editingItemId === currentItem.id && <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} />}
            <ReviewActions>
              <button type="button" disabled={submitting} onClick={() => decideItem("APPROVED", currentItem.proposedContent)}>승인</button>
              <button type="button" disabled={submitting} onClick={() => {
                if (editingItemId === currentItem.id) decideItem("EDITED", editContent.trim());
                else { setEditingItemId(currentItem.id); setEditContent(currentItem.proposedContent ?? ""); }
              }}>{editingItemId === currentItem.id ? "수정 저장" : "직접 수정"}</button>
              <button type="button" disabled={submitting} onClick={() => decideItem("REJECTED")}>거절</button>
            </ReviewActions>
          </ReviewCard>
        </>}
        {!loading && ready && !currentItem && currentQuestion && <>
          <StepHead><span><img src={aiDocument} alt="" />확인할 내용</span><em>{progress}</em></StepHead>
          <Progress>{questions.map((question) => <i className={hasAnswer(question) ? "done" : ""} key={question.id} />)}</Progress>
          <Question>{currentQuestion.question}</Question>
          {currentQuestion.targetSection && <Sub>{currentQuestion.targetSection}</Sub>}
          {(currentQuestion.suggestedAnswers ?? []).map((answer) => <Option type="button" key={answer} disabled={submitting} onClick={() => submitAnswer(answer, "SUGGESTED")}>{answer}</Option>)}
        </>}
        {!loading && ready && canComplete && <>
          <Complete><img src={checkIcon} alt="" />{totalTasks ? "모든 검토 항목을 처리했어요." : "추가로 다듬을 내용 없음"}</Complete>
          <FinishButton type="button" disabled={submitting} onClick={finishReview}>{submitting ? "완료 처리 중" : "최종 검토 완료"}</FinishButton>
        </>}
        {!loading && ready && error && <ErrorText>{error}</ErrorText>}
      </Body>
      <Composer>
        <textarea placeholder={currentQuestion ? "답변을 직접 입력해 주세요." : "답변할 질문이 없습니다."} value={input} disabled={!currentQuestion || Boolean(currentItem) || submitting} onChange={(event) => setInput(event.target.value)} />
        <ComposerActions>
          <button type="button" disabled={!currentQuestion || Boolean(currentItem)} onClick={() => setPicker(true)}>＋ 30초 기록</button>
          <button type="button" disabled={!currentQuestion || Boolean(currentItem) || !input.trim() || submitting} onClick={() => submitAnswer(input, "DIRECT")}>{submitting ? "저장 중" : "전송"}</button>
        </ComposerActions>
      </Composer>
      {picker && <Picker>
        <h3>기록 선택</h3>
        {records.length ? records.map((record) => <label key={record.id}><input type="checkbox" checked={selected.includes(record.id)} onChange={() => toggleRecord(record.id)} /><span>{record.content}</span></label>) : <Sub>연결된 30초 기록이 없습니다.</Sub>}
        <button type="button" disabled={!selected.length} onClick={addSelectedRecords}>선택한 기록 추가 ({selected.length})</button>
      </Picker>}
    </Panel>
  );
}
