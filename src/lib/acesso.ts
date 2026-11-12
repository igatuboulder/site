// Acesso estimado a pé da praça de Igatu até cada setor, pela rede de trilhas e ruas (ver scripts/gerar-mapa.py).
export interface Acesso { km: number; min: number; desnivel: number }

export function formatarTempo(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

export function formatarAcesso(a: Acesso) {
  return {
    distancia: `~${a.km.toFixed(1).replace('.', ',')} km`,
    tempo: `~${formatarTempo(a.min)} a pé`,
    desnivel: a.desnivel > 0 ? `sobe ${a.desnivel} m` : a.desnivel < 0 ? `desce ${-a.desnivel} m` : 'plano',
  };
}
