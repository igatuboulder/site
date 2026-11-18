import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { PAGINAS } from '../src/data/navegacao';

describe('página do painel', () => {
  const src = readFileSync('src/pages/painel.astro', 'utf8');
  it('fica fora do Google e fora do menu', () => {
    expect(src).toContain('<meta name="robots" content="noindex, nofollow"');
    expect(PAGINAS.some((p) => p.href.includes('painel'))).toBe(false);
    expect(readFileSync('public/_headers', 'utf8')).toMatch(/\/painel[\s\S]*X-Robots-Tag: noindex/);
  });
  it('mostra o CPF só mascarado', () => {
    expect(src).toContain('cpfMascarado');
    expect(src).not.toMatch(/\.cpf\b(?!\))/);
  });
  it('avisa quando os dados são de demonstração', () => {
    expect(src).toContain('dados inventados');
  });
  it('tem a versão para imprimir a lista de kits', () => {
    expect(src).toContain('@media print');
    expect(src).toContain('window.print()');
    expect(existsSync('src/pages/painel.astro')).toBe(true);
  });
});
