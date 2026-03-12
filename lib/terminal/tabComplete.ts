import { projects } from '@/data/projects';

const ROUTES = ['/projects', '/about', '/contact'];
const TOP_LEVEL_COMMANDS = [
  'help',
  'cd',
  'cat',
  'grep',
  'find',
  'history',
  'whoami',
  'clear'
];
const SLUGS = projects.map((project) => project.slug);

export function tabComplete(partial: string): string | null {
  const lower = partial.toLowerCase();

  if (lower.startsWith('cd ')) {
    const routePartial = lower.slice(3);
    const route = ROUTES.find((item) => item.startsWith(routePartial));

    return route ? `cd ${route}` : null;
  }

  if (lower.startsWith('cat ')) {
    const slugPartial = lower.slice(4);
    const slug = SLUGS.find((item) => item.startsWith(slugPartial));

    return slug ? `cat ${slug}` : null;
  }

  const command = TOP_LEVEL_COMMANDS.find((item) => item.startsWith(lower));
  return command ?? null;
}
