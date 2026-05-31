"use client";

import {
    useForm,
    type DefaultValues,
    type FieldValues,
    type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ZodType } from "zod";

type ActionResult = { ok: false; error: string } | void;

type Options<V extends FieldValues> = {
    schema: ZodType<V>;
    defaultValues: DefaultValues<V>;
    action: (values: V) => Promise<ActionResult>;
    onSuccess?: () => void;
};

export const useEntityForm = <V extends FieldValues>({
    schema,
    defaultValues,
    action,
    onSuccess,
}: Options<V>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolver = zodResolver(schema as any) as unknown as Resolver<V>;
    const form = useForm<V>({
        resolver,
        mode: "onBlur",
        defaultValues,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await action(values);
        if (result && !result.ok) {
            toast.error(result.error);
            return;
        }
        onSuccess?.();
    });

    return { form, onSubmit };
};
