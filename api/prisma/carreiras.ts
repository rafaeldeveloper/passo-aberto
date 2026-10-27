import { PrismaClient } from '@prisma/client';

type Carreira = { titulo: string; resumo: string; ondeTrabalhar: string; formacao: string; competencias: string[] };

export const CARREIRAS: Record<string, Carreira[]> = {
  Informática: [
    {
      titulo: 'Desenvolvimento de software',
      resumo: 'Cria sites, aplicativos e sistemas, do planejamento ao código e aos testes.',
      ondeTrabalhar: 'Empresas de software, startups, bancos, órgãos públicos e vagas remotas.',
      formacao: 'Análise e Desenvolvimento de Sistemas (tecnólogo), Ciência da Computação, Engenharia de Software.',
      competencias: ['lógica de programação', 'javascript', 'python', 'git', 'sql'],
    },
    {
      titulo: 'Suporte e infraestrutura de TI',
      resumo: 'Mantém computadores, redes e sistemas funcionando e atende os usuários.',
      ondeTrabalhar: 'Empresas de qualquer setor, provedores de internet, escolas e hospitais.',
      formacao: 'Redes de Computadores (tecnólogo), certificações de redes e sistemas operacionais.',
      competencias: ['redes', 'hardware', 'linux', 'windows', 'atendimento'],
    },
    {
      titulo: 'Análise de dados',
      resumo: 'Organiza e interpreta dados para ajudar empresas a tomar decisões.',
      ondeTrabalhar: 'Varejo, bancos, saúde, governo e consultorias.',
      formacao: 'Ciência de Dados, Sistemas de Informação, Estatística.',
      competencias: ['excel', 'sql', 'python', 'power bi'],
    },
    {
      titulo: 'Segurança da informação',
      resumo: 'Protege sistemas e dados contra falhas e ataques.',
      ondeTrabalhar: 'Bancos, empresas de tecnologia, órgãos públicos e consultorias.',
      formacao: 'Segurança da Informação (tecnólogo), Redes de Computadores.',
      competencias: ['redes', 'linux', 'segurança'],
    },
    {
      titulo: 'Design de interfaces (UX/UI)',
      resumo: 'Desenha telas e experiências fáceis de usar em sites e aplicativos.',
      ondeTrabalhar: 'Agências digitais, empresas de software e startups.',
      formacao: 'Design, Sistemas para Internet (tecnólogo).',
      competencias: ['figma', 'html', 'css', 'pesquisa com usuários'],
    },
  ],
  Agroindústria: [
    {
      titulo: 'Controle de qualidade de alimentos',
      resumo: 'Garante que os alimentos sejam seguros, com análises e boas práticas na produção.',
      ondeTrabalhar: 'Laticínios, frigoríficos, indústrias de bebidas, sucos e polpas.',
      formacao: 'Tecnologia em Alimentos, Engenharia de Alimentos, Química.',
      competencias: ['boas práticas de fabricação', 'appcc', 'análises laboratoriais'],
    },
    {
      titulo: 'Produção e beneficiamento',
      resumo: 'Opera e acompanha linhas de processamento de frutas, leite, carnes e grãos, como o beneficiamento do caju.',
      ondeTrabalhar: 'Indústrias de alimentos, agroindústrias familiares e cooperativas.',
      formacao: 'Tecnologia em Agroindústria, Engenharia de Alimentos.',
      competencias: ['processamento de alimentos', 'boas práticas de fabricação', 'segurança do trabalho'],
    },
    {
      titulo: 'Gestão de cooperativas e agronegócio',
      resumo: 'Organiza a produção, as compras e as vendas de produtores rurais.',
      ondeTrabalhar: 'Cooperativas, associações de produtores e órgãos de assistência técnica rural.',
      formacao: 'Agronegócio (tecnólogo), Administração, Gestão de Cooperativas.',
      competencias: ['gestão', 'custos', 'comercialização'],
    },
    {
      titulo: 'Pesquisa e desenvolvimento',
      resumo: 'Desenvolve novos produtos e processos, aproveitando melhor as matérias-primas da região.',
      ondeTrabalhar: 'Centros de pesquisa como a Embrapa Agroindústria Tropical, universidades e indústrias.',
      formacao: 'Engenharia de Alimentos, Química, Agronomia e pós-graduação.',
      competencias: ['análises laboratoriais', 'método científico'],
    },
    {
      titulo: 'Empreendedorismo em alimentos',
      resumo: 'Abre o próprio negócio de produção de alimentos, com rotulagem e regularização sanitária.',
      ondeTrabalhar: 'Negócio próprio, feiras e mercados locais.',
      formacao: 'Cursos de gestão e empreendedorismo, Tecnologia em Alimentos.',
      competencias: ['boas práticas de fabricação', 'custos', 'vendas'],
    },
  ],
  Turismo: [
    {
      titulo: 'Hotelaria',
      resumo: 'Cuida da recepção, reservas, governança e eventos em meios de hospedagem.',
      ondeTrabalhar: 'Hotéis, pousadas e resorts da capital e do litoral.',
      formacao: 'Hotelaria (tecnólogo), Turismo.',
      competencias: ['atendimento', 'inglês', 'espanhol', 'sistemas de reserva'],
    },
    {
      titulo: 'Agenciamento e guiamento',
      resumo: 'Monta roteiros, vende pacotes e conduz turistas. Para atuar como guia é preciso cadastro no Cadastur.',
      ondeTrabalhar: 'Agências de viagem, receptivos e operadoras de turismo.',
      formacao: 'Curso técnico de guia de turismo, Turismo.',
      competencias: ['idiomas', 'roteiros', 'história local', 'atendimento'],
    },
    {
      titulo: 'Eventos',
      resumo: 'Planeja e executa congressos, feiras, shows e festas.',
      ondeTrabalhar: 'Centros de eventos, produtoras, buffets e hotéis.',
      formacao: 'Eventos (tecnólogo), Turismo.',
      competencias: ['eventos', 'organização', 'atendimento'],
    },
    {
      titulo: 'Planejamento e turismo comunitário',
      resumo: 'Desenvolve destinos e projetos de turismo com as comunidades locais.',
      ondeTrabalhar: 'Secretarias de turismo, ONGs e consultorias.',
      formacao: 'Turismo (bacharelado), Gestão de Turismo (tecnólogo).',
      competencias: ['planejamento', 'projetos', 'comunicação'],
    },
  ],
  Enfermagem: [
    {
      titulo: 'Enfermagem hospitalar',
      resumo: 'Atua em internação, emergência e UTI sob supervisão do enfermeiro. Exige registro no Coren.',
      ondeTrabalhar: 'Hospitais, UPAs e clínicas.',
      formacao: 'Especializações técnicas (UTI, urgência), Enfermagem (bacharelado).',
      competencias: ['sinais vitais', 'administração de medicamentos', 'primeiros socorros'],
    },
    {
      titulo: 'Atenção básica',
      resumo: 'Trabalha com vacinação, curativos e acompanhamento das famílias na comunidade.',
      ondeTrabalhar: 'Unidades básicas de saúde e equipes de saúde da família.',
      formacao: 'Enfermagem (bacharelado), Saúde Coletiva.',
      competencias: ['vacinação', 'curativos', 'educação em saúde'],
    },
    {
      titulo: 'Home care e cuidados prolongados',
      resumo: 'Cuida de pacientes em casa ou em instituições de longa permanência para idosos.',
      ondeTrabalhar: 'Empresas de home care e instituições de longa permanência.',
      formacao: 'Especialização em cuidado ao idoso, Enfermagem (bacharelado).',
      competencias: ['cuidados com idosos', 'sinais vitais', 'curativos'],
    },
    {
      titulo: 'Centro cirúrgico e instrumentação',
      resumo: 'Prepara materiais e auxilia a equipe durante cirurgias.',
      ondeTrabalhar: 'Hospitais e clínicas cirúrgicas.',
      formacao: 'Curso de instrumentação cirúrgica, especialização em centro cirúrgico.',
      competencias: ['esterilização', 'instrumentação cirúrgica'],
    },
    {
      titulo: 'Enfermagem do trabalho',
      resumo: 'Cuida da saúde dos trabalhadores e da prevenção de acidentes nas empresas.',
      ondeTrabalhar: 'Indústrias, construtoras e grandes empresas.',
      formacao: 'Especialização técnica em enfermagem do trabalho.',
      competencias: ['primeiros socorros', 'saúde ocupacional'],
    },
  ],
};

export const NOVIDADES: Record<string, { titulo: string; texto: string; link: string; carreira?: string }> = {
  Informática: {
    titulo: 'Monte seu portfólio no GitHub',
    texto: 'Empresas de tecnologia olham os projetos que você publica. Coloque lá os trabalhos da escola e adicione o link na sua ficha.',
    link: 'https://github.com',
    carreira: 'Desenvolvimento de software',
  },
  Agroindústria: {
    titulo: 'Pesquisa em agroindústria aqui em Fortaleza',
    texto: 'A Embrapa Agroindústria Tropical desenvolve tecnologias para frutas tropicais como caju, acerola e coco. Vale conhecer as linhas de pesquisa.',
    link: 'https://www.embrapa.br/agroindustria-tropical',
    carreira: 'Pesquisa e desenvolvimento',
  },
  Turismo: {
    titulo: 'Quer ser guia? Conheça o Cadastur',
    texto: 'O Cadastur é o cadastro do Ministério do Turismo para prestadores de serviços turísticos, incluindo guias.',
    link: 'https://cadastur.turismo.gov.br',
    carreira: 'Agenciamento e guiamento',
  },
  Enfermagem: {
    titulo: 'Registro no Coren depois da formatura',
    texto: 'Para trabalhar como técnico de enfermagem é preciso se inscrever no Conselho Regional de Enfermagem. Veja os documentos necessários.',
    link: 'https://www.coren-ce.org.br',
    carreira: 'Enfermagem hospitalar',
  },
};

export async function seedCarreiras(prisma: PrismaClient, escolaId: string) {
  if (await prisma.carreira.count({ where: { escolaId } })) return;
  const cursos = await prisma.curso.findMany({ where: { escolaId } });
  for (const curso of cursos) {
    const criadas = await Promise.all(
      (CARREIRAS[curso.nome] ?? []).map((c, ordem) => prisma.carreira.create({ data: { ...c, ordem, escolaId, cursoId: curso.id } })),
    );
    const novidade = NOVIDADES[curso.nome];
    if (novidade) {
      const { carreira, ...dados } = novidade;
      await prisma.novidade.create({
        data: { ...dados, escolaId, cursoId: curso.id, carreiraId: criadas.find((c) => c.titulo === carreira)?.id },
      });
    }
  }
}
