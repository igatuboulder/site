// Regras do painel da organização (inscritos pagos e pendentes, lista de entrega de kits).
// Os dados reais vêm do banco depois do login; aqui só ficam as contas.
import { EVENTO } from '../config/evento';

export type Status = 'pago' | 'pendente';
export type Camiseta = (typeof EVENTO.camisetas)[number];
export interface Registro {
  pedido: string; nome: string; cpf: string; email: string; telefone: string;
  camiseta: Camiseta; status: Status; criadoEm: string; pagoEm?: string;
  valorPago?: number; // centavos, o que entrou de fato
  forma?: 'pix' | 'cartao';
}

export function resumir(lista: Registro[]) {
  const pagos = lista.filter((x) => x.status === 'pago');
  const camisetas = Object.fromEntries(EVENTO.camisetas.map((t) => [t, 0])) as Record<Camiseta, number>;
  for (const p of pagos) camisetas[p.camiseta]++;
  return {
    total: lista.length,
    pagos: pagos.length,
    pendentes: lista.length - pagos.length,
    arrecadado: pagos.reduce((s, p) => s + (p.valorPago ?? 0), 0),
    camisetas,
  };
}

const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export function filtrar(lista: Registro[], o: { status?: Status | 'todos'; busca?: string }) {
  const q = normalizar(o.busca ?? '');
  const digitos = q.replace(/\D/g, '');
  return lista.filter((x) => {
    if (o.status && o.status !== 'todos' && x.status !== o.status) return false;
    if (!q) return true;
    return normalizar(x.nome).includes(q) || normalizar(x.pedido).includes(q) || normalizar(x.email).includes(q)
      || (digitos.length >= 3 && x.cpf.endsWith(digitos));
  });
}

export const porNome = (a: Registro, b: Registro) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });

export function listaKits(lista: Registro[]) {
  return lista.filter((x) => x.status === 'pago').sort(porNome);
}

export function cpfMascarado(cpf: string) {
  const d = cpf.replace(/\D/g, '');
  return `•••.•••.•${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

export function linkCobranca(x: Registro) {
  const primeiro = x.nome.split(' ')[0];
  const msg = `Oi, ${primeiro}! Aqui é da organização do ${EVENTO.nome} ${EVENTO.ano}. Vimos que sua inscrição (pedido ${x.pedido}) ainda está com o pagamento pendente. Precisa de ajuda para concluir?`;
  return `https://wa.me/55${x.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
}
