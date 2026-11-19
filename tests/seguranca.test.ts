import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const h = readFileSync('public/_headers', 'utf8');

describe('cabeçalhos de segurança em todas as páginas', () => {
  it('vale para o site inteiro', () => { expect(h).toMatch(/^\/\*\s*$/m); });
  it('não deixa outro site embutir o nosso (golpe de clique)', () => { expect(h).toMatch(/X-Frame-Options: DENY/); });
  it('navegador não adivinha tipo de arquivo', () => { expect(h).toMatch(/X-Content-Type-Options: nosniff/); });
  it('não vaza endereço completo para outros sites', () => { expect(h).toMatch(/Referrer-Policy: strict-origin-when-cross-origin/); });
  it('sempre HTTPS', () => { expect(h).toMatch(/Strict-Transport-Security: max-age=\d+/); });
  it('sem câmera, microfone nem localização', () => { expect(h).toMatch(/Permissions-Policy: .*camera=\(\).*microphone=\(\).*geolocation=\(\)/); });
});
