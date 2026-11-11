// Divide o texto da página em trechos curtos para a leitura em voz alta
// (alguns navegadores cortam falas longas do speechSynthesis).
export function dividirEmTrechos(texto: string, max = 200): string[] {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  if (!limpo) return [];
  const frases = limpo.match(/[^.!?]+[.!?]+|[^.!?]+$/g)!.map((f) => f.trim()).filter(Boolean);
  const pedacos: string[] = [];
  for (const frase of frases) {
    if (frase.length <= max) { pedacos.push(frase); continue; }
    let atual = '';
    for (const palavra of frase.split(' ')) {
      if (atual && (atual + ' ' + palavra).length > max) { pedacos.push(atual); atual = palavra; }
      else atual = atual ? atual + ' ' + palavra : palavra;
    }
    if (atual) pedacos.push(atual);
  }
  const trechos: string[] = [];
  for (const p of pedacos) {
    const ult = trechos.length - 1;
    if (ult >= 0 && (trechos[ult] + ' ' + p).length <= max) trechos[ult] += ' ' + p;
    else trechos.push(p);
  }
  return trechos;
}
