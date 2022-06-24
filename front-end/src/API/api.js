import axios from "axios";
import { backendServer } from "../environment";
import { getAuth, getIdToken } from "firebase/auth";

// Add a request interceptor
const AxiosInstance = axios.create({
  baseURL: backendServer,
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded",
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  },
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const { currentUser } = auth;
    if (config.headers === undefined) {
      config.headers = {};
    }
    if (currentUser) {
      const token = await getIdToken(currentUser, true);
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log("error on creating axios instance ", error);
  }
);

export default AxiosInstance;
