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

describe('Km10 com ainda mais destaque e links das marcas', () => {
  it('logo da Km10 tem pelo menos 1,9× a altura dos apoios', async () => {
    const b = (await import('node:fs')).readFileSync('src/layouts/Base.astro', 'utf8');
    const apoio = Number(b.match(/\.grupo img \{ height: (\d+)px/)?.[1]);
    const pat = Number(b.match(/\.patrocinio img \{ height: (\d+)px/)?.[1]);
    expect(pat / apoio).toBeGreaterThanOrEqual(1.9);
  });

  it('link de parceiro, quando existe, é https', () => {
    for (const p of [...REALIZACAO, ...PATROCINIO, ...APOIOS]) if (p.link) expect(p.link, p.nome).toMatch(/^https:\/\//);
  });

  it('o rodapé transforma a logo em link para a marca, abrindo em outra aba', async () => {
    const b = (await import('node:fs')).readFileSync('src/layouts/Base.astro', 'utf8');
    expect(b).toMatch(/href=\{p\.link\}/);
    expect(b).toMatch(/target="_blank" rel="noopener"/);
  });
});

describe('parceiros em negociação ficam fora do site', () => {
  it('Fullgrip não aparece por enquanto', () => {
    expect([...REALIZACAO, ...PATROCINIO, ...APOIOS].map((p) => p.nome)).not.toContain('Fullgrip');
  });
});

describe('Instagram centralizado embaixo do patrocínio', () => {
  it('a base do rodapé usa as mesmas colunas dos parceiros e centraliza o Instagram', async () => {
    const b = (await import('node:fs')).readFileSync('src/layouts/Base.astro', 'utf8');
    const cols = 'grid-template-columns: var(--col-realizacao) var(--col-patrocinio) minmax(0, 1fr)';
    expect(b.match(/\.parceiros \{[^}]*\}/)?.[0]).toContain(cols);
    expect(b.match(/\.base \{[^}]*\}/)?.[0]).toContain(cols);
    expect(b).toMatch(/\.col-ig \{ text-align: center; \}/);
  });
});
