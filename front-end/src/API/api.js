import axios from "axios";
import { backendServer } from "../environment";

// Add a request interceptor
const AxiosInstance = axios.create({
  baseURL: backendServer,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  },
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    // const idToken = await firebase.auth().currentUser?.getIdToken();
    // if (config.headers === undefined) {
    //   config.headers = {};
    // }
    // if (idToken) {
    //   config.headers.Authorization = idToken;
    // }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log("error on creating axios instance ", error);
  }
);

export default AxiosInstance;
