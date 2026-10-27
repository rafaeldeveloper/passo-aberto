export const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const dataCurta = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const bairro = (endereco?: string | null) => endereco?.split(' - ').pop();

export const origemFonte = (origem: 'PARCEIRA' | 'SCOUT') => (origem === 'PARCEIRA' ? 'PARCEIRA' : 'EXTERNA');

export function DataEvento({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-sand text-brand-ink">
      <span className="text-lg leading-none font-bold">{d.getDate()}</span>
      <span className="text-[11px] font-semibold uppercase">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
    </span>
  );
}
