type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
      <path d="M3 7l9 6 9-6" {...stroke} />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"
      />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" {...stroke} />
      <path d="M8 11V7a4 4 0 018 0v4" {...stroke} />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...stroke} />
      <circle cx="12" cy="12" r="3" {...stroke} />
    </svg>
  );
}

export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M2 12s3.5-7 10-7c2 0 3.8.5 5.3 1.3M22 12s-3.5 7-10 7c-2 0-3.8-.5-5.3-1.3"
      />
      <path
        {...stroke}
        d="M9.9 5.2A10 10 0 0122 12M2 12a10 10 0 014.6-5.8M9 9a3 3 0 014.2 4.2M3 3l18 18"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function CheckBoldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

export function SpinnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 11-6.22-8.56" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MigrationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 12h18M3 12l6-6M3 12l6 6M21 3v18" {...stroke} />
    </svg>
  );
}

export function GoogleLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2a10.3 10.3 0 00-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92a8.78 8.78 0 002.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18a8.6 8.6 0 005.96-2.18l-2.92-2.26a5.4 5.4 0 01-8.04-2.83H.97v2.33A9 9 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71a5.4 5.4 0 010-3.42V4.96H.97a9 9 0 000 8.08l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58a4.86 4.86 0 013.44 1.35l2.58-2.59A8.66 8.66 0 009 0 9 9 0 00.97 4.96l2.99 2.33A5.4 5.4 0 019 3.58z"
      />
    </svg>
  );
}

export function MicrosoftLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <rect x="1" y="1" width="8" height="8" fill="#F25022" />
      <rect x="9" y="1" width="8" height="8" fill="#7FBA00" />
      <rect x="1" y="9" width="8" height="8" fill="#00A4EF" />
      <rect x="9" y="9" width="8" height="8" fill="#FFB900" />
    </svg>
  );
}
