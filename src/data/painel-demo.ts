// Dados INVENTADOS só para demonstrar o painel antes do banco existir.
// Nenhuma pessoa real: nomes de mentira, sem e-mail, CPFs e telefones fictícios.
import type { Registro } from '../lib/painel';

export const REGISTROS_DEMO: Registro[] = [
  { pedido: 'IGB27-0001', nome: 'Ana Exemplo', cpf: '00000000000', email: '', telefone: '75900000000', camiseta: 'G', status: 'pago', criadoEm: '2026-12-01T10:00:00-03:00', pagoEm: '2026-12-01T10:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0002', nome: 'Bruno Teste', cpf: '00000000113', email: '', telefone: '75900000001', camiseta: 'GG', status: 'pago', criadoEm: '2026-12-02T11:00:00-03:00', pagoEm: '2026-12-02T11:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0003', nome: 'Carla Fictícia', cpf: '00000000226', email: '', telefone: '75900000002', camiseta: 'PP', status: 'pago', criadoEm: '2026-12-03T12:00:00-03:00', pagoEm: '2026-12-03T12:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0004', nome: 'Diego Modelo', cpf: '00000000339', email: '', telefone: '75900000003', camiseta: 'PP', status: 'pendente', criadoEm: '2026-12-04T13:00:00-03:00' },
  { pedido: 'IGB27-0005', nome: 'Elisa Amostra', cpf: '00000000442', email: '', telefone: '75900000004', camiseta: 'PP', status: 'pago', criadoEm: '2026-12-05T14:00:00-03:00', pagoEm: '2026-12-05T14:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0006', nome: 'Fábio Exemplo', cpf: '00000000555', email: '', telefone: '75900000005', camiseta: 'G', status: 'pago', criadoEm: '2026-12-06T15:00:00-03:00', pagoEm: '2026-12-06T15:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0007', nome: 'Gabi Teste', cpf: '00000000668', email: '', telefone: '75900000006', camiseta: 'PP', status: 'pago', criadoEm: '2026-12-07T16:00:00-03:00', pagoEm: '2026-12-07T16:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0008', nome: 'Heitor Modelo', cpf: '00000000771', email: '', telefone: '75900000007', camiseta: 'XG', status: 'pendente', criadoEm: '2026-12-08T17:00:00-03:00' },
  { pedido: 'IGB27-0009', nome: 'Íris Amostra', cpf: '00000000884', email: '', telefone: '75900000008', camiseta: 'GG', status: 'pago', criadoEm: '2026-12-09T18:00:00-03:00', pagoEm: '2026-12-09T18:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0010', nome: 'João Fictício', cpf: '00000000997', email: '', telefone: '75900000009', camiseta: 'P', status: 'pago', criadoEm: '2026-12-10T19:00:00-03:00', pagoEm: '2026-12-10T19:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0011', nome: 'Kátia Exemplo', cpf: '00000001000', email: '', telefone: '75900000010', camiseta: 'M', status: 'pago', criadoEm: '2026-12-11T10:00:00-03:00', pagoEm: '2026-12-11T10:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0012', nome: 'Lucas Teste', cpf: '00000001113', email: '', telefone: '75900000011', camiseta: 'PP', status: 'pago', criadoEm: '2026-12-12T11:00:00-03:00', pagoEm: '2026-12-12T11:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0013', nome: 'Marina Modelo', cpf: '00000001226', email: '', telefone: '75900000012', camiseta: 'XG', status: 'pago', criadoEm: '2026-12-13T12:00:00-03:00', pagoEm: '2026-12-13T12:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0014', nome: 'Nina Amostra', cpf: '00000001339', email: '', telefone: '75900000013', camiseta: 'GG', status: 'pago', criadoEm: '2026-12-14T13:00:00-03:00', pagoEm: '2026-12-14T13:05:00-03:00', valorPago: 16672, forma: 'cartao' },
  { pedido: 'IGB27-0015', nome: 'Otávio Fictício', cpf: '00000001442', email: '', telefone: '75900000014', camiseta: 'PP', status: 'pago', criadoEm: '2026-12-15T14:00:00-03:00', pagoEm: '2026-12-15T14:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0016', nome: 'Paula Exemplo', cpf: '00000001555', email: '', telefone: '75900000015', camiseta: 'GG', status: 'pago', criadoEm: '2026-12-16T15:00:00-03:00', pagoEm: '2026-12-16T15:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0017', nome: 'Rafa Teste', cpf: '00000001668', email: '', telefone: '75900000016', camiseta: 'G', status: 'pago', criadoEm: '2026-12-17T16:00:00-03:00', pagoEm: '2026-12-17T16:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0018', nome: 'Sofia Modelo', cpf: '00000001771', email: '', telefone: '75900000017', camiseta: 'M', status: 'pago', criadoEm: '2026-12-18T17:00:00-03:00', pagoEm: '2026-12-18T17:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0019', nome: 'Tiago Amostra', cpf: '00000001884', email: '', telefone: '75900000018', camiseta: 'M', status: 'pago', criadoEm: '2026-12-19T18:00:00-03:00', pagoEm: '2026-12-19T18:05:00-03:00', valorPago: 16000, forma: 'pix' },
  { pedido: 'IGB27-0020', nome: 'Vera Fictícia', cpf: '00000001997', email: '', telefone: '75900000019', camiseta: 'XG', status: 'pago', criadoEm: '2026-12-20T19:00:00-03:00', pagoEm: '2026-12-20T19:05:00-03:00', valorPago: 16000, forma: 'pix' },
];
