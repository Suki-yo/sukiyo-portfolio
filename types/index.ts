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

export type ContactLink = {
  label: string;
  url: string;
};

export type ContactData = {
  email: string;
  github: string;
  linkedin?: string;
  other?: ContactLink[];
};

export type TerminalLine = {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};
