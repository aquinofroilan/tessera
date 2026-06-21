"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconDownload, IconLoader2, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export type CsvEntity = "products" | "customers" | "vendors";

type CsvIoActionsProps = {
    entity: CsvEntity;
    label: string;
    importable?: boolean;
};

type ImportResult = {
    rowsParsed: number;
    rowsCreated: number;
    errors: Array<{ rowNumber: number; message: string }>;
};

export function CsvIoActions({ entity, label, importable = true }: CsvIoActionsProps) {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onExport = () => {
        window.location.href = `/api/io/csv/${entity}/export`;
    };

    const reset = () => {
        setResult(null);
        setError(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const onImport = async (file: File) => {
        setImporting(true);
        setResult(null);
        setError(null);
        try {
            const body = new FormData();
            body.append("file", file);
            const response = await fetch(`/api/io/csv/${entity}/import`, { method: "POST", body });
            const data = (await response.json().catch(() => null)) as ImportResult | { error?: string } | null;
            if (!response.ok || !data || !("rowsParsed" in data)) {
                const message =
                    (data && "error" in data ? data.error : null) ?? `Couldn't import ${label.toLowerCase()}.`;
                setError(message);
                toast.error(message);
                return;
            }
            setResult(data);
            const createdNoun = data.rowsCreated === 1 ? label.replace(/s$/, "").toLowerCase() : label.toLowerCase();
            toast.success(`Imported ${data.rowsCreated} ${createdNoun}.`);
            router.refresh();
        } catch {
            const message = `Couldn't import ${label.toLowerCase()}.`;
            setError(message);
            toast.error(message);
        } finally {
            setImporting(false);
        }
    };

    return (
        <>
            {importable && (
                <Dialog
                    open={open}
                    onOpenChange={(next) => {
                        setOpen(next);
                        if (!next) reset();
                    }}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconUpload stroke={1.8} />
                            Import
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md gap-5">
                        <div className="grid gap-1.5">
                            <DialogTitle className="font-display text-foreground text-xl font-[380]">
                                Import {label}
                            </DialogTitle>
                            <DialogDescription>
                                Upload a CSV exported from this page or a spreadsheet matching the same columns. Good
                                rows persist even if some rows fail validation.
                            </DialogDescription>
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept=".csv,text/csv"
                            disabled={importing}
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) void onImport(file);
                            }}
                            className="border-(--rule) file:bg-(--paper-2) file:text-foreground hover:file:bg-(--paper-3) block w-full cursor-pointer rounded-md border bg-(--paper) text-[13px] text-(--ink-soft) file:mr-3 file:cursor-pointer file:border-0 file:px-3 file:py-2 file:text-[13px] file:font-medium disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {importing && (
                            <div className="flex items-center gap-2 text-[13px] text-(--muted)">
                                <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
                                Importing…
                            </div>
                        )}

                        {error && (
                            <div role="alert" className="text-[13px] text-(--accent)">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="grid gap-3 text-[13px]">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-(--paper-2) rounded-md px-3 py-2">
                                        <div className="text-(--muted) font-mono text-[10px] tracking-[0.08em] uppercase">
                                            Parsed
                                        </div>
                                        <div className="font-display text-foreground text-xl font-[380]">
                                            {result.rowsParsed}
                                        </div>
                                    </div>
                                    <div className="bg-(--paper-2) rounded-md px-3 py-2">
                                        <div className="text-(--muted) font-mono text-[10px] tracking-[0.08em] uppercase">
                                            Created
                                        </div>
                                        <div className="font-display text-foreground text-xl font-[380]">
                                            {result.rowsCreated}
                                        </div>
                                    </div>
                                </div>
                                {result.errors.length > 0 && (
                                    <div className="grid gap-1.5">
                                        <div className="text-(--muted) font-mono text-[10px] tracking-[0.08em] uppercase">
                                            {result.errors.length} row{result.errors.length === 1 ? "" : "s"} skipped
                                        </div>
                                        <ul className="max-h-40 overflow-y-auto border-l-2 border-(--accent) pl-3 text-[12px] text-(--ink-soft)">
                                            {result.errors.slice(0, 20).map((err) => (
                                                <li key={`${err.rowNumber}-${err.message}`}>
                                                    <span className="font-mono">row {err.rowNumber}:</span> {err.message}
                                                </li>
                                            ))}
                                            {result.errors.length > 20 && (
                                                <li className="text-(--muted) italic">
                                                    …and {result.errors.length - 20} more.
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                                <DialogClose asChild>
                                    <Button variant="outline" size="sm" className="justify-self-end">
                                        Done
                                    </Button>
                                </DialogClose>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            <Button variant="outline" size="sm" onClick={onExport}>
                <IconDownload stroke={1.8} />
                Export
            </Button>
        </>
    );
}
