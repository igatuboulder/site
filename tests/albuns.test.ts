import { describe, it, expect } from 'vitest';
import { montarAlbuns, type Foto } from '../src/lib/fotos';

const f = (arquivo: string, secao: Foto['secao'], extra: Partial<Foto> = {}): Foto => ({ arquivo, secao, alt: arquivo, descricao: arquivo, ...extra });

describe('montarAlbuns (galerias da página Fotos)', () => {
  it('um álbum por seção, na ordem Social, Escalada, Festival', () => {
    const r = montarAlbuns([f('a', 'festival'), f('b', 'escalada'), f('c', 'social')]);
    expect(r.map((a) => a.titulo)).toEqual(['IgatuBoulder Social', 'Escalada', 'O festival']);
  });

  it('escalada com setor vira um álbum por setor; as sem setor ficam em "Escalada"', () => {
    const r = montarAlbuns([f('a', 'escalada'), f('b', 'escalada', { setor: 'Labirinto' }), f('c', 'escalada', { setor: 'Labirinto' })]);
    expect(r.map((a) => a.titulo)).toEqual(['Setor Labirinto', 'Escalada']);
    expect(r[0].fotos.map((x) => x.arquivo)).toEqual(['b', 'c']);
  });

  it('a capa é a foto marcada como capa, ou a primeira', () => {
    expect(montarAlbuns([f('a', 'social'), f('b', 'social', { capa: true })])[0].capa.arquivo).toBe('b');
    expect(montarAlbuns([f('a', 'social'), f('b', 'social')])[0].capa.arquivo).toBe('a');
  });

  it('id do álbum serve de âncora (sem acento nem espaço)', () => {
    const r = montarAlbuns([f('a', 'escalada', { setor: 'Coisa Boa' }), f('b', 'social')]);
    expect(r.map((a) => a.id)).toEqual(['social', 'setor-coisa-boa']);
  });
});
