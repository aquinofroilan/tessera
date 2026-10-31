import React from 'react';
import { Link } from '@tanstack/react-router';

type AuthLayoutProps = {
    children: React.ReactNode;
    title: string;
    description?: string;
    variant?: 'default' | 'editorial';
    headerAction?: React.ReactNode;
    editorialIntro?: React.ReactNode;
    editorialContent?: React.ReactNode;
};

export const AuthLayout = ({
    children,
    title,
    description,
    variant = 'default',
    headerAction,
    editorialIntro,
    editorialContent,
}: AuthLayoutProps) => {
    if (variant === 'editorial') {
        return (
            <div className="grid min-h-screen grid-cols-2 overflow-x-hidden bg-(--paper) max-[900px]:grid-cols-1">
                <main className="flex min-w-0 flex-col px-10 pt-7 pb-10 max-[900px]:px-7 max-[900px]:py-10 max-[520px]:px-5.5 max-[520px]:py-7.5">
                    <header className="mb-16 flex items-center justify-between max-[900px]:mb-10">
                        <Link
                            to="/auth/signup"
                            aria-label="Tessera home"
                            className="inline-flex items-baseline gap-1 font-display text-[26px] font-medium tracking-[-0.02em] text-(--ink) italic"
                        >
                            Tessera
                            <span
                                aria-hidden="true"
                                className="mb-0.75 size-1.5 self-center rounded-full bg-(--accent)"
                            />
                        </Link>
                        {headerAction}
                    </header>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-105">
                            {editorialIntro ?? (
                                <div className="mb-8">
                                    <h1 className="mb-3.5 font-display text-[46px] leading-[0.98] font-normal tracking-[-0.03em] text-(--ink) max-[520px]:text-[38px]">
                                        {title}
                                    </h1>
                                    {description && <p className="max-w-[40ch] text-[15px] text-(--ink-soft)">{description}</p>}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </main>
                <aside className="relative flex min-w-0 overflow-hidden bg-(--ink) px-10 pt-7 pb-10 text-(--paper) max-[900px]:order-[-1] max-[900px]:min-h-105 max-[900px]:px-7 max-[900px]:py-10 max-[520px]:min-h-85 max-[520px]:px-5.5 max-[520px]:py-7.5">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-50 -right-50 size-150 rounded-full bg-[radial-gradient(circle,rgb(185_58_29/28%)_0%,transparent_60%)]"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-37.5 -left-37.5 size-125 rounded-full bg-[radial-gradient(circle,rgb(62_106_140/18%)_0%,transparent_60%)]"
                    />
                    <div className="relative z-1 mx-auto flex w-full max-w-125 self-center flex-col">
                        {editorialContent}
                    </div>
                </aside>
            </div>
        );
    }

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
