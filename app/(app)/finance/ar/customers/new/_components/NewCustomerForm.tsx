"use client";

import { PartyForm } from "../../../../_components/PartyForm";
import { createCustomerAction } from "../_data/create-customer-action";

export const NewCustomerForm = () => (
    <PartyForm
        entityLabel="Customer"
        namePlaceholder="e.g. Cedar & Co."
        emailPlaceholder="billing@customer.com"
        accountLabel="Default revenue account"
        accountPlaceholder="e.g. acc_4000"
        submitLabel="Create customer"
        action={createCustomerAction}
    />
);
