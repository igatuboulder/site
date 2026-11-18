import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

// Pedido do cliente: Igatu é "distrito", não "vila". Nenhum texto visível do site pode usar "vila".
// (Nomes internos de arquivo, como pp-vila-*, e chaves de código não aparecem para o visitante.)
const arquivos = [
  ...readdirSync('src/pages').filter((f) => f.endsWith('.astro')).map((f) => `src/pages/${f}`),
  ...readdirSync('src/components').map((f) => `src/components/${f}`),
  'src/layouts/Base.astro', 'src/data/fotos.ts', 'src/data/navegacao.ts', 'src/lib/fotos.ts', 'src/data/setores.json',
];
const VILA = /(?<![-.\w'"])vil(a|as|arejo)(?![-\w'"])|'(A |a )?[Vv]ila'|"(A |a )?[Vv]ila"|\b[Vv]ila viva/;

describe('Igatu é distrito, não vila', () => {
  for (const f of arquivos) {
    it(f, () => {
      const linhas = readFileSync(f, 'utf8').split('\n').map((l, i) => [i + 1, l] as const).filter(([, l]) => VILA.test(l.replace(/pp-vila-[a-z0-9-]+|mapa\.vila|vila: /g, '')));
      expect(linhas.map(([n, l]) => `${n}: ${l.trim().slice(0, 90)}`)).toEqual([]);
    });
  }

  it('a página de Igatu mudou de endereço e o antigo redireciona', () => {
    expect(readdirSync('src/pages')).toContain('igatu.astro');
    expect(readdirSync('src/pages')).not.toContain('a-vila.astro');
    expect(readFileSync('public/_redirects', 'utf8')).toMatch(/^\/a-vila\s+\/igatu\s+301/m);
  });
});
