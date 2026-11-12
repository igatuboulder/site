"""Gera src/data/mapa-setores.json: curvas de nível reais (DEM AWS Terrarium z15) e posição dos setores,
num mapa ilustrativo fora de escala (distorção radial a partir da vila, para os setores próximos caberem).
Também desenha rios, trilhas, estradas e pontos de referência (extrato do OpenStreetMap) e estima o
acesso a pé até cada setor pela rede de trilhas e ruas (Dijkstra + tempo de Tobler com o relevo, +25% de folga).
Uso: python3 scripts/gerar-mapa.py caminho/dem.npz caminho/osm_igatu.json  (o .npz tem el, lats, lons)"""
import json, math, sys, re, heapq
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

# ---------- OpenStreetMap: rios, trilhas, estradas, pontos ----------
osm = json.load(open(sys.argv[2]))
def proj(lat, lon): return tela(*dist(*km(lat, lon)))
def linha(geom, passo=1):
    pts_ = [proj(g['lat'], g['lon']) for g in geom[::passo]] + [proj(geom[-1]['lat'], geom[-1]['lon'])]
    return 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pts_)
rios, trilhas, estradas = [], [], []
for e in osm['elements']:
    t = e.get('tags', {})
    if e['type'] != 'way' or 'geometry' not in e: continue
    if t.get('waterway') in ('river', 'stream'):
        rios.append({'d': linha(e['geometry']), 'rio': t.get('waterway') == 'river', 'nome': t.get('name')})
    elif t.get('highway') in ('path', 'footway', 'track'):
        trilhas.append(linha(e['geometry']))
    elif t.get('highway') in ('tertiary', 'unclassified') and 'Acesso' in t.get('name', ''):
        estradas.append(linha(e['geometry']))
PONTOS = {  # nome no OSM -> rótulo no mapa, tipo do ícone
    'Igreja e Cemitério Gótico': ('Cemitério gótico', 'igreja'),
    'Machu Pichu Bahiana': ('Ruínas do garimpo', 'ruina'),
    'Cachoeira dos Pombos': ('Cachoeira dos Pombos', 'agua'),
    'Gruta do Brejo / Gruna do Brejo / Mina': ('Gruna do Brejo', 'gruta'),
}
pontos = []
for e in osm['elements']:
    n = e.get('tags', {}).get('name')
    if e['type'] == 'node' and n in PONTOS:
        x, y = proj(e['lat'], e['lon']); pontos.append({'nome': PONTOS[n][0], 'tipo': PONTOS[n][1], 'x': x, 'y': y})

# ---------- acesso a pé: menor caminho pela rede de trilhas e ruas ----------
def hv(a, b):
    p1, p2 = map(math.radians, (a[0], b[0])); dl = math.radians(b[1] - a[1])
    h = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))
el0, lats0, lons0 = d['el'], d['lats'], d['lons']
def alt(p): return float(el0[np.abs(lats0 - p[0]).argmin(), np.abs(lons0 - p[1]).argmin()])
nos, G = {}, {}
for e in osm['elements']:
    if e['type'] == 'way' and 'highway' in e.get('tags', {}) and 'geometry' in e:
        for n, g in zip(e['nodes'], e['geometry']): nos[n] = (g['lat'], g['lon'])
        for a, b in zip(e['nodes'], e['nodes'][1:]):
            w = hv(nos[a], nos[b]); G.setdefault(a, []).append((b, w)); G.setdefault(b, []).append((a, w))
CENTRO = (-12.89636, -41.31871)  # praça da vila (place=village no OSM)
src = min(G, key=lambda n: hv(nos[n], CENTRO)); D = {src: 0}; prev = {}; fila = [(0, src)]
while fila:
    dd, u = heapq.heappop(fila)
    if dd > D[u]: continue
    for v, w in G[u]:
        if dd + w < D.get(v, 1e9): D[v] = dd + w; prev[v] = u; heapq.heappush(fila, (dd + w, v))
acessos = {}
for s_ in SETORES:
    p = (s_['lat'], s_['lon']); n = min(D, key=lambda k: hv(nos[k], p)); gap = hv(nos[n], p)
    cam = [p]; k = n
    while True:
        cam.append(nos[k])
        if k == src: break
        k = prev[k]
    cam = cam[::-1]; t = 0.0
    for a, b in zip(cam, cam[1:]):
        dx = hv(a, b)
        if dx < 1e-4: continue
        t += dx / (6 * math.exp(-3.5 * abs((alt(b) - alt(a)) / (dx * 1000) + 0.05)))
    minutos = max(5, int(math.ceil(t * 60 * 1.25 / 5) * 5))
    acessos[s_['nome']] = {'km': round(D[n] + gap * 1.3, 1), 'min': minutos, 'desnivel': int(round((alt(p) - alt(CENTRO)) / 5) * 5)}

res = {'w': W, 'h': H, 'vila': vila, 'setores': {n: tela(*p) for n, p in pts.items()}, 'curvas': paths,
       'rios': rios, 'trilhas': trilhas, 'estradas': estradas, 'pontos': pontos, 'acessos': acessos}
open('src/data/mapa-setores.json', 'w').write(json.dumps(res, ensure_ascii=False, separators=(',', ':')))
print(len(paths), 'curvas', len(rios), 'rios', len(trilhas), 'trilhas', len(pontos), 'pontos'); print(json.dumps(acessos, ensure_ascii=False, indent=0))
