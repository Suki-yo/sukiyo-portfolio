'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid() {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');
  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort();

  const filteredProjects = activeTag
    ? projects.filter((project) =>
        project.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      )
    : projects;

  return (
    <section className="space-y-5">
      <div className="terminal-block">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="terminal-muted text-xs">
            {filteredProjects.length} project
            {filteredProjects.length === 1 ? '' : 's'} loaded
          </p>
          {activeTag ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="terminal-chip">grep:{activeTag}</span>
              <Link
                href="/projects"
                className="font-mono text-xs text-[var(--muted)] transition hover:text-[var(--accent-strong)]"
              >
                clear filter
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="terminal-block terminal-muted text-sm">
          no projects found matching &quot;{activeTag}&quot;
        </p>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}

      <div className="terminal-block space-y-4">
        <p className="terminal-command-line">$ help projects</p>
        <div className="space-y-2 terminal-muted text-sm">
          <p>`cat portfolio`</p>
          <p>`grep TypeScript`</p>
          <p>`find --tag React`</p>
          <p>`cd /about`</p>
        </div>
      </div>

      <div className="terminal-block">
        <p className="terminal-command-line">$ ls tags</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {uniqueTags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tag=${encodeURIComponent(tag)}`}
              className="terminal-chip transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
