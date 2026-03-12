import type { Metadata } from 'next';
import { Github, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
import { TerminalRouteNav } from '@/components/terminal/TerminalRouteNav';
import { contact } from '@/data/contact';

export const metadata: Metadata = {
  title: 'Contact'
};

const linkRows = [
  {
    label: 'email',
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: Mail
  },
  {
    label: 'github',
    value: contact.github,
    href: contact.github,
    icon: Github
  },
  ...(contact.linkedin
    ? [
        {
          label: 'linkedin',
          value: contact.linkedin,
          href: contact.linkedin,
          icon: Linkedin
        }
      ]
    : []),
  ...(contact.other?.map((item) => ({
    label: item.label,
    value: item.url,
    href: item.url,
    icon: LinkIcon
  })) ?? [])
];

export default function ContactPage() {
  return (
    <main className="page-shell pb-10">
      <section className="page-card">
        <div className="terminal-headerbar">
          <div className="terminal-dots">
            <span className="terminal-dot" />
            <span className="terminal-dot" data-variant="accent" />
            <span className="terminal-dot" />
          </div>
          <p className="terminal-title">~/contact</p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <TerminalRouteNav current="/contact" />

          <div className="terminal-block">
            <p className="terminal-command-line">$ contact</p>
            <h1 className="mt-3 font-sans text-3xl text-[var(--text)] sm:text-4xl">
              Get in touch
            </h1>
            <p className="mt-4 max-w-2xl terminal-muted text-sm leading-7">
              Reach out for software roles, freelance work, or product
              collaboration. Every link is kept copy-friendly and terminal-safe.
            </p>

            <div className="mt-8 overflow-hidden rounded-[0.95rem] border border-[var(--line)]">
              {linkRows.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="flex flex-col gap-3 border-b border-[var(--line)] bg-[rgba(20,12,37,0.72)] px-4 py-4 transition last:border-b-0 hover:bg-[rgba(34,20,60,0.92)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                    <Icon size={14} />
                    {label}
                  </span>
                  <span className="font-mono text-sm text-[var(--text)]">
                    {value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
