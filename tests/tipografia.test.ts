import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

const css = readFileSync('src/styles/global.css', 'utf8');
const ESCALA = ['--t-titulo', '--t-secao', '--t-item', '--t-lead', '--t-corpo', '--t-nota', '--t-rotulo'];

// A capa (index) é composição de cartaz; o resto das páginas segue a escala.
const paginas = readdirSync('src/pages').filter((f) => f.endsWith('.astro') && f !== 'index.astro');

describe('escala tipográfica única', () => {
  it('define todos os tamanhos da escala no global.css', () => {
    for (const t of ESCALA) expect(css).toMatch(new RegExp(`${t}:`));
  });

  it('classes padrão usam a escala', () => {
    for (const c of ['.h2', '.h3', '.lead', '.texto', '.rotulo']) {
      const regra = css.match(new RegExp(`\\${c} \\{[^}]*\\}`))?.[0] ?? '';
      expect(regra, c).toMatch(/font-size: var\(--t-/);
    }
  });

  it.each(paginas)('%s não inventa tamanho de fonte fora da escala', (arq) => {
    const fonte = readFileSync(`src/pages/${arq}`, 'utf8');
    const soltos = [...fonte.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim()).filter((v) => !v.startsWith('var(--t-'));
    expect(soltos).toEqual([]);
  });

  it('o cabeçalho das páginas usa o tamanho de título', () => {
    expect(readFileSync('src/components/Cabecalho.astro', 'utf8')).toMatch(/font-size: var\(--t-titulo\)/);
  });
});

describe('Sobre', () => {
  it('Sobre: Feito com a vila e a apresentação do festival estão no mesmo bloco', () => {
    const sobre = readFileSync('src/pages/sobre.astro', 'utf8');
    const secoes = sobre.split('<section').slice(1);
    const bloco = secoes.find((s) => s.includes('Feito com a vila')) ?? '';
    expect(bloco).toContain('O IgatuBoulder é um festival de escalada em blocos');
  });
});
