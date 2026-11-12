// Curva de velocidade em trapézio: acelera suave, segura um ritmo constante e desacelera no fim.
// `a` é a fração do tempo gasta acelerando (e a mesma desacelerando).
export function ritmo(t: number, a = 0.18): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const v = 1 / (1 - a); // velocidade no trecho constante
  // aceleração com início em "S" (suavestep) para não dar tranco
  const rampa = (x: number) => v * a * (x * x * x * (1 - x / 2)); // integral de 3x²-2x³ normalizada: ∫0^1 = 1/2
  if (t < a) return rampa(t / a);
  if (t > 1 - a) return 1 - rampa((1 - t) / a);
  return v * a / 2 + v * (t - a);
}
