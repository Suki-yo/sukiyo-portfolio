import type { Metadata } from 'next';
import { about } from '@/data/about';

export const metadata: Metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <main className="page-shell pb-40">
      <section className="page-card p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/65">
          ~/about
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-sans text-4xl text-white">{about.name}</h1>
            <p className="mt-3 font-mono text-sm text-slate-400">
              {about.title} / {about.location}
            </p>
            <p className="mt-8 max-w-2xl font-sans text-base leading-8 text-slate-300">
              {about.bio}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
              skills
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 font-mono text-xs text-slate-300"
                >
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
