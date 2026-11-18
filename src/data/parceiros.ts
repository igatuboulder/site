// Logos em public/img/logos/<arquivo>.png. `nome` vira o texto alternativo da logo.
// Parceiro sem `arquivo` aparece só com o nome escrito (ainda sem logo).
// `link`: site ou Instagram da marca (https). Com link, a logo do rodapé vira link e abre em outra aba.
export interface Parceiro { nome: string; arquivo?: string; link?: string }

export const REALIZACAO: Parceiro[] = [
  { nome: 'IgatuLands', arquivo: 'igatulands' },
  { nome: 'IgatuBoulder Social', arquivo: 'igatuboulder-social' },
];

export const PATROCINIO: Parceiro[] = [{ nome: 'Km10 Sport', arquivo: 'km10', link: 'https://km10sports.com/' }];

export const APOIOS: Parceiro[] = [
  { nome: 'Larikinha', arquivo: 'larikinha' },
  { nome: 'Prefeitura de Andaraí', arquivo: 'andarai' },
  { nome: 'Hostel Igatu', arquivo: 'hostel-igatu', link: 'https://www.instagram.com/hosteligatu/' },
  { nome: 'Woodtropia', arquivo: 'woodtropia' },
  { nome: 'Gênesis', arquivo: 'genesis' },
  { nome: 'Bendito', arquivo: 'bendito', link: 'https://www.instagram.com/bendito_sorvetes/' },
];
