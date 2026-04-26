"use client";

import { GoogleLogo, MicrosoftLogo } from "./icons";

const ssoButtonClass =
  "inline-flex items-center justify-center gap-2.5 rounded-[10px] border border-[var(--rule)] bg-[var(--card)] px-3.5 py-[11px] text-sm font-medium text-[var(--ink)] transition-all hover:-translate-y-px hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60";

export function SsoButtons({ disabled }: { disabled?: boolean }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-1">
      <button
        type="button"
        className={ssoButtonClass}
        disabled={disabled}
        onClick={() => {
          // SSO not wired up yet.
        }}
      >
        <GoogleLogo className="h-[18px] w-[18px]" />
        Continue with Google
      </button>
      <button
        type="button"
        className={ssoButtonClass}
        disabled={disabled}
        onClick={() => {
          // SSO not wired up yet.
        }}
      >
        <MicrosoftLogo className="h-[18px] w-[18px]" />
        Continue with Microsoft
      </button>
    </div>
  );
}
