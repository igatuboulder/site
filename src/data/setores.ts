// Setores de boulder ao redor de Igatu. Coordenadas públicas (27crags/cragmap, conferidas em 05/11/2026).
// Denorex é um boulder do setor Corredor (confirmado pela organização em 13/11/2026), não um setor.
// As coordenadas ficam em setores.json (lidas também por scripts/gerar-mapa.py).
// boulders/destaques: preencher com dados da organização ou do Guia Igatu Boulder (não inventar).
export interface Destaque { nome: string; grau: string }
export interface Setor { nome: string; lat?: number; lon?: number; boulders?: number; destaques?: Destaque[] }

import dados from './setores.json';

export const SETORES: Setor[] = dados;

// Ordem da trilha desenhada no mapa ilustrado (sai da vila e passa por todos os setores).
export const ORDEM_TRILHA = ['Cemitério', 'Lagartos', 'Laranjeiras', 'Cruzeiro', 'Disco Voador', 'Labirinto', 'Verruga', 'Corredor', 'Besouro', 'Califórnia', 'Coisa Boa', 'Degredo'];

