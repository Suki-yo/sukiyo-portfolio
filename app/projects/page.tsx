import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProjectGrid } from '@/components/projects/ProjectGrid';

export const metadata: Metadata = {
  title: 'Projects'
};

export default function ProjectsPage() {
  return (
    <main className="page-shell pb-40">
      <section className="page-card p-8 sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/65">
              ~/projects
            </p>
            <h1 className="mt-3 font-sans text-4xl text-white">
              Selected work in code and design
            </h1>
          </div>
          <p className="max-w-md font-sans text-sm leading-7 text-slate-400">
            Use the drawer below to navigate with commands, or browse the cards
            directly.
          </p>
        </div>

        <div className="mt-10">
          <Suspense
            fallback={
              <p className="font-mono text-sm text-slate-500">loading...</p>
            }
          >
            <ProjectGrid />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
