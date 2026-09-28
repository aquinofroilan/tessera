import Axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // We will inject the token from our Zustand store here later
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = \`Bearer \${token}\`;
    // }
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // We can handle global error notifications here (e.g., toast)
    // if (error.response?.status === 401) { logout() }
    return Promise.reject(error);
  }
);
