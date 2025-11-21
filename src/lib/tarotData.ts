export interface Arcano {
  id: number;
  nome: string;
  imagem: string;
  significado: string;
  palavrasChave: string[];
}

export const arcanosMaiores: Arcano[] = [
  {
    id: 0,
    nome: "O Louco",
    imagem: "/cards/00-o-louco.png",
    significado: "Representa novos começos, inocência, espontaneidade e fé no desconhecido. É hora de dar um salto de fé e confiar no processo.",
    palavrasChave: ["Novos Começos", "Liberdade", "Aventura"]
  },
  {
    id: 1,
    nome: "O Mago",
    imagem: "/cards/01-o-mago.png",
    significado: "Representa poder, habilidade, concentração e ação. É hora de usar seus talentos para manifestar seus desejos na realidade.",
    palavrasChave: ["Manifestação", "Poder", "Habilidade"]
  },
  {
    id: 2,
    nome: "A Sacerdotisa",
    imagem: "/cards/02-a-sacerdotisa.png",
    significado: "Representa intuição, mistério e sabedoria interior. Ouça sua voz interior e confie em seus instintos profundos.",
    palavrasChave: ["Intuição", "Mistério", "Sabedoria"]
  },
  {
    id: 3,
    nome: "A Imperatriz",
    imagem: "/cards/03-a-imperatriz.png",
    significado: "Representa abundância, fertilidade e amor maternal. É tempo de nutrir projetos e relacionamentos com carinho e dedicação.",
    palavrasChave: ["Abundância", "Criatividade", "Natureza"]
  },
  {
    id: 4,
    nome: "O Imperador",
    imagem: "/cards/04-o-imperador.png",
    significado: "Representa autoridade, estrutura e liderança. Estabeleça limites claros e assuma o controle da sua vida com sabedoria.",
    palavrasChave: ["Autoridade", "Estrutura", "Liderança"]
  },
  {
    id: 5,
    nome: "O Hierofante",
    imagem: "/cards/05-o-hierofante.png",
    significado: "Representa tradição, educação e orientação espiritual. Busque sabedoria em ensinamentos ancestrais e mentores experientes.",
    palavrasChave: ["Tradição", "Sabedoria", "Orientação"]
  },
  {
    id: 6,
    nome: "Os Amantes",
    imagem: "/cards/06-os-amantes.png",
    significado: "Representa escolhas importantes, amor e harmonia. Uma decisão significativa sobre relacionamentos ou valores pessoais se aproxima.",
    palavrasChave: ["Amor", "Escolhas", "Harmonia"]
  },
  {
    id: 7,
    nome: "O Carro",
    imagem: "/cards/07-o-carro.png",
    significado: "Representa determinação, vitória e controle. Mantenha o foco nos seus objetivos e avance com confiança e disciplina.",
    palavrasChave: ["Determinação", "Vitória", "Controle"]
  },
  {
    id: 8,
    nome: "A Força",
    imagem: "/cards/08-a-forca.png",
    significado: "Representa coragem, paciência e compaixão. A verdadeira força vem da gentileza e do controle emocional, não da força bruta.",
    palavrasChave: ["Coragem", "Paciência", "Compaixão"]
  },
  {
    id: 9,
    nome: "O Eremita",
    imagem: "/cards/09-o-eremita.png",
    significado: "Representa introspecção, solidão e busca interior. É momento de se retirar e buscar respostas dentro de si mesmo.",
    palavrasChave: ["Introspecção", "Sabedoria", "Solidão"]
  },
  {
    id: 10,
    nome: "A Roda da Fortuna",
    imagem: "/cards/10-a-roda-da-fortuna.png",
    significado: "Representa ciclos, mudanças e destino. A vida está em constante movimento - aceite as mudanças com graça e sabedoria.",
    palavrasChave: ["Ciclos", "Mudança", "Destino"]
  },
  {
    id: 11,
    nome: "A Justiça",
    imagem: "/cards/11-a-justica.png",
    significado: "Representa equilíbrio, verdade e consequências. Suas ações têm consequências - aja com integridade e assuma responsabilidade.",
    palavrasChave: ["Equilíbrio", "Verdade", "Justiça"]
  },
  {
    id: 12,
    nome: "O Enforcado",
    imagem: "/cards/12-o-enforcado.png",
    significado: "Representa sacrifício, nova perspectiva e rendição. Às vezes é necessário pausar e ver as coisas de um ângulo diferente.",
    palavrasChave: ["Perspectiva", "Sacrifício", "Pausa"]
  },
  {
    id: 13,
    nome: "A Morte",
    imagem: "/cards/13-a-morte.png",
    significado: "Representa transformação, finais e recomeços. Algo precisa terminar para que o novo possa nascer - aceite as mudanças.",
    palavrasChave: ["Transformação", "Finais", "Renascimento"]
  },
  {
    id: 14,
    nome: "A Temperança",
    imagem: "/cards/14-a-temperanca.png",
    significado: "Representa equilíbrio, moderação e paciência. Busque o meio-termo e integre os opostos de forma harmoniosa.",
    palavrasChave: ["Equilíbrio", "Moderação", "Harmonia"]
  },
  {
    id: 15,
    nome: "O Diabo",
    imagem: "/cards/15-o-diabo.png",
    significado: "Representa apegos, materialismo e ilusões. Examine o que está te prendendo e liberte-se das correntes autoimpostas.",
    palavrasChave: ["Apegos", "Ilusão", "Libertação"]
  },
  {
    id: 16,
    nome: "A Torre",
    imagem: "/cards/16-a-torre.png",
    significado: "Representa mudanças súbitas, revelações e ruptura. Estruturas antigas precisam cair para dar lugar ao novo e verdadeiro.",
    palavrasChave: ["Mudança Súbita", "Revelação", "Libertação"]
  },
  {
    id: 17,
    nome: "A Estrela",
    imagem: "/cards/17-a-estrela.png",
    significado: "Representa esperança, inspiração e renovação. Após a tempestade vem a calma - mantenha a fé e renove suas energias.",
    palavrasChave: ["Esperança", "Inspiração", "Cura"]
  },
  {
    id: 18,
    nome: "A Lua",
    imagem: "/cards/18-a-lua.png",
    significado: "Representa ilusões, medos e subconsciente. Nem tudo é o que parece - confie em sua intuição para navegar pela névoa.",
    palavrasChave: ["Intuição", "Ilusão", "Mistério"]
  },
  {
    id: 19,
    nome: "O Sol",
    imagem: "/cards/19-o-sol.png",
    significado: "Representa alegria, sucesso e vitalidade. A clareza chegou - celebre suas conquistas e brilhe intensamente.",
    palavrasChave: ["Alegria", "Sucesso", "Vitalidade"]
  },
  {
    id: 20,
    nome: "O Julgamento",
    imagem: "/cards/20-o-julgamento.png",
    significado: "Representa renovação, reflexão e chamado. É hora de avaliar suas escolhas e responder ao seu chamado superior.",
    palavrasChave: ["Renovação", "Reflexão", "Chamado"]
  },
  {
    id: 21,
    nome: "O Mundo",
    imagem: "/cards/21-o-mundo.png",
    significado: "Representa conclusão, realização e integração. Um ciclo se completa com sucesso - celebre suas conquistas e prepare-se para o próximo.",
    palavrasChave: ["Conclusão", "Realização", "Plenitude"]
  }
];
