import Link from 'next/link';

const routes = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' }
];

export function TerminalRouteNav({ current }: { current: string }) {
  return (
    <div className="terminal-block">
      <p className="terminal-command-line">$ cd</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            data-active={current === route.href}
            className="terminal-chip transition hover:border-[rgba(255,137,216,0.4)] hover:text-[var(--accent-strong)]"
          >
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
