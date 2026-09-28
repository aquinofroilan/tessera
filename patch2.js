const fs = require('fs');

// Patch Button
let btn = fs.readFileSync('components/ui/button.tsx', 'utf8');
btn = btn.replace('link: "text-primary underline-offset-4 hover:underline",', 
\`link: "text-primary underline-offset-4 hover:underline",
        pill: "rounded-full bg-foreground text-background tracking-[-0.005em] hover:-translate-y-px hover:bg-(--accent)",
        "pill-outline": "rounded-full border-(--ink) bg-transparent text-foreground hover:-translate-y-px hover:bg-foreground hover:text-background",
        "pill-ghost": "rounded-full bg-transparent text-(--ink-soft) hover:border-border hover:bg-(--paper-2)",
        "pill-success": "rounded-full bg-(--moss) text-background hover:-translate-y-px",
        sso: "rounded-[10px] border-border bg-card text-foreground hover:-translate-y-px hover:border-(--ink)",
        "nav-card": "w-full justify-start rounded-[10px] border-(--rule) bg-(--paper) text-left whitespace-normal hover:border-(--muted-2)",
        chip: "rounded-full border-(--rule) bg-(--paper) text-(--ink-soft) hover:border-(--muted-2) hover:text-(--ink) aria-selected:border-(--ink) aria-selected:bg-(--ink) aria-selected:text-(--paper)",\`);

btn = btn.replace('"icon-lg": "size-9",', 
\`"icon-lg": "size-9",
        pill: "gap-2 px-4.5 py-2.5 text-sm",
        "pill-lg": "gap-2.5 px-5 py-3.5 text-[15px]",
        sso: "gap-2.5 px-3.5 py-[11px] text-sm [&_svg:not([class*='size-'])]:size-4.5",
        "nav-card": "h-auto gap-2.5 p-2.5 text-[13px]",\`);
fs.writeFileSync('components/ui/button.tsx', btn);
