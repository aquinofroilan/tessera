import { PackagePlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'

export const InventoryPage = () => (
    <DashboardShell>
        <div className="mx-auto w-full max-w-7xl">
            <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                <div>
                    <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory</p>
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Products</h1>
                    <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage the product records used across your inventory and sales workflows.</p>
                </div>
                <Button asChild variant="pill-ghost" size="sm" className="mt-[18px] inline-flex items-center gap-1.5 rounded-lg bg-(--ink) px-3 py-2 text-[13px] font-medium text-(--paper) transition-colors hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:mt-0">
                    <Link to="/inventory/products/new"><PackagePlus size={16} aria-hidden="true" />Add product</Link>
                </Button>
            </div>

            <Card className="mx-auto max-w-3xl text-center">
                <CardHeader className="items-center">
                    <div className="mb-2 grid size-12 place-items-center rounded-xl bg-(--paper-2) text-(--ink)">
                        <PackagePlus size={21} aria-hidden="true" />
                    </div>
                    <CardEyebrow>Product master data</CardEyebrow>
                    <CardTitle>Start your product catalog</CardTitle>
                    <CardDescription className="max-w-lg">Create a product record with its SKU, pricing, tax group, and inventory tracking options.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                        <Link to="/inventory/products/new"><PackagePlus size={16} aria-hidden="true" />Create your first product</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </DashboardShell>
)
