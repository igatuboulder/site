import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { FOTOS, fotoPorArquivo } from '../src/data/fotos';

describe('audiodescrição das fotos', () => {
  it('toda foto tem texto alternativo curto e uma audiodescrição completa', () => {
    for (const f of FOTOS) {
      expect(f.alt.trim().length, f.arquivo).toBeGreaterThan(10);
      expect(f.alt.length, f.arquivo).toBeLessThanOrEqual(125);
      expect(f.descricao.trim().length, f.arquivo).toBeGreaterThanOrEqual(80);
    }
  });

  it('nenhuma foto da pasta fica sem descrição', () => {
    const arquivos = readdirSync('src/assets/fotos').filter((a) => a.endsWith('.jpg')).map((a) => a.replace('.jpg', ''));
    for (const a of arquivos) expect(fotoPorArquivo(a), a).toBeDefined();
  });

  it('fotoPorArquivo acha pelo nome do arquivo', () => {
    expect(fotoPorArquivo('IMG_1092')?.secao).toBe('festival');
    expect(fotoPorArquivo('nao-existe')).toBeUndefined();
  });
});
