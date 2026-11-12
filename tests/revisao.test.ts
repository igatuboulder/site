import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Revisão pelas skills de design (Impeccable, UI UX Pro Max, Taste, Stop Slop).

const arquivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });
const fontes = arquivos('src').filter((f) => /\.(astro|ts|css)$/.test(f));
const ler = (f: string) => readFileSync(f, 'utf8');
const css = ler('src/styles/global.css');

const luminancia = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a: string, b: string) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const token = (nome: string) => css.match(new RegExp(`${nome}:\\s*(#[0-9A-Fa-f]{6})`))?.[1] ?? '';

describe('animação suave, sem quique', () => {
  it.each(fontes)('%s não usa elastic, back.out nem curva que passa do ponto', (f) => {
    const c = ler(f);
    expect(c).not.toMatch(/elastic\.|back\.out/);
    expect(c).not.toMatch(/cubic-bezier\([^)]*,\s*1\.\d+\s*\)/);
  });
});

describe('contraste do laranja em texto pequeno', () => {
  it('existe um laranja de texto com contraste AA no papel', () => {
    expect(contraste(token('--laranja-texto'), token('--papel'))).toBeGreaterThanOrEqual(4.5);
  });
  it.each([
    ['src/styles/global.css', /\.link \{[^}]*\}/],
    ['src/pages/programacao.astro', /\.titulo \{[^}]*\}/],
    ['src/pages/setores.astro', /\.n \{[^}]*\}/],
    ['src/pages/como-chegar.astro', /\.n \{[^}]*\}/],
    ['src/pages/como-chegar.astro', /\.km \{[^}]*\}/],
    ['src/pages/fotos.astro', /\.qtd \{[^}]*\}/],
    ['src/components/FormInscricao.astro', /\.erro \{[^}]*\}/],
    ['src/components/MapaSetores.astro', /\.p-n \{[^}]*\}/],
  ])('%s %s usa o laranja de texto', (f, regra) => {
    expect(ler(f).match(regra)?.[0]).toMatch(/var\(--laranja-texto\)/);
  });
});

describe('alvos de toque com 44px no celular', () => {
  const base = ler('src/layouts/Base.astro');
  const toque = base.match(/@media \(pointer: coarse\), \(max-width: 600px\) \{[^\n]*\}/)?.[0] ?? '';
  it.each(['.acess button', '.menu summary', '.inscreva'])('%s tem altura mínima de 44px no toque', (sel) => {
    expect(toque).toContain(sel);
    expect(toque).toMatch(/min-height: 44px/);
  });
  it('a barra de acessibilidade cabe numa linha no celular (rótulo só para leitor de tela)', () => {
    expect(base).toMatch(/\.acess \{ flex-wrap: nowrap/);
    expect(base).toMatch(/\.acess \.rotulo \{ position: absolute; width: 1px/);
  });
});

describe('capa', () => {
  const idx = ler('src/pages/index.astro');
  it('nenhum texto abaixo de 11px', () => {
    expect(idx).not.toMatch(/font-size: (10|9|8)px/);
  });
  it('no celular os cards não reservam altura vazia', () => {
    expect(idx).toMatch(/@media \(max-width: 760px\) \{[^\n]*\.card \{ min-height: 0/);
  });
});
