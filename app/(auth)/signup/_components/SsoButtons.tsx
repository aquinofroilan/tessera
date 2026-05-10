"use client";

import { IconBrandGoogleFilled, IconBrandWindows } from "@tabler/icons-react";
import { Button } from "@/components/ui";

export function SsoButtons({ disabled }: { disabled?: boolean }) {
    return (
        <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Button type="button" variant="sso" size="sso" disabled={disabled} onClick={() => {}}>
                <IconBrandGoogleFilled className="size-4.5" />
                Continue with Google
            </Button>
            <Button type="button" variant="sso" size="sso" disabled={disabled} onClick={() => {}}>
                <IconBrandWindows className="size-4.5" />
                Continue with Microsoft
            </Button>
        </div>
    );
}
