# Portfolio Site — Design Spec

[Back to repo README](../../../README.md) · [Documentation index](../README.md) · [Implementation plan](../plans/2026-03-11-portfolio.md)

**Date:** 2026-03-11
**Status:** Approved
**Repository state:** Documentation only; implementation has not started

---

## Overview

A personal portfolio site targeting software employers, with a creative developer identity. Showcases a mix of software projects and design work. The defining creative feature is a terminal-first experience: the landing page is a fake interactive terminal, and a persistent terminal drawer is available throughout the site after entry.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG, file-based routing, Vercel-native |
| Language | TypeScript (strict) | No `any`, full type safety |
| Styling | Tailwind CSS v4 | Utility-first, current release |
| Package manager | Bun | Fast installs, modern tooling |
| Deployment | Vercel | Zero-config, free tier |
| Animations | Framer Motion | Page transitions, scroll effects, terminal animations |
| Icons | Lucide React | TypeScript-native icon set |
| Fonts | `next/font` | Zero layout shift, built-in to Next.js |
| Linting | ESLint + Prettier | Consistent formatting, TS-aware rules |

**Content strategy:** Project data is defined as typed TypeScript objects in a `data/` directory. No CMS, no MDX. Simple, fully typed, easy to extend.

---

## Page Structure

### `/` — Terminal Landing Page

The entry point to the portfolio. The user arrives at a fake terminal interface. There is no immediate portfolio content visible — the terminal is the UI.

**Behavior:**
- Blinking cursor on load with subtle hint text (e.g., `hint: try "help"`)
- User types commands to explore or launch the portfolio
- Typing `bun run dev` (or similar launch command) transitions into the full portfolio with an animation

**Supported commands:**

| Command | Output |
|---|---|
| `help` | Lists all available commands |
| `bun run dev` | Launches the portfolio (animated transition) |
| `whoami` | Prints a short bio blurb |
| `ls projects` | Lists project slugs with a one-liner description each. Slugs match the `slug` field in `data/projects.ts` and are the same identifiers used with `cat` in the persistent drawer. |
| `contact` | Displays contact links and email |
| `clear` | Clears the terminal output |

The landing terminal does not support tab completion — it is intentionally minimal and hint-driven.

### `/projects` — Projects Grid

Grid layout displaying both software projects and design work. Each project card is a typed data object containing: name, description, tags/tech stack, links (GitHub, live demo), and type (code vs. design). Supports a `?tag=<tech>` query param for filtered views — this is what `grep` and `find` commands resolve to.

### `/projects/[slug]` — Project Detail Page

Individual project page rendered from the project's `slug`. Displays full project info including `longDescription`, tags, and links. This is the destination for the `cat <slug>` terminal command.

### `/about` — About Page

Bio, background, and skills. Content sourced from typed data objects.

### `/contact` — Contact Page

Contact links (email, GitHub, LinkedIn, etc.). Minimal page.

---

## Persistent Terminal Drawer

After the user launches the portfolio from the terminal landing page, a terminal drawer is docked to the bottom of every page — visually and functionally similar to VS Code's integrated terminal panel.

**Key behaviors:**
- Persists across all routes (rendered in the root layout)
- Visible by default on all routes — including direct URL access (e.g., linking straight to `/projects`). The drawer does not require the landing terminal to be used first; it is always present after `/` is removed from scope.
- Can be minimized/maximized by the user
- Mirrors UI navigation: when the user clicks to a new page, the terminal echoes the navigation (e.g., `→ navigating to /projects`)
- Full command history via up/down arrow keys
- Tab completion on the drawer only (not on the landing terminal): prefix-match on project `slug` (case-insensitive) and on route paths (`/projects`, `/about`, `/contact`)

**Supported commands:**

| Command | Action |
|---|---|
| `cd /projects` | Navigates to the projects page |
| `cd /about` | Navigates to the about page |
| `cd /contact` | Navigates to the contact page |
| `cat <slug>` | Navigates to `/projects/[slug]` detail page |
| `grep <tech>` | Navigates to `/projects?tag=<tech>`, filtering the grid in-place |
| `find --tag <tag>` | Same as `grep` — alternative syntax |
| `history` | Displays command history |
| `whoami` | Prints bio blurb |
| `clear` | Clears terminal output |

---

## Data Architecture

Project data lives in `data/projects.ts` as a typed array:

```ts
type Project = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  tags: string[];
  type: 'code' | 'design' | 'both';
  links: {
    github?: string;
    live?: string;
  };
};
```

Additional data files: `data/about.ts`, `data/contact.ts` for other static content.

---

## Architecture

```
app/
  layout.tsx          # Root layout — mounts persistent terminal drawer
  page.tsx            # Terminal landing page
  projects/
    page.tsx
    [slug]/
      page.tsx
  about/
    page.tsx
  contact/
    page.tsx
components/
  terminal/
    TerminalLanding.tsx    # Full-screen terminal for landing page
    TerminalDrawer.tsx     # Persistent bottom drawer
    TerminalInput.tsx      # Shared input + history logic
    useTerminal.ts         # Hook: command parsing, history, tab completion
  projects/
    ProjectGrid.tsx
    ProjectCard.tsx
    ProjectDetail.tsx
data/
  projects.ts
  about.ts
  contact.ts
```

**Terminal state** is managed via a React context (`TerminalContext`) so the drawer and navigation system stay in sync across routes.

---

## Error Handling

- Unknown terminal commands return a helpful message: `command not found: <cmd>. Type "help" for available commands.`
- No server-side data fetching — all content is static, so no API error states needed at launch.

---

## Testing

No automated tests planned for the initial build. The site is static content with no business logic to unit test. Manual QA covers terminal command coverage and responsive layout.

---

## Out of Scope

- Blog / long-form writing (can add MDX layer later if needed)
- CMS integration
- Authentication
- Dark/light mode toggle (terminal aesthetic implies dark by default)
