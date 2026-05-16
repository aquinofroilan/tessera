"use client";

import { IconBrandGoogleFilled, IconBrandWindows } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function SsoButtons({ disabled, twoColumn }: { disabled?: boolean; twoColumn?: boolean }) {
    return (
        <div className={cn("mb-5 grid grid-cols-1 gap-2.5", twoColumn && "sm:grid-cols-2")}>
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
