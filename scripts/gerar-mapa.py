"""Gera src/data/mapa-setores.json: curvas de nível reais (DEM AWS Terrarium z15) e posição dos setores,
num mapa ilustrativo fora de escala (distorção radial a partir da vila, para os setores próximos caberem).
Uso: python3 scripts/gerar-mapa.py caminho/dem.npz  (o .npz tem el, lats, lons)"""
import json, math, sys, re
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

VILA = (-12.8953, -41.3197)
SETORES = json.loads(open('src/data/setores.json').read())
W, H, M = 1000, 760, 70  # viewBox e margem
EXP = 0.5                # distorção: r' = r^EXP (km)

def km(lat, lon):
    x = (lon - VILA[1]) * 111.32 * math.cos(math.radians(VILA[0]))
    y = (lat - VILA[0]) * 110.57
    return x, y

def dist(x, y):
    r = math.hypot(x, y)
    if r == 0: return 0.0, 0.0
    f = r ** EXP / r
    return x * f, y * f

pts = {s['nome']: dist(*km(s['lat'], s['lon'])) for s in SETORES}
xs = [p[0] for p in pts.values()] + [0]; ys = [p[1] for p in pts.values()] + [0]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
esc = min((W - 2 * M) / (maxx - minx), (H - 2 * M) / (maxy - miny))
ox = (W - (maxx - minx) * esc) / 2; oy = (H - (maxy - miny) * esc) / 2
def tela(dx, dy):
    return round(ox + (dx - minx) * esc, 1), round(oy + (maxy - dy) * esc, 1)

d = np.load(sys.argv[1]); el, lats, lons = d['el'], d['lats'], d['lons']
LON, LAT = np.meshgrid(lons, lats)
# suaviza um pouco o relevo (fica mais "desenhado")
from numpy.lib.stride_tricks import sliding_window_view as swv
k = 5; pad = np.pad(el, k // 2, mode='edge'); el = swv(pad, (k, k)).mean(axis=(2, 3))
cs = plt.contour(LON, LAT, el, levels=np.arange(400, 1160, 30))
curvas = []
for nivel, segs in zip(cs.levels, cs.allsegs):
    for seg in segs:
        if len(seg) < 40: continue
        out = []
        for lon, lat in seg[::7]:
            X, Y = tela(*dist(*km(lat, lon)))
            if -40 <= X <= W + 40 and -40 <= Y <= H + 40: out.append((X, Y))
            elif out:
                if len(out) > 4: curvas.append((int(nivel), out))
                out = []
        if len(out) > 4: curvas.append((int(nivel), out))
paths = []
for nivel, pts_ in curvas:
    dpath = 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pts_)
    paths.append({'n': nivel, 'd': dpath})
vila = tela(0, 0)
res = {'w': W, 'h': H, 'vila': vila, 'setores': {n: tela(*p) for n, p in pts.items()}, 'curvas': paths}
open('src/data/mapa-setores.json', 'w').write(json.dumps(res, ensure_ascii=False, separators=(',', ':')))
print(len(paths), 'curvas', sum(len(p['d']) for p in paths) // 1024, 'KB', res['setores'])
