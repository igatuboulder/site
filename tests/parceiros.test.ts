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
