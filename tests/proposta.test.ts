import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { EVENTO } from '../src/config/evento';
import { DIAS } from '../src/data/programacao';

describe('datas da 14ª edição (proposta 2027)', () => {
  it('é de 8 a 10 de janeiro, sexta a domingo', () => {
    expect(EVENTO.datas).toBe('08 a 10 de janeiro de 2027');
    expect(EVENTO.dias).toBe('sex · sáb · dom');
  });

  it('a programação tem os três dias certos, cada um com atividades', () => {
    expect(DIAS.map((d) => [d.dia, d.data])).toEqual([['Sex', '08.01'], ['Sáb', '09.01'], ['Dom', '10.01']]);
    for (const d of DIAS) expect(d.atividades.length).toBeGreaterThan(1);
  });
});

describe('sigilo da proposta comercial', () => {
  const arquivos = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : /\.(astro|ts|md|json)$/.test(n) ? [p] : [];
  });
  const fonte = arquivos('src').map((p) => readFileSync(p, 'utf8')).join('\n');

  it('não publica valores de patrocínio (nenhum valor de R$ 1.000 para cima)', () => {
    expect(fonte).not.toMatch(/R\$\s?\d{1,3}\.\d{3}/);
    expect(fonte).not.toMatch(/\bcotas?\b/i);
    expect(fonte).not.toMatch(/contrapartida/i);
  });

  it('não exibe e-mails (o único fica só na configuração, fora das páginas)', () => {
    const semConfig = fonte.replace(/email: '[^']+'/, '');
    expect(semConfig).not.toMatch(/[\w.]+@[\w]+\.[a-z]/i);
  });
});
