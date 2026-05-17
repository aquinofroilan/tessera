import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewAccountForm } from "./_components/NewAccountForm";

export const metadata: Metadata = {
    title: "New account · Loom",
};

const NewAccountPage = () => {
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Chart of accounts", href: "/finance/accounts" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · General ledger · New"
                        title="New account"
                        description="Add a ledger account — code, name, type, and optional parent for sub-accounts."
                    />
                    <NewAccountForm />
                </div>
            </div>
        </>
    );
};

export default NewAccountPage;
