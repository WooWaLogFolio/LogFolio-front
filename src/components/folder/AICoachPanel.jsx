import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  answerGapQuestion,
  getGapQuestions,
  getReviewSession,
  startReviewSession,
} from "../../apis/experienceApi";
import aiDocument from "../../assets/icons/folder/ai-document.svg";
import checkIcon from "../../assets/icons/folder/check.svg";

const Panel = styled.aside`
  position: sticky; top: 24px; width: 312px; height: 663px;
  border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 12px;
  background: white; overflow: hidden;
  @media (max-width: 980px) { position: static; width: 100%; }
`;
const Header = styled.h2`padding:18px 16px;border-bottom:1px solid ${({theme})=>theme.colors.border};font-size:13px;line-height:20px;`;
const Body = styled.div`padding:14px 16px;`;
const StepHead = styled.div`display:flex;align-items:center;justify-content:space-between;padding:8px 0 12px;font-size:12px;font-weight:700;img{width:24px;height:24px;}span{display:flex;align-items:center;gap:8px;}em{color:${({theme})=>theme.colors.textGray};font-style:normal;font-weight:400;}`;
const Progress = styled.div`display:flex;gap:3px;margin-bottom:16px;i{display:block;flex:1;height:2px;background:${({theme})=>theme.colors.border};}i.done{background:${({theme})=>theme.colors.primary};}`;
const Question = styled.p`font-size:13px;font-weight:600;line-height:20px;`;
const Sub = styled.p`margin-top:5px;color:${({theme})=>theme.colors.textGray};font-size:11px;line-height:18px;`;
const Option = styled.button`width:100%;margin-top:6px;padding:9px 11px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;text-align:left;font-size:12px;&:hover,&:focus-visible{border-color:${({theme})=>theme.colors.primary};}&:disabled{cursor:wait;opacity:.55;}`;
const Complete = styled.div`display:flex;align-items:center;gap:6px;padding:9px 11px;border-radius:7px;background:${({theme})=>theme.colors.primaryLight};color:${({theme})=>theme.colors.primary};font-size:12px;font-weight:600;img{width:11px;height:11px;}`;
const Composer = styled.div`position:absolute;left:0;right:0;bottom:0;padding:12px 14px;border-top:1px solid ${({theme})=>theme.colors.border};background:white;textarea{width:100%;height:59px;padding:10px 11px;resize:none;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;font:inherit;font-size:13px;&:focus{outline:none;border-color:${({theme})=>theme.colors.primary};}&:disabled{background:#f8f9fa;}}`;
const ComposerActions = styled.div`display:flex;justify-content:space-between;margin-top:10px;button{height:28px;padding:0 10px;border:1px solid ${({theme})=>theme.colors.border};border-radius:6px;color:${({theme})=>theme.colors.textGray};font-size:11px;}button:last-child{border:0;background:${({theme})=>theme.colors.primary};color:white;&:disabled{background:${({theme})=>theme.colors.border};}}`;
const Picker = styled.div`position:absolute;z-index:2;left:16px;right:16px;top:175px;max-height:310px;overflow:auto;padding:14px;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;background:white;box-shadow:0 5px 18px rgba(0,0,0,.12);h3{font-size:13px;margin-bottom:8px;}label{display:flex;gap:8px;margin:10px 0;font-size:12px;line-height:18px;}button{width:100%;height:34px;margin-top:8px;border-radius:7px;background:${({theme})=>theme.colors.primary};color:white;font-size:12px;&:disabled{background:${({theme})=>theme.colors.border};color:${({theme})=>theme.colors.textGray};}}`;
const State = styled.div`display:grid;min-height:260px;place-items:center;color:${({theme})=>theme.colors.textGray};font-size:12px;line-height:20px;text-align:center;button{display:block;margin:12px auto 0;color:${({theme})=>theme.colors.primary};font-weight:700;}`;
const ErrorText = styled.p`margin-top:10px;color:#d92d20;font-size:11px;line-height:18px;`;

const hasAnswer = (question) => (question.answers?.length ?? 0) > 0;
const POLL_INTERVAL = 2500;
const POLL_ATTEMPTS = 24;
const FAILED_SESSION_STATUSES = new Set(["FAILED", "ERROR"]);
const FINISHED_SESSION_STATUSES = new Set(["COMPLETED", "DONE"]);
const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export default function AICoachPanel({ experienceId, records = [] }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const [selected, setSelected] = useState([]);
  const [input, setInput] = useState("");
  const requestVersion = useRef(0);

  const showQuestions = useCallback((items) => {
    setQuestions(items);
    const firstUnanswered = items.findIndex((item) => !hasAnswer(item));
    setCurrentIndex(firstUnanswered < 0 ? items.length : firstUnanswered);
    setEmptyMessage("");
  }, []);

  const prepareQuestions = useCallback(async ({ restart = false } = {}) => {
    const version = requestVersion.current + 1;
    const storageKey = `logfolio-review-session:${experienceId}`;
    requestVersion.current = version;
    setLoading(true);
    setGenerating(false);
    setError("");
    setEmptyMessage("");
    try {
      const questionResponse = await getGapQuestions(experienceId);
      const existingQuestions = Array.isArray(questionResponse.data) ? questionResponse.data : [];
      if (requestVersion.current !== version) return;
      if (existingQuestions.length) {
        showQuestions(existingQuestions);
        sessionStorage.removeItem(`logfolio-review-session:${experienceId}`);
        return;
      }

      let sessionId = restart ? null : sessionStorage.getItem(storageKey);
      if (!sessionId) {
        const { data } = await startReviewSession(experienceId);
        sessionId = data.id;
        sessionStorage.setItem(storageKey, sessionId);
      }

      if (requestVersion.current !== version) return;
      setGenerating(true);

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        if (attempt > 0) await wait(POLL_INTERVAL);
        if (requestVersion.current !== version) return;

        const [sessionResponse, questionsResponse] = await Promise.all([
          getReviewSession(sessionId),
          getGapQuestions(experienceId),
        ]);
        if (requestVersion.current !== version) return;

        const generatedQuestions = Array.isArray(questionsResponse.data) ? questionsResponse.data : [];
        if (generatedQuestions.length) {
          showQuestions(generatedQuestions);
          sessionStorage.removeItem(storageKey);
          return;
        }

        const status = sessionResponse.data?.status;
        if (FAILED_SESSION_STATUSES.has(status)) {
          sessionStorage.removeItem(storageKey);
          throw new Error("AI 질문 생성에 실패했습니다.");
        }
        if (FINISHED_SESSION_STATUSES.has(status)) {
          sessionStorage.removeItem(storageKey);
          setEmptyMessage("AI 분석이 완료됐지만 생성된 보완 질문이 없습니다.");
          return;
        }
      }

      setEmptyMessage("질문 생성이 지연되고 있습니다. 잠시 후 다시 확인해 주세요.");
    } catch (requestError) {
      if (requestVersion.current !== version) return;
      if ([404, 410].includes(requestError.response?.status)) {
        sessionStorage.removeItem(storageKey);
      }
      setError(requestError.response?.data?.detail ?? requestError.message ?? "AI 질문을 준비하지 못했습니다.");
    } finally {
      if (requestVersion.current === version) {
        setLoading(false);
        setGenerating(false);
      }
    }
  }, [experienceId, showQuestions]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    prepareQuestions();
    return () => {
      requestVersion.current += 1;
    };
  }, [prepareQuestions]);

  const currentQuestion = questions[currentIndex];
  const completed = questions.length > 0 && currentIndex >= questions.length;
  const progress = useMemo(
    () => questions.map((question, index) => hasAnswer(question) || index <= currentIndex),
    [currentIndex, questions],
  );

  const submitAnswer = async (answer, answerType) => {
    const normalized = answer.trim();
    if (!currentQuestion || !normalized || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await answerGapQuestion(currentQuestion.id, normalized, answerType);
      setQuestions((items) => items.map((item, index) => (
        index === currentIndex
          ? { ...item, answers: [...(item.answers ?? []), data] }
          : item
      )));
      setInput("");
      setSelected([]);
      setPicker(false);
      setCurrentIndex((index) => index + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? "답변을 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRecord = (id) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const addSelectedRecords = () => {
    const references = records
      .filter((record) => selected.includes(record.id))
      .map((record) => record.content)
      .filter(Boolean);
    if (references.length) {
      setInput((value) => [value.trim(), ...references].filter(Boolean).join("\n"));
    }
    setPicker(false);
  };

  return (
    <Panel>
      <Header>AI로 경험 다듬기</Header>
      <Body>
        {loading && <State>{generating ? "AI가 보완 질문을 만들고 있습니다." : "확인할 내용을 불러오는 중입니다."}</State>}
        {!loading && error && questions.length === 0 && (
          <State><div>{error}<button type="button" onClick={() => prepareQuestions()}>다시 시도</button><button type="button" onClick={() => prepareQuestions({ restart: true })}>새로 시작</button></div></State>
        )}
        {!loading && !error && questions.length === 0 && emptyMessage && (
          <State><div>{emptyMessage}<button type="button" onClick={() => prepareQuestions()}>다시 확인</button><button type="button" onClick={() => prepareQuestions({ restart: true })}>새로 생성</button></div></State>
        )}
        {!loading && currentQuestion && (
          <>
            <StepHead>
              <span><img src={aiDocument} alt="" />확인할 내용</span>
              <em>{currentIndex + 1} / {questions.length}</em>
            </StepHead>
            <Progress>{progress.map((done, index) => <i className={done ? "done" : ""} key={questions[index].id} />)}</Progress>
            <Question>{currentQuestion.question}</Question>
            {currentQuestion.targetSection && <Sub>{currentQuestion.targetSection}</Sub>}
            {(currentQuestion.suggestedAnswers ?? []).map((answer) => (
              <Option type="button" key={answer} disabled={submitting} onClick={() => submitAnswer(answer, "SUGGESTED")}>{answer}</Option>
            ))}
            {error && <ErrorText>{error}</ErrorText>}
          </>
        )}
        {!loading && completed && <Complete><img src={checkIcon} alt="" />모든 확인 질문에 답변했어요.</Complete>}
      </Body>
      <Composer>
        <textarea
          placeholder={currentQuestion ? "답변을 직접 입력해 주세요." : "답변할 질문이 없습니다."}
          value={input}
          disabled={!currentQuestion || submitting}
          onChange={(event) => setInput(event.target.value)}
        />
        <ComposerActions>
          <button type="button" disabled={!currentQuestion} onClick={() => setPicker(true)}>＋ 30초 기록</button>
          <button type="button" disabled={!currentQuestion || !input.trim() || submitting} onClick={() => submitAnswer(input, "DIRECT")}>{submitting ? "저장 중" : "전송"}</button>
        </ComposerActions>
      </Composer>
      {picker && (
        <Picker>
          <h3>기록 선택</h3>
          {records.length
            ? records.map((record) => (
              <label key={record.id}>
                <input type="checkbox" checked={selected.includes(record.id)} onChange={() => toggleRecord(record.id)} />
                <span>{record.content}</span>
              </label>
            ))
            : <Sub>연결된 30초 기록이 없습니다.</Sub>}
          <button type="button" disabled={!selected.length} onClick={addSelectedRecords}>선택한 기록 추가 ({selected.length})</button>
        </Picker>
      )}
    </Panel>
  );
}
