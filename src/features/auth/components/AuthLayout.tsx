import React from 'react';

type AuthLayoutProps = {
    children: React.ReactNode;
    title: string;
    description?: string;
    variant?: 'default' | 'editorial';
    editorialContent?: React.ReactNode;
};

export const AuthLayout = ({
    children,
    title,
    description,
    variant = 'default',
    editorialContent,
}: AuthLayoutProps) => {
    if (variant === 'editorial') {
        return (
            <div className="auth-shell">
                <main className="auth-form-panel">
                    <div className="auth-form-wrap">
                        <div className="auth-form-card">
                            <div className="auth-form-heading">
                                <h1>{title}</h1>
                                {description && <p>{description}</p>}
                            </div>
                            {children}
                        </div>
                    </div>
                </main>
                <aside className="auth-editorial-panel">{editorialContent}</aside>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid place-items-center bg-muted/30">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border shadow-sm">
                <div className="space-y-2 text-center animate-in fade-in zoom-in-95 duration-300">
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
