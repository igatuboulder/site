import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { ehPrevia, segredos } from '../src/lib/servidor/hospedagem';

describe('hospedagem no Cloudflare', () => {
  it('usa o adaptador do Cloudflare, não o da Netlify', () => {
    const cfg = readFileSync('astro.config.mjs', 'utf8');
    expect(cfg).toMatch(/@astrojs\/cloudflare/);
    expect(cfg).not.toMatch(/@astrojs\/netlify/);
    expect(readFileSync('package.json', 'utf8')).not.toMatch(/@astrojs\/netlify/);
  });
  it('não deixa a Netlify publicar sozinha (gasta crédito e quebraria o site)', () => {
    expect(existsSync('netlify.toml')).toBe(false);
  });
  it('mantém cabeçalhos e redirecionamentos (o Cloudflare lê os mesmos arquivos)', () => {
    expect(existsSync('public/_headers')).toBe(true);
    expect(readFileSync('public/_redirects', 'utf8')).toMatch(/\/a-vila\s+\/igatu\s+301/);
  });
});

describe('ehPrevia', () => {
  it('reconhece prévias do Cloudflare e da Netlify', () => {
    expect(ehPrevia('abc123.igatuboulder.pages.dev')).toBe(true);
    expect(ehPrevia('teste-pagamento.igatuboulder.pages.dev')).toBe(true);
    expect(ehPrevia('deploy-preview-18--igatuboulder.netlify.app')).toBe(true);
  });
  it('nunca trata o site oficial como prévia', () => {
    expect(ehPrevia('igatuboulder.com.br')).toBe(false);
    expect(ehPrevia('www.igatuboulder.com.br')).toBe(false);
    expect(ehPrevia('igatuboulder.pages.dev')).toBe(false);
    expect(ehPrevia('igatuboulder.netlify.app')).toBe(false);
    expect(ehPrevia('x.pages.dev.golpe.com')).toBe(false);
  });
});

describe('segredos', () => {
  it('lê as chaves do Cloudflare (locals.runtime.env)', () => {
    const s = segredos({ runtime: { env: { SUPABASE_SECRET_KEY: 'cf' } } }, {});
    expect(s.SUPABASE_SECRET_KEY).toBe('cf');
  });
  it('cai para process.env quando não há runtime (testes, dev)', () => {
    expect(segredos(undefined, { SUPABASE_SECRET_KEY: 'node' }).SUPABASE_SECRET_KEY).toBe('node');
  });
  it('o Cloudflare tem prioridade', () => {
    expect(segredos({ runtime: { env: { A: 'cf' } } }, { A: 'node' }).A).toBe('cf');
  });
  it('ignora valores que não são texto (bindings)', () => {
    expect(segredos({ runtime: { env: { ASSETS: { fetch() {} } } } }, {}).ASSETS).toBeUndefined();
  });
});

describe('página não encontrada', () => {
  it('existe 404 (sem ela o Cloudflare mostraria a capa com status 200)', () => {
    expect(existsSync('src/pages/404.astro')).toBe(true);
    expect(readFileSync('src/pages/404.astro', 'utf8')).toMatch(/href="\/"/);
  });
});
