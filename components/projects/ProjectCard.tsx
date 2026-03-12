import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';

const badgeStyles: Record<Project['type'], string> = {
  code: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
  design: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
  both: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-200/20 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-slate-500">{project.slug}</p>
          <Link
            href={`/projects/${project.slug}`}
            className="mt-2 inline-block font-sans text-xl text-white transition group-hover:text-cyan-100"
          >
            {project.name}
          </Link>
        </div>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] ${badgeStyles[project.type]}`}
        >
          {project.type}
        </span>
      </div>

      <p className="mt-4 flex-1 font-sans text-sm leading-7 text-slate-300">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 font-mono text-[11px] text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {(project.links.github || project.links.live) && (
        <div className="mt-6 flex items-center gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-cyan-200/20 hover:text-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-cyan-200/20 hover:text-white"
            >
              <ExternalLink size={14} />
              live
            </a>
          )}
        </div>
      )}
    </article>
  );
}
