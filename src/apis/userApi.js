import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "./apiConfig";
import { getCsrfHeaders } from "./csrf";

export const getUserProfile = () => axiosInstance.get("/users/me");

export const updateUserName = async (name) =>
  axiosInstance.patch("/users/me/name", { name }, {
    headers: await getCsrfHeaders(),
  });

export const changePassword = async (currentPassword, newPassword) =>
  axiosInstance.put("/users/me/password", { currentPassword, newPassword }, {
    headers: await getCsrfHeaders(),
  });

export const getAuthAccounts = () =>
  axiosInstance.get("/users/me/auth-accounts");

export const startAuthAccountLink = (provider) => {
  window.location.assign(`${API_BASE_URL}/users/me/auth-accounts/${provider}/link`);
};

export const unlinkAuthAccount = async (provider) =>
  axiosInstance.delete(`/users/me/auth-accounts/${provider}`, {
    headers: await getCsrfHeaders(),
  });
