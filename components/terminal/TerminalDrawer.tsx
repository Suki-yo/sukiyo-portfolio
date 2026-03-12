'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, TerminalSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTerminalContext } from '@/contexts/TerminalContext';
import { executeDrawerCommand } from '@/lib/terminal/commands';
import type { TerminalLine } from '@/types';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

export function TerminalDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    lines,
    commandHistory,
    addLines,
    clearLines,
    addToHistory,
    addSystemLine
  } = useTerminalContext();
  const [open, setOpen] = useState(true);
  const previousPathname = useRef(pathname);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      addSystemLine(`-> ${pathname}`);
      previousPathname.current = pathname;
    }
  }, [addSystemLine, pathname]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [lines, open]);

  function handleSubmit(input: string) {
    const nextHistory = [...commandHistory, input];
    addToHistory(input);

    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'input',
      content: `$ ${input}`
    };

    const result = executeDrawerCommand(input, nextHistory);

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
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/85 shadow-[0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-3 border-b border-white/10 px-4 py-3 text-left transition hover:bg-white/5"
        >
          <TerminalSquare size={15} className="text-cyan-200" />
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
              terminal drawer
            </p>
            <p className="font-mono text-xs text-slate-300">
              commands: cd, cat, grep, find, history
            </p>
          </div>
          <span className="ml-auto text-slate-400">
            {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 264, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid h-full gap-4 px-4 py-4 sm:grid-cols-[1fr_220px]">
                <div className="terminal-panel flex h-full flex-col rounded-[1.25rem] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-xs text-slate-500">
                      route-aware shell
                    </p>
                    <p className="font-mono text-xs text-slate-600">{pathname}</p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <TerminalOutput lines={lines} />
                    <div ref={bottomRef} />
                  </div>
                  <div className="mt-4">
                    <TerminalInput
                      onSubmit={handleSubmit}
                      history={commandHistory}
                      showTabComplete={true}
                      autoFocus={false}
                    />
                  </div>
                </div>

                <aside className="hidden rounded-[1.25rem] border border-white/8 bg-white/4 p-4 sm:block">
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-cyan-100/60">
                    quick refs
                  </p>
                  <div className="mt-4 space-y-3 font-mono text-xs text-slate-400">
                    <p>`cd /projects`</p>
                    <p>`cat portfolio`</p>
                    <p>`grep TypeScript`</p>
                    <p>`find --tag React`</p>
                    <p>`history`</p>
                    <p>`clear`</p>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
