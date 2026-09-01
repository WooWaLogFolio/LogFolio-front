import axiosInstance from "./axiosInstance";

export const login = ({ email, password }) =>
  axiosInstance.post("/auth/login", { email, password });

export const signup = ({ name, email, password }) =>
  axiosInstance.post("/auth/signup", { name, email, password });
