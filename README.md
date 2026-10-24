# Warframe — Epoch Operation: Taubound

Guia pessoal da **Epoch Operation: Taubound** (evento único, até 17/11/2026): onde clicar, mapa de Eris com as melhores missões, loja da Praghasa com checklist, seletor de arcanos e calculadora de Moonflesh.

Visual: **Sinal Interceptado** — o Orbiter interceptando a Praghasa sobre Eris (títulos que se decifram, esporos, lascas Sentient que cristalizam e a seção do Xaku em ouro Orokin). Temas: *Eris infestada* (escuro) e *Osso de Tau* (claro). O porquê de cada escolha está em `docs/direcao-de-arte.md` e nas pranchas em `docs/pranchas/`.

- Site: https://ruysalles.github.io/Warframe/

## Estrutura

```
index.html                estrutura da página (seções e textos fixos)
assets/
  css/style.css           visual: tokens dos dois temas, lascas, mapa, modo Orokin, celular
  js/theme-init.js        aplica o tema salvo antes de pintar a tela (no <head>); aceita ?tema=light|dark
  js/data.js              ← CONTEÚDO: evento, missões, loja da Praghasa, arcanos
  js/core.js              base: progresso salvo, exportar/importar, avisos, formatação
  js/header.js            topo: contagem regressiva, tema, menu ⋯
  js/guide.js             passos "onde clicar", abas da rotina, mapa de Eris e tabela de missões
  js/planner.js           loja em lascas, seletor de arcanos (e o selo do Xaku), calculadora
  js/effects.js           menu ativo, títulos que se decifram, animações, galeria, esporos do topo
img/                      fotos do loadout (Xaku Prime)
docs/
  direcao-de-arte.md      conceito, peças, temas e momento de assinatura
  pranchas/               pranchas de conceito 0–6 (abra docs/pranchas/index.html)
backups/                  cópias antes de mudanças grandes (fora do git)
```

Os scripts são carregados nessa ordem no fim do `index.html` e conversam por `window.TB` (funções da base) e `window.TB_DATA` (conteúdo). O `?v=2` nos links força o navegador a baixar a versão nova: aumente o número quando mudar o arquivo.

Para mudar preço ou texto de um item, edite só o `assets/js/data.js`.

## Progresso salvo

O progresso (passos, loja, arcanos, calculadora, tema) fica no navegador, em chaves com o prefixo `warframe-taubound-` e sufixo `-v1`.
**Nunca mude o prefixo, as chaves nem os `id` dos itens da loja**, ou o progresso salvo se perde.

Para levar o progresso do PC para o celular: menu **⋯ → Exportar progresso (.json)** num aparelho e **⋯ → Importar progresso** no outro.

## Rodar localmente

Abra o `index.html` com duplo clique. Não precisa de servidor, porque os scripts são comuns (sem `fetch` nem módulos).

## Fontes

Listadas no fim da página. Warframe e as imagens do jogo pertencem à Digital Extremes; este é um guia não oficial.
