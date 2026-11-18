import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Fotos que a organização pediu para tirar do site. Não podem voltar em nenhuma página nem nos arquivos.
const REMOVIDAS = ['pp-social-menino'];

const arquivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });

describe('fotos removidas a pedido da organização', () => {
  const fontes = arquivos('src').filter((p) => /\.(astro|ts|js|json|md)$/.test(p));
  for (const nome of REMOVIDAS) {
    it(`${nome} não aparece em nenhuma página ou dado`, () => {
      const onde = fontes.filter((p) => readFileSync(p, 'utf8').includes(nome));
      expect(onde).toEqual([]);
    });
    it(`${nome} não está nos arquivos de imagem`, () => {
      expect(existsSync(`src/assets/fotos/${nome}.jpg`)).toBe(false);
      expect(arquivos('public').some((p) => p.includes(nome))).toBe(false);
    });
  }
});
