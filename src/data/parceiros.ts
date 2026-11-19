// Logos em public/img/logos/<arquivo>.png. `nome` vira o texto alternativo da logo.
// Parceiro sem `arquivo` aparece só com o nome escrito (ainda sem logo).
// `link`: site ou Instagram da marca (https). Com link, a logo do rodapé vira link e abre em outra aba.
export interface Parceiro { nome: string; arquivo?: string; link?: string }

export const REALIZACAO: Parceiro[] = [
  { nome: 'IgatuLands', arquivo: 'igatulands' },
];

export const PATROCINIO: Parceiro[] = [{ nome: 'Km10 Sport', arquivo: 'km10', link: 'https://km10sports.com/' }];

export const APOIOS: Parceiro[] = [
  { nome: 'IgatuBoulder Social', arquivo: 'igatuboulder-social' },
  { nome: 'Larikinha', arquivo: 'larikinha', link: 'https://larikinha.com/' },
  { nome: 'Prefeitura de Andaraí', arquivo: 'andarai', link: 'https://www.andarai.ba.gov.br/' },
  { nome: 'Hostel Igatu', arquivo: 'hostel-igatu', link: 'https://www.instagram.com/hosteligatu/' },
  { nome: 'Woodtropia', arquivo: 'woodtropia', link: 'https://www.woodtropia.com/' },
  { nome: 'Gênesis', arquivo: 'genesis', link: 'https://www.instagram.com/genesisclimb/' },
  { nome: 'Bendito', arquivo: 'bendito', link: 'https://www.instagram.com/bendito_sorvetes/' },
];
