import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/src/lib/axios";
import type { 
    ValidateInvitationCredentials, 
    ValidateInvitationResponse, 
    AcceptInvitationCredentials 
} from "@/src/features/auth/types";

export const validateInvitation = (data: ValidateInvitationCredentials): Promise<ValidateInvitationResponse> => {
    return axios.post('/api/v1/auth/invitations/validate', data);
};

export const acceptInvitation = (data: AcceptInvitationCredentials): Promise<{ message: string }> => {
    return axios.post('/api/v1/auth/invitations/accept', data);
};

export const useValidateInvitation = (token: string | undefined) => {
    return useQuery({
        queryKey: ['validate-invitation', token],
        queryFn: () => {
            if (!token) throw new Error("No token provided");
            return validateInvitation({ token });
        },
        enabled: !!token,
        retry: false,
    });
};

export const useAcceptInvitation = () => {
    return useMutation({
        mutationFn: acceptInvitation,
    });
};
