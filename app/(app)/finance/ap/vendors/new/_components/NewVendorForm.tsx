"use client";

import { PartyForm } from "../../../../_components/PartyForm";
import { createVendorAction } from "../_data/create-vendor-action";

export const NewVendorForm = () => (
    <PartyForm
        entityLabel="Vendor"
        namePlaceholder="e.g. Westline Hardwoods"
        emailPlaceholder="orders@vendor.com"
        accountLabel="Default expense account"
        accountPlaceholder="e.g. acc_5000"
        submitLabel="Create vendor"
        action={createVendorAction}
    />
);
