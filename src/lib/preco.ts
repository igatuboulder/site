import { EVENTO } from '../config/evento';
import { ehPrevia } from './servidor/hospedagem';

/** Preço único do passaporte, em centavos. No cartão, a InfinitePay acrescenta a taxa para o comprador. */
export const PRECO_PASSAPORTE = EVENTO.preco;

export function formatarReais(centavos: number): string {
  const [r, c] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${r.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${c}`;
}

/** Preço que vale nesta requisição. O preço de teste (PRECO_TESTE_CENTAVOS) só vale numa prévia
 *  (deploy-preview-…); no site oficial é sempre o preço real. Mínimo R$ 1, máximo o preço real. */
export function precoVigente(env: Record<string, string | undefined>, host: string): number {
  const teste = Number(env.PRECO_TESTE_CENTAVOS);
  if (!ehPrevia(host) || !Number.isInteger(teste) || teste <= 0) return PRECO_PASSAPORTE;
  return Math.min(PRECO_PASSAPORTE, Math.max(100, teste));
}
