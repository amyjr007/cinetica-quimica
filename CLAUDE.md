# App Cinética Química

Audiobook animado sobre cinética química, para celular em pé. Um único arquivo
(`cinetica.html`) com HTML, CSS, JS e a cena 3D em Three.js; `sw.js` faz o PWA
funcionar offline. Publicado por GitHub Pages a partir do `main`.

O código é comentado de propósito, e os comentários explicam o *porquê* de cada
número. Antes de mudar uma constante, leia o bloco em cima dela — quase toda
tem uma história de calibragem atrás.

## Regras de trabalho

**Toda alteração vai para o GitHub.** Commit e push no `main`, sem perguntar. É
assim que o app chega ao celular para teste; mudança que fica só no disco é
mudança que o autor não consegue ver. Sem branch, sem PR.

**Subir a versão em DOIS lugares, sempre juntos:**

- `const VERSAO` e o `<div id="versao">` em `cinetica.html`
- `const CACHE` em `sw.js`

Se o `CACHE` não mudar, o celular continua servindo assets do cache velho. E o
selo de versão na tela é como o autor confere o que está rodando — se ele não
subir, ele não sabe se está vendo a mudança nova.

**Mensagem de commit em português**, uma frase do que mudou mais `(vX.Y.Z)`, e
o corpo explicando o *porquê*. O histórico é usado como documentação.

## Ambiente

O repositório mora numa pasta do OneDrive, e isso quebra o git de formas não
óbvias. Duas configurações já aplicadas neste clone, necessárias:

```
git config windows.appendAtomically false   # senão `git commit` falha
git config core.longpaths true
```

E a pasta precisa estar fixada como "sempre neste dispositivo" (`attrib +P -U`),
senão o Files On-Demand desidrata arquivos do `.git` e o `git fetch` morre com
`mmap failed: Invalid argument`.

**A forma correta é não usar o OneDrive para isto.** Clone em caminho curto
fora dele (`C:\dev\cinetica`) e sincronize por `git pull --ff-only` / `git push`.
O OneDrive copia o `.git` byte a byte, sem entender que refs, índice e objetos
precisam ser consistentes entre si — já houve um episódio de `HEAD` mudando
sozinho no meio de um comando.

## Invariantes que custaram caro

Não desfaça nenhuma destas sem ler o comentário correspondente no arquivo.

**O canvas 3D precisa de `width`/`height` em CSS.** `position:fixed; inset:0`
NÃO estica um `<canvas>`: é elemento substituído, usa a largura intrínseca (os
atributos) e descarta o `right`. Com `setSize(w,h,false)` os atributos viram
`w * devicePixelRatio`, então o canvas ficava `dpr` vezes maior que a moldura,
ancorado no canto superior esquerdo, e o `overflow:hidden` cortava o resto. No
celular (dpr 3) via-se 1/3 da imagem; no preview (dpr 1.5), 2/3. Foi *o* bug de
enquadramento, e ele se disfarçou por meses porque o recorte é proporcional —
aspecto e FOV batiam perfeitamente enquanto a imagem estava errada.

**A moldura tem 384×798 CSS fixos** (`#app`, `TELA_REF_W`/`TELA_REF_H`), e a
caixa inteira é ampliada por `scale` para caber na janela. É o que faz o preview
e o celular mostrarem a mesma coisa: mesmo aspecto, mesmo FOV, mesmos `--vw`,
mesmos clamps em px. Todo o CSS usa `calc(var(--vw)*N)` em vez de `Nvw`, porque
unidade de viewport segue a janela e escaparia da moldura.

**A escala usa a propriedade `scale`, não `transform`.** `tremerTela()` escreve
`transform` próprio e apagaria a escala junto.

**Coordenadas de ponteiro passam por `pontoNaMoldura()`.** `clientX/Y` são da
janela; dentro da moldura é preciso descontar o canto e desfazer a ampliação.
Exceção deliberada: `elementsFromPoint` quer coordenadas de janela.

**O app é retrato-only.** Não existe mais caminho de paisagem — `LAYOUT_QUADRO`
e as câmeras têm uma calibragem só. Duas calibragens em sincronia foi
exatamente o que divergia antes.

**`LAYOUT_QUADRO` é calibrado em par com `CAM_QUADRO_DEF`.** Ao aproximar a
câmera da definição, a coluna de texto deixa de caber e `colDir` tem de descer
junto — o que muda a quebra de linha e obriga `perguntaV` a descer também. Nunca
mexa em uma só.

## Calibrar enquadramento

Nunca deduza câmera de print: print é imagem, e não dá para saber se foi tirado
com um movimento de câmera ainda correndo. Use a ferramenta.

1. Tecla `L`, ou toque no selo de versão, liga a **câmera livre**.
2. Arrastar gira; `Ctrl`+arrastar (ou dois dedos) faz pan; roda ou pinça
   aproxima. O HUD mostra janela, moldura, aspecto, FOV e ampliação.
3. Tecla `C`, o botão do HUD, ou segurar 3 s copia o bloco pronto para colar
   numa constante `CAM_*`, junto com o diagnóstico: tamanho de tela, e onde os
   pontos de referência caíram em NDC (−1 a +1, com 0 no centro).
4. **Meça no celular**, que é onde o app roda. Depois da correção do canvas o
   número medido lá vale no preview — antes não valia.

Ao conferir uma câmera, olhe o objeto que é o assunto, não o quadro: em cenas
fechadas o quadro está fora de campo e o NDC dele dispara perto da borda do
frustum sem significar nada.

## Mapa de `cinetica.html`

O arquivo tem um índice comentado logo no início do `<script>`. Em linhas
gerais: CSS e HTML no topo, depois versão e constantes, faixas do roteiro,
utilidades de DOM, áudio e SFX, o quadro pintado em `<canvas>` (o texto do
quadro é textura, não overlay), a cena 3D, as câmeras, a coreografia por faixa
(`EVENTOS` — é ali que se mexe para "na faixa X, em 8 s faz Y") e o boot.
