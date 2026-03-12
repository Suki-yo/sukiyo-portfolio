import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { TerminalRouteNav } from '@/components/terminal/TerminalRouteNav';
import type { Project } from '@/types';

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="page-shell pb-10">
      <section className="page-card mx-auto max-w-4xl">
        <div className="terminal-headerbar">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" data-variant="accent" />
            <span className="terminal-dot" />
          </div>
          <p className="terminal-title">~/projects/{project.slug}</p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <TerminalRouteNav current="/projects" />

          <article className="terminal-block">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] transition hover:text-[var(--accent-strong)]"
            >
              <ArrowLeft size={14} />
              cd /projects
            </Link>

            <div className="mt-8">
              <p className="terminal-command-line">$ cat {project.slug}.md</p>
              <h1 className="mt-3 font-sans text-3xl text-[var(--text)] sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-6 terminal-muted text-sm leading-8">
                {project.longDescription}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="terminal-chip">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="terminal-block">
              <p className="terminal-command-line">$ stat {project.slug}</p>
              <div className="mt-4 space-y-2 terminal-muted text-sm">
                <p>type: {project.type}</p>
                <p>tags: {project.tags.length}</p>
              </div>
            </div>

            {(project.links.github || project.links.live) && (
              <div className="terminal-block">
                <p className="terminal-command-line">$ open links</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 font-mono text-xs text-[var(--text)] transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
                    >
                      <Github size={14} />
                      github
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 font-mono text-xs text-[var(--text)] transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
                    >
                      <ExternalLink size={14} />
                      live site
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
