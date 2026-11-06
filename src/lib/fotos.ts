export type Secao = 'social' | 'escalada' | 'festival';
export interface Foto { arquivo: string; secao: Secao; setor?: string; alt: string }
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
