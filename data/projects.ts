import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'portfolio',
    name: 'Portfolio Site',
    description:
      'Terminal-first portfolio with a command-driven landing experience.',
    longDescription:
      'A personal portfolio that opens as a fake terminal session, then expands into a statically generated site with a persistent command drawer for navigation and filtering.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    type: 'both',
    links: {
      github: 'https://github.com/sukiyo/portfolio'
    }
  },
  {
    slug: 'design-system-lab',
    name: 'Design System Lab',
    description:
      'Component library experiments focused on accessibility and motion.',
    longDescription:
      'An exploration space for reusable component patterns, interaction states, and accessible design tokens across product surfaces.',
    tags: ['React', 'TypeScript', 'Storybook', 'Accessibility'],
    type: 'both',
    links: {}
  },
  {
    slug: 'visual-editor',
    name: 'Visual Editor',
    description: 'A browser-based editing tool for layout and content workflows.',
    longDescription:
      'A rich client-side interface for structuring layouts, managing visual blocks, and exporting clean configuration for production apps.',
    tags: ['React', 'TypeScript', 'UI', 'Product Design'],
    type: 'design',
    links: {}
  }
];
