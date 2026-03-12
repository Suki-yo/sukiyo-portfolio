'use client';

import { usePathname } from 'next/navigation';
import { TerminalDrawer } from './TerminalDrawer';

export function TerminalDrawerWrapper() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <TerminalDrawer />;
}
