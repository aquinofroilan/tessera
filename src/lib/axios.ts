import Axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/src/features/auth/stores/authStore';
import { markApiErrorToastHandled, toastApiError } from '@/src/lib/api-error';

const LONG_REQUEST_DELAY_MS = 1_500;
const LONG_REQUEST_MESSAGE = "The request takes longer than expected. Please wait and don't refresh the page.";
const LONG_REQUEST_TOAST_ID = 'long-request-pending';

type PendingRequestToast = {
  timeoutId: ReturnType<typeof setTimeout>;
  hasShownToast: boolean;
};

const pendingRequestToasts = new Map<InternalAxiosRequestConfig, PendingRequestToast>();
let activeLongRequestCount = 0;
let longRequestToastId: string | number | undefined;
let isRedirectingForUnauthorized = false;

export const resetUnauthorizedRedirect = () => {
  isRedirectingForUnauthorized = false;
  toast.dismiss( 'unauthorized-session' );
};

const clearPendingRequestToast = (config?: InternalAxiosRequestConfig) => {
  if (!config) return;

  const pendingToast = pendingRequestToasts.get(config);
  if (!pendingToast) return;

  clearTimeout(pendingToast.timeoutId);

  if (pendingToast.hasShownToast) {
    activeLongRequestCount = Math.max(0, activeLongRequestCount - 1);
  }

  pendingRequestToasts.delete(config);

  if (activeLongRequestCount === 0 && longRequestToastId !== undefined) {
    toast.dismiss(longRequestToastId);
    longRequestToastId = undefined;
  }
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
      hasShownToast: false,
      timeoutId: setTimeout(() => {
        if (pendingRequestToasts.get(config) !== pendingToast) return;

        pendingToast.hasShownToast = true;
        activeLongRequestCount += 1;

        if (longRequestToastId === undefined) {
          longRequestToastId = toast.info(LONG_REQUEST_MESSAGE, {
            id: LONG_REQUEST_TOAST_ID,
            duration: Infinity,
          });
        }
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

    const isAuthenticationRequest = Axios.isAxiosError( error ) && error.config?.url?.includes( '/api/v1/auth/' );

    if ( Axios.isAxiosError( error ) && error.response?.status === 401 && typeof window !== 'undefined' && !isAuthenticationRequest ) {
      if ( !isRedirectingForUnauthorized ) {
        isRedirectingForUnauthorized = true;
        useAuthStore.getState().logout();
        toastApiError( error, 'Your session is unauthorized. Please sign in again.', {}, { id: 'unauthorized-session' } );
        void import( '@/src/routes' ).then( ({ router }) => {
          void router.navigate( { to: '/auth/signin', replace: true } );
        } ).catch( () => window.location.replace( '/auth/signin' ) );
      }

      markApiErrorToastHandled( error );
    }

    return Promise.reject(error);
  }
);
