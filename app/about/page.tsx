import type { Metadata } from 'next';
import { TerminalRouteNav } from '@/components/terminal/TerminalRouteNav';
import { about } from '@/data/about';

export const metadata: Metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <main className="page-shell pb-10">
      <section className="page-card">
        <div className="terminal-headerbar">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" data-variant="accent" />
            <span className="terminal-dot" />
          </div>
          <p className="terminal-title">~/about</p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <TerminalRouteNav current="/about" />

          <div className="terminal-block">
            <p className="terminal-command-line">$ whoami</p>
            <h1 className="mt-3 font-sans text-3xl text-[var(--text)] sm:text-4xl">
              {about.name}
            </h1>
            <p className="mt-3 terminal-muted text-sm">
              {about.title} / {about.location}
            </p>
            <p className="mt-8 terminal-muted text-sm leading-8">
              {about.bio}
            </p>
          </div>

          <div className="terminal-block">
            <p className="terminal-command-line">$ skills</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <span key={skill} className="terminal-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
