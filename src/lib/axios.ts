import Axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const LONG_REQUEST_DELAY_MS = 1_500;
const LONG_REQUEST_MESSAGE = "The request takes longer than expected. Please wait and don't refresh the page.";

type PendingRequestToast = {
  timeoutId: ReturnType<typeof setTimeout>;
  toastId?: string | number;
};

const pendingRequestToasts = new Map<InternalAxiosRequestConfig, PendingRequestToast>();

const clearPendingRequestToast = (config?: InternalAxiosRequestConfig) => {
  if (!config) return;

  const pendingToast = pendingRequestToasts.get(config);
  if (!pendingToast) return;

  clearTimeout(pendingToast.timeoutId);
  if (pendingToast.toastId !== undefined) {
    toast.dismiss(pendingToast.toastId);
  }
  pendingRequestToasts.delete(config);
};

export const clearPendingRequestToasts = () => {
  for (const config of pendingRequestToasts.keys()) {
    clearPendingRequestToast(config);
  }
};

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('tessera_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';

    const pendingToast: PendingRequestToast = {
      timeoutId: setTimeout(() => {
        pendingToast.toastId = toast.info(LONG_REQUEST_MESSAGE, { duration: Infinity });
      }, LONG_REQUEST_DELAY_MS),
    };
    pendingRequestToasts.set(config, pendingToast);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    clearPendingRequestToast(response.config);
    return response.data;
  },
  (error) => {
    clearPendingRequestToast(error?.config);
    // We can handle global error notifications here (e.g., toast)
    // if (error.response?.status === 401) { logout() }
    return Promise.reject(error);
  }
);
