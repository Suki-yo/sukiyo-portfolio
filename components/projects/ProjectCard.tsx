import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';

const badgeStyles: Record<Project['type'], string> = {
  code: 'border-violet-300/30 bg-violet-300/10 text-violet-100',
  design: 'border-pink-300/30 bg-pink-300/10 text-pink-100',
  both: 'border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100'
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="terminal-block group transition hover:border-[rgba(255,137,216,0.38)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="terminal-command-line">$ cat {project.slug}</p>
          <Link
            href={`/projects/${project.slug}`}
            className="mt-3 inline-block font-sans text-xl text-[var(--text)] transition group-hover:text-[var(--accent-strong)]"
          >
            {project.name}
          </Link>
          <p className="mt-3 terminal-muted text-sm leading-7">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="terminal-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span
            className={`inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] ${badgeStyles[project.type]}`}
          >
            {project.type}
          </span>
          {(project.links.github || project.links.live) && (
            <div className="flex flex-wrap gap-2 sm:justify-end">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-mono text-xs text-[var(--muted)] transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-mono text-xs text-[var(--muted)] transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
              >
                <ExternalLink size={14} />
                live
              </a>
            )}
          </div>
          )}
        </div>
      </div>
    </article>
  );
}
