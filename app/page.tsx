'use client';

import { useRouter } from 'next/navigation';
import { TerminalLanding } from '@/components/terminal/TerminalLanding';

export default function HomePage() {
  const router = useRouter();

  return <TerminalLanding onLaunch={() => router.push('/projects')} />;
}
