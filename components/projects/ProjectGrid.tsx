'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid() {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  const filteredProjects = activeTag
    ? projects.filter((project) =>
        project.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      )
    : projects;

  return (
    <section>
      {activeTag && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-4 py-2">
          <p className="font-mono text-xs text-slate-300">
            grep results for <span className="text-cyan-100">{activeTag}</span>
          </p>
          <Link
            href="/projects"
            className="font-mono text-xs text-slate-500 transition hover:text-white"
          >
            clear filter
          </Link>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <p className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 font-mono text-sm text-slate-400">
          no projects found matching &quot;{activeTag}&quot;
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
