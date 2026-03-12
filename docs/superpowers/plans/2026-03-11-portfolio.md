# Portfolio Site Implementation Plan

[Back to repo README](../../../README.md) · [Documentation index](../README.md) · [Design spec](../specs/2026-03-11-portfolio-design.md)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Current repository state:** Documentation only. This plan has not been executed yet.

**Goal:** Build a terminal-themed personal portfolio site with a fake interactive landing terminal, persistent terminal drawer, and static portfolio pages for projects, about, and contact.

**Architecture:** Next.js 15 App Router with static TypeScript data files. A `TerminalContext` provides shared drawer state across all routes. The landing page (`/`) is a standalone full-screen terminal; the persistent drawer renders in the root layout on all other routes. Navigation mirroring is handled by watching `usePathname()` changes inside the drawer.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, Bun, Framer Motion, Lucide React, Vercel

---

## File Map

| File | Responsibility |
|---|---|
| `types/index.ts` | Shared types: `Project`, `AboutData`, `ContactData`, `TerminalLine` |
| `data/projects.ts` | Typed project data array |
| `data/about.ts` | Typed bio/skills data |
| `data/contact.ts` | Typed contact links data |
| `lib/terminal/commands.ts` | Pure command parser — `executeLandingCommand` and `executeDrawerCommand`, each returning `CommandResult` |
| `lib/terminal/tabComplete.ts` | Tab completion — prefix-match on slugs and route paths |
| `contexts/TerminalContext.tsx` | React context — drawer output lines, command history, `addLines`, `clearLines`, `addToHistory`, `addSystemLine` |
| `components/terminal/TerminalOutput.tsx` | Renders `TerminalLine[]` with type-based color classes |
| `components/terminal/TerminalInput.tsx` | Controlled input with ↑↓ history nav and optional Tab completion |
| `components/terminal/TerminalLanding.tsx` | Full-screen landing terminal — local line state, calls `onLaunch` prop |
| `components/terminal/TerminalDrawerWrapper.tsx` | Client wrapper that hides drawer on `/` via `usePathname` |
| `components/terminal/TerminalDrawer.tsx` | Docked bottom drawer — context-backed state, navigation mirroring via `usePathname` |
| `components/projects/ProjectCard.tsx` | Single project card with tags, links, type badge |
| `components/projects/ProjectGrid.tsx` | Filtered project grid — reads `?tag` query param |
| `components/projects/ProjectDetail.tsx` | Full project detail view |
| `app/layout.tsx` | Root layout — `TerminalProvider` + `TerminalDrawerWrapper` + fonts |
| `app/globals.css` | Tailwind imports + base styles |
| `app/page.tsx` | Terminal landing page |
| `app/projects/page.tsx` | Projects grid page |
| `app/projects/[slug]/page.tsx` | Project detail page |
| `app/about/page.tsx` | About page |
| `app/contact/page.tsx` | Contact page |

---

## Chunk 1: Project Setup

### Task 1: Initialize project and install dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.prettierrc`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd /home/jyq/dev/sukiyo-portfolio
bunx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

Answer prompts:
- Would you like to use Turbopack for `next dev`? → **Yes**

- [ ] **Step 2: Install runtime dependencies**

```bash
bun add framer-motion lucide-react
```

- [ ] **Step 3: Install dev dependencies**

```bash
bun add -d prettier eslint-config-prettier
```

- [ ] **Step 4: Add Prettier config**

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

- [ ] **Step 5: Confirm TypeScript strict mode**

Open `tsconfig.json` and verify `"strict": true` is present under `compilerOptions`. If missing, add it. Also add `"noUncheckedIndexedAccess": true`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 5b: Wire eslint-config-prettier**

Open `.eslintrc.json` (or `eslint.config.mjs`) created by `create-next-app` and add `"prettier"` as the last entry in the `extends` array (or plugins config), so Prettier formatting rules take precedence over ESLint formatting rules:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"]
}
```

- [ ] **Step 6: Confirm Tailwind v4**

```bash
cat package.json | grep tailwindcss
```

If version shows `"3.x"`, upgrade:
```bash
bun add tailwindcss@latest @tailwindcss/postcss@latest
```

- [ ] **Step 7: Verify dev server starts**

```bash
bun run dev
```

Expected: `▲ Next.js 15` with server at `http://localhost:3000`. Open in browser and confirm default page loads. Press `Ctrl+C` to stop.

- [ ] **Step 8: Initialize git and commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js 15 project with TypeScript, Tailwind, Bun"
```

---

## Chunk 2: Data Layer

### Task 2: Shared types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create types directory and file**

```bash
mkdir types
```

Create `types/index.ts`:
```ts
export type Project = {
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

export type AboutData = {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  location: string;
};

export type ContactData = {
  email: string;
  github: string;
  linkedin?: string;
  other?: { label: string; url: string }[];
};

export type TerminalLine = {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};
```

### Task 3: Data files

**Files:**
- Create: `data/projects.ts`, `data/about.ts`, `data/contact.ts`

- [ ] **Step 1: Create data directory**

```bash
mkdir data
```

- [ ] **Step 2: Create projects data**

> **Note:** The entries below are placeholders. Replace them with your real projects before deploying. The `slug` field is what `ls projects` and `cat <slug>` use, so keep slugs lowercase and hyphenated.

Create `data/projects.ts`:
```ts
import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'portfolio',
    name: 'Portfolio Site',
    description: 'Terminal-themed personal portfolio built with Next.js 15.',
    longDescription:
      'A creative developer portfolio with a fake interactive terminal landing page and a persistent terminal drawer. Built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, and Framer Motion.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    type: 'both',
    links: {
      github: 'https://github.com/sukiyo/portfolio',
    },
  },
  {
    slug: 'example-app',
    name: 'Example App',
    description: 'Placeholder — replace with your real projects.',
    longDescription:
      'This is a placeholder entry. Replace the contents of data/projects.ts with your actual work.',
    tags: ['React', 'TypeScript'],
    type: 'code',
    links: {},
  },
];
```

- [ ] **Step 3: Create about data**

Create `data/about.ts`:
```ts
import type { AboutData } from '@/types';

export const about: AboutData = {
  name: 'Your Name',
  title: 'Software Developer',
  bio: 'Full-stack developer with a love for creative interfaces and clean code. Open to new opportunities.',
  skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Figma'],
  location: 'Your City, Country',
};
```

- [ ] **Step 4: Create contact data**

Create `data/contact.ts`:
```ts
import type { ContactData } from '@/types';

export const contact: ContactData = {
  email: 'you@example.com',
  github: 'https://github.com/sukiyo',
  linkedin: 'https://linkedin.com/in/yourprofile',
};
```

- [ ] **Step 5: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add types/ data/
git commit -m "feat: add shared types and placeholder data layer"
```

---

## Chunk 3: Terminal Engine

### Task 4: Command parser

**Files:**
- Create: `lib/terminal/commands.ts`

- [ ] **Step 1: Create lib directory**

```bash
mkdir -p lib/terminal
```

- [ ] **Step 2: Create command parser**

Create `lib/terminal/commands.ts`:
```ts
import type { TerminalLine } from '@/types';
import { projects } from '@/data/projects';
import { about } from '@/data/about';
import { contact } from '@/data/contact';

function line(type: TerminalLine['type'], content: string): TerminalLine {
  return { id: crypto.randomUUID(), type, content };
}

export type CommandResult = {
  lines: TerminalLine[];
  navigate?: string;
  launch?: boolean;
  clear?: boolean;
};

// ── Landing page commands ──────────────────────────────────────────────────

export function executeLandingCommand(input: string): CommandResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'clear') {
    return { lines: [], clear: true };
  }

  if (lower === 'help') {
    return {
      lines: [
        line('output', 'Available commands:'),
        line('output', '  bun run dev     Launch the portfolio'),
        line('output', '  whoami          About me'),
        line('output', '  ls projects     List projects'),
        line('output', '  contact         Contact links'),
        line('output', '  clear           Clear terminal'),
      ],
    };
  }

  if (lower === 'bun run dev' || lower === 'npm run dev' || lower === 'yarn dev') {
    return {
      lines: [
        line('output', ''),
        line('system', '> portfolio@1.0.0 dev'),
        line('system', '> next dev --turbopack'),
        line('output', ''),
        line('system', '  ▲ Next.js 15'),
        line('system', '  - Local: http://localhost:3000'),
        line('output', ''),
        line('output', 'Launching...'),
      ],
      launch: true,
    };
  }

  if (lower === 'whoami') {
    return {
      lines: [
        line('output', about.name),
        line('output', about.title),
        line('output', about.bio),
      ],
    };
  }

  if (lower === 'ls projects') {
    return {
      lines: projects.map((p) =>
        line('output', `  ${p.slug.padEnd(20)} ${p.description}`)
      ),
    };
  }

  if (lower === 'contact') {
    return {
      lines: [
        line('output', `  email     ${contact.email}`),
        line('output', `  github    ${contact.github}`),
        ...(contact.linkedin
          ? [line('output', `  linkedin  ${contact.linkedin}`)]
          : []),
        ...(contact.other?.map((o) =>
          line('output', `  ${o.label.padEnd(10)}${o.url}`)
        ) ?? []),
      ],
    };
  }

  return {
    lines: [
      line(
        'error',
        `command not found: ${trimmed}. Type "help" for available commands.`
      ),
    ],
  };
}

// ── Drawer commands ────────────────────────────────────────────────────────

export function executeDrawerCommand(
  input: string,
  commandHistory: string[]
): CommandResult {
  const trimmed = input.trim();
  const [cmd, ...args] = trimmed.split(/\s+/);

  if (trimmed === 'clear') {
    return { lines: [], clear: true };
  }

  if (trimmed === 'help') {
    return {
      lines: [
        line('output', 'Available commands:'),
        line('output', '  cd /projects    Navigate to projects'),
        line('output', '  cd /about       Navigate to about'),
        line('output', '  cd /contact     Navigate to contact'),
        line('output', '  cat <slug>      Open project detail'),
        line('output', '  grep <tech>     Filter projects by technology'),
        line('output', '  find --tag <t>  Same as grep'),
        line('output', '  whoami          About me'),
        line('output', '  history         Command history'),
        line('output', '  clear           Clear terminal'),
      ],
    };
  }

  if (trimmed === 'whoami') {
    return {
      lines: [
        line('output', about.name),
        line('output', about.title),
        line('output', about.bio),
      ],
    };
  }

  if (trimmed === 'history') {
    if (commandHistory.length === 0) {
      return { lines: [line('output', '(no history)')] };
    }
    return {
      lines: commandHistory.map((h, i) =>
        line('output', `${String(i + 1).padStart(3)}  ${h}`)
      ),
    };
  }

  if (cmd === 'cd') {
    const validRoutes: Record<string, string> = {
      '/projects': '/projects',
      '/about': '/about',
      '/contact': '/contact',
    };
    const path = args[0] ?? '';
    if (validRoutes[path]) {
      return { lines: [], navigate: validRoutes[path] };
    }
    return { lines: [line('error', `cd: no such directory: ${path}`)] };
  }

  if (cmd === 'cat') {
    const slug = args[0]?.toLowerCase() ?? '';
    if (!slug) {
      return { lines: [line('error', 'cat: missing argument')] };
    }
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
      return { lines: [line('error', `cat: ${slug}: no such file`)] };
    }
    return { lines: [], navigate: `/projects/${slug}` };
  }

  if (cmd === 'grep') {
    const tech = args[0];
    if (!tech) {
      return { lines: [line('error', 'grep: missing pattern')] };
    }
    return {
      lines: [],
      navigate: `/projects?tag=${encodeURIComponent(tech)}`,
    };
  }

  if (cmd === 'find') {
    const tagIdx = args.indexOf('--tag');
    if (tagIdx === -1 || !args[tagIdx + 1]) {
      return { lines: [line('error', 'find: usage: find --tag <tag>')] };
    }
    const tag = args[tagIdx + 1]!;
    return {
      lines: [],
      navigate: `/projects?tag=${encodeURIComponent(tag)}`,
    };
  }

  return {
    lines: [
      line(
        'error',
        `command not found: ${cmd}. Type "help" for available commands.`
      ),
    ],
  };
}
```

- [ ] **Step 3: Verify command parser compiles**

```bash
bun run build
```

Expected: No TypeScript errors in `lib/terminal/commands.ts`.

### Task 5: Tab completion

**Files:**
- Create: `lib/terminal/tabComplete.ts`

- [ ] **Step 1: Create tab completion module**

Create `lib/terminal/tabComplete.ts`:
```ts
import { projects } from '@/data/projects';

const ROUTES = ['/projects', '/about', '/contact'];
const SLUGS = projects.map((p) => p.slug);
const TOP_LEVEL_COMMANDS = ['cd', 'cat', 'grep', 'find', 'history', 'whoami', 'clear'];

export function tabComplete(partial: string): string | null {
  const lower = partial.toLowerCase();

  // "cd /pro" → "cd /projects"
  if (lower.startsWith('cd ')) {
    const pathPartial = lower.slice(3);
    const match = ROUTES.find((r) => r.startsWith(pathPartial));
    return match ? `cd ${match}` : null;
  }

  // "cat port" → "cat portfolio"
  if (lower.startsWith('cat ')) {
    const slugPartial = lower.slice(4);
    const match = SLUGS.find((s) => s.startsWith(slugPartial));
    return match ? `cat ${match}` : null;
  }

  // "his" → "history"
  const match = TOP_LEVEL_COMMANDS.find((c) => c.startsWith(lower));
  return match ?? null;
}
```

- [ ] **Step 2: Verify tab completion compiles**

```bash
bun run build
```

Expected: No TypeScript errors in `lib/terminal/tabComplete.ts`.

### Task 6: TerminalContext

**Files:**
- Create: `contexts/TerminalContext.tsx`

- [ ] **Step 1: Create contexts directory**

```bash
mkdir contexts
```

- [ ] **Step 2: Create TerminalContext**

Create `contexts/TerminalContext.tsx`:
```tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { TerminalLine } from '@/types';

type TerminalContextValue = {
  lines: TerminalLine[];
  commandHistory: string[];
  addLines: (lines: TerminalLine[]) => void;
  clearLines: () => void;
  addToHistory: (cmd: string) => void;
  addSystemLine: (content: string) => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const clearLines = useCallback(() => setLines([]), []);

  const addToHistory = useCallback((cmd: string) => {
    setCommandHistory((prev) => [...prev, cmd]);
  }, []);

  const addSystemLine = useCallback((content: string) => {
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: 'system', content },
    ]);
  }, []);

  return (
    <TerminalContext.Provider
      value={{ lines, commandHistory, addLines, clearLines, addToHistory, addSystemLine }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminalContext(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminalContext must be used within TerminalProvider');
  return ctx;
}
```

- [ ] **Step 3: Verify build**

```bash
bun run build
```

Expected: Succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add lib/ contexts/
git commit -m "feat: add terminal command parser, tab completion, and context"
```

---

## Chunk 4: Terminal Landing Page

### Task 7: TerminalOutput component

**Files:**
- Create: `components/terminal/TerminalOutput.tsx`

- [ ] **Step 1: Create component directories**

```bash
mkdir -p components/terminal components/projects
```

- [ ] **Step 2: Create TerminalOutput**

Create `components/terminal/TerminalOutput.tsx`:
```tsx
import type { TerminalLine } from '@/types';

const typeStyles: Record<TerminalLine['type'], string> = {
  input: 'text-green-400',
  output: 'text-zinc-300',
  error: 'text-red-400',
  system: 'text-zinc-500',
};

type Props = { lines: TerminalLine[] };

export function TerminalOutput({ lines }: Props) {
  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line) => (
        <div key={line.id} className={typeStyles[line.type]}>
          {line.content || '\u00A0'}
        </div>
      ))}
    </div>
  );
}
```

### Task 8: TerminalInput component

**Files:**
- Create: `components/terminal/TerminalInput.tsx`

- [ ] **Step 1: Create TerminalInput**

Create `components/terminal/TerminalInput.tsx`:
```tsx
'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { tabComplete } from '@/lib/terminal/tabComplete';

type Props = {
  onSubmit: (value: string) => void;
  history: string[];
  showTabComplete?: boolean;
  prefix?: string;
  autoFocus?: boolean;
};

export function TerminalInput({
  onSubmit,
  history,
  showTabComplete = false,
  prefix = '$',
  autoFocus = true,
}: Props) {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
        setValue('');
        setHistoryIndex(null);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(history[next] ?? '');
      }
      return;
    }

    if (e.key === 'Tab' && showTabComplete) {
      e.preventDefault();
      const completed = tabComplete(value);
      if (completed) setValue(completed);
      return;
    }
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className="text-green-400 shrink-0">{prefix}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-zinc-200 outline-none caret-green-400"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus={autoFocus}
      />
    </div>
  );
}
```

### Task 9: TerminalLanding component

**Files:**
- Create: `components/terminal/TerminalLanding.tsx`

- [ ] **Step 1: Create TerminalLanding**

Create `components/terminal/TerminalLanding.tsx`:
```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { executeLandingCommand } from '@/lib/terminal/commands';
import type { TerminalLine } from '@/types';

const BOOT_LINES: TerminalLine[] = [
  { id: 'boot-0', type: 'system', content: 'sukiyo — portfolio' },
  { id: 'boot-1', type: 'system', content: '──────────────────' },
  { id: 'boot-2', type: 'output', content: '' },
  { id: 'boot-3', type: 'output', content: 'hint: try "help"' },
  { id: 'boot-4', type: 'output', content: '' },
];

type Props = {
  onLaunch: () => void;
};

export function TerminalLanding({ onLaunch }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [history, setHistory] = useState<string[]>([]);
  const [launching, setLaunching] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function handleSubmit(input: string) {
    if (launching) return;

    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'input',
      content: `$ ${input}`,
    };

    setHistory((prev) => [...prev, input]);

    const result = executeLandingCommand(input);

    if (result.clear) {
      setLines([inputLine, ...result.lines]);
      return;
    }

    setLines((prev) => [...prev, inputLine, ...result.lines]);

    if (result.launch) {
      setLaunching(true);
      setTimeout(() => onLaunch(), 1400);
    }
  }

  return (
    <AnimatePresence>
      {!launching && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen bg-zinc-950 flex flex-col p-6 md:p-16"
        >
          <div className="flex-1 max-w-3xl w-full mx-auto overflow-y-auto">
            <TerminalOutput lines={lines} />
            <div ref={bottomRef} />
          </div>
          <div className="max-w-3xl w-full mx-auto mt-4 border-t border-zinc-800 pt-4">
            <TerminalInput
              onSubmit={handleSubmit}
              history={history}
              showTabComplete={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Task 10: Landing page route

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace default page.tsx**

Replace the entire contents of `app/page.tsx`:
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { TerminalLanding } from '@/components/terminal/TerminalLanding';

export default function HomePage() {
  const router = useRouter();

  function handleLaunch() {
    router.push('/projects');
  }

  return <TerminalLanding onLaunch={handleLaunch} />;
}
```

- [ ] **Step 2: Verify landing page in browser**

```bash
bun run dev
```

Open `http://localhost:3000`. Verify:
- Dark screen with boot text and "hint: try "help""
- `help` → lists all 5 commands
- `whoami` → prints name, title, bio
- `ls projects` → lists slugs with descriptions
- `contact` → prints email, github, linkedin
- `clear` → clears output
- `bun run dev` → prints boot sequence, page fades out, redirects to `/projects` after ~1.4s

- [ ] **Step 3: Commit**

```bash
git add components/terminal/TerminalOutput.tsx components/terminal/TerminalInput.tsx components/terminal/TerminalLanding.tsx app/page.tsx
git commit -m "feat: add terminal landing page with full command support"
```

---

## Chunk 5: Persistent Terminal Drawer

### Task 11: TerminalDrawer component

**Files:**
- Create: `components/terminal/TerminalDrawer.tsx`

- [ ] **Step 1: Create TerminalDrawer**

Create `components/terminal/TerminalDrawer.tsx`:
```tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { useTerminalContext } from '@/contexts/TerminalContext';
import { executeDrawerCommand } from '@/lib/terminal/commands';
import type { TerminalLine } from '@/types';

export function TerminalDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { lines, commandHistory, addLines, clearLines, addToHistory, addSystemLine } =
    useTerminalContext();
  const [open, setOpen] = useState(true);
  const prevPathnameRef = useRef(pathname);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mirror UI navigation into terminal output
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      addSystemLine(`→ ${pathname}`);
      prevPathnameRef.current = pathname;
    }
  }, [pathname, addSystemLine]);

  // Auto-scroll to bottom when new lines appear
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, open]);

  function handleSubmit(input: string) {
    addToHistory(input);

    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'input',
      content: `$ ${input}`,
    };

    const result = executeDrawerCommand(input, commandHistory);

    if (result.clear) {
      clearLines();
      return;
    }

    addLines([inputLine, ...result.lines]);

    if (result.navigate) {
      router.push(result.navigate);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950">
      {/* Tab bar */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-left"
      >
        <Terminal size={13} />
        <span className="font-mono text-xs">terminal</span>
        <span className="ml-auto">
          {open ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </span>
      </button>

      {/* Drawer panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 220 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="h-full flex flex-col px-4 pb-3">
              <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-zinc-700">
                <TerminalOutput lines={lines} />
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-zinc-800 pt-2">
                <TerminalInput
                  onSubmit={handleSubmit}
                  history={commandHistory}
                  showTabComplete={true}
                  autoFocus={false}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Task 12: TerminalDrawerWrapper (route guard)

**Files:**
- Create: `components/terminal/TerminalDrawerWrapper.tsx`

- [ ] **Step 1: Create wrapper**

Create `components/terminal/TerminalDrawerWrapper.tsx`:
```tsx
'use client';

import { usePathname } from 'next/navigation';
import { TerminalDrawer } from './TerminalDrawer';

export function TerminalDrawerWrapper() {
  const pathname = usePathname();
  // Don't show drawer on landing page — the landing IS a terminal
  if (pathname === '/') return null;
  return <TerminalDrawer />;
}
```

### Task 13: Update root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace root layout**

Replace the entire contents of `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TerminalProvider } from '@/contexts/TerminalContext';
import { TerminalDrawerWrapper } from '@/components/terminal/TerminalDrawerWrapper';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'sukiyo — portfolio',
  description: 'Software developer portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-zinc-950 text-zinc-200 antialiased font-mono">
        <TerminalProvider>
          {children}
          <TerminalDrawerWrapper />
        </TerminalProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update globals.css**

Ensure `app/globals.css` has only Tailwind imports (remove Next.js default styles):
```css
@import "tailwindcss";

:root {
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
}

body {
  padding-bottom: 2.5rem; /* space for drawer tab bar */
}
```

- [ ] **Step 3: Create placeholder pages so the build doesn't fail**

Create `app/projects/page.tsx`:
```tsx
export default function ProjectsPage() {
  return <main className="p-8"><p className="text-zinc-400">Projects — coming in next task</p></main>;
}
```

Create `app/about/page.tsx`:
```tsx
export default function AboutPage() {
  return <main className="p-8"><p className="text-zinc-400">About — coming in next task</p></main>;
}
```

Create `app/contact/page.tsx`:
```tsx
export default function ContactPage() {
  return <main className="p-8"><p className="text-zinc-400">Contact — coming in next task</p></main>;
}
```

Create `app/projects/[slug]/page.tsx`:
```tsx
export default function ProjectDetailPage() {
  return <main className="p-8"><p className="text-zinc-400">Project detail — coming in next task</p></main>;
}
```

- [ ] **Step 4: Verify drawer in browser**

```bash
bun run dev
```

1. Open `http://localhost:3000` — no drawer visible on landing page
2. Navigate to `http://localhost:3000/projects` directly — drawer visible at bottom
3. Click the terminal tab bar — drawer collapses and expands
4. Type `cd /about` in drawer → navigates to `/about`, terminal echoes `→ /about`
5. Click browser back → terminal echoes `→ /projects` (navigation mirror working)
6. Type `cat portfolio` → navigates to `/projects/portfolio`
7. Type `grep TypeScript` → navigates to `/projects?tag=TypeScript`
8. Type `whoami` → prints bio
9. Type `history` → lists previous commands
10. Press ↑↓ → cycles through history
11. Type `cd /pr` then Tab → completes to `cd /projects`

- [ ] **Step 5: Commit**

```bash
git add components/terminal/TerminalDrawer.tsx components/terminal/TerminalDrawerWrapper.tsx app/layout.tsx app/globals.css app/projects/ app/about/ app/contact/
git commit -m "feat: add persistent terminal drawer with navigation mirroring"
```

---

## Chunk 6: Portfolio Pages

### Task 14: ProjectCard component

**Files:**
- Create: `components/projects/ProjectCard.tsx`

- [ ] **Step 1: Create ProjectCard**

Create `components/projects/ProjectCard.tsx`:
```tsx
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/types';

const typeBadgeStyles: Record<Project['type'], string> = {
  code: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  design: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  both: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

type Props = { project: Project };

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-zinc-800 rounded p-5 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="font-mono text-sm font-medium text-zinc-100 group-hover:text-white">
          {project.name}
        </h2>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-mono ${typeBadgeStyles[project.type]}`}>
          {project.type}
        </span>
      </div>

      <p className="font-mono text-xs text-zinc-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 shrink-0 ml-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label="GitHub"
            >
              <Github size={14} />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label="Live site"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### Task 15: ProjectGrid component

**Files:**
- Create: `components/projects/ProjectGrid.tsx`

- [ ] **Step 1: Create ProjectGrid**

Create `components/projects/ProjectGrid.tsx`:
```tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid() {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  const filtered = activeTag
    ? projects.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
      )
    : projects;

  return (
    <div>
      {activeTag && (
        <p className="font-mono text-xs text-zinc-500 mb-6">
          grep results for: <span className="text-green-400">{activeTag}</span>
          {' '}
          <a href="/projects" className="text-zinc-600 hover:text-zinc-400 ml-2">
            clear filter
          </a>
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="font-mono text-xs text-zinc-500">
          no projects found matching &quot;{activeTag}&quot;
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Task 16: ProjectDetail component

**Files:**
- Create: `components/projects/ProjectDetail.tsx`

- [ ] **Step 1: Create ProjectDetail**

Create `components/projects/ProjectDetail.tsx`:
```tsx
import Link from 'next/link';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import type { Project } from '@/types';

type Props = { project: Project };

export function ProjectDetail({ project }: Props) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 pb-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
      >
        <ArrowLeft size={12} />
        cd /projects
      </Link>

      <div className="mb-2 font-mono text-xs text-zinc-500">{project.slug}</div>
      <h1 className="font-mono text-2xl font-medium text-zinc-100 mb-4">
        {project.name}
      </h1>

      <p className="font-mono text-sm text-zinc-300 leading-relaxed mb-8">
        {project.longDescription}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded transition-all"
          >
            <Github size={13} />
            github
          </a>
        )}
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded transition-all"
          >
            <ExternalLink size={13} />
            live site
          </a>
        )}
      </div>
    </main>
  );
}
```

### Task 17: Projects pages

**Files:**
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Replace projects list page**

Replace `app/projects/page.tsx`:
```tsx
import { Suspense } from 'react';
import { ProjectGrid } from '@/components/projects/ProjectGrid';

export const metadata = { title: 'projects — sukiyo' };

export default function ProjectsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 pb-32">
      <h1 className="font-mono text-xs text-zinc-500 mb-8">~/projects</h1>
      <Suspense fallback={<p className="font-mono text-xs text-zinc-500">loading...</p>}>
        <ProjectGrid />
      </Suspense>
    </main>
  );
}
```

- [ ] **Step 2: Replace project detail page**

Replace `app/projects/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.name} — sukiyo` : 'not found' };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

### Task 18: About and Contact pages

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Replace about page**

Replace `app/about/page.tsx`:
```tsx
import { about } from '@/data/about';

export const metadata = { title: 'about — sukiyo' };

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 pb-32">
      <p className="font-mono text-xs text-zinc-500 mb-8">~/about</p>

      <h1 className="font-mono text-2xl font-medium text-zinc-100 mb-1">
        {about.name}
      </h1>
      <p className="font-mono text-sm text-zinc-500 mb-8">{about.title} · {about.location}</p>

      <p className="font-mono text-sm text-zinc-300 leading-relaxed mb-12">
        {about.bio}
      </p>

      <div>
        <p className="font-mono text-xs text-zinc-500 mb-4">skills</p>
        <div className="flex flex-wrap gap-2">
          {about.skills.map((skill) => (
            <span
              key={skill}
              className="font-mono text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Replace contact page**

Replace `app/contact/page.tsx`:
```tsx
import { contact } from '@/data/contact';
import { Github, Mail, Linkedin } from 'lucide-react';

export const metadata = { title: 'contact — sukiyo' };

const links = [
  { href: `mailto:${contact.email}`, label: 'email', icon: Mail, value: contact.email },
  { href: contact.github, label: 'github', icon: Github, value: contact.github },
  ...(contact.linkedin
    ? [{ href: contact.linkedin, label: 'linkedin', icon: Linkedin, value: contact.linkedin }]
    : []),
];

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 pb-32">
      <p className="font-mono text-xs text-zinc-500 mb-8">~/contact</p>
      <h1 className="font-mono text-xl font-medium text-zinc-100 mb-8">get in touch</h1>

      <div className="flex flex-col gap-3">
        {links.map(({ href, label, icon: Icon, value }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="flex items-center gap-4 group font-mono text-sm"
          >
            <span className="text-zinc-600 group-hover:text-zinc-300 transition-colors w-20 text-xs shrink-0">
              {label}
            </span>
            <span className="text-zinc-400 group-hover:text-zinc-100 transition-colors flex items-center gap-2">
              <Icon size={13} />
              {value}
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Full browser QA**

```bash
bun run dev
```

Verify all routes:
1. `/` — landing terminal works end-to-end
2. `bun run dev` on landing → redirects to `/projects`
3. `/projects` — grid shows placeholder projects, drawer visible
4. `/projects?tag=TypeScript` — filtered view (linked from `grep TypeScript` in drawer)
5. `/projects/portfolio` — detail page with back link
6. `/about` — bio, title, location, skills grid
7. `/contact` — all links render
8. Drawer `cd /about` → navigates, echoes `→ /about`
9. Drawer `cat portfolio` → navigates to detail page
10. Direct URL to `/projects` → drawer shown (not hidden)
11. Direct URL to `/` → drawer hidden

- [ ] **Step 4: Production build check**

```bash
bun run build
```

Expected: All pages generate successfully, zero TypeScript errors, zero warnings about missing `generateStaticParams`.

- [ ] **Step 5: Final commit**

```bash
git add components/projects/ app/projects/ app/about/ app/contact/
git commit -m "feat: add projects grid, project detail, about, and contact pages"
```

---

## Deployment

### Task 19: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

Create a new repository at `github.com/new`, then:
```bash
git remote add origin https://github.com/sukiyo/portfolio.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository
3. Framework: **Next.js** (auto-detected)
4. No environment variables needed
5. Click **Deploy**

- [ ] **Step 3: Verify production deploy**

Open the Vercel-provided URL. Verify:
- Landing terminal loads
- `bun run dev` launches portfolio
- All pages accessible
- Drawer works on all non-landing routes
- No console errors

- [ ] **Step 4: Add custom domain (optional)**

In Vercel project settings → Domains → add your domain.
