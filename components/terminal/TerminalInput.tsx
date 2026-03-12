'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { tabComplete } from '@/lib/terminal/tabComplete';

type TerminalInputProps = {
  onSubmit: (value: string) => void;
  history: string[];
  showTabComplete?: boolean;
  prefix?: string;
  autoFocus?: boolean;
};

export function TerminalInput({
  onSubmit,
  history,
  showTabComplete = false,
  prefix = '$',
  autoFocus = true
}: TerminalInputProps) {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const trimmed = value.trim();

      if (!trimmed) {
        return;
      }

      onSubmit(trimmed);
      setValue('');
      setHistoryIndex(null);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (history.length === 0) {
        return;
      }

      const nextIndex =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? '');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (historyIndex === null) {
        return;
      }

      const nextIndex = historyIndex + 1;

      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex] ?? '');
      }

      return;
    }

    if (event.key === 'Tab' && showTabComplete) {
      event.preventDefault();

      const completed = tabComplete(value);

      if (completed) {
        setValue(completed);
      }
    }
  }

  return (
    <div
      className="flex items-center gap-3 rounded-[0.85rem] border border-[var(--line-strong)] bg-[rgba(8,10,11,0.82)] px-4 py-3"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="shrink-0 font-mono text-sm text-[var(--accent-strong)]">
        {prefix}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label="Terminal input"
        className="w-full bg-transparent font-mono text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
        placeholder={showTabComplete ? 'Type a command. Tab to complete.' : 'Type a command.'}
      />
    </div>
  );
}
