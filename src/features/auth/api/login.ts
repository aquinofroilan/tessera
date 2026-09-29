import { useMutation } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type { AuthResponse, LoginCredentials } from "@/src/features/auth/types";

export const loginWithEmailAndPassword = (data: LoginCredentials): Promise<AuthResponse> => {
    // Usually OAuth2 token endpoints require form-urlencoded data
    // Adjust this to standard JSON if your backend handles it differently
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', data.email);
    params.append('password', data.password);

    return axios.post('/api/v1/oauth2/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

type UseLoginOptions = {
    onSuccess?: (data: AuthResponse) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
    return useMutation({
        mutationFn: loginWithEmailAndPassword,
        onSuccess: (data) => {
            // Here you can store the token in localStorage or Zustand
            localStorage.setItem('tessera_token', data.access_token);
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });
};
