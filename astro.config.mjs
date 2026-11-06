import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://igatuboulder.com.br',
  output: 'static',
  adapter: netlify({ imageCDN: false }),
});
