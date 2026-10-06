import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
