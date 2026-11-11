// Setores de boulder ao redor de Igatu. Coordenadas públicas (27crags/cragmap, conferidas em 05/11/2026).
// Corredor e Denorex aparecem juntos no 27crags como "Corredor Denorex": os dois usam esse ponto até a organização confirmar.
export interface Setor { nome: string; lat?: number; lon?: number }

export const SETORES: Setor[] = [
  { nome: 'Labirinto', lat: -12.897474, lon: -41.322788 },
  { nome: 'Verruga', lat: -12.893411, lon: -41.324881 },
  { nome: 'Corredor', lat: -12.895079, lon: -41.321039 },
  { nome: 'Denorex', lat: -12.895079, lon: -41.321039 },
  { nome: 'Disco Voador', lat: -12.896773, lon: -41.320975 },
  { nome: 'Besouro', lat: -12.892676, lon: -41.321147 },
  { nome: 'Cemitério', lat: -12.89305, lon: -41.316941 },
  { nome: 'Lagartos', lat: -12.89557, lon: -41.316623 },
  { nome: 'Laranjeiras', lat: -12.901422, lon: -41.316801 },
  { nome: 'Cruzeiro', lat: -12.902352, lon: -41.319774 },
  { nome: 'Califórnia', lat: -12.876614, lon: -41.316909 },
  { nome: 'Coisa Boa', lat: -12.864596, lon: -41.316066 },
  { nome: 'Degredo', lat: -12.872336, lon: -41.289421 },
];

export const linkMapa = (s: Setor) =>
  s.lat == null || s.lon == null ? null : `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}`;
