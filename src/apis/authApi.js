import axiosInstance from "./axiosInstance";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export const login = ({ email, password }) =>
  axiosInstance.post("/auth/login", { email, password });

export const signup = ({ name, email, password }) =>
  axiosInstance.post("/auth/signup", { name, email, password });

export const getMe = () => axiosInstance.get("/auth/me");

export const getPendingSocialSignup = () =>
  axiosInstance.get("/auth/oauth2/pending-signup");

export const getCsrfToken = () => axiosInstance.get("/auth/csrf");

export const completeSocialSignup = async (email) => {
  const { data: csrf } = await getCsrfToken();

  return axiosInstance.post(
    "/auth/oauth2/complete-signup",
    { email },
    { headers: { [csrf.headerName]: csrf.token } },
  );
};

export const startSocialLogin = (provider) => {
  window.location.assign(`${apiBaseUrl}/auth/login/${provider}`);
};
