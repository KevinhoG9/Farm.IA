# BioGen Sertão v11 — PWA e defesa de banca

Protótipo funcional para o Hackathon Expoagro Crateús 2026.

## Rodar

```bash
npm install
npm run dev
```

## Ajustes da v11

- Manifesto PWA corrigido para `BioGen Sertão`.
- Service Worker atualizado para cache `biogen-sertao-v11`.
- Textos removendo rastros de `Farm IA`.
- Roteiro da banca atualizado com defesa correta do motor local de inteligência adaptativa.
- Relatório e assistente reforçando armazenamento local, edge computing e cuidado com LGPD.
- Linguagem da IA ajustada para evitar promessa falsa de modelo treinado.

## Defesa técnica rápida

O protótipo usa localStorage para simular uma operação edge/offline-first. O motor de recomendação é local e adaptativo, combinando histórico reprodutivo, linhagem, fertilidade, qualidade dos dados e risco genético. Em produção, o fluxo pode ser conectado a um backend e a modelos treinados com dados regionais.


## Deploy no GitHub Pages

Esta versão já vem com:

- `vite.config.js` configurado com `base: '/biogen-sertao/'`;
- workflow `.github/workflows/deploy.yml`;
- `manifest.webmanifest` ajustado para funcionar dentro do caminho do repositório;
- Service Worker compatível com GitHub Pages.

Para publicar, suba o projeto no GitHub, vá em **Settings > Pages** e selecione **GitHub Actions**.

Mais detalhes em `docs/github-pages.md`.

## Atualização v14

- Aba IA genética transformada em ritual de 3 passos: seleção, processamento local simulado e revelação do resultado.
- Loading de 2,5s com DNA animado e etapas técnicas para melhorar o impacto no pitch.
- Resultado da análise só aparece após clicar em **Executar Análise Combinatória Local**.
- Relatórios no mobile ajustados para leitura sem precisar reduzir zoom.
- Script de build ajustado para GitHub Actions usando `node ./node_modules/vite/bin/vite.js build`, evitando erro de permissão do executável `vite`.


## v15 — Histórico de análises genéticas

- Cada execução do Motor de Inteligência Adaptativa Local agora salva um registro no navegador.
- O produtor pode abrir uma análise anterior sem repetir o teste.
- O histórico mantém matriz, reprodutor, espécie, decisão, compatibilidade, prenhez prevista, risco genético, confiança e resumo técnico.
- Os dados continuam locais via localStorage, reforçando a proposta de edge/offline para campo.
