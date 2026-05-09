"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
        scrolled ? "border-[var(--rule)]" : "border-transparent"
      } bg-[color:rgba(246,241,230,0.78)]`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-7">
        <Link
          href="/"
          className="font-display flex items-baseline gap-0.5 text-[26px] font-medium italic tracking-[-0.02em]"
        >
          Loom
          <span className="mb-[3px] ml-0.5 size-1.5 self-center rounded-full bg-[var(--accent)]" />
        </Link>

        <ul className="hidden list-none gap-8 text-[14.5px] text-[var(--ink-soft)] min-[701px]:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition-colors hover:text-[var(--accent)]">
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
