import type { ReactNode } from 'react';

export type TomBadge = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'info' | 'danger';

const tons: Record<TomBadge, string> = {
  neutral: 'bg-surface-2 text-ink-2',
  brand: 'bg-brand-soft text-brand-ink',
  accent: 'bg-accent-soft text-accent-ink',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  danger: 'bg-danger-soft text-danger',
};

export function Badge({ tom = 'neutral', children }: { tom?: TomBadge; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tons[tom]}`}>{children}</span>;
}
