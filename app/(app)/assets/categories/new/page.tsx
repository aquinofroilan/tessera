import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { CategoryForm } from "../_components/CategoryForm";
import { CATEGORY_FORM_DEFAULTS } from "../_data/category-form-schema";
import { createAssetCategoryAction } from "../_data/create-category-action";

export const metadata: Metadata = {
    title: "New asset category · Tessera",
};

const NewCategoryPage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "Assets", href: "/assets" },
                { label: "Categories", href: "/assets/categories" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-300 p-9">
                <PageHeader
                    eyebrow="Fixed assets · New category"
                    title="New asset category"
                    description="Code is immutable. Defaults below apply to new assets in this category."
                />
                <CategoryForm
                    defaultValues={CATEGORY_FORM_DEFAULTS}
                    submitLabel="Create category"
                    action={(values) => createAssetCategoryAction(values)}
                />
            </div>
        </div>
    </>
);

export default NewCategoryPage;
