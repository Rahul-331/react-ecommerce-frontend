import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 2500,
});
delete API.defaults.headers.common["Authorization"];
export default API;

