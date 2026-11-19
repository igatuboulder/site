import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://igatuboulder.com.br',
  output: 'static',
  // Gera sobre.html (e não sobre/index.html): o Cloudflare serve /sobre direto, sem redirecionar para /sobre/.
  build: { format: 'file' },
  adapter: cloudflare({ imageService: 'passthrough' }),
});
