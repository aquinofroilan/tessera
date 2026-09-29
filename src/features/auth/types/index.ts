export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    orgName: string;
    orgSlug: string;
    orgBaseCurrency: string;
    orgDescription?: string;
}

export interface ForgotPasswordCredentials {
    email: string;
}

export interface ResetPasswordCredentials {
    token: string;
    newPassword: string;
}
