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

## Cenário

A sala tem duas paredes. A do **fundo** carrega o quadro onde os gráficos são projetados.
A **lateral esquerda** (`x = -7.4`) é um mural no estilo "slide de apresentação": fundo em
degradê, faixas diagonais nos cantos e barra de acento no rodapé. Como conteúdo, estruturas
moleculares desenhadas (benzeno, água, CO₂, metano, amônia, O₂) e as equações do curso —
`v = k·[A]ᵐ·[B]ⁿ`, `k = A·e^(−Ea/RT)`, `2 H₂O₂ → 2 H₂O + O₂`, `N₂ + 3H₂ ⇌ 2NH₃`,
`CaCO₃ + 2HCl → …`, além de `MnO₂`, `V₂O₅`, `Ea` e `ΔH`. Tudo tom sobre tom, entre 3% e 7%
de alfa, para nunca competir com a bancada.

O enquadramento de referência dela é a constante `CAM_PAREDE`:

```js
{ theta: 1.50, phi: 1.38, dist: 4.7, target:[1.2,3.6,-1.1] }
```

Madeira, metal e a parede são texturas geradas em `<canvas>` no boot — nenhum arquivo
externo, o PWA continua funcionando offline.

## Câmera livre (ferramenta de desenvolvimento)

Serve para descobrir enquadramentos e colar as coordenadas direto no código.

### No celular

**Toque no selo de versão** (canto inferior direito) para ligar — ele fica vermelho sólido.
Toque de novo para sair.

| Gesto | O que faz |
|---|---|
| 1 dedo | gira em torno do alvo — `theta` / `phi` |
| 2 dedos | move o alvo no plano da tela (pan) |
| pinça **abrindo** | vai para frente (aproxima) |
| pinça **fechando** | vai para trás (afasta) |
| **segurar 1 dedo parado por 3 s** | **copia a posição** |

Ao segurar, um anel de progresso nasce sob o dedo e vai preenchendo até os 3 s — aí vibra e
copia. Cancela se você arrastar (está girando), encostar um segundo dedo ou soltar antes.
Um tremor de até 16 px não cancela.

### No computador

`L` liga e desliga (o selo de versão também funciona).

| Gesto / tecla | O que faz |
|---|---|
| arrastar com o mouse | gira em torno do alvo |
| roda do mouse | aproxima / afasta |
| segurar o botão parado 3 s | copia a posição |
| **`C`** | copia a posição |
| setas · `W` / `S` | movem o alvo em X/Y e em Z (`Shift` = passo maior) |
| `+` / `-` | aproxima / afasta pelo teclado |
| `R` | volta à posição inicial |

Copia algo assim, pronto para colar numa constante `CAM_*`:

```js
{ theta: 0.42, phi: 1.22, dist: 6.4, target:[-2.6,1.1,0.2] }
```

Enquanto a câmera livre está ligada, `irParaCamera()` é ignorada — a coreografia não rouba
o enquadramento no meio do ajuste.

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
