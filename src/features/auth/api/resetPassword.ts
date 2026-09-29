import { useMutation } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type { ResetPasswordCredentials } from "@/src/features/auth/types";

export const executePasswordReset = (data: ResetPasswordCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/reset-password', data);
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: executePasswordReset,
    });
};
