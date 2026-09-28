import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { User } from "../types";

export const getUser = (): Promise<User> => {
    return axios.get('/api/v1/users/me');
};

export const useUser = () => {
    return useQuery({
        queryKey: ['auth-user'],
        queryFn: getUser,
    });
};
