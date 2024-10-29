import axios from "axios";
import { envVars } from "@/data/constants";

const axiosInstance = axios.create({
  baseURL: envVars.API_BASE_URL,
});

export default axiosInstance;
