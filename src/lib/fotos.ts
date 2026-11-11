export type Secao = 'social' | 'escalada' | 'festival';
// alt: texto alternativo curto. descricao: audiodescrição completa, lida pelo leitor de tela e mostrada com o botão "Audiodescrição".
// capa: marque true na foto que abre o álbum (sem marcação, vale a primeira).
export interface Foto { arquivo: string; secao: Secao; setor?: string; alt: string; descricao: string; capa?: boolean }
export interface Grupo { setor: string | null; fotos: Foto[] }
export interface SecaoFotos { secao: Secao; grupos: Grupo[] }

const ORDEM: Secao[] = ['social', 'escalada', 'festival'];

export function agruparFotos(fotos: Foto[]): SecaoFotos[] {
  return ORDEM.map((secao) => {
    const daSecao = fotos.filter((f) => f.secao === secao);
    const setores = [...new Set(daSecao.filter((f) => f.setor).map((f) => f.setor!))];
    const grupos: Grupo[] = setores.map((setor) => ({ setor, fotos: daSecao.filter((f) => f.setor === setor) }));
    const semSetor = daSecao.filter((f) => !f.setor);
    if (semSetor.length) grupos.push({ setor: null, fotos: semSetor });
    return { secao, grupos };
  }).filter((s) => s.grupos.length > 0);
}

export interface Album { id: string; titulo: string; secao: Secao; fotos: Foto[]; capa: Foto }

const TITULOS: Record<Secao, string> = { social: 'IgatuBoulder Social', escalada: 'Escalada', festival: 'O festival' };
const ancora = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Galerias da página Fotos: uma por seção; na escalada, uma por setor (as sem setor ficam em "Escalada").
export function montarAlbuns(fotos: Foto[]): Album[] {
  const albuns: Album[] = [];
  for (const s of agruparFotos(fotos)) {
    for (const g of s.grupos) {
      const titulo = g.setor ? `Setor ${g.setor}` : TITULOS[s.secao];
      albuns.push({ id: ancora(g.setor ? `setor ${g.setor}` : s.secao), titulo, secao: s.secao, fotos: g.fotos, capa: g.fotos.find((f) => f.capa) ?? g.fotos[0] });
    }
  }
  return albuns;
}
