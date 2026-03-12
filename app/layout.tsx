import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TerminalDrawerWrapper } from '@/components/terminal/TerminalDrawerWrapper';
import { TerminalProvider } from '@/contexts/TerminalContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'sukiyo / portfolio',
    template: '%s | sukiyo'
  },
  description:
    'Terminal-first developer portfolio built with Next.js, TypeScript, and Tailwind CSS.'
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <TerminalProvider>
          {children}
          <TerminalDrawerWrapper />
        </TerminalProvider>
      </body>
    </html>
  );
}
