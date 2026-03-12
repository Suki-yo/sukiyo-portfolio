import Link from 'next/link';
import { TerminalRouteNav } from '@/components/terminal/TerminalRouteNav';

export default function NotFound() {
  return (
    <main className="page-shell pb-10">
      <section className="page-card mx-auto max-w-3xl">
        <div className="terminal-headerbar">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" data-variant="accent" />
            <span className="terminal-dot" />
          </div>
          <p className="terminal-title">error.log</p>
        </div>

        <div className="p-8 sm:p-10">
          <TerminalRouteNav current="" />

          <p className="terminal-command-line">$ resolve route</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-rose-300">
            404
          </p>
          <h1 className="mt-4 font-sans text-4xl text-[var(--text)]">
            Requested path not found
          </h1>
          <p className="mt-5 max-w-xl terminal-muted text-sm leading-7">
            The workspace resolver could not match that route or project slug.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-full border border-[var(--line-strong)] px-4 py-3 font-mono text-xs text-[var(--text)] transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
            >
              cd /projects
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[var(--line)] px-4 py-3 font-mono text-xs text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
            >
              return /
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
