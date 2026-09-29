import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../lib/axios";
import type { ForgotPasswordCredentials } from "../types";

export const requestPasswordReset = (data: ForgotPasswordCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/forgot-password', data);
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: requestPasswordReset,
    });
};
