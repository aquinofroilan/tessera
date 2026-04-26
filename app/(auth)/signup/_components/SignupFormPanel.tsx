import Link from "next/link";
import { SignupForm } from "./SignupForm";
import { MigrationIcon } from "./icons";

export function SignupFormPanel() {
  return (
    <div className="relative flex flex-col px-7 pb-10 pt-7 md:px-10">
      <header className="mb-10 flex items-center justify-between md:mb-16">
        <Link href="/" className="font-display inline-flex items-baseline gap-1 text-[26px] font-medium italic tracking-[-0.02em] text-[var(--ink)] no-underline">
          Loom
          <span className="mb-[3px] ml-0.5 size-1.5 rounded-full bg-[var(--accent)]" />
        </Link>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-2 text-[13px] text-[var(--ink-soft)] no-underline transition-colors hover:border-[var(--rule)] hover:bg-[var(--paper-2)]"
        >
          Already have an account?
          <strong className="font-medium text-[var(--ink)]">Sign in</strong>
        </a>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[420px]">
          <div className="mb-5 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            <span>Start your trial</span>
            <span className="rounded-full bg-[var(--moss-soft)] px-2.5 py-[3px] text-[10px] tracking-[0.1em] text-[var(--moss)]">
              30 days · free
            </span>
          </div>

          <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] sm:text-[46px] max-sm:text-[38px]">
            Run the whole shop on{" "}
            <em className="italic text-[var(--accent)]">Loom.</em>
          </h1>

          <p className="mb-8 max-w-[40ch] text-[15px] text-[var(--ink-soft)]">
            No credit card. No sales call. Every module, every feature — for 30 days. If you don&apos;t like it, just walk away.
          </p>

          <SignupForm />

          <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-dashed border-[var(--rule)] bg-[var(--paper-2)] px-4 py-3.5 text-[13px] leading-[1.5] text-[var(--ink-soft)]">
            <div className="grid size-[30px] flex-none place-items-center rounded-md bg-[var(--ink)] text-[var(--paper)]">
              <MigrationIcon className="h-4 w-4" />
            </div>
            <div>
              <strong className="font-medium text-[var(--ink)]">
                Coming from QuickBooks, NetSuite, or SAP B1?
              </strong>
              <br />
              Our migration team will move your data for you, free.{" "}
              <a href="#" className="font-medium text-[var(--accent)] no-underline">
                Book a 30-min call →
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
        <span>© 2026 Loom Systems, Inc. · Portland, OR</span>
        <span className="space-x-1.5">
          <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">Status</a>
          <span>·</span>
          <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">Security</a>
          <span>·</span>
          <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">Docs</a>
        </span>
      </footer>
    </div>
  );
}
