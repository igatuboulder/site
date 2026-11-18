import { describe, it, expect } from 'vitest';
const ANTIGO = 'd80045b3a06fcf7473089def33bf22dfa5c22bc7'; // favicon com a ID do Instagram
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

describe('favicon', () => {
  it('é o escalador do logo novo, não a ID do Instagram (mudou de tamanho e cor)', async () => {
    const { createHash } = await import('node:crypto');
    const h = createHash('sha1').update(readFileSync('public/favicon.png')).digest('hex');
    expect(h).not.toBe(ANTIGO);
  });
});
