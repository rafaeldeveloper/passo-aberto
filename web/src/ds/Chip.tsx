import type { ReactNode } from 'react';

export const chipsCls = '-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export function Chip({ ativo, onClick, children, contador }: { ativo: boolean; onClick: () => void; children: ReactNode; contador?: number }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ${
        ativo ? 'bg-ink text-canvas' : 'bg-surface text-ink-2 ring-1 ring-line active:bg-surface-2'
      }`}
    >
      {children}
      {contador !== undefined && <span className={`tabular-nums ${ativo ? 'opacity-80' : 'text-ink-3'}`}>{contador}</span>}
    </button>
  );
}
