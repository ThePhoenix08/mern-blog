import axiosInstance from "@/api/axiosInstance";
import { restEndpoints } from "@/data/endpoints";
import { AxiosResponse } from "axios";

const register = async (data: Record<string, any>) => {
  const endpoint = restEndpoints.register.endpoint;
  let response: AxiosResponse | null = null;
  let error: any = null;

  // send request to server
  try {
    response = await axiosInstance.post(endpoint, data);
  } catch (err: any) {
    error = err;
  }

  if (!response || response?.status != 200) {
    return {
      response,
      error: error || response?.statusText || "Something went wrong",
      data: response?.data || null,
      success: false,
      status: response?.status || null,
    };
  }

  return {
    error: null,
    data: response.data,
    success: true,
    status: response.status,
  };
};

export default register;
