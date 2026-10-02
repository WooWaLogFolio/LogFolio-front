import { getCsrfToken } from "./authApi";

export const getCsrfHeaders = async () => {
  const { data } = await getCsrfToken();
  return { [data.headerName]: data.token };
};