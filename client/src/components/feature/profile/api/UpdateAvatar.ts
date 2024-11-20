import axiosInstance from "@/axios/axiosInstance";
import { restEndpoints } from "@/data/endpoints";

const updateAvatarRequest = async (
  data: any
): Promise<{ status: boolean; updatedUser?: any; error?: any }> => {
  try {
    const endpoint = restEndpoints.uploadAvatar.endpoint;
    const response = await axiosInstance.post(endpoint, data);

    if (response && response.status === 200) {
      return {
        status: true,
        updatedUser: response.data.data,
      };
    } else {
      return {
        status: false,
        error: response.data,
      };
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    return {
      status: false,
      error: error,
    };
  }
};

export default updateAvatarRequest;
