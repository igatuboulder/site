// Dados oficiais da 14ª edição (contratante, 05/11/2026)
export const EVENTO = {
  nome: 'Festival IgatuBoulder',
  edicao: 14,
  ano: 2027,
  datas: '07 a 09 de janeiro de 2027',
  dias: 'qui · sex · sáb',
  local: 'Igatu · Chapada Diamantina · BA',
  email: 'boulderigatu@gmail.com',
  instagram: 'igatuboulder2027',
  // Preço do passaporte no Pix, em centavos. O preço do cartão é calculado em src/lib/preco.ts
  // para cobrir a taxa da InfinitePay (o festival não arca com ela).
  precoPix: 16000,
  camisetas: ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const,
} as const;
