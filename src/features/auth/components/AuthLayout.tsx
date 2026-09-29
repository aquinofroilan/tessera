import React from 'react';

type AuthLayoutProps = {
    children: React.ReactNode;
    title: string;
    description?: string;
};

export const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen grid place-items-center bg-muted/30">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
