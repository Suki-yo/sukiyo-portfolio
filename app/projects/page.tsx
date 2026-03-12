import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { TerminalRouteNav } from '@/components/terminal/TerminalRouteNav';

export const metadata: Metadata = {
  title: 'Projects'
};

export default function ProjectsPage() {
  return (
    <main className="page-shell pb-10">
      <section className="page-card">
        <div className="terminal-headerbar">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" data-variant="accent" />
            <span className="terminal-dot" />
          </div>
          <p className="terminal-title">~/projects</p>
        </div>

        <div className="grid gap-8 p-6 sm:p-8">
          <div className="space-y-3">
            <p className="terminal-command-line">$ ls projects</p>
            <div>
              <h1 className="mt-3 font-sans text-3xl text-[var(--text)] sm:text-4xl">
                Selected work in code and design
              </h1>
            </div>
            <p className="max-w-3xl terminal-muted text-sm leading-7">
              Browse projects as terminal output. Use `cat &lt;slug&gt;` to open a
              project and `grep &lt;tech&gt;` to filter the list.
            </p>
          </div>

          <TerminalRouteNav current="/projects" />

          <Suspense
            fallback={
              <p className="font-mono text-sm text-[var(--muted)]">
                loading workspace...
              </p>
            }
          >
            <ProjectGrid />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
