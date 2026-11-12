// Caminho SVG suave (Catmull-Rom → Bézier) passando por todos os pontos, para a trilha do mapa.
export type Ponto = [number, number];

const r = (n: number) => Math.round(n * 10) / 10;

export function trilha(pontos: Ponto[], tensao = 0.5): string {
  const p = pontos.filter((q, i) => i === 0 || q[0] !== pontos[i - 1][0] || q[1] !== pontos[i - 1][1]);
  if (p.length === 0) return '';
  let d = `M${r(p[0][0])} ${r(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] ?? p2;
    const c1: Ponto = [p1[0] + (p2[0] - p0[0]) * tensao / 3, p1[1] + (p2[1] - p0[1]) * tensao / 3];
    const c2: Ponto = [p2[0] - (p3[0] - p1[0]) * tensao / 3, p2[1] - (p3[1] - p1[1]) * tensao / 3];
    d += ` C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}
