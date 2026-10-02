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

export const decideCandidate = async (candidateId, decision) =>
  axiosInstance.put(
    `/experience-candidates/${candidateId}/decision`,
    { decision },
    { headers: await getCsrfHeaders() },
  );

export const finalizeAnalysis = async (runId) =>
  axiosInstance.post(`/analysis-runs/${runId}/finalize`, null, {
    headers: await getCsrfHeaders(),
  });