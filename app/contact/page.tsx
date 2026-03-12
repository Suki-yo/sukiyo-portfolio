import type { Metadata } from 'next';
import { Github, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
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
    <main className="page-shell pb-40">
      <section className="page-card p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/65">
          ~/contact
        </p>
        <h1 className="mt-4 font-sans text-4xl text-white">Get in touch</h1>
        <p className="mt-4 max-w-xl font-sans text-base leading-8 text-slate-400">
          Reach out for software roles, freelance work, or product
          collaboration.
        </p>

        <div className="mt-10 space-y-3">
          {linkRows.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 transition hover:border-cyan-200/20 hover:bg-white/7 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                <Icon size={14} />
                {label}
              </span>
              <span className="font-sans text-sm text-slate-200">{value}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
