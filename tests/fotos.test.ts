import { describe, it, expect } from 'vitest';
import { agruparFotos, type Foto } from '../src/lib/fotos';

const f = (arquivo: string, secao: Foto['secao'], setor?: string): Foto => ({ arquivo, secao, setor, alt: arquivo, descricao: arquivo });

describe('agruparFotos', () => {
  it('separa as seções na ordem: Social, Escalada, Festival', () => {
    const r = agruparFotos([f('a', 'festival'), f('b', 'escalada'), f('c', 'social')]);
    expect(r.map((s) => s.secao)).toEqual(['social', 'escalada', 'festival']);
  });

  it('agrupa a escalada por setor, com as fotos sem setor no fim', () => {
    const r = agruparFotos([f('a', 'escalada'), f('b', 'escalada', 'Labirinto'), f('c', 'escalada', 'Cemitério'), f('d', 'escalada', 'Labirinto')]);
    const esc = r.find((s) => s.secao === 'escalada')!;
    expect(esc.grupos.map((g) => g.setor)).toEqual(['Labirinto', 'Cemitério', null]);
    expect(esc.grupos[0].fotos.map((x) => x.arquivo)).toEqual(['b', 'd']);
  });

  it('não cria seção vazia', () => {
    const r = agruparFotos([f('a', 'social')]);
    expect(r).toHaveLength(1);
  });
});
