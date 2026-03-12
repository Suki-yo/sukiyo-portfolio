'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { TerminalLine } from '@/types';

type TerminalContextValue = {
  lines: TerminalLine[];
  commandHistory: string[];
  addLines: (lines: TerminalLine[]) => void;
  clearLines: () => void;
  addToHistory: (command: string) => void;
  addSystemLine: (content: string) => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    if (newLines.length === 0) {
      return;
    }

    setLines((current) => [...current, ...newLines]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const addToHistory = useCallback((command: string) => {
    setCommandHistory((current) => [...current, command]);
  }, []);

  const addSystemLine = useCallback((content: string) => {
    setLines((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type: 'system',
        content
      }
    ]);
  }, []);

  const value = useMemo(
    () => ({
      lines,
      commandHistory,
      addLines,
      clearLines,
      addToHistory,
      addSystemLine
    }),
    [addLines, addSystemLine, addToHistory, clearLines, commandHistory, lines]
  );

  return (
    <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>
  );
}

export function useTerminalContext(): TerminalContextValue {
  const context = useContext(TerminalContext);

  if (!context) {
    throw new Error('useTerminalContext must be used within TerminalProvider');
  }

  return context;
}
