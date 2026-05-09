"use client";

import { Button } from "@/components/ui/button";
import { GoogleLogo, MicrosoftLogo } from "./icons";

export function SsoButtons({ disabled }: { disabled?: boolean }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <Button
        type="button"
        variant="sso"
        size="sso"
        disabled={disabled}
        onClick={() => {
          // SSO not wired up yet.
        }}
      >
        <GoogleLogo className="h-[18px] w-[18px]" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="sso"
        size="sso"
        disabled={disabled}
        onClick={() => {
          // SSO not wired up yet.
        }}
      >
        <MicrosoftLogo className="h-[18px] w-[18px]" />
        Continue with Microsoft
      </Button>
    </div>
  );
}
