import { Icone, type NomeIcone } from './Icone';

export type AbaTabBar<T extends string> = { id: T; rotulo: string; icone: NomeIcone; contador?: number };

export function TabBar<T extends string>({ abas, ativa, onChange }: { abas: AbaTabBar<T>[]; ativa: T; onChange: (id: T) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {abas.map((a) => {
          const on = a.id === ativa;
          return (
            <li key={a.id} className="flex-1">
              <button
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => onChange(a.id)}
                className={`relative flex w-full flex-col items-center gap-1 py-2 text-tab font-semibold ${on ? 'text-brand-ink' : 'text-ink-3'}`}
              >
                <span className={`grid h-8 w-14 place-items-center rounded-full ${on ? 'bg-brand-soft' : ''}`}>
                  <Icone nome={a.icone} className="h-6 w-6" />
                </span>
                {a.rotulo}
                {!!a.contador && (
                  <span className="absolute -top-0.5 right-3 min-w-5 rounded-full bg-accent px-1 text-[10px] leading-5 font-bold text-on-accent tabular-nums">
                    {a.contador}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
