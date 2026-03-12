import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-shell pb-40">
      <section className="page-card mx-auto max-w-3xl p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-200/70">
          404
        </p>
        <h1 className="mt-4 font-sans text-4xl text-white">
          Requested path not found
        </h1>
        <p className="mt-5 max-w-xl font-sans text-base leading-8 text-slate-400">
          The terminal could not resolve that route or project slug.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/projects"
            className="rounded-full border border-white/10 px-4 py-3 font-mono text-xs text-slate-200 transition hover:border-cyan-200/20 hover:text-white"
          >
            cd /projects
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-3 font-mono text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            return /
          </Link>
        </div>
      </section>
    </main>
  );
}
