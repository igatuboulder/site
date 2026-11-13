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

describe('destaque do patrocínio no rodapé', () => {
  it('logo do patrocínio fica 10 a 15% maior que os demais', async () => {
    const { readFileSync } = await import('node:fs');
    const b = readFileSync('src/layouts/Base.astro', 'utf8');
    expect(b).toMatch(/\['Patrocínio', PATROCINIO, 'patrocinio'\]/);
    const base = Number(b.match(/\.grupo img \{ height: (\d+)px/)?.[1]);
    const pat = Number(b.match(/\.patrocinio img \{ height: (\d+)px/)?.[1]);
    expect(pat / base).toBeGreaterThanOrEqual(1.1);
    expect(pat / base).toBeLessThanOrEqual(1.15);
  });
});
