import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listUoms } from "@/lib/api/inventory/uoms-dal";
import { AddUomForm } from "./_components/AddUomForm";
import { UomsTable } from "./_components/UomsTable";

export const metadata: Metadata = {
    title: "Units of measure · Tessera",
    description: "Org-wide units used by items, variants, and movements.",
};

const UomsPage = async () => {
    const uoms = await listUoms();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Settings" },
                    { label: "Units of measure" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Settings"
                        title="Units of measure"
                        description="Org-wide reference data. Items and variants pick from this list when you set a unit of measure."
                    />

                    <Block title="All units" description={`${uoms.length} unit${uoms.length === 1 ? "" : "s"} configured.`}>
                        <div className="grid gap-4">
                            <UomsTable rows={uoms} />
                            <AddUomForm />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default UomsPage;
