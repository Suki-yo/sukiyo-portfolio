import type { TerminalLine } from '@/types';

const typeStyles: Record<TerminalLine['type'], string> = {
  input: 'text-emerald-300',
  output: 'text-slate-200',
  error: 'text-rose-300',
  system: 'text-slate-500'
};

export function TerminalOutput({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="space-y-1 font-mono text-sm leading-6 whitespace-pre-wrap break-words">
      {lines.map((line) => (
        <div key={line.id} className={typeStyles[line.type]}>
          {line.content || '\u00A0'}
        </div>
      ))}
    </div>
  );
}
