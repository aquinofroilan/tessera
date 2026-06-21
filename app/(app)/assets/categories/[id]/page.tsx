import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAssetCategory } from "@/lib/api/assets/assets-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { CategoryForm } from "../_components/CategoryForm";
import { updateAssetCategoryAction } from "../_data/update-category-action";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const cat = await getAssetCategory(id);
    return { title: cat ? `${cat.code} · ${cat.name} · Tessera` : "Asset category · Tessera" };
};

const CategoryDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const cat = await getAssetCategory(id);
    if (!cat) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Categories", href: "/assets/categories" },
                    { label: cat.code },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Fixed assets · Category ${cat.code}`}
                        title={cat.name}
                        description={cat.description ?? "Edit defaults or deactivate the category below."}
                    />
                    <CategoryForm
                        defaultValues={{
                            code: cat.code,
                            name: cat.name,
                            description: cat.description ?? "",
                            defaultUsefulLifeMonths: cat.defaultUsefulLifeMonths
                                ? String(cat.defaultUsefulLifeMonths)
                                : "60",
                            defaultSalvageValue: cat.defaultSalvageValue,
                        }}
                        submitLabel="Save changes"
                        action={(values, isActive) => updateAssetCategoryAction(cat.id, values, isActive)}
                        initialActive={cat.isActive}
                        showActiveToggle
                    />
                </div>
            </div>
        </>
    );
};

export default CategoryDetailPage;
