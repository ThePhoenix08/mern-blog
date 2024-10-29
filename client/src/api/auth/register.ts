import axiosInstance from "@/api/axiosInstance";
import { restEndpoints } from "@/data/endpoints";

const register = async (
  data: Record<string, any>
): Promise<Record<string, any>> => {
  const endpoint = restEndpoints.register.endpoint;

  // send request to server
  const response = await axiosInstance.post(endpoint, data);
  console.log(response.data);

  // check if request is successful
  if (response.status !== 200) {
    // if error, throw it, reset user creds, and return
    const error = response.data;
    console.log(error);
    throw new Error(error.message);
  }
  console.log(response.data);
  return response.data;
};

export default register;
