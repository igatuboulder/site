import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { FOTOS } from '../src/data/fotos';
import { AUTORES, creditoDe } from '../src/data/autores';
import { montarAlbuns } from '../src/lib/fotos';

const arquivos = readdirSync('src/assets/fotos').map((f) => f.replace(/\.jpg$/, ''));

describe('autoria das fotos', () => {
  it('Pedro P. está cadastrado com o Instagram @pdr.rn', () => {
    expect(AUTORES.pedro).toEqual({ nome: 'Pedro P.', instagram: 'pdr.rn' });
  });

  it('nenhuma foto do Pedro (arquivo pp-*) fica sem autor, nem no cadastro nem nos arquivos', () => {
    const doPedro = arquivos.filter((a) => a.startsWith('pp-'));
    expect(doPedro.length).toBeGreaterThan(10);
    for (const a of doPedro) {
      const f = FOTOS.find((x) => x.arquivo === a);
      expect(f, `${a} sem cadastro`).toBeDefined();
      expect(f!.autor, `${a} sem autor`).toBe('pedro');
    }
  });

  it('toda foto cadastrada tem arquivo, audiodescrição e, se tiver autor, um autor conhecido', () => {
    for (const f of FOTOS) {
      expect(arquivos, f.arquivo).toContain(f.arquivo);
      expect(f.descricao.length).toBeGreaterThan(40);
      if (f.autor) expect(AUTORES[f.autor]).toBeDefined();
    }
  });

  it('monta o crédito "Foto: Nome (@insta)"', () => {
    expect(creditoDe('pedro')).toEqual({ texto: 'Foto: Pedro P.', instagram: '@pdr.rn', link: 'https://www.instagram.com/pdr.rn/' });
    expect(creditoDe(undefined)).toBeNull();
  });

  it('o crédito aparece na foto do site e no visor da galeria', () => {
    expect(readFileSync('src/components/FotoAD.astro', 'utf8')).toMatch(/class="credito"/);
    expect(readFileSync('src/pages/fotos.astro', 'utf8')).toMatch(/v-credito/);
  });

  it('existe a galeria "A vila"', () => {
    expect(montarAlbuns(FOTOS).map((a) => a.titulo)).toContain('A vila');
  });
});

describe('fotos do Pedro espalhadas pelo site', () => {
  const paginas = ['a-vila', 'como-chegar', 'setores', 'programacao', 'historia', 'sobre'];
  for (const p of paginas) {
    it(`${p} mostra pelo menos uma foto do Pedro`, () => {
      expect(readFileSync(`src/pages/${p}.astro`, 'utf8')).toMatch(/pp-[a-z0-9-]+/);
    });
  }
});
