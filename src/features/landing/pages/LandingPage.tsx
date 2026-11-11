import { ArrowRight, ArrowUpRight, Boxes, Check, CircleDollarSign, Cog, Grid2X2, MessageSquare, ShoppingCart, Users } from '@/components/ui/hugeicons'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

const modules = [
    { title: 'Sales & CRM', text: 'Pipelines, quotes, orders, and customer 360, connected to every invoice and shipment.', icon: Grid2X2 },
    { title: 'Accounting', text: 'Double-entry ledger, tax, multi-currency, bank feeds, and reporting that closes on time.', icon: CircleDollarSign },
    { title: 'Inventory', text: 'Multi-warehouse stock, lot and serial tracking, cycle counts, and reorder rules that work.', icon: Boxes },
    { title: 'HR & Payroll', text: 'Time-off, onboarding, payroll, and an org chart your people actually keep looking at.', icon: Users },
    { title: 'Projects', text: 'Boards, Gantt, timesheets, and budgets tied to invoices so billable work bills itself.', icon: Grid2X2 },
    { title: 'Manufacturing', text: 'Bills of materials, work orders, shop-floor routing, and MRP without the PhD.', icon: Cog },
    { title: 'Purchasing', text: 'Vendors, RFQs, purchase orders, and receiving, with three-way match that matches.', icon: ShoppingCart },
    { title: 'Helpdesk', text: 'Tickets, SLAs, and a customer portal on the same CRM record as every order.', icon: MessageSquare },
]

const customerNames = ['Hollis & Dray Millwork', 'Cascade Cycles', 'North Atlas Logistics', 'The Everyday Press', 'Meridian Coffee Roasters', 'Ardent Mechanical', 'Studio Fieldnote', 'Thorne Manufacturing']
const container = 'mx-auto w-[calc(100%-56px)] max-w-screen-2xl max-sm:w-[calc(100%-36px)]'
const buttonBase = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-(--ink) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper)'
const buttonDark = `${ buttonBase } bg-(--ink) text-(--paper) hover:bg-(--accent)`
const kicker = 'flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-(--accent) uppercase before:h-px before:w-[22px] before:bg-current'
const mockPanel = 'overflow-hidden rounded-2xl border border-(--rule) bg-[#fffdf7] shadow-[0_24px_55px_-32px_rgb(23_22_15_/_28%)]'
const mockTop = 'flex items-center gap-1.5 border-b border-(--rule) bg-(--paper-2) px-3.5 py-3'
const mockDot = 'size-[9px] rounded-full bg-(--rule)'
const mockSmall = 'block overflow-hidden text-[8px] text-(--muted) uppercase'
const mockKpi = 'min-w-0 rounded-lg border border-(--rule) bg-(--paper) p-2.5 max-sm:p-1.5'

function CheckLine ( { children }: Readonly<{ children: string }> ) {
    return <li className="flex items-center gap-2.5 border-t border-(--rule) py-3 last:border-b"><span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-(--moss) text-(--paper)"><Check size={ 13 } aria-hidden="true" /></span><span>{ children }</span></li>
}

function DashboardMockup () {
    return (
        <div className={ mockPanel }>
            <div className={ mockTop }><span className={ mockDot } /><span className={ mockDot } /><span className={ mockDot } /><small className="ml-2 font-mono text-[9px] text-(--muted)">app.tessera.com / dashboard</small></div>
            <div className="grid min-h-[360px] grid-cols-[112px_minmax(0,1fr)] gap-4 p-4 max-[680px]:grid-cols-1">
                <aside className="flex flex-col gap-1 max-[680px]:flex-row max-[680px]:flex-wrap" aria-label="Dashboard preview navigation">
                    { [ 'Overview', 'Sales', 'Inventory', 'Accounting', 'HR', 'Reports' ].map( ( item, i ) => <div className={ `flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] ${ i === 0 ? 'bg-(--paper) font-medium text-(--ink)' : 'text-(--ink-soft)' }` } key={ item }><i className={ `size-3 rounded-[3px] ${ i === 0 ? 'bg-(--accent)' : 'bg-(--rule)' }` } />{ item }</div> ) }
                </aside>
                <div className="flex min-w-0 flex-col gap-2.5">
                    <h3 className="font-display text-lg">Good morning, Emma <span aria-hidden="true">👋</span></h3>
                    <div className="grid grid-cols-3 gap-2 max-[420px]:grid-cols-1">
                        { [ [ 'Revenue (MTD)', '$284,120', '↗ +12.4%' ], [ 'Cash on hand', '$91,847', '↗ +3.1%' ], [ 'Open tickets', '14', '↘ 2 overdue' ] ].map( ( [ label, value, delta ], i ) => <div className={ mockKpi } key={ label }><small className={ mockSmall }>{ label }</small><strong className="mt-1 block font-display text-[clamp(15px,2vw,21px)] font-normal tracking-[-.03em]">{ value }</strong><em className={ `font-mono text-[8px] not-italic ${ i === 2 ? 'text-(--accent)' : 'text-(--moss)' }` }>{ delta }</em></div> ) }
                    </div>
                    <div className="h-[123px] rounded-lg border border-(--rule) bg-(--paper) p-2.5">
                        <div className="flex justify-between text-[8px] text-(--muted)"><strong className="font-display text-[11px] font-normal text-(--ink-soft)">Revenue · Last 30 days</strong><span className="font-mono">DAILY</span></div>
                        <svg className="h-[88px] w-full" viewBox="0 0 500 120" preserveAspectRatio="none" role="img" aria-label="Revenue trending upward over the last 30 days"><defs><linearGradient id="landing-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b93a1d" stopOpacity=".24" /><stop offset="100%" stopColor="#b93a1d" stopOpacity="0" /></linearGradient></defs><path d="M0 92 L34 84 L68 88 L102 70 L136 76 L170 60 L204 66 L238 50 L272 57 L306 43 L340 48 L374 35 L408 40 L442 23 L476 29 L500 16 L500 120 L0 120Z" fill="url(#landing-chart-fill)" /><path d="M0 92 L34 84 L68 88 L102 70 L136 76 L170 60 L204 66 L238 50 L272 57 L306 43 L340 48 L374 35 L408 40 L442 23 L476 29 L500 16" fill="none" stroke="#b93a1d" strokeWidth="2" /></svg>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-(--rule) bg-(--paper)">
                        <div className="grid grid-cols-[minmax(0,1fr)_48px_48px_32px] gap-1 bg-(--paper-2) px-2 py-2 font-mono text-[7px] text-(--muted) uppercase"><span>Recent orders</span><span>Amount</span><span>Stage</span><span>PO#</span></div>
                        { [ [ 'Hollis & Dray Millwork', '$4,280', 'Shipped', '#2841' ], [ 'Cascade Cycles', '$1,960', 'Packing', '#2840' ], [ 'Meridian Coffee Roasters', '$12,400', 'On hold', '#2839' ] ].map( ( row, i ) => <div className="grid grid-cols-[minmax(0,1fr)_48px_48px_32px] items-center gap-1 border-t border-(--rule) px-2 py-2 text-[8px]" key={ row[ 0 ] }><span className="truncate">{ row[ 0 ] }</span><span>{ row[ 1 ] }</span><span className={ `rounded-full px-1 py-0.5 text-center text-[7px] ${ i === 0 ? 'bg-(--moss-soft) text-(--moss)' : i === 1 ? 'bg-(--ochre-soft) text-[#8a5c18]' : 'bg-(--accent-soft) text-(--accent-deep)' }` }>{ row[ 2 ] }</span><span>{ row[ 3 ] }</span></div> ) }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const LandingPage = () => {
    const [scrolled, setScrolled] = useState( false )

    useEffect( () => {
        const updateScrollState = () => setScrolled( window.scrollY > 8 )
        updateScrollState()
        window.addEventListener( 'scroll', updateScrollState, { passive: true } )
        return () => window.removeEventListener( 'scroll', updateScrollState )
    }, [] )

    return (
    <div className="min-h-screen overflow-x-clip bg-(--paper) bg-[radial-gradient(circle_at_15%_10%,rgb(185_58_29_/_4%),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(61_90_58_/_4%),transparent_45%)] text-(--ink)">
        <header className={ `sticky top-0 z-20 border-b bg-(--paper)/[.78] backdrop-blur-[10px] transition-colors duration-300 ${ scrolled ? 'border-(--rule)' : 'border-transparent' }` }>
            <div className={ `flex min-h-[68px] items-center justify-between gap-6 ${ container }` }>
                <a href="#top" className="inline-flex items-baseline gap-1 font-display text-[26px] font-medium italic tracking-[-.02em]">Tessera<span className="mb-1 size-1.5 rounded-full bg-(--accent)" /></a>
                <nav aria-label="Main navigation" className="flex items-center gap-7 text-sm text-(--ink-soft) max-[700px]:hidden"><a className="hover:text-(--accent)" href="#modules">Modules</a><a className="hover:text-(--accent)" href="#features">How it works</a><a className="hover:text-(--accent)" href="#pricing">Pricing</a><a className="hover:text-(--accent)" href="#footer">Company</a></nav>
                <div className="flex items-center gap-2"><Button asChild variant="pill-ghost" size="lg" className="text-(--ink) hover:bg-(--paper-2) max-[680px]:hidden"><Link to="/auth/signin">Sign in</Link></Button><Button asChild variant="pill-ghost" size="lg" className={ buttonDark }><Link to="/auth/signup">Start a trial <ArrowRight size={ 15 } /></Link></Button></div>
            </div>
        </header>

        <main id="top">
            <section className="pt-[76px]">
                <div className={ container }>
                    <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[.14em] text-(--ink-soft) uppercase"><span className="size-[7px] rounded-full bg-(--moss) shadow-[0_0_0_5px_rgb(61_90_58_/_13%)]" />Tessera v4.2 · Shipped this week</div>
                    <h1 className="max-w-[14ch] font-display text-[clamp(48px,8.2vw,112px)] font-light leading-[.98] tracking-[-.045em]">Software for running the <em className="text-(--accent)">whole shop.</em></h1>
                    <p className="mt-7 max-w-[570px] text-lg text-(--ink-soft)">Tessera is a modern ERP for small and mid-sized businesses. <strong className="font-medium text-(--ink)">Sales, inventory, accounting, HR, manufacturing, and projects</strong>—all in one place, all in one database, all priced like a grown-up.</p>
                    <div className="mt-8 flex flex-wrap items-center gap-3"><Button asChild variant="pill-ghost" size="pill" className={ buttonDark }><Link to="/auth/signup">Start a 30-day trial <ArrowRight size={ 16 } /></Link></Button><a className={ `${ buttonBase } border border-(--ink) text-(--ink) hover:bg-(--ink) hover:text-(--paper)` } href="#features">See how it works <ArrowUpRight size={ 15 } /></a></div>
                    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-(--muted) max-[680px]:grid">{ [ 'No credit card', 'Free migration from QuickBooks, NetSuite & SAP B1', 'Self-host or managed cloud' ].map( ( line ) => <li className="flex items-center gap-2" key={ line }><Check size={ 14 } className="text-(--moss)" />{ line }</li> ) }</ul>
                </div>
                <div className={ `${ container } mt-[74px] overflow-hidden border-y border-(--rule) py-4` }>
                    <p className="mb-3 text-center font-mono text-[10px] tracking-[.12em] text-(--muted) uppercase">Running the books of 4,200+ companies—from 3-person shops to 500-person plants</p>
                    <div className="overflow-hidden" aria-label="Customer brands">
                        <div className="flex w-max animate-brand-marquee gap-10 whitespace-nowrap pb-1 font-display text-xl italic text-(--ink-soft)/75 motion-reduce:animate-none hover:[animation-play-state:paused]">
                            { [ ...customerNames, ...customerNames ].map( ( name, i ) => <span className="after:pl-3 after:text-sm after:text-(--accent) after:content-['✦']" key={ `${ name }-${ i }` }>{ name }</span> ) }
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-[88px]" id="modules"><div className={ container }>
                <div className="mb-12 grid grid-cols-[1fr_1.1fr] items-end gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-6"><div><div className={ kicker }>One platform</div><h2 className="mt-4 max-w-[17ch] font-display text-[clamp(36px,5vw,62px)] font-light leading-[1.02] tracking-[-.04em]">Eight modules. <em className="text-(--ink-soft)">One database.</em> Zero duct tape.</h2></div><p className="max-w-[55ch] text-base text-(--ink-soft)">Most companies run on six disconnected SaaS tools and a heroic spreadsheet. Tessera replaces all of it with integrated modules that share the same customers, products, and ledger—so a sale in one module posts everywhere it should.</p></div>
                <div className="grid grid-cols-4 gap-px overflow-hidden rounded-[17px] border border-(--rule) bg-(--rule) max-[1000px]:grid-cols-2 max-[520px]:grid-cols-1">{ modules.map( ( item, i ) => { const Icon = item.icon; return <a className="group relative min-h-[220px] bg-(--paper) p-6 transition-colors hover:bg-(--paper-2)" href="#pricing" key={ item.title }><span className={ `mb-5 grid size-[42px] place-items-center rounded-[11px] text-(--paper) ${ [ 'bg-(--accent)', 'bg-(--moss)', 'bg-(--sky)', 'bg-(--ochre)', 'bg-(--plum)', 'bg-(--ink)', 'bg-(--accent-deep)', 'bg-(--moss)' ][ i ] }` }><Icon size={ 22 } strokeWidth={ 1.7 } /></span><span className="absolute right-5 top-5 font-mono text-[10px] tracking-[.1em] text-(--muted)">{ String( i + 1 ).padStart( 2, '0' ) }</span><h3 className="mb-1 font-display text-[21px] font-normal">{ item.title }</h3><p className="max-w-[32ch] text-xs leading-relaxed text-(--ink-soft)">{ item.text }</p><ArrowUpRight className="absolute bottom-5 right-5 text-(--accent) opacity-40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" size={ 18 } /></a> } ) }</div>
            </div></section>

            <section className="py-6" id="features"><div className={ `${ container } grid grid-cols-[.9fr_1.1fr] items-center gap-14 max-[900px]:grid-cols-1` }>
                <div><div className={ kicker }>The dashboard</div><h2 className="my-4 max-w-[17ch] font-display text-[clamp(32px,4vw,48px)] font-light leading-[1.04] tracking-[-.04em]">Every number, <em className="text-(--accent)">already reconciled.</em></h2><p className="max-w-[48ch] text-[15px] text-(--ink-soft)">No more exporting to spreadsheets at 11 p.m. on the 30th. Because every module writes to the same ledger, your P&amp;L updates the instant an order ships, an invoice is paid, or a part is consumed on the shop floor.</p><ul className="mt-6 grid text-[13px] text-(--ink-soft)"><CheckLine>Drill from any KPI straight to the source transaction.</CheckLine><CheckLine>Custom dashboards per role—operator, controller, owner.</CheckLine><CheckLine>Real-time cash flow, not a month-old rearview mirror.</CheckLine></ul></div>
                <DashboardMockup />
            </div></section>

            <section className="py-14"><div className={ `${ container } grid grid-cols-[1.1fr_.9fr] items-center gap-14 max-[900px]:grid-cols-1` }>
                <div className="order-2 max-[900px]:order-1"><div className={ kicker }>Built by operators</div><h2 className="my-4 max-w-[17ch] font-display text-[clamp(32px,4vw,48px)] font-light leading-[1.04] tracking-[-.04em]">Opinionated where it <em className="text-(--accent)">saves you time.</em> Flexible where it counts.</h2><p className="max-w-[48ch] text-[15px] text-(--ink-soft)">We’ve run factories, warehouses, and bookkeeping teams. That shows up in the defaults: a chart of accounts that matches GAAP out of the box, approval chains that assume humans get sick, and a migration path off the tools you already hate.</p><ul className="mt-6 grid text-[13px] text-(--ink-soft)"><CheckLine>Open API and a Python SDK—build anything on top.</CheckLine><CheckLine>Row-level permissions so Sales never sees payroll.</CheckLine><CheckLine>Everything exports. Your data is yours, always.</CheckLine></ul></div>
                <div className={ `${ mockPanel } order-1 max-[900px]:order-2` }><div className={ mockTop }><span className={ mockDot } /><span className={ mockDot } /><span className={ mockDot } /><small className="ml-2 font-mono text-[9px] text-(--muted)">app.tessera.com / inventory / SKU-4120</small></div><div className="flex flex-col gap-4 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-base">SKU-4120 · Walnut shelf bracket, 8&quot;</h3><span className="rounded-full bg-(--moss-soft) px-2 py-1 text-[10px] text-(--moss)">In stock · 142</span></div><div className="grid grid-cols-4 gap-2 max-[500px]:grid-cols-2">{ [ [ 'On hand', '142' ], [ 'Committed', '38' ], [ 'Reorder at', '60' ], [ 'Avg cost', '$3.42' ] ].map( ( [ l, v ] ) => <div className={ mockKpi } key={ l }><small className={ mockSmall }>{ l }</small><strong className="mt-1 block font-display text-xl font-normal">{ v }</strong></div> ) }</div><div className="overflow-hidden rounded-lg border border-(--rule) bg-(--paper) text-[9px]"><div className="grid grid-cols-[45px_minmax(0,1fr)_65px_30px] gap-2 bg-(--paper-2) p-2 font-mono text-[7px] text-(--muted) uppercase"><span>Date</span><span>Movement</span><span>Source</span><span>Qty</span></div>{ [ [ 'Apr 17', 'Shipment to Cascade Cycles', 'SO #2840', '−12' ], [ 'Apr 16', 'Receipt from Thorne Supply', 'PO #881', '+60' ], [ 'Apr 15', 'Cycle count adjustment', 'CC-04', '−2' ], [ 'Apr 14', 'Work order consumption', 'WO #412', '−8' ] ].map( ( row, i ) => <div className="grid grid-cols-[45px_minmax(0,1fr)_65px_30px] gap-2 border-t border-(--rule) p-2" key={ row[ 0 ] }><span>{ row[ 0 ] }</span><span>{ row[ 1 ] }</span><span>{ row[ 2 ] }</span><b className={ i === 1 ? 'text-(--moss)' : 'text-(--accent)' }>{ row[ 3 ] }</b></div> ) }</div></div></div>
            </div></section>

            <section className="py-10 pb-24"><div className={ container }><blockquote className="mx-auto max-w-[23ch] text-center font-display text-[clamp(32px,5vw,58px)] font-light italic leading-[1.1] tracking-[-.035em]">“We replaced QuickBooks, Monday, ShipStation, and two spreadsheets in a weekend. Our month-end went from <em className="text-(--accent)">nine days to two.</em>”</blockquote><p className="mt-7 text-center font-mono text-[10px] tracking-[.12em] text-(--ink-soft) uppercase">Emma Voss · COO, Hollis &amp; Dray Millwork</p></div></section>

            <section className="pb-20" id="pricing"><div className={ `${ container } relative grid grid-cols-[1.1fr_.9fr] items-center gap-14 overflow-hidden rounded-[23px] bg-(--ink) p-[60px] text-(--paper) before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(600px_300px_at_110%_15%,rgb(185_58_29_/_40%),transparent_60%)] max-[900px]:grid-cols-1 max-[900px]:p-10 max-sm:p-6` }>
                <div className="relative z-1"><div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[.14em] text-[#f0a090] uppercase before:h-px before:w-[22px] before:bg-current">Pricing</div><h2 className="my-4 max-w-[17ch] font-display text-[clamp(36px,4.5vw,56px)] font-light leading-[1.02] tracking-[-.04em]">One flat price. <em className="text-[#f0a090]">No per-seat games.</em></h2><p className="mb-3 max-w-[48ch] text-[15px] text-(--paper)/70">Most ERPs punish you for growing—every new hire is another $95/month. Pay one price, invite everyone in the company, and get on with your work.</p><p className="max-w-[48ch] text-[15px] text-(--paper)/70">Includes all modules. Unlimited users. Unlimited companies. Support from people who’ve shipped real product.</p></div>
                <div className="relative z-1 rounded-[17px] bg-(--paper) p-8 text-(--ink) shadow-2xl max-sm:p-5"><div className="font-mono text-[10px] tracking-[.12em] text-(--accent) uppercase">Tessera Business</div><div className="my-3 flex items-baseline gap-2"><span className="font-display text-[66px] font-light leading-none tracking-[-.05em]">$349</span><small className="text-xs text-(--muted)">/ month, flat</small></div><p className="text-xs text-(--ink-soft)">For the whole company. Billed annually at $3,990.</p><ul className="my-4 grid gap-2 border-y border-(--rule) py-4 text-xs text-(--ink-soft)">{ [ 'All 8 modules included', 'Unlimited users & roles', 'Up to 3 legal entities', 'Open API + Python SDK', 'Migration assistance, on us', '30-day full-refund trial' ].map( ( item ) => <li className="before:pr-2 before:font-mono before:text-(--accent) before:content-['→']" key={ item }>{ item }</li> ) }</ul><Button asChild variant="pill-ghost" size="pill-lg" className={ `${ buttonDark } w-full` }><Link to="/auth/signup">Start your trial <ArrowRight size={ 16 } /></Link></Button></div>
            </div></section>

            <section className="border-t border-(--rule) py-28 text-center"><div className={ container }><h2 className="mx-auto mb-6 max-w-[14ch] font-display text-[clamp(48px,8vw,108px)] font-light leading-[.98] tracking-[-.05em]">Run the <em className="text-(--accent)">whole shop</em> on Tessera.</h2><p className="mx-auto mb-8 max-w-[42ch] text-base text-(--ink-soft)">Thirty days, every module, every feature. No card, no sales call, no “let’s hop on a quick demo.”</p><Button asChild variant="pill-ghost" size="pill-lg" className={ buttonDark }><Link to="/auth/signup">Start your trial <ArrowRight size={ 16 } /></Link></Button></div></section>
        </main>

        <footer className="border-t border-(--rule) py-11 pb-8 text-(--ink-soft)" id="footer"><div className={ container }><div className="mb-10 grid grid-cols-[1.5fr_repeat(4,1fr)] gap-8 max-[900px]:grid-cols-3 max-[680px]:grid-cols-2"><div className="max-[680px]:col-span-2"><a href="#top" className="inline-flex items-baseline gap-1 font-display text-3xl font-medium italic">Tessera<span className="mb-1 size-1.5 rounded-full bg-(--accent)" /></a><p className="mt-3 max-w-[29ch] text-xs">Software for running the whole shop. Made in Portland, Oregon. Serving operators everywhere since 2019.</p></div>{ [ { title: 'Product', links: [ 'Modules', 'Integrations', 'Changelog', 'Roadmap' ] }, { title: 'Resources', links: [ 'Docs', 'API reference', 'Migration guides', 'Customer stories' ] }, { title: 'Company', links: [ 'About', 'Our principles', 'Careers', 'Press kit' ] }, { title: 'Legal', links: [ 'Terms', 'Privacy', 'Security', 'SOC 2' ] } ].map( ( group ) => <div key={ group.title }><h3 className="mb-3 font-mono text-[10px] font-normal tracking-[.12em] text-(--muted) uppercase">{ group.title }</h3><ul className="grid gap-2 text-xs">{ group.links.map( ( label ) => <li key={ label }><a className="hover:text-(--accent)" href="#top">{ label }</a></li> ) }</ul></div> ) }</div><div className="flex justify-between gap-4 border-t border-(--rule) pt-5 font-mono text-[10px] tracking-[.05em] text-(--muted) max-[520px]:flex-col"><span>© 2026 Tessera Systems, Inc.</span><span>Built with care in PDX · v4.2.1</span></div></div></footer>
    </div>
    )
}
