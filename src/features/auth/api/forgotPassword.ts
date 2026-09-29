import { useMutation } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type { ForgotPasswordCredentials } from "@/src/features/auth/types";

export const requestPasswordReset = (data: ForgotPasswordCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/forgot-password', data);
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: requestPasswordReset,
    });
};
