import snapshot from './snapshot.json';

type Registro = Record<string, unknown> & { id?: string };

const db = snapshot as unknown as Record<string, unknown>;
const copia = <T,>(v: T): T => structuredClone(v);
const contem = (texto: unknown, termo: string) => String(texto ?? '').toLowerCase().includes(termo.toLowerCase());

function filtrar(rota: string, q: URLSearchParams) {
  if (rota === '/alunos') {
    return (db['/alunos'] as Registro[]).filter(
      (a) =>
        (!q.get('cursoId') || a.cursoId === q.get('cursoId')) &&
        (!q.get('situacao') || a.situacao === q.get('situacao')) &&
        (!q.get('turma') || a.turma === q.get('turma')) &&
        (!q.get('busca') || contem(a.nome, q.get('busca')!)),
    );
  }
  if (rota === '/empresas') {
    const lista = db[`/empresas?origem=${q.get('origem') ?? 'PARCEIRA'}`] as (Registro & { cursos: Registro[] })[];
    return lista.filter((e) => !q.get('cursoId') || e.cursos.some((c) => c.id === q.get('cursoId')));
  }
  if (rota === '/estagios') {
    return (db['/estagios'] as Registro[]).filter((e) => !q.get('status') || e.status === q.get('status'));
  }
  if (rota === '/carreiras' || rota === '/novidades' || rota === '/mentores') {
    return (db[rota] as Registro[]).filter((r) => !q.get('cursoId') || r.cursoId === q.get('cursoId'));
  }
  return db[rota];
}

export async function demoApi<T>(path: string, method: string): Promise<T> {
  const [rota, busca = ''] = path.split('?');
  const q = new URLSearchParams(busca);

  if (method === 'GET') {
    const dados = filtrar(rota, q);
    if (dados === undefined) throw new Error('Esta tela não está disponível na demonstração');
    return copia(dados) as T;
  }

  const interesse = rota.match(/^\/portal\/aluno\/([^/]+)\/interesses\/([^/]+)$/);
  if (interesse) {
    const empresas = db[`/portal/aluno/${interesse[1]}/empresas`] as Registro[];
    const empresa = empresas.find((e) => e.id === interesse[2]);
    if (empresa) empresa.interessado = method === 'PUT';
    return undefined as T;
  }

  const pedido = rota.match(/^\/portal\/empresa\/([^/]+)\/vagas\/([^/]+)\/pedidos$/);
  if (pedido) return undefined as T;

  return undefined as T;
}

const alunos = db['/alunos'] as Registro[];
const empresa = (db['/empresas?origem=PARCEIRA'] as Registro[]).find((e) => e.tokenAcesso);

export const linksDemo = {
  aluno: `app/aluno/${(alunos.find((a) => a.nome === 'Ana Souza') ?? alunos[0]).tokenAcesso}`,
  empresa: empresa ? `app/empresa/${empresa.tokenAcesso}` : undefined,
};
