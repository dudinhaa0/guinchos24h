# Guinchos24h — PPDM2 | Aluno 24

Aplicativo acadêmico em React + Vite + Capacitor para capturar a localização atual do motorista e abrir as coordenadas no Google Maps.

## Requisitos

- Node.js LTS instalado
- VS Code
- Android Studio instalado para gerar/executar o aplicativo Android
- Smartphone Android com localização ativada (recomendado para testar o GPS real)

## 1. Abrir o projeto

Extraia o ZIP, abra a pasta `Guinchos24h` no VS Code e abra o terminal integrado.

## 2. Instalar as dependências

```bash
npm install
```

## 3. Criar e configurar o Android

```bash
npm run android:setup
```

Esse comando cria a plataforma Android caso ainda não exista, adiciona as permissões de localização no `AndroidManifest.xml` e sincroniza o Capacitor.

## 4. Gerar a versão atualizada e sincronizar

Sempre que alterar o React, execute:

```bash
npm run android:sync
```

## 5. Abrir no Android Studio

```bash
npm run android:open
```

No Android Studio, conecte o celular com depuração USB ativada, selecione o dispositivo e pressione Run.

## 6. Testar

1. Abra o Guinchos24h no celular.
2. Toque em **Localizar minha posição**.
3. Quando o Android solicitar, permita o acesso à localização.
4. Confira latitude, longitude e precisão.
5. Toque em **Abrir no Google Maps**.

> Observação: a precisão depende do aparelho, das condições de sinal, das permissões e do ambiente. O aplicativo não envia automaticamente a localização para uma central de guincho; ele captura, exibe e permite abrir/compartilhar o ponto no mapa.

## 7. Rodar no navegador (visual; GPS do navegador)

```bash
npm run dev
```

Abra o endereço local mostrado no terminal. A captura de localização no navegador depende das permissões do navegador e de um contexto seguro (localhost/HTTPS). Para demonstrar a permissão nativa solicitada na atividade, use o app Android.

## 8. Publicar no GitHub

Crie um repositório vazio no GitHub, por exemplo `Guinchos24h`. Depois, no terminal, execute (substitua SEU_USUARIO pelo seu usuário):

```bash
git init
git add .
git commit -m "Projeto Guinchos24h - PPDM2"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/Guinchos24h.git
git push -u origin main
```

Não publique a pasta `node_modules`; ela já está no `.gitignore`.

## Estrutura

```text
Guinchos24h/
├── android/                 # Gerada pelo comando npm run android:setup
├── public/
├── scripts/
│   └── setup-android.mjs
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── capacitor.config.ts
├── index.html
├── package.json
└── vite.config.js
```
