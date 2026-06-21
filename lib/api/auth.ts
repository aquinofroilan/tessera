import "server-only";

import { serverClient } from "@/lib/http";

export const AUTH_PATHS = {
    signin: "/auth/signin",
    signup: "/auth/signup",
    loginLinkRequest: "/auth/login-link/request",
    loginLinkConsume: "/auth/login-link/consume",
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

export type RequestLoginLinkRequest = {
    email: string;
};

export type LoginLinkIssuedResponse = {
    message: string;
};

export type ConsumeLoginLinkRequest = {
    token: string;
};

export const signin = (body: SigninRequest) => serverClient.post<AuthResponse>(AUTH_PATHS.signin, body);

export const signup = (body: SignupRequest) => serverClient.post<AuthResponse>(AUTH_PATHS.signup, body);

export const requestLoginLink = (body: RequestLoginLinkRequest) =>
    serverClient.post<LoginLinkIssuedResponse>(AUTH_PATHS.loginLinkRequest, body);

export const consumeLoginLink = (body: ConsumeLoginLinkRequest) =>
    serverClient.post<AuthResponse>(AUTH_PATHS.loginLinkConsume, body);
