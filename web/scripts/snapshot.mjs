import { writeFileSync } from 'fs';

const API = process.env.API ?? 'http://localhost:3333/api';
const saida = new URL('../src/demo/snapshot.json', import.meta.url);
const db = {};

async function pegar(rota) {
  const res = await fetch(API + rota);
  if (!res.ok) throw new Error(`${rota}: ${res.status}`);
  db[rota] = await res.json();
  return db[rota];
}

await pegar('/escola');
await pegar('/painel');
const alunos = await pegar('/alunos');
await pegar('/empresas?origem=PARCEIRA');
await pegar('/empresas?origem=SCOUT');
await pegar('/estagios');
const vagas = await pegar('/vagas');
await pegar('/mentores');
const eventos = await pegar('/eventos');
await pegar('/carreiras');
await pegar('/novidades');

for (const a of alunos) {
  await pegar(`/alunos/${a.id}`);
  await pegar(`/portal/aluno/${a.tokenAcesso}`);
  await pegar(`/portal/aluno/${a.tokenAcesso}/empresas`);
  await pegar(`/portal/aluno/${a.tokenAcesso}/carreiras`);
}
for (const v of vagas) {
  await pegar(`/vagas/${v.id}`);
  await pegar(`/vagas/${v.id}/sugestoes`);
}
for (const e of eventos) await pegar(`/eventos/${e.id}`);
for (const e of db['/empresas?origem=PARCEIRA'].filter((e) => e.tokenAcesso)) {
  await pegar(`/portal/empresa/${e.tokenAcesso}`);
  await pegar(`/portal/empresa/${e.tokenAcesso}/talentos`);
}

writeFileSync(saida, JSON.stringify(db));
console.log(`${Object.keys(db).length} rotas salvas em ${saida.pathname}`);
