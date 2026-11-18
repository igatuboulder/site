// Na prévia (deploy-preview-*), devolve o motivo técnico do erro para facilitar o teste.
// No site de verdade, nunca: quem se inscreve vê só a mensagem amigável.
export function detalhePrevia(host: string, e: unknown): string | undefined {
  if (!host.startsWith('deploy-preview-')) return undefined;
  const msg = e instanceof Error ? e.message : String(e);
  return msg.slice(0, 500);
}
