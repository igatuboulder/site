import { EVENTO } from '../config/evento';
export type Pagamento = 'pix' | 'cartao';
export function precoEmCentavos(p: Pagamento): number {
  if (!(p in EVENTO.precos)) throw new Error(`Forma de pagamento inválida: ${p}`);
  return EVENTO.precos[p];
}
export function formatarReais(centavos: number): string {
  const [r, c] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${r.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${c}`;
}
