import React from 'react';
import { Navigate, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '@/src/features/auth/stores/authStore';

export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
