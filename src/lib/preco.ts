import { EVENTO } from '../config/evento';

/** Preço único do passaporte, em centavos. No cartão, a InfinitePay acrescenta a taxa para o comprador. */
export const PRECO_PASSAPORTE = EVENTO.preco;

export function formatarReais(centavos: number): string {
  const [r, c] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${r.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${c}`;
}
