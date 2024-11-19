import axios from "axios";
import { envVars } from "@/data/constants";
import { refreshUser } from "@/components/feature/core/api/RefreshUser";
import store from "@/redux/store";
import { setUserCreds, logout } from "@/redux/slices/authSlice";
import { NavigateFunction } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: envVars.API_BASE_URL,
  withCredentials: true,
});

export const setUpAxiosInterceptor = (navigate: NavigateFunction) => {
  axiosInstance.interceptors.response.use(
    (response) => response, // pass successful response forward
    async (error) => {
      if (error.response.status === 401) {
        // handle unauthorized error
        try {
          const refreshedUser = await refreshUser();
          store.dispatch(setUserCreds(refreshedUser));
          return axiosInstance(error.config);
        } catch (refreshError) {
          store.dispatch(logout());
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
