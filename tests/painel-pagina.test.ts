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

describe('acesso ao painel', () => {
  const src = readFileSync('src/pages/painel.astro', 'utf8');
  it('entra por link no e-mail, sem criar conta nova', () => {
    expect(src).toContain('signInWithOtp');
    expect(src).toContain('shouldCreateUser: false');
  });
  it('usa só a chave pública no navegador', () => {
    expect(src).not.toMatch(/SECRET|service_role|sb_secret/);
    expect(src).toContain('SUPABASE_PUBLICA');
  });
  it('a demonstração só aparece pedindo ?demo', () => {
    expect(src).toContain("get('demo')");
  });
});
