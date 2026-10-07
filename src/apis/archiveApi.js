import axiosInstance from "./axiosInstance";
import { getCsrfToken } from "./authApi";

const csrfConfig = async () => {
  const { data } = await getCsrfToken();

  return {
    headers: {
      [data.headerName]: data.token,
    },
  };
};

export const getArchive = () => axiosInstance.get("/archive");

export const getAllQuickLogs = async (projectId) => {
  const items = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const { data } = await axiosInstance.get("/quick-logs", {
      params: { page, size: 100, ...(projectId ? { projectId } : {}) },
    });
    items.push(...data.items);
    hasNext = data.hasNext;
    page += 1;
  }

  return items;
};

export const createQuickLog = async ({ content, projectId }) =>
  axiosInstance.post(
    "/quick-logs",
    { content, projectId },
    await csrfConfig(),
  );

export const updateQuickLog = async (id, content) =>
  axiosInstance.patch(
    `/quick-logs/${id}`,
    { content },
    await csrfConfig(),
  );

export const linkQuickLogProject = async (id, projectId) =>
  axiosInstance.put(
    `/quick-logs/${id}/project`,
    { projectId },
    await csrfConfig(),
  );

export const deleteQuickLog = async (id) =>
  axiosInstance.delete(`/quick-logs/${id}`, await csrfConfig());
