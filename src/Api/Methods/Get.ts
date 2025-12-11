import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ErrorMessage, ShowNotification } from "../../Attribute";
import { HTTP_STATUS, ROUTES } from "../../Constants";
import type { Params } from "../../Types";
import { getToken } from "../../Utils";

let isRedirecting = false;

export async function Get<T>(url: string, params?: Params, headers?: Record<string, string>): Promise<T> {
  const authToken = getToken();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const config: AxiosRequestConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...headers,
    },
    params,
  };

  try {
    const response = await axios.get<T>(BASE_URL + url, config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    const responseData = axiosError.response?.data as { message?: string };
    const errorMessage = responseData?.message || axiosError.message || "Something went wrong";
    const status = axiosError?.response?.status;

    if (status === HTTP_STATUS.TOKEN_EXPIRED && !isRedirecting) {
      isRedirecting = true;
      window.location.href = ROUTES.HOME;
      setTimeout(() => (isRedirecting = false), 1000);
    } else {
      ShowNotification(ErrorMessage(errorMessage), "error");
    }
    throw null;
  }
}
