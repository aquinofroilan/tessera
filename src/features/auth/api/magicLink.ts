import { useMutation } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type {
    RequestMagicLinkCredentials,
    ConsumeMagicLinkCredentials,
    AuthenticatedResponse,
    AuthResponse,
} from "@/src/features/auth/types";
import { getUser } from "@/src/features/auth/api/getUser";
import { useAuthStore } from "@/src/features/auth/stores/authStore";

export const requestMagicLink = (data: RequestMagicLinkCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/login-link/request', data);
};

export const consumeMagicLink = (data: ConsumeMagicLinkCredentials): Promise<AuthResponse> => {
    return axios.post('/api/v1/auth/login-link/consume', data);
};

export const useRequestMagicLink = () => {
    return useMutation({
        mutationFn: requestMagicLink,
    });
};

type UseConsumeMagicLinkOptions = {
    onSuccess?: (data: AuthenticatedResponse) => void;
};

export const useConsumeMagicLink = ({ onSuccess }: UseConsumeMagicLinkOptions = {}) => {
    return useMutation({
        mutationFn: consumeMagicLink,
        onSuccess: async (data) => {
            // Note: Since this is an authentication endpoint that issues a token,
            // we should store the access token securely, identical to a standard login.
            localStorage.setItem('tessera_token', data.access_token);
            const user = data.user ?? await getUser();
            useAuthStore.getState().setUser(user);
            if (onSuccess) {
                onSuccess({ ...data, user });
            }
        },
    });
};
