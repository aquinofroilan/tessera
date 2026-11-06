import { useMutation } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type { AuthenticatedResponse, AuthResponse, LoginCredentials } from "@/src/features/auth/types";
import { useAuthStore } from "@/src/features/auth/stores/authStore";
import { getUser } from "@/src/features/auth/api/getUser";

export const loginWithEmailAndPassword = (data: LoginCredentials): Promise<AuthResponse> => {
    return axios.post('/api/v1/auth/signin', {
        username: data.email,
        password: data.password,
    });
};

type UseLoginOptions = {
    onSuccess?: (data: AuthenticatedResponse) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
    return useMutation({
        mutationFn: loginWithEmailAndPassword,
        onSuccess: async (data) => {
            localStorage.setItem('tessera_token', data.accessToken);
            const user = data.user ?? await getUser();
            useAuthStore.getState().setUser(user);
            if (onSuccess) {
                onSuccess({ ...data, user });
            }
        },
    });
};
