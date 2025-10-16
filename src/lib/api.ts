import axios from "axios";

const api = axios.create({
  baseURL: "http://cotos02-002-site3.qtempurl.com/api/",
});

export default api;
