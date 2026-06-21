"use client";

import { useState } from "react";

import { MagicLinkForm } from "./MagicLinkForm";
import { SigninForm } from "./SigninForm";

type Mode = "password" | "magic";

export function SigninSurface() {
    const [mode, setMode] = useState<Mode>("password");

    if (mode === "magic") {
        return <MagicLinkForm onSwitchToPassword={() => setMode("password")} />;
    }
    return <SigninForm onSwitchToMagicLink={() => setMode("magic")} />;
}
