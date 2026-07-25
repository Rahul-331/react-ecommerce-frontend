import axios from "axios";

const API = axios.create({
  baseURL: "https://springboot-ecommerce-backend-0q40.onrender.com/api",
  timeout: 2500,
});
delete API.defaults.headers.common["Authorization"];
export default API;

