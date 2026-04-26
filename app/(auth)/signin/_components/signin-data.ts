export const changelogItems = [
  {
    title: "Multi-warehouse picking, redesigned.",
    detail: "Wave picking, batch labels, and route-aware suggestions on the warehouse app.",
  },
  {
    title: "Faster month-end close.",
    detail: "Automated bank reconciliation matches at 2× the speed, with audit trail.",
  },
  {
    title: "Open API v2.",
    detail: "Cursor pagination, partial responses, and a Python SDK 1.0.",
  },
  {
    title: "Row-level permissions.",
    detail: "Field-grain access control, now generally available on every plan.",
  },
];

export const dashKpis = [
  { label: "Revenue MTD", value: "$284,120", delta: "↑ +12.4%", negative: false },
  { label: "Cash", value: "$491K", delta: "↑ +3.1%", negative: false },
  { label: "AR · 60+", value: "$22K", delta: "↓ 2 accts", negative: true },
];

export const floatingStats = [
  { label: "Uptime · 90d", value: "99.99%", position: "a" as const },
  { label: "Last close", value: "2.1 days", position: "b" as const },
];

export const customerQuote = {
  body: "Fourteen months in. Books still close on time, every month. Loom stopped feeling like software and started feeling like",
  emphasis: "infrastructure.",
  name: "Marcus Thorne",
  role: "OWNER · THORNE MANUFACTURING",
  initials: "MT",
};
