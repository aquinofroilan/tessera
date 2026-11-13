import { IconArrowUpRight, IconCircleCheck, IconClock, IconPlus } from '@/components/ui/hugeicons'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useAuthStore } from '@/src/features/auth/stores/authStore'
import { Button } from '@/components/ui/button'

const placeholderSlots = [
    {
        label: 'Primary content slot',
        title: 'Your workspace, at a glance',
        description: 'Feature pages can plug into this area without rebuilding the authenticated shell.',
        icon: <IconCircleCheck size={ 18 } />,
        tone: 'moss',
    },
    {
        label: 'Secondary content slot',
        title: 'Ready for your next module',
        description: 'Keep this surface open for the next product area while the frame stays consistent.',
        icon: <IconClock size={ 18 } />,
        tone: 'ochre',
    },
]

export const DashboardPage = () => {
    const user = useAuthStore( ( state ) => state.user )
    const firstName = user?.firstName || 'there'

    return (
        <DashboardShell>
            <div className="mb-7 flex w-full items-end justify-between gap-7 border-b border-(--rule) pb-6 max-sm:block">
                <div>
                    <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Monday, November 2, 2026</p>
                    <h1 className="mb-2.5 font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Good morning, <em className="text-(--accent)">{ firstName }.</em></h1>
                    <p className="text-[15px] text-(--ink-soft)">A calm starting point for the whole shop.</p>
                </div>
                <Button type="button" variant="pill-ghost" size="sm" className="mt-[18px] inline-flex items-center gap-1.5 self-end rounded-lg bg-(--ink) px-2.5 py-2 text-[13px] font-medium text-(--paper) transition-colors hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:mt-0">
                    <IconPlus size={ 16 } strokeWidth={ 2.2 } aria-hidden="true" />
                    Create something
                </Button>
            </div>

            <section className="mb-5 flex w-full items-start gap-4 rounded-xl border border-(--rule) bg-(--paper-2) p-5 shadow-[0_1px_0_rgb(23_22_15_/_3%),0_8px_24px_-16px_rgb(23_22_15_/_18%)] sm:p-6" aria-label="Dashboard shell status">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--ink) text-(--paper) shadow-sm" aria-hidden="true">
                    <IconArrowUpRight size={ 18 } />
                </div>
                <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Dashboard shell</p>
                    <h2 className="my-1 font-display text-[23px] font-normal tracking-[-0.02em]">The frame is ready for your workspace.</h2>
                    <p className="text-[13px] text-(--ink-soft)">Use the shared sidebar, top bar, and content rhythm as the foundation for future authenticated pages.</p>
                </div>
            </section>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-5">
                { placeholderSlots.map( ( slot ) => (
                    <section key={ slot.label } className="min-h-[220px] rounded-xl border border-(--rule) bg-(--card) p-6 shadow-[0_1px_0_rgb(23_22_15_/_3%),0_10px_28px_-18px_rgb(23_22_15_/_22%)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-(--muted-2) hover:shadow-[0_1px_0_rgb(23_22_15_/_4%),0_16px_32px_-18px_rgb(23_22_15_/_25%)]">
                        <div className={ `grid size-10 place-items-center rounded-lg ring-1 ring-inset ring-black/5 ${ slot.tone === 'moss' ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--ochre-soft) text-(--ochre)' }` } aria-hidden="true">{ slot.icon }</div>
                        <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">{ slot.label }</p>
                        <h2 className="my-1 font-display text-[23px] font-normal tracking-[-0.02em]">{ slot.title }</h2>
                        <p className="text-[13px] text-(--ink-soft)">{ slot.description }</p>
                    </section>
                ) ) }
            </div>
        </DashboardShell>
    )
}
