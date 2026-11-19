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
  it('entra com e-mail e senha (sem gastar o limite de e-mails)', () => {
    expect(src).toContain('signInWithPassword');
    expect(src).toMatch(/id="senha-entrar"[^>]*type="password"|type="password"[^>]*id="senha-entrar"/);
    expect(src).toContain('autocomplete="current-password"');
  });
  it('o link no e-mail fica só para o primeiro acesso ou senha esquecida, sem criar conta nova', () => {
    expect(src).toContain('signInWithOtp');
    expect(src).toContain('shouldCreateUser: false');
    expect(src).toMatch(/esqueci|primeiro acesso/i);
  });
  it('quem já entrou pode criar ou trocar a senha, com no mínimo 10 caracteres', () => {
    expect(src).toContain('updateUser({ password');
    expect(src).toContain('autocomplete="new-password"');
    expect(src).toContain('minlength="10"');
    expect(src).toMatch(/length < 10/);
  });
  it('usa só a chave pública no navegador', () => {
    expect(src).not.toMatch(/SECRET|service_role|sb_secret/);
    expect(src).toContain('SUPABASE_PUBLICA');
  });
  it('a demonstração só aparece pedindo ?demo', () => {
    expect(src).toContain("get('demo')");
  });
});
