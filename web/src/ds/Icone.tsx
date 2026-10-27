const caminhos = {
  inicio: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  ficha: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  eu: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  eventos: 'M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  agenda: 'M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm3 7h2m4 0h2m-8 4h2m4 0h2',
  carreiras: 'M12 3 2 8l10 5 10-5zM6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5',
  estudar: 'M12 3 2 8l10 5 10-5zM6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5M22 8v6',
  oportunidades: 'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-11 0h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm-1 6h18',
  trabalhar: 'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-11 0h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm-1 6h18',
  vagas: 'M4 7h16v12H4zM9 7V5h6v2',
  candidatos: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2.5 3 5',
  estagiarios: 'M12 4 2 9l10 5 10-5-10-5zM6 11v5c3 2 9 2 12 0v-5',
  pessoa: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-4 4-6 8-6s8 2 8 6',
  bussola: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm3.5-12.5-2 5-5 2 2-5z',
  ajuda: 'M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12zM9 10.5a3 3 0 0 1 5.6-1.2c.6 1.4-.4 2.4-1.4 3-.6.3-1.2.9-1.2 1.7M12 16.5h.01',
  mapa: 'M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5zm0 0v13.5m6-11v13.5',
  lista: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  escudo: 'M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6zm-3.5 9 2.5 2.5 4.5-5',
  cadeado: 'M6.5 11h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zm2 0V7.5a3.5 3.5 0 0 1 7 0V11',
  externo: 'M14 4h6v6m0-6-9 9m-1-7H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  check: 'M5 12.5 10 17l9-10',
  mais: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  seta: 'M9 6l6 6-6 6',
  voltar: 'M15 6l-6 6 6 6',
  busca: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm5-2 4 4',
};

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, className = 'h-6 w-6' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={caminhos[nome]} />
    </svg>
  );
}
