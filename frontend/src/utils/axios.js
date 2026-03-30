import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-app-production-e699.up.railway.app",
  withCredentials: true,
});

export default api;
