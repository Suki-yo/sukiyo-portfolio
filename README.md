# sukiyo-portfolio

Terminal-first portfolio site built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion.

## Status

The application scaffold and initial implementation are in place.

- `/` is a fake interactive landing terminal
- `/projects`, `/projects/[slug]`, `/about`, and `/contact` are implemented
- A persistent terminal drawer is mounted on all non-landing routes
- Static portfolio data currently uses placeholders and should be replaced before deployment

## Run Locally

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run build
```

## Project Summary

The site is aimed at software employers, with a terminal-driven entry experience and a persistent terminal drawer for route navigation and project filtering.

Landing terminal commands:

- `help`
- `bun run dev`
- `whoami`
- `ls projects`
- `contact`
- `clear`

Drawer commands:

- `cd /projects`
- `cd /about`
- `cd /contact`
- `cat <slug>`
- `grep <tech>`
- `find --tag <tag>`
- `history`
- `whoami`
- `clear`

## Stack

- Next.js 15 App Router
- TypeScript with `strict` and `noUncheckedIndexedAccess`
- Tailwind CSS v4
- npm
- Framer Motion
- Lucide React

## Content To Replace

Before deployment, update the placeholder portfolio content in:

- `data/projects.ts`
- `data/about.ts`
- `data/contact.ts`

## Reference Docs

- [Design spec](./docs/superpowers/specs/2026-03-11-portfolio-design.md)
- [Implementation plan](./docs/superpowers/plans/2026-03-11-portfolio.md)
- [Documentation index](./docs/superpowers/README.md)
