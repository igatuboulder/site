import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { FOTOS } from '../src/data/fotos';
import { AUTORES, creditoDe } from '../src/data/autores';
import { montarAlbuns } from '../src/lib/fotos';

const daDilma = FOTOS.filter((f) => f.arquivo.startsWith('dilma-'));

describe('fotos da Dilma (21/11)', () => {
  it('Dilma é autora cadastrada, com o Instagram @dilmasantos_igatulands', () => {
    expect(AUTORES.dilma.instagram).toBe('dilmasantos_igatulands');
    expect(creditoDe('dilma')?.link).toBe('https://www.instagram.com/dilmasantos_igatulands/');
  });
  it('as fotos dela entram no site, todas com crédito, texto alternativo e audiodescrição', () => {
    expect(daDilma.length).toBeGreaterThanOrEqual(70);
    for (const f of daDilma) {
      expect(f.autor, f.arquivo).toBe('dilma');
      expect(f.alt.length, f.arquivo).toBeGreaterThan(10);
      expect(f.descricao.length, f.arquivo).toBeGreaterThan(60);
      expect(existsSync(`src/assets/fotos/${f.arquivo}.jpg`), f.arquivo).toBe(true);
    }
  });
  it('não entram as fotos com marca de outro fotógrafo nem o quadro do documentário', () => {
    for (const n of ['dilma-74', 'dilma-75', 'dilma-83']) expect(FOTOS.some((f) => f.arquivo === n), n).toBe(false);
  });
  it('paisagens fora do distrito ficam na galeria "Chapada Diamantina", depois de Igatu', () => {
    const titulos = montarAlbuns(FOTOS).map((a) => a.titulo);
    expect(titulos).toContain('Chapada Diamantina');
    expect(titulos.indexOf('Chapada Diamantina')).toBeGreaterThan(titulos.indexOf('Igatu'));
  });
  it('a capa das galerias que já existiam não muda', () => {
    for (const a of montarAlbuns(FOTOS)) if (a.titulo !== 'Chapada Diamantina') expect(a.capa.arquivo.startsWith('dilma-'), a.titulo).toBe(false);
  });
});
