# Cinética Química — audiobook animado

App educacional interativo sobre **Cinética Química** para ensino médio e início de
graduação. Formato "audiobook animado": a narração conduz a cena 3D, os gráficos e os
quizzes, tudo sincronizado por tempo de áudio.

**▶ Abrir o app:** https://amyjr007.github.io/cinetica-quimica/

Instalável como PWA (no celular: menu do navegador → *Instalar app* / *Adicionar à tela de início*).

---

## Conteúdo

1. O que a Cinética estuda
2. Velocidade de reação — `v = ΔC / Δt`
3. Teoria das colisões — efetivas × não efetivas
4. Energia de ativação e complexo ativado
5. Fator: concentração
6. Fator: superfície de contato
7. Fator: temperatura (Maxwell-Boltzmann)
8. Fator: catalisador
9. Quiz com 6 questões
10. Encerramento

## Arquivos

| Arquivo | O que é |
|---|---|
| `cinetica.html` | O app inteiro — CSS e JS inline, sem build |
| `sw.js` | Service worker (PWA). `CACHE` deve subir a cada alteração |
| `manifest.json` | Manifesto do PWA |
| `libs/three.min.js` | Three.js r134 (local, para funcionar offline) |
| `audios/` | Narração `.mp3` por faixa + `sfx/` (ver `audios/LEIA-ME.txt`) |
| `imagens/` | Ícones do PWA |

## Modo demonstração

Sem os `.mp3` em `audios/`, o app roda com um **relógio virtual** que usa o campo `dur`
de cada faixa — toda a coreografia acontece na ordem certa e um selo "modo demonstração"
aparece no topo. Os efeitos sonoros são sintetizados com WebAudio quando o mp3 não existe.

Basta soltar os arquivos em `audios/` para a narração real assumir.

## Como o código é organizado

O JS de `cinetica.html` está dividido em 13 seções numeradas e comentadas. As duas que
mais importam para editar o roteiro:

- **`FAIXAS`** — o roteiro linear: `{ id, arquivo, titulo, dur, texto }`
- **`EVENTOS`** — a coreografia, faixa por faixa, em cues por segundo:

```js
ativacao: () => rodarStory([
  { t:8.0,  fn:()=> energiaDesenharCurva(1800) },
  { t:13.0, fn:()=> energiaMostrarEa() },
  { t:20.7, fn:()=> energiaPulsarEa() }
]),
```

Os quizzes são data-driven em `QUIZZES.quiz1.itens`, com quatro tipos de interação:
`alternativas`, `figuras`, `arrastar` e `3d`.

**Câmera livre:** toque no selo de versão (canto inferior direito) para orbitar a cena e
copiar as coordenadas prontas para colar numa constante `CAM_*`.

## Rodar localmente

Precisa de um servidor — o service worker não funciona em `file://`.

```bash
npx serve .        # ou qualquer servidor estático
```

## Versionamento

A cada alteração, suba **as duas**: `VERSAO` em `cinetica.html` e `CACHE` em `sw.js`.
Sem isso o celular continua servindo a versão antiga do cache.

---

Prof. Amauri Silva Júnior
