// Setores de boulder ao redor de Igatu. Coordenadas públicas (27crags/cragmap, conferidas em 05/11/2026).
// Corredor e Denorex aparecem juntos no 27crags como "Corredor Denorex": os dois usam esse ponto até a organização confirmar.
// As coordenadas ficam em setores.json (lidas também por scripts/gerar-mapa.py).
// boulders/destaques: preencher com dados da organização ou do Guia Igatu Boulder (não inventar).
export interface Destaque { nome: string; grau: string }
export interface Setor { nome: string; lat?: number; lon?: number; boulders?: number; destaques?: Destaque[] }

import dados from './setores.json';

export const SETORES: Setor[] = dados;

// Ordem da trilha desenhada no mapa ilustrado (sai da vila e passa por todos os setores).
export const ORDEM_TRILHA = ['Cemitério', 'Lagartos', 'Laranjeiras', 'Cruzeiro', 'Disco Voador', 'Labirinto', 'Verruga', 'Corredor', 'Denorex', 'Besouro', 'Califórnia', 'Coisa Boa', 'Degredo'];

