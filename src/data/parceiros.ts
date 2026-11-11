// Logos em public/img/logos/<arquivo>.png. `nome` vira o texto alternativo da logo.
// Parceiro sem `arquivo` aparece só com o nome escrito (ainda sem logo).
export interface Parceiro { nome: string; arquivo?: string }

export const REALIZACAO: Parceiro[] = [
  { nome: 'IgatuLands', arquivo: 'igatulands' },
  { nome: 'IgatuBoulder Social', arquivo: 'igatuboulder-social' },
];

export const PATROCINIO: Parceiro[] = [{ nome: 'Km10 Sport', arquivo: 'km10' }];

export const APOIOS: Parceiro[] = [
  { nome: 'Larikinha', arquivo: 'larikinha' },
  { nome: 'Prefeitura de Andaraí', arquivo: 'andarai' },
  { nome: 'Hostel Igatu', arquivo: 'hostel-igatu' },
  { nome: 'Woodtropia', arquivo: 'woodtropia' },
  { nome: 'Gênesis', arquivo: 'genesis' },
  { nome: 'Bendito', arquivo: 'bendito' },
  { nome: 'Fullgrip' },
];
