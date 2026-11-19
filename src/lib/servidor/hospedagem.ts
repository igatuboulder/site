// Detalhes de onde o site roda (Cloudflare Pages). Só no servidor.

/** Prévia = endereço de teste: <algo>.<projeto>.pages.dev (Cloudflare) ou deploy-preview-* (Netlify antiga).
 *  O endereço principal <projeto>.pages.dev e o domínio oficial nunca são prévia. */
export function ehPrevia(host: string): boolean {
  return host.startsWith('deploy-preview-') || /^[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev$/i.test(host);
}

type Env = Record<string, string | undefined>;

/** Chaves secretas: no Cloudflare vêm em locals.runtime.env; em testes e dev, em process.env. */
export function segredos(locals?: unknown, proc: Env = typeof process !== 'undefined' ? (process.env as Env) : {}): Env {
  const cf = (locals as { runtime?: { env?: Record<string, unknown> } } | undefined)?.runtime?.env ?? {};
  const out: Env = { ...proc };
  for (const [k, v] of Object.entries(cf)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}
