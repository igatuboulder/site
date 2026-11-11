// Programação da 14ª edição (texto da proposta 2027, sem dados comerciais).
export interface Dia { dia: string; data: string; titulo: string; atividades: string[] }

export const DIAS: Dia[] = [
  { dia: 'Sex', data: '08.01', titulo: 'Abertura', atividades: [
    'Credenciamento e inscrições', 'Abertura oficial do festival', 'Entrega de kits', 'Caminhada patrimonial', 'Café comunitário',
    'Abertura das ações do IgatuBoulder Social', 'Mutirão de limpeza e conservação', 'Atividades com as crianças da comunidade',
  ] },
  { dia: 'Sáb', data: '09.01', titulo: 'Escalada e festa', atividades: [
    'Atividades de escalada', 'Ações sociais e atendimentos gratuitos', 'Yoga e atividades de bem-estar', 'Roda de capoeira',
    'Workshops e atividades culturais', 'Música e confraternização', 'Festa e sorteio de prêmios',
  ] },
  { dia: 'Dom', data: '10.01', titulo: 'Encerramento', atividades: [
    'Escalada livre', 'Atividades de integração', 'Encerramento do festival',
  ] },
];
