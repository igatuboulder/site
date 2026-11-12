import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { ritmo } from '../src/lib/ritmo';

describe('ritmo da trilha: começa suave, mantém o ritmo, termina suave', () => {
  it('vai de 0 a 1 sempre avançando', () => {
    expect(ritmo(0)).toBe(0);
    expect(ritmo(1)).toBeCloseTo(1);
    let ant = 0;
    for (let t = 0.01; t <= 1; t += 0.01) { const p = ritmo(t); expect(p).toBeGreaterThanOrEqual(ant); ant = p; }
  });
  it('acelera no começo, velocidade constante no meio e desacelera no fim', () => {
    const v = (t: number) => (ritmo(t + 0.001) - ritmo(t)) / 0.001;
    expect(v(0.01)).toBeLessThan(v(0.5) / 3);
    expect(v(0.4)).toBeCloseTo(v(0.6), 2);
    expect(v(0.985)).toBeLessThan(v(0.5) / 3);
  });
  it('a trilha usa esse ritmo e leva pelo menos 12 s', () => {
    const c = readFileSync('src/components/MapaSetores.astro', 'utf8');
    expect(c).toMatch(/ease: ritmo/);
    const dur = Number(c.match(/p: 1, duration: (\d+)/)?.[1]);
    expect(dur).toBeGreaterThanOrEqual(12);
    expect(c).not.toMatch(/back\.out/);
  });
});

describe('capa: cards alternam o destaque em loop até alguém usar', () => {
  const idx = readFileSync('src/pages/index.astro', 'utf8');
  it('tem o loop e para quando o mouse ou o foco entra', () => {
    expect(idx).toMatch(/data-loop/);
    expect(idx).toMatch(/\.card\.destaque/);
    expect(idx).toMatch(/mouseenter|pointerenter/);
    expect(idx).toMatch(/prefers-reduced-motion/);
  });
});

describe('textura de curvas de nível no fundo bege', () => {
  it('existe o desenho das curvas e o fundo papel usa ele', () => {
    expect(existsSync('public/img/curvas-textura.svg')).toBe(true);
    const css = readFileSync('src/styles/global.css', 'utf8');
    expect(css).toMatch(/\.papel \{[^}]*curvas-textura\.svg/);
  });
});

describe('Como chegar com descrições mais completas', () => {
  const p = readFileSync('src/pages/como-chegar.astro', 'utf8');
  it('cita o aeroporto de Salvador e o de Lençóis, e a estrada de pedra até Igatu', () => {
    expect(p).toMatch(/Aeroporto de Salvador/);
    expect(p).toMatch(/aeroporto de Lençóis/i);
    expect(p).toMatch(/estrada de pedra/i);
  });
});
