import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const arquivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? arquivos(p) : [p]; });

describe('logo principal', () => {
  const base = readFileSync('src/layouts/Base.astro', 'utf8');
  it('o topo do site usa o logo IgatuBoulder Festival', () => {
    const nav = base.slice(base.indexOf('<nav'), base.indexOf('</nav>'));
    expect(nav).toContain('/img/logos/igatuboulder.png');
  });
  it('a ID que veio do Instagram não aparece em nenhuma página', () => {
    const onde = arquivos('src').filter((p) => /\.(astro|ts|css)$/.test(p) && readFileSync(p, 'utf8').includes('id-ig'));
    expect(onde).toEqual([]);
  });
});
