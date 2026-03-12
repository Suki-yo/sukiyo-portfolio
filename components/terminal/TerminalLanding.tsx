'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { executeLandingCommand } from '@/lib/terminal/commands';
import type { TerminalLine } from '@/types';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

const BOOT_LINES: TerminalLine[] = [
  { id: 'boot-0', type: 'system', content: 'booting terminal portfolio...' },
  { id: 'boot-1', type: 'system', content: 'theme loaded: cyberpunk-purple' },
  { id: 'boot-2', type: 'output', content: '' },
  { id: 'boot-3', type: 'output', content: 'hint: run "help" or "bun run dev"' },
  { id: 'boot-4', type: 'output', content: '' }
];

const PROMPT = 'dev@sukiyo:~$';

export function TerminalLanding({ onLaunch }: { onLaunch: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [history, setHistory] = useState<string[]>([]);
  const [launching, setLaunching] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lines, launching]);

  function handleSubmit(input: string) {
    if (launching) {
      return;
    }

    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'input',
      content: `${PROMPT} ${input}`
    };

    setHistory((current) => [...current, input]);

    const result = executeLandingCommand(input);

    if (result.clear) {
      setLines([]);
      return;
    }

    setLines((current) => [...current, inputLine, ...result.lines]);

    if (result.launch) {
      setLaunching(true);
      window.setTimeout(() => {
        onLaunch();
      }, 1400);
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={launching ? 'launching' : 'ready'}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex min-h-screen items-center overflow-hidden px-4 py-6 sm:px-6"
      >
        <div className="mx-auto w-full max-w-4xl overflow-hidden page-card">
          <div className="terminal-headerbar">
            <div className="terminal-dots">
              <span className="terminal-dot" />
              <span className="terminal-dot" data-variant="accent" />
              <span className="terminal-dot" />
            </div>
            <p className="terminal-title">visitor@sukiyo: ~</p>
          </div>

          <section className="terminal-grid bg-[var(--background)] p-4 sm:p-6">
            <div className="terminal-panel rounded-[0.9rem] p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="terminal-section-label">sukiyo / terminal portfolio</p>
                  <p className="mt-2 terminal-muted text-sm">
                    run commands to explore. try `help`, `whoami`, `ls projects`,
                    `contact`, or `bun run dev`.
                  </p>
                </div>
                <span className="terminal-chip">interactive shell</span>
              </div>

              <div className="min-h-[18rem] overflow-y-auto">
                <TerminalOutput lines={lines} />
                {launching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 font-mono text-sm text-[var(--accent-strong)]"
                  >
                    Session ready. Opening /projects...
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-4">
                <TerminalInput
                  onSubmit={handleSubmit}
                  history={history}
                  showTabComplete={false}
                  prefix={PROMPT}
                />
              </div>
            </div>
          </section>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
