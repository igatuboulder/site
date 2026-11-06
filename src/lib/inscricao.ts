import { validarCPF } from './cpf';
import { EVENTO } from '../config/evento';
import type { Pagamento } from './preco';

export type Inscricao = {
  nome: string; cpf: string; email: string; telefone: string;
  camiseta: (typeof EVENTO.camisetas)[number]; pagamento: Pagamento; aceite: true;
};
export type Resultado = { ok: true; dados: Inscricao } | { ok: false; erros: Partial<Record<keyof Inscricao, string>> };

export function validarInscricao(entrada: Record<string, unknown>): Resultado {
  const s = (k: string) => (typeof entrada[k] === 'string' ? (entrada[k] as string).trim() : '');
  const erros: Partial<Record<keyof Inscricao, string>> = {};
  const nome = s('nome').replace(/\s+/g, ' ');
  if (nome.split(' ').filter(p => p.length >= 2).length < 2) erros.nome = 'Informe nome e sobrenome.';
  const cpf = s('cpf').replace(/\D/g, '');
  if (!validarCPF(cpf)) erros.cpf = 'CPF inválido.';
  const email = s('email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) erros.email = 'E-mail inválido.';
  const telefone = s('telefone').replace(/\D/g, '');
  if (!/^\d{10,11}$/.test(telefone)) erros.telefone = 'Telefone com DDD, ex.: (75) 98170-7643.';
  const camiseta = s('camiseta').toUpperCase();
  if (!(EVENTO.camisetas as readonly string[]).includes(camiseta)) erros.camiseta = 'Escolha um tamanho de camiseta.';
  const pagamento = s('pagamento');
  if (pagamento !== 'pix' && pagamento !== 'cartao') erros.pagamento = 'Escolha Pix ou cartão.';
  const aceite = entrada.aceite === true || entrada.aceite === 'on' || entrada.aceite === 'true';
  if (!aceite) erros.aceite = 'É preciso aceitar o termo de responsabilidade.';
  if (Object.keys(erros).length) return { ok: false, erros };
  return { ok: true, dados: { nome, cpf, email, telefone, camiseta: camiseta as Inscricao['camiseta'], pagamento: pagamento as Pagamento, aceite: true } };
}
