// Autores das fotos. Toda foto com autor mostra "Foto: Nome" com link para o Instagram.
// Para cadastrar um fotógrafo novo, acrescente aqui e preencha `autor` em src/data/fotos.ts.
export const AUTORES = {
  pedro: { nome: 'Pedro P.', instagram: 'pdr.rn' },
} as const;

export type Autor = keyof typeof AUTORES;

export interface Credito { texto: string; instagram: string; link: string }

export function creditoDe(autor?: Autor): Credito | null {
  if (!autor) return null;
  const a = AUTORES[autor];
  return { texto: `Foto: ${a.nome}`, instagram: `@${a.instagram}`, link: `https://www.instagram.com/${a.instagram}/` };
}
