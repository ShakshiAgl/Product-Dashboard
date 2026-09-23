import axios from "axios";
import { tokenStore } from "./token";

export class ApiError extends Error { 
    constructor(message, status){
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export const api = axios.create({
    baseURL : "https://dummyjson.com",
    timeout: 15000,
    headers : { "Content-Type": "application/json"},
});

//runs on every request : attach the token 

api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//runs on every response : normalize errors in one place 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;

    if(
        (status === 401 || status === 403) && 
        typeof window !== "undefined" && 
        !window.location.pathname.startsWith("/login")
    ) {
        tokenStore.clear();
        window.location.href = "/login";
    }

    const message = !error.response
      ? "Network error. Check your connection and try again"
      : error.response.data?.message ?? "Something went wrong.";

      return Promise.reject(new ApiError(message, status));
  }
);

export const isCancel = axios.isCancel;