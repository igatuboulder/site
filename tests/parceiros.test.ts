import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { REALIZACAO, PATROCINIO, APOIOS } from '../src/data/parceiros';

describe('parceiros', () => {
  it('Bendito está entre os apoios', () => {
    expect(APOIOS.map((p) => p.nome)).toContain('Bendito');
  });

  it('toda logo listada existe em public/img/logos', () => {
    for (const p of [...REALIZACAO, ...PATROCINIO, ...APOIOS]) {
      if (p.arquivo) expect(existsSync(`public/img/logos/${p.arquivo}.png`), p.arquivo).toBe(true);
    }
  });

  it('todo parceiro tem nome (vira o texto alternativo da logo)', () => {
    for (const p of [...REALIZACAO, ...PATROCINIO, ...APOIOS]) expect(p.nome.trim()).not.toBe('');
  });
});

describe('destaque de realização e patrocínio no rodapé', () => {
  const ler = async () => (await import('node:fs')).readFileSync('src/layouts/Base.astro', 'utf8');
  const altura = (b: string, sel: string) => Number(b.match(new RegExp(`\\${sel} img \\{ height: (\\d+)px`))?.[1]);

  it('realização e patrocínio ficam bem maiores que os apoios (pelo menos 40%)', async () => {
    const b = await ler();
    expect(b).toMatch(/\['Realização', REALIZACAO, 'realizacao'\]/);
    expect(b).toMatch(/\['Patrocínio', PATROCINIO, 'patrocinio'\]/);
    const apoio = altura(b, '.grupo');
    expect(altura(b, '.realizacao') / apoio).toBeGreaterThanOrEqual(1.4);
    expect(altura(b, '.patrocinio') / apoio).toBeGreaterThanOrEqual(1.4);
  });

  it('patrocínio é o maior de todos', async () => {
    const b = await ler();
    expect(altura(b, '.patrocinio')).toBeGreaterThan(altura(b, '.realizacao'));
  });
});
