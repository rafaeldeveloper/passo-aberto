import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'util';

type Tags = Record<string, string>;

interface Elemento {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Tags;
}

const REGRAS: { curso: string; setor: string; filtros: string[] }[] = [
  {
    curso: 'Informática',
    setor: 'Tecnologia',
    filtros: ['["office"~"^(it|telecommunication)$"]', '["shop"~"^(computer|electronics)$"]', '["craft"="electronics_repair"]'],
  },
  {
    curso: 'Agroindústria',
    setor: 'Agroindústria e alimentos',
    filtros: [
      '["industrial"~"food|dairy|slaughterhouse|beverage|agricultural"]',
      '["craft"~"^(cheese_maker|confectionery|brewery|distillery|winery)$"]',
      '["shop"="agrarian"]',
      '["office"="cooperative"]',
    ],
  },
  {
    curso: 'Turismo',
    setor: 'Turismo e hotelaria',
    filtros: ['["tourism"~"^(hotel|hostel|guest_house|motel)$"]', '["office"="travel_agent"]', '["shop"="travel_agency"]', '["amenity"="events_venue"]'],
  },
  {
    curso: 'Enfermagem',
    setor: 'Saúde',
    filtros: ['["amenity"~"^(hospital|clinic|nursing_home)$"]', '["healthcare"~"^(hospital|clinic|centre|laboratory|rehabilitation)$"]'],
  },
];

const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];

async function buscar(municipio: string, uf: string, filtros: string[]) {
  const consulta = `
[out:json][timeout:180];
area["ISO3166-2"="BR-${uf}"]->.uf;
rel(area.uf)["boundary"="administrative"]["admin_level"="8"]["name"="${municipio}"];
map_to_area->.m;
(
${filtros.map((f) => `  nwr${f}["name"](area.m);`).join('\n')}
);
out center tags;`;
  for (let tentativa = 0; tentativa < SERVIDORES.length * 2; tentativa++) {
    const servidor = SERVIDORES[tentativa % SERVIDORES.length];
    const res = await fetch(servidor, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'ponte-scout/0.1' },
      body: new URLSearchParams({ data: consulta }),
    }).catch(() => undefined);
    if (res?.ok) return ((await res.json()) as { elements: Elemento[] }).elements;
    console.warn(`${servidor} respondeu ${res?.status ?? 'erro de rede'}, tentando de novo`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('Overpass indisponível');
}

const endereco = (t: Tags) =>
  [[t['addr:street'], t['addr:housenumber']].filter(Boolean).join(', '), t['addr:suburb']].filter(Boolean).join(' - ') || undefined;

async function main() {
  const { values } = parseArgs({ options: { escola: { type: 'string' }, municipio: { type: 'string' }, uf: { type: 'string', default: 'CE' } } });
  const prisma = new PrismaClient();
  const escola = await prisma.escola.findUniqueOrThrow({
    where: { slug: values.escola ?? process.env.ESCOLA_SLUG ?? 'eeep-piloto' },
    include: { cursos: true },
  });
  const municipio = values.municipio ?? escola.municipio;

  const achados = new Map<string, { el: Elemento; setor: string; cursoIds: Set<string> }>();
  for (const regra of REGRAS) {
    const curso = escola.cursos.find((c) => c.nome === regra.curso);
    if (!curso) continue;
    const elementos = await buscar(municipio, values.uf!, regra.filtros);
    console.log(`${regra.curso}: ${elementos.length} lugares`);
    for (const el of elementos) {
      const osmId = `${el.type}/${el.id}`;
      const item = achados.get(osmId) ?? { el, setor: regra.setor, cursoIds: new Set<string>() };
      item.cursoIds.add(curso.id);
      achados.set(osmId, item);
    }
  }

  let novas = 0;
  for (const [osmId, { el, setor, cursoIds }] of achados) {
    const t = el.tags ?? {};
    const existente = await prisma.empresa.findUnique({ where: { escolaId_osmId: { escolaId: escola.id, osmId } } });
    if (existente) continue;
    await prisma.empresa.create({
      data: {
        escolaId: escola.id,
        origem: 'SCOUT',
        osmId,
        nome: t.name,
        setor,
        endereco: endereco(t),
        site: t.website ?? t['contact:website'],
        contatoTelefone: t.phone ?? t['contact:phone'],
        contatoEmail: t.email ?? t['contact:email'],
        latitude: el.lat ?? el.center?.lat,
        longitude: el.lon ?? el.center?.lon,
        cursos: { connect: [...cursoIds].map((id) => ({ id })) },
      },
    });
    novas++;
  }
  console.log(`${achados.size} lugares encontrados, ${novas} empresas novas como scout em ${municipio}-${values.uf}`);
  await prisma.$disconnect();
}

main();
