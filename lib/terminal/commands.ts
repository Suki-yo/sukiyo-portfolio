import { about } from '@/data/about';
import { contact } from '@/data/contact';
import { projects } from '@/data/projects';
import type { TerminalLine } from '@/types';

function line(type: TerminalLine['type'], content: string): TerminalLine {
  return {
    id: crypto.randomUUID(),
    type,
    content
  };
}

export type CommandResult = {
  lines: TerminalLine[];
  navigate?: string;
  launch?: boolean;
  clear?: boolean;
};

const drawerRoutes: Record<string, string> = {
  '/projects': '/projects',
  '/about': '/about',
  '/contact': '/contact'
};

export function executeLandingCommand(input: string): CommandResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return { lines: [] };
  }

  if (lower === 'clear') {
    return { lines: [], clear: true };
  }

  if (lower === 'help') {
    return {
      lines: [
        line('output', 'Available commands:'),
        line('output', '  help            Show this help'),
        line('output', '  bun run dev     Launch the portfolio'),
        line('output', '  whoami          About me'),
        line('output', '  ls projects     List projects'),
        line('output', '  contact         Contact links'),
        line('output', '  clear           Clear terminal')
      ]
    };
  }

  if (
    lower === 'bun run dev' ||
    lower === 'npm run dev' ||
    lower === 'pnpm dev' ||
    lower === 'yarn dev'
  ) {
    return {
      lines: [
        line('system', '> portfolio@0.1.0 dev'),
        line('system', '> next dev --turbopack'),
        line('output', ''),
        line('system', '  Next.js 15'),
        line('system', '  Local: http://localhost:3000'),
        line('output', ''),
        line('output', 'Launching portfolio...')
      ],
      launch: true
    };
  }

  if (lower === 'whoami') {
    return {
      lines: [
        line('output', about.name),
        line('output', about.title),
        line('output', about.bio)
      ]
    };
  }

  if (lower === 'ls projects') {
    return {
      lines: projects.map((project) =>
        line('output', `  ${project.slug.padEnd(20)} ${project.description}`)
      )
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
        ...(contact.other?.map((item) =>
          line('output', `  ${item.label.padEnd(9)} ${item.url}`)
        ) ?? [])
      ]
    };
  }

  return {
    lines: [
      line(
        'error',
        `command not found: ${trimmed}. Type "help" for available commands.`
      )
    ]
  };
}

export function executeDrawerCommand(
  input: string,
  commandHistory: string[]
): CommandResult {
  const trimmed = input.trim();
  const [cmd = '', ...args] = trimmed.split(/\s+/);

  if (!trimmed) {
    return { lines: [] };
  }

  if (trimmed === 'clear') {
    return { lines: [], clear: true };
  }

  if (trimmed === 'help') {
    return {
      lines: [
        line('output', 'Available commands:'),
        line('output', '  help            Show this help'),
        line('output', '  cd /projects    Navigate to projects'),
        line('output', '  cd /about       Navigate to about'),
        line('output', '  cd /contact     Navigate to contact'),
        line('output', '  cat <slug>      Open project detail'),
        line('output', '  grep <tech>     Filter projects by technology'),
        line('output', '  find --tag <t>  Same as grep'),
        line('output', '  whoami          About me'),
        line('output', '  history         Command history'),
        line('output', '  clear           Clear terminal')
      ]
    };
  }

  if (trimmed === 'whoami') {
    return {
      lines: [
        line('output', about.name),
        line('output', about.title),
        line('output', about.bio)
      ]
    };
  }

  if (trimmed === 'history') {
    if (commandHistory.length === 0) {
      return { lines: [line('output', '(no history)')] };
    }

    return {
      lines: commandHistory.map((entry, index) =>
        line('output', `${String(index + 1).padStart(3)}  ${entry}`)
      )
    };
  }

  if (cmd === 'cd') {
    const path = args[0] ?? '';

    if (path in drawerRoutes) {
      return { lines: [], navigate: drawerRoutes[path] };
    }

    return {
      lines: [line('error', `cd: no such directory: ${path}`)]
    };
  }

  if (cmd === 'cat') {
    const slug = args[0]?.toLowerCase() ?? '';

    if (!slug) {
      return { lines: [line('error', 'cat: missing argument')] };
    }

    const project = projects.find((item) => item.slug === slug);

    if (!project) {
      return { lines: [line('error', `cat: ${slug}: no such file`)] };
    }

    return { lines: [], navigate: `/projects/${project.slug}` };
  }

  if (cmd === 'grep') {
    const tag = args.join(' ').trim();

    if (!tag) {
      return { lines: [line('error', 'grep: missing pattern')] };
    }

    return {
      lines: [],
      navigate: `/projects?tag=${encodeURIComponent(tag)}`
    };
  }

  if (cmd === 'find') {
    const tagIndex = args.indexOf('--tag');
    const tag = tagIndex === -1 ? '' : args.slice(tagIndex + 1).join(' ').trim();

    if (!tag) {
      return { lines: [line('error', 'find: usage: find --tag <tag>')] };
    }

    return {
      lines: [],
      navigate: `/projects?tag=${encodeURIComponent(tag)}`
    };
  }

  return {
    lines: [
      line(
        'error',
        `command not found: ${cmd}. Type "help" for available commands.`
      )
    ]
  };
}
