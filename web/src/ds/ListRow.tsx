import type { ReactNode } from 'react';

export const listaCls = 'divide-y divide-line';
export const avatarCls = 'grid h-10 w-10 shrink-0 place-items-center rounded-md text-sm font-bold';

export function ListRow({
  inicio,
  titulo,
  meta,
  badges,
  fim,
  onClick,
}: {
  inicio?: ReactNode;
  titulo: ReactNode;
  meta?: ReactNode;
  badges?: ReactNode;
  fim?: ReactNode;
  onClick?: () => void;
}) {
  const corpo = (
    <>
      {inicio}
      <span className="block min-w-0 flex-1">
        <span className="block truncate font-semibold">{titulo}</span>
        {meta && <span className="block truncate text-xs text-ink-3">{meta}</span>}
        {badges && <span className="mt-1 flex flex-wrap gap-1">{badges}</span>}
      </span>
    </>
  );
  return (
    <div className="flex min-h-14 items-center gap-3 py-3">
      {onClick ? (
        <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left">
          {corpo}
        </button>
      ) : (
        corpo
      )}
      {fim && <div className="shrink-0">{fim}</div>}
    </div>
  );
}
