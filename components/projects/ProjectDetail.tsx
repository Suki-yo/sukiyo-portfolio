import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="page-shell pb-40">
      <section className="page-card mx-auto max-w-4xl p-8 sm:p-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          cd /projects
        </Link>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-200/70">
            {project.slug}
          </p>
          <h1 className="mt-3 font-sans text-4xl text-white">{project.name}</h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-8 text-slate-300">
            {project.longDescription}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.links.github || project.links.live) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 font-mono text-xs text-slate-200 transition hover:border-cyan-200/20 hover:text-white"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 font-mono text-xs text-slate-200 transition hover:border-cyan-200/20 hover:text-white"
              >
                <ExternalLink size={14} />
                live site
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
