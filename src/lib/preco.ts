import { EVENTO } from '../config/evento';
export type Pagamento = 'pix' | 'cartao';

/** Taxa da InfinitePay no cartão à vista (checkout integrado, recebimento D+1). */
export const TAXA_CARTAO = 0.042;

/** Menor valor em reais redondos que, descontada a taxa, entrega ao festival o valor do Pix. */
function precoCartao(pix: number): number {
  return Math.ceil(pix / (1 - TAXA_CARTAO) / 100) * 100;
}

export function precoEmCentavos(p: Pagamento): number {
  if (p === 'pix') return EVENTO.precoPix;
  if (p === 'cartao') return precoCartao(EVENTO.precoPix);
  throw new Error(`Forma de pagamento inválida: ${p}`);
}

export function formatarReais(centavos: number): string {
  const [r, c] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${r.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${c}`;
}
