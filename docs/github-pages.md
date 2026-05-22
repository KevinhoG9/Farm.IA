# Deploy no GitHub Pages

Este projeto já está preparado para subir no GitHub Pages usando GitHub Actions.

## 1. Subir o projeto para um repositório

```bash
git init
git add .
git commit -m "deploy BioGen Sertão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/biogen-sertao.git
git push -u origin main
```

## 2. Ativar GitHub Pages

No GitHub:

1. Abra o repositório.
2. Vá em **Settings**.
3. Vá em **Pages**.
4. Em **Build and deployment**, selecione **GitHub Actions**.

Depois disso, todo `git push` na branch `main` publica uma nova versão.

## 3. Link final

O site ficará em algo parecido com:

```txt
https://SEU-USUARIO.github.io/biogen-sertao/
```

## Observação importante

O `vite.config.js` usa `base: '/biogen-sertao/'`, então o projeto foi configurado especificamente para o repositório `biogen-sertao`. Se mudar o nome do repositório, também mude o `base` no `vite.config.js`.
