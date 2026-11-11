// Dados oficiais da 14ª edição (datas confirmadas pela proposta 2027, 11/11/2026)
export const EVENTO = {
  nome: 'Festival IgatuBoulder',
  edicao: 14,
  ano: 2027,
  datas: '08 a 10 de janeiro de 2027',
  dias: 'sex · sáb · dom',
  local: 'Igatu · Chapada Diamantina · BA',
  email: 'boulderigatu@gmail.com',
  instagram: 'igatuboulder2027',
  // Preço único do passaporte, em centavos. No cartão, a taxa é repassada ao comprador
  // pelo checkout da InfinitePay (o festival não arca com ela).
  preco: 16000,
  camisetas: ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const,
} as const;
