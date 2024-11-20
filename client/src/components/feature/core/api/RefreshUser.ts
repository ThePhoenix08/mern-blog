import axiosInstance from "@/axios/axiosInstance";
import { restEndpoints } from "@/data/endpoints";

export const refreshUser = async () => {
  const endpoint = restEndpoints.refreshUser.endpoint;
  const response = await axiosInstance.post(endpoint);
  if (response.status !== 200) {
    const error = response.data;
    console.log(error);
    throw new Error(error.message);
  }
  console.log(response.data.data);
  return response.data.data;
};
