import { z } from "zod";

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^-?\d+(\.\d+)?$/.test(v), "Must be a number");

export const variantFormSchema = z.object({
    skuSuffix: z.string().trim().min(1, "Required").max(32, "Too long"),
    attributes: z
        .string()
        .trim()
        .min(1, "Required")
        .refine(
            (v) => v.split(",").every((pair) => /^[^:]+:[^:]+$/.test(pair.trim())),
            "Use comma-separated key:value pairs, e.g. size:L, color:black",
        ),
    salesPrice: optionalDecimal,
    purchaseCost: optionalDecimal,
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;

export const VARIANT_FORM_DEFAULTS: VariantFormValues = {
    skuSuffix: "",
    attributes: "",
    salesPrice: "",
    purchaseCost: "",
};

export const parseAttributes = (raw: string): Record<string, string> =>
    raw
        .split(",")
        .map((p) => p.trim().split(":"))
        .reduce<Record<string, string>>((acc, [k, v]) => {
            if (k && v) acc[k.trim()] = v.trim();
            return acc;
        }, {});
