import axiosInstance from "./axiosInstance";
import { getCsrfHeaders } from "./csrf";

export const getProjectExperiences = (projectId) =>
  axiosInstance.get(`/projects/${projectId}/experiences`);

export const createExperience = async (projectId, experience) =>
  axiosInstance.post(`/projects/${projectId}/experiences`, experience, {
    headers: await getCsrfHeaders(),
  });

export const getExperience = (experienceId) =>
  axiosInstance.get(`/experiences/${experienceId}`);

export const updateExperience = async (experienceId, experience) =>
  axiosInstance.put(`/experiences/${experienceId}`, experience, {
    headers: await getCsrfHeaders(),
  });

export const deleteExperience = async (experienceId) =>
  axiosInstance.delete(`/experiences/${experienceId}`, {
    headers: await getCsrfHeaders(),
  });

export const getExperienceEvidence = (experienceId) =>
  axiosInstance.get(`/experiences/${experienceId}/evidence`);
