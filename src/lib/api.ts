import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7109/api/",
});

export default api;
