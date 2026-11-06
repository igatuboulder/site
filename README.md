# Site do Festival IgatuBoulder

Site oficial do Festival IgatuBoulder (Igatu, Chapada Diamantina, BA), com inscrição e pagamento.

- **Stack:** Astro, testes com Vitest, hospedagem na Netlify.
- **Dados da edição:** `src/config/evento.ts` (datas, preços, tamanhos de camiseta). Atualize aqui a cada ano.
- **Regra do projeto:** testes antes do código. `npm test` precisa passar; a Netlify roda os testes antes de publicar.

```bash
npm install
npm test       # testes
npm run dev    # site local em http://localhost:4321
```

Segredos (chave da InfinitePay) ficam só nas variáveis de ambiente da Netlify, nunca no repositório.
