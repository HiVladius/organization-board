import axios from "axios";

const urlBack = import.meta.env.VITE_API_BACK as string

const apiClient = axios.create({
  // baseURL: "http://localhost:3000/api", //*Desarrollo
  baseURL: urlBack, // Use the URL from the environment variable if available
  
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;