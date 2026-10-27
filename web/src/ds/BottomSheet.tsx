import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { btnFantasma } from './botoes';

export function BottomSheet({ titulo, aberta, fechar, children }: { titulo: ReactNode; aberta: boolean; fechar: () => void; children: ReactNode }) {
  const painel = useRef<HTMLDivElement>(null);
  const tituloId = useId();
  const fecharRef = useRef(fechar);
  fecharRef.current = fechar;

  useEffect(() => {
    if (!aberta) return;
    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    painel.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharRef.current();
    };
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
      anterior?.focus();
    };
  }, [aberta]);

  if (!aberta) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Fechar" tabIndex={-1} className="absolute inset-0 bg-petrol-900/45" onClick={fechar} />
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className="relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-sheet bg-surface px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-ink shadow-sheet focus:outline-none"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line-strong" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 id={tituloId} className="text-lg font-semibold">
            {titulo}
          </h3>
          <button type="button" onClick={fechar} className={`${btnFantasma} -mr-3`}>
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
