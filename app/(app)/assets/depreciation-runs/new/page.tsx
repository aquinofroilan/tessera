import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewDepreciationRunForm } from "./_components/NewDepreciationRunForm";

export const metadata: Metadata = {
    title: "New depreciation run · Tessera",
};

const NewDepreciationRunPage = () => {
    const now = new Date();
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Depreciation runs", href: "/assets/depreciation-runs" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · New run"
                        title="New depreciation run"
                        description="Pick a period. Lines are calculated from active assets and saved as a DRAFT — review and post on the next screen."
                    />
                    <NewDepreciationRunForm
                        defaultYear={now.getFullYear()}
                        defaultMonth={now.getMonth() + 1}
                    />
                </div>
            </div>
        </>
    );
};

export default NewDepreciationRunPage;
