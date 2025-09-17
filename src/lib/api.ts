import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44301/api/",
});

export default api;
