import axiosInstance from "./axiosInstance";
import { getCsrfHeaders } from "./csrf";

export const createProject = async (project) =>
  axiosInstance.post("/projects", project, {
    headers: await getCsrfHeaders(),
  });

export const updateProject = async (projectId, project) =>
  axiosInstance.put(`/projects/${projectId}`, project, {
    headers: await getCsrfHeaders(),
  });

export const getProject = (projectId) =>
  axiosInstance.get(`/projects/${projectId}`);

export const getProjectFiles = (projectId) =>
  axiosInstance.get(`/projects/${projectId}/files`);

export const getStorage = () => axiosInstance.get("/storage");

export const uploadProjectFile = async (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post(`/projects/${projectId}/files`, formData, {
    headers: {
      ...(await getCsrfHeaders()),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProjectFile = async (fileId) =>
  axiosInstance.delete(`/files/${fileId}`, {
    headers: await getCsrfHeaders(),
  });
