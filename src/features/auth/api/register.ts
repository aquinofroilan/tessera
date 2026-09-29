import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../lib/axios";
import type { RegisterCredentials } from "../types";

export const registerWithEmailAndPassword = (data: RegisterCredentials): Promise<{ message: string, userId: string }> => {
    return axios.post('/api/v1/auth/signup', data);
};

type UseRegisterOptions = {
    onSuccess?: (data: { message: string, userId: string }) => void;
};

export const useRegister = ({ onSuccess }: UseRegisterOptions = {}) => {
    return useMutation({
        mutationFn: registerWithEmailAndPassword,
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });
};
