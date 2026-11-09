import axiosInstance from "./axiosInstance";
import { getCsrfHeaders } from "./csrf";

export const startAnalysis = async (projectId, fileIds) =>
  axiosInstance.post(
    `/projects/${projectId}/analysis-runs`,
    { fileIds },
    { headers: await getCsrfHeaders() },
  );

export const getAnalysisRun = (runId) =>
  axiosInstance.get(`/analysis-runs/${runId}`);

export const getCandidates = (runId) =>
  axiosInstance.get(`/analysis-runs/${runId}/candidates`);

// 서버는 summary를 보내지 않으면 null로 덮어쓰므로, title·summary·draftContent를 항상 함께 보냅니다.
export const decideCandidate = async (candidateId, decision, { title, summary, draftContent } = {}) =>
  axiosInstance.put(
    `/experience-candidates/${candidateId}/decision`,
    { decision, title, summary, draftContent },
    { headers: await getCsrfHeaders() },
  );

export const finalizeAnalysis = async (runId) =>
  axiosInstance.post(`/analysis-runs/${runId}/finalize`, null, {
    headers: await getCsrfHeaders(),
  });