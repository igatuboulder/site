import { describe, it, expect } from 'vitest';
import { dividirEmTrechos } from '../src/lib/leitura';

describe('dividirEmTrechos (leitor em voz alta)', () => {
  it('quebra por frase sem passar do limite', () => {
    const t = 'Primeira frase curta. Segunda frase também curta! Terceira? Sim.';
    const r = dividirEmTrechos(t, 30);
    expect(r.every((x) => x.length <= 30)).toBe(true);
    expect(r.join(' ')).toBe(t);
  });

  it('junta frases curtas no mesmo trecho', () => {
    expect(dividirEmTrechos('Oi. Tudo bem? Sim.', 100)).toEqual(['Oi. Tudo bem? Sim.']);
  });

  it('quebra uma frase longa por palavras', () => {
    const r = dividirEmTrechos('palavra '.repeat(20).trim(), 30);
    expect(r.every((x) => x.length <= 30)).toBe(true);
    expect(r.join(' ')).toBe('palavra '.repeat(20).trim());
  });

  it('normaliza espaços e ignora texto vazio', () => {
    expect(dividirEmTrechos('  a\n\n  b  ', 100)).toEqual(['a b']);
    expect(dividirEmTrechos('   ', 100)).toEqual([]);
  });
});
