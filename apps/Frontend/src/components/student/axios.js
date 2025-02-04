// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:3001/api/v1",
// });

// export default instance;
import axios from "axios";
import { API_BASE_URL } from "../../config/constants.js";
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
