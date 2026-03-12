'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { executeLandingCommand } from '@/lib/terminal/commands';
import type { TerminalLine } from '@/types';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

const BOOT_LINES: TerminalLine[] = [
  { id: 'boot-0', type: 'system', content: 'sukiyo / portfolio' },
  { id: 'boot-1', type: 'system', content: '-------------------' },
  { id: 'boot-2', type: 'output', content: '' },
  { id: 'boot-3', type: 'output', content: 'hint: try "help"' },
  { id: 'boot-4', type: 'output', content: '' }
];

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
      content: `$ ${input}`
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
        className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10"
      >
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_40px_120px_rgba(2,6,23,0.6)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                developer terminal
              </p>
              <h1 className="mt-1 font-sans text-xl text-white sm:text-2xl">
                Enter through the command line
              </h1>
            </div>
            <div className="hidden gap-2 sm:flex">
              <span className="h-3 w-3 rounded-full bg-rose-300/80" />
              <span className="h-3 w-3 rounded-full bg-amber-300/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
            </div>
          </div>

          <div className="terminal-grid flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex h-full max-w-3xl flex-col">
              <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 px-4 py-3">
                <p className="font-mono text-xs text-cyan-100/80">
                  boot sequence ready
                </p>
                <p className="font-mono text-xs text-slate-500">cursor active</p>
              </div>

              <div className="terminal-panel flex-1 overflow-y-auto rounded-[1.5rem] p-5 sm:p-6">
                <TerminalOutput lines={lines} />
                {launching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 font-mono text-sm text-cyan-200"
                  >
                    Session ready. Opening /projects...
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="mt-5">
                <TerminalInput
                  onSubmit={handleSubmit}
                  history={history}
                  showTabComplete={false}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
