"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { LoomLogo } from "@/components/atoms/loom-logo";

const links = [
    { href: "#modules", label: "Modules" },
    { href: "#features", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#", label: "Changelog" },
    { href: "#", label: "Docs" },
];

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 border-b backdrop-blur-[10px] transition-colors ${
                scrolled ? "border-border" : "border-transparent"
            } bg-[rgba(246,241,230,0.78)]`}>
            <div className="mx-auto flex h-17 w-full max-w-310 items-center justify-between px-7">
                <LoomLogo />

                <ul className="hidden list-none gap-8 text-[14.5px] text-(--ink-soft) min-[701px]:flex">
                    {links.map((link) => (
                        <li key={link.label}>
                            <a href={link.href} className="transition-colors hover:text-(--accent)">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2.5">
                    <Button asChild variant="pill-ghost" size="pill">
                        <Link href="/signin">Sign in</Link>
                    </Button>
                    <Button asChild variant="pill" size="pill">
                        <Link href="/signup">Start a trial →</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
