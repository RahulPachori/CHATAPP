import axios from "axios";

export const axiosInstance = axios.create({
   baseURL:"https://nextalk-backend-qgg4.onrender.com/api",
   withCredentials: true,
});