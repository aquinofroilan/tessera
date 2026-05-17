import "server-only";

import { serverClient } from "@/lib/http";

export const AUTH_PATHS = {
    signin: "/auth/signin",
    signup: "/auth/signup",
} as const;

export type SigninRequest = {
    username: string;
    password: string;
    rememberMe: boolean;
};

export type SignupRequest = {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    orgName: string;
    orgSlug: string;
    orgDescription: string | null;
    orgBaseCurrency: string;
    orgFiscalYearStart: string;
    orgTimezone: string;
    orgLegalName: string;
    orgTradeName: string;
};

export type AuthResponse = {
    token?: string;
};

export const signin = (body: SigninRequest) => serverClient.post<AuthResponse>(AUTH_PATHS.signin, body);

export const signup = (body: SignupRequest) => serverClient.post<AuthResponse>(AUTH_PATHS.signup, body);
