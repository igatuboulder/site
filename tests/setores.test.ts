import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PAGINAS } from '../src/data/navegacao';
import { SETORES, ORDEM_TRILHA } from '../src/data/setores';
import mapa from '../src/data/mapa-setores.json';
import { trilha } from '../src/lib/trilha';

describe('aba Setores', () => {
  it('fica no menu entre Como chegar e Contato', () => {
    const r = PAGINAS.map((p) => p.rotulo);
    expect(r.slice(-3)).toEqual(['Como chegar', 'Setores', 'Contato']);
    expect(PAGINAS.find((p) => p.rotulo === 'Setores')?.href).toBe('/setores');
  });

  it('tem 12 setores; Denorex é boulder do Corredor, não setor', () => {
    expect(SETORES.map((s) => s.nome)).toEqual(['Labirinto', 'Verruga', 'Corredor', 'Disco Voador', 'Besouro', 'Cemitério', 'Lagartos', 'Laranjeiras', 'Cruzeiro', 'Califórnia', 'Coisa Boa', 'Degredo']);
  });

  it('a lista de setores sai do Sobre (agora tem página própria)', () => {
    expect(readFileSync('src/pages/sobre.astro', 'utf8')).not.toContain('Onde a gente escala');
  });

  it('não mostra distância em linha reta nem o link "Abrir no mapa"', () => {
    const p = readFileSync('src/pages/setores.astro', 'utf8');
    expect(p).not.toMatch(/linha reta/i);
    expect(p).not.toMatch(/Abrir no mapa/i);
  });
});

describe('mapa ilustrado dos setores', () => {
  it('tem posição para todos os setores', () => {
    for (const s of SETORES) expect((mapa.setores as Record<string, number[]>)[s.nome], s.nome).toHaveLength(2);
  });

  it('a trilha passa por todos os setores, uma vez cada', () => {
    expect([...ORDEM_TRILHA].sort()).toEqual(SETORES.map((s) => s.nome).sort());
  });

  it('trilha(): começa no primeiro ponto e faz uma curva por trecho', () => {
    const d = trilha([[0, 0], [10, 0], [20, 10]]);
    expect(d.startsWith('M0 0')).toBe(true);
    expect(d.match(/C/g)).toHaveLength(2);
    expect(d.endsWith('20 10')).toBe(true);
  });

  it('trilha(): pula pontos repetidos (setores no mesmo lugar)', () => {
    expect(trilha([[0, 0], [5, 5], [5, 5], [9, 9]]).match(/C/g)).toHaveLength(2);
  });
});

describe('acesso estimado aos setores (pela trilha, não em linha reta)', () => {
  it('formata distância, tempo e desnível', async () => {
    const { formatarAcesso, formatarTempo } = await import('../src/lib/acesso');
    expect(formatarTempo(20)).toBe('20 min');
    expect(formatarTempo(65)).toBe('1h05');
    expect(formatarTempo(60)).toBe('1h');
    expect(formatarAcesso({ km: 0.8, min: 20, desnivel: 75 })).toEqual({ distancia: '~0,8 km', tempo: '~20 min a pé', desnivel: 'sobe 75 m' });
    expect(formatarAcesso({ km: 2.6, min: 40, desnivel: -180 }).desnivel).toBe('desce 180 m');
    expect(formatarAcesso({ km: 0.4, min: 10, desnivel: 0 }).desnivel).toBe('plano');
  });

  it('todo setor tem acesso estimado no mapa, maior ou igual à distância em linha reta', () => {
    const acessos = (mapa as unknown as { acessos: Record<string, { km: number; min: number }> }).acessos;
    const VILA = [-12.89636, -41.31871];
    for (const s of SETORES) {
      const a = acessos[s.nome];
      expect(a, s.nome).toBeDefined();
      const reta = Math.hypot((s.lat! - VILA[0]) * 110.57, (s.lon! - VILA[1]) * 108.5);
      expect(a.km, s.nome).toBeGreaterThanOrEqual(Math.floor(reta * 10) / 10);
      expect(a.min).toBeGreaterThan(0);
    }
  });

  it('mapa traz rios, trilhas e pontos de referência além das curvas', () => {
    const m = mapa as unknown as { rios: unknown[]; trilhas: unknown[]; pontos: { nome: string }[] };
    expect(m.rios.length).toBeGreaterThan(0);
    expect(m.trilhas.length).toBeGreaterThan(0);
    expect(m.pontos.map((p) => p.nome)).toContain('Cemitério gótico');
  });
});

describe('seleção do setor nos dois sentidos', () => {
  const pagina = readFileSync('src/pages/setores.astro', 'utf8');
  const comp = readFileSync('src/components/MapaSetores.astro', 'utf8');
  it('cards e marcadores compartilham data-setor e um painel de detalhes', () => {
    expect(pagina).toMatch(/data-setor=/);
    expect(comp).toMatch(/data-setor=/);
    expect(comp).toMatch(/class="painel"/);
  });
  it('a trilha anima com aceleração suave (ease in/out), não constante', () => {
    expect(comp).not.toMatch(/ease: 'none'/);
    expect(comp).toMatch(/inOut/);
  });
});
