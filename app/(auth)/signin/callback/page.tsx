import type { Metadata } from "next";
import { Suspense } from "react";

import { CallbackConsumer } from "./_components/CallbackConsumer";

export const metadata: Metadata = {
    title: "Signing you in · Tessera",
    description: "Completing your magic-link sign-in.",
};

type Props = { searchParams: Promise<{ token?: string }> };

const SigninCallbackPage = async ({ searchParams }: Props) => {
    const { token } = await searchParams;

    return (
        <Suspense fallback={null}>
            <CallbackConsumer token={token ?? ""} />
        </Suspense>
    );
};

export default SigninCallbackPage;
