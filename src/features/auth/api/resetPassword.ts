import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../lib/axios";
import type { ResetPasswordCredentials } from "../types";

export const executePasswordReset = (data: ResetPasswordCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/reset-password', data);
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: executePasswordReset,
    });
};
