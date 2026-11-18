import { describe, it, expect } from 'vitest';
import { detalhePrevia } from '../src/lib/servidor/erro';

describe('detalhePrevia', () => {
  it('mostra o motivo técnico só na prévia', () => {
    const e = new Error('InfinitePay /links 422: {"x":1}');
    expect(detalhePrevia('deploy-preview-18--igatuboulder.netlify.app', e)).toContain('InfinitePay /links 422');
  });
  it('nunca mostra no site de verdade', () => {
    const e = new Error('qualquer coisa');
    expect(detalhePrevia('igatuboulder.netlify.app', e)).toBeUndefined();
    expect(detalhePrevia('igatuboulder.com.br', e)).toBeUndefined();
  });
  it('corta textos longos', () => {
    expect(detalhePrevia('deploy-preview-1--x.netlify.app', new Error('a'.repeat(2000)))!.length).toBeLessThanOrEqual(500);
  });
});
