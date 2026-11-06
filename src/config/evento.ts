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
  // Preços em centavos. Pix confirmado. Cartão: PENDENTE de confirmação com a contratante
  // (proposta R$ 167 para cobrir a taxa). Enquanto isso, igual ao Pix.
  precos: { pix: 16000, cartao: 16000 },
  camisetas: ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const,
} as const;
