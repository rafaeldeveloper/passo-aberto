# Ponte (MVP)

Conecta estudantes do ensino técnico a estágios, empresas, mentores e vagas. A coordenação opera o painel; alunos e empresas usam o app (PWA) por um link pessoal.

**Demonstração:** https://rafaeldeveloper.github.io/ponte/ (dados fictícios, alterações não são salvas)

- `api/`: NestJS + Prisma + Postgres (porta 3333, prefixo `/api`)
- `web/`: React + Vite + Tailwind (porta 5173, com proxy de `/api` para a API)

## Rodando

```bash
docker compose up -d

cd api
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

cd ../web
npm install
npm run dev
```

Abra http://localhost:5173 (painel da coordenação) ou http://localhost:5173/app (app de aluno e empresa).

O seed cria a escola `eeep-piloto` com os cursos de Informática, Agroindústria, Turismo e Enfermagem, além de alguns dados de exemplo. Para usar o Supabase, aponte o `DATABASE_URL` para o Postgres do projeto.

## Telas

| Tela | O que faz |
|---|---|
| Painel | Situação por curso, 3º ano sem estágio, próximos eventos, vagas abertas, egressos empregados |
| Alunos | Cadastro manual, filtros e ficha (dados, competências, certificações, projetos, estágios, eventos, indicações) |
| Estágios | Acompanhamento de horas, status e avaliação do supervisor |
| Empresas | Parceiras (com link de acesso) e encontradas no scout, com filtro por curso e "Tornar parceira" |
| Vagas e match | Vagas por curso, sugestão de alunos pontuada e funil de indicação |
| Mentores e eventos | Mentores por curso, palestras, visitas e mentorias com lista de presença |
| Carreiras | Caminhos de carreira por curso e novidades publicadas para os alunos |

## App (PWA) para aluno e empresa

Sem login: a coordenação copia o link pessoal na ficha do aluno ou na empresa parceira e envia. "Novo link" invalida o anterior.

- Aluno (`/app/aluno/<token>`): vê e completa a própria ficha, acompanha estágio, eventos e indicações, explora carreiras e novidades do curso e as empresas da área (parceiras e do scout), podendo marcar "Tenho interesse".
- Empresa (`/app/empresa/<token>`): publica vagas, vê os candidatos que a escola encaminhou (sem contato direto), vê perfis anônimos de outros talentos disponíveis e pode pedir que a escola os encaminhe, responde e avalia estagiários.

## Scout de empresas

```bash
cd api
npm run scout                      # usa o município da escola, UF CE
npm run scout -- --municipio Sobral --uf CE
```

Busca no OpenStreetMap (Overpass) lugares ligados a cada curso e grava como empresa `SCOUT`, sem duplicar. No painel, "Tornar parceira" muda a origem para `PARCEIRA`. Dados © OpenStreetMap contributors (ODbL). O Google Places não foi usado porque os termos proíbem guardar os dados no banco.

## Regras automáticas

- Registrar um estágio marca o aluno como "Estagiando"; concluir ou cancelar atualiza a situação.
- Uma indicação "Contratado" em vaga de emprego marca o aluno como "Empregado".
- Vagas de estágio sugerem alunos que ainda estão cursando; vagas de emprego sugerem o 3º ano e os egressos.
- Pontuação do match: competências em comum (até 70), certificações (até 20) e participação em eventos (10).
- Aluno menor de idade sem consentimento do responsável aparece no match, mas não pode ser indicado.
- A empresa só vê indicações com status "Encaminhado" ou "Contratado". Outros talentos aparecem anônimos e só se estiverem disponíveis e autorizados; o pedido da empresa vira uma indicação "Sugerido" marcada como pedido da empresa, listada no Painel.
- O interesse dos alunos aparece em Empresas e ajuda a priorizar quais empresas do scout procurar para parceria.
- O conteúdo inicial de carreiras (seed) é um rascunho para a coordenação revisar.

## Demonstração estática (GitHub Pages)

O Pages não roda a API, então a demo usa uma foto dos dados (`web/src/demo/snapshot.json`) e as alterações ficam só no navegador. Para atualizar a foto com a API local rodando:

```bash
cd web
node scripts/snapshot.mjs
```

O workflow `.github/workflows/pages.yml` publica a cada push na `main`.

## Fora do MVP

Login da coordenação, importação em lote e acesso de mentores.
