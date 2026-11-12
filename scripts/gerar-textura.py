"""Gera public/img/curvas-textura.svg: curvas de nível que emendam nas bordas (ladrilho sem costura),
para usar como textura de fundo nas seções bege. Relevo sintético periódico (soma de ondas inteiras).
Uso: python3 scripts/gerar-textura.py"""
import numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
L, N = 900, 220  # tamanho do ladrilho (px) e resolução da grade
rng = np.random.default_rng(14)
x = np.linspace(0, 1, N, endpoint=False); X, Y = np.meshgrid(x, x)
z = np.zeros_like(X)
for _ in range(26):  # ondas com frequências inteiras -> periódico no ladrilho
    kx, ky = rng.integers(-4, 5, 2)
    if kx == 0 and ky == 0: continue
    amp = 1 / (kx * kx + ky * ky) ** 0.8
    z += amp * np.cos(2 * np.pi * (kx * X + ky * Y) + rng.uniform(0, 2 * np.pi))
# grade 3x3 para as linhas atravessarem a borda sem corte
Z = np.tile(z, (3, 3)); xx = np.linspace(-1, 2, 3 * N, endpoint=False); XX, YY = np.meshgrid(xx, xx)
cs = plt.contour(XX, YY, Z, levels=np.linspace(z.min(), z.max(), 30)[1:-1])
paths = []
for i, segs in enumerate(cs.allsegs):
    for seg in segs:
        runs, run = [], []
        for px, py in seg:  # quebra o traço onde ele sai do ladrilho
            if -0.03 <= px <= 1.03 and -0.03 <= py <= 1.03: run.append((px, py))
            elif run: runs.append(run); run = []
        if run: runs.append(run)
        for r in runs:
            if len(r) < 3: continue
            r = r[::2] + ([r[-1]] if len(r) % 2 == 0 else [])
            d = 'M' + ' L'.join(f'{px * L:.0f} {py * L:.0f}' for px, py in r)
            paths.append((i % 5 == 0, d))
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{L}" height="{L}" viewBox="0 0 {L} {L}" fill="none" stroke="#22362A" stroke-opacity=".12" stroke-linecap="round" stroke-linejoin="round">']
for mestra, d in paths:
    svg.append(f'<path d="{d}" stroke-width="{1.4 if mestra else 0.8}"/>')
svg.append('</svg>')
open('public/img/curvas-textura.svg', 'w').write('\n'.join(svg))
print(len(paths), 'linhas', sum(len(p[1]) for p in paths) // 1024, 'KB')
