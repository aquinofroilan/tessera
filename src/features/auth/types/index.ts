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
