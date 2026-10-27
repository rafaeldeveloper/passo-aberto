import type { ReactNode } from 'react';
import { Logo } from './Logo';

export function AppHeader({ titulo, subtitulo, acao }: { titulo: ReactNode; subtitulo?: ReactNode; acao?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4">
        <Logo />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-brand-ink">{titulo}</p>
          {subtitulo && <p className="truncate text-xs text-ink-3">{subtitulo}</p>}
        </div>
        {acao && <div className="shrink-0">{acao}</div>}
      </div>
    </header>
  );
}
