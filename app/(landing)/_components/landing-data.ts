export type ModuleItem = {
    id: string;
    title: string;
    description: string;
    icon: "grid" | "trend" | "stack" | "user" | "blocks" | "gear" | "cart" | "chat";
    iconColor: string;
};

export const trustedCompanies = [
    "Hollis & Dray Millwork",
    "Cascade Cycles",
    "North Atlas Logistics",
    "The Everyday Press",
    "Meridian Coffee Roasters",
    "Ardent Mechanical",
    "Studio Fieldnote",
    "Thorne Manufacturing",
];

export const modules: ModuleItem[] = [
    {
        id: "01",
        title: "Sales & CRM",
        description: "Pipelines, quotes, orders, and customer 360 - connected to every invoice and shipment.",
        icon: "grid",
        iconColor: "bg-[var(--accent)]",
    },
    {
        id: "02",
        title: "Accounting",
        description: "Double-entry ledger, tax, multi-currency, bank feeds, and reporting that closes a month on time.",
        icon: "trend",
        iconColor: "bg-[var(--moss)]",
    },
    {
        id: "03",
        title: "Inventory",
        description: "Multi-warehouse stock, lot and serial tracking, cycle counts, and reorder rules that just work.",
        icon: "stack",
        iconColor: "bg-[var(--sky)]",
    },
    {
        id: "04",
        title: "HR & Payroll",
        description: "Time-off, onboarding, payroll, and an org chart your people actually keep looking at.",
        icon: "user",
        iconColor: "bg-[var(--ochre)]",
    },
    {
        id: "05",
        title: "Projects",
        description: "Boards, Gantt, timesheets, and budgets - tied to invoices so billable work bills itself.",
        icon: "blocks",
        iconColor: "bg-[var(--plum)]",
    },
    {
        id: "06",
        title: "Manufacturing",
        description: "Bills of materials, work orders, shop-floor routing, and MRP without the PhD.",
        icon: "gear",
        iconColor: "bg-[var(--ink)]",
    },
    {
        id: "07",
        title: "Purchasing",
        description: "Vendors, RFQs, purchase orders, and receiving - with three-way match that actually matches.",
        icon: "cart",
        iconColor: "bg-[var(--accent-deep)]",
    },
    {
        id: "08",
        title: "Helpdesk",
        description: "Tickets, SLAs, and a customer portal, sitting on the same CRM record as every order.",
        icon: "chat",
        iconColor: "bg-[var(--moss)]",
    },
];

export const featureOneBullets = [
    "Drill from any KPI straight to the source transaction.",
    "Custom dashboards per role - operator, controller, owner.",
    "Real-time cash flow, not a month-old rearview mirror.",
];

export const featureTwoBullets = [
    "Open API and a Python SDK - build anything on top.",
    "Row-level permissions so Sales never sees payroll.",
    "Everything exports. Your data is yours, always.",
];

export const footerColumns = [
    {
        heading: "Product",
        links: ["Modules", "Integrations", "Changelog", "Roadmap"],
    },
    {
        heading: "Resources",
        links: ["Docs", "API reference", "Migration guides", "Customer stories"],
    },
    {
        heading: "Company",
        links: ["About", "Our principles", "Careers", "Press kit"],
    },
    {
        heading: "Legal",
        links: ["Terms", "Privacy", "Security", "SOC 2"],
    },
];
