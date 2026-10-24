# Warframe — Epoch Operation: Taubound

Guia pessoal da **Epoch Operation: Taubound** (evento único, até 17/11/2026): onde clicar, melhores missões em Eris, loja da Praghasa com checklist, seletor de arcanos e calculadora de Moonflesh.

- Site: https://ruysalles.github.io/Warframe/

## Estrutura

```
index.html                estrutura da página (seções e textos fixos)
assets/
  css/style.css           visual: cores (tema escuro e claro), layout, celular
  js/theme-init.js        aplica o tema salvo antes de pintar a tela (no <head>)
  js/data.js              ← CONTEÚDO: evento, missões, loja da Praghasa, arcanos
  js/core.js              base: progresso salvo, exportar/importar, avisos, formatação
  js/header.js            topo: contagem regressiva, tema, menu ⋯
  js/guide.js             passos "onde clicar", abas da rotina, tabela de missões
  js/planner.js           checklist da loja, seletor de arcanos, calculadora
  js/effects.js           menu ativo, animações, galeria, partículas
img/                      fotos do loadout (Xaku Prime)
```

Os scripts são carregados nessa ordem no fim do `index.html` e conversam por `window.TB` (funções da base) e `window.TB_DATA` (conteúdo).

Para mudar preço ou texto de um item, edite só o `assets/js/data.js`.

## Progresso salvo

O progresso (passos, loja, arcanos, calculadora, tema) fica no navegador, em chaves com o prefixo `warframe-taubound-` e sufixo `-v1`.
**Nunca mude o prefixo, as chaves nem os `id` dos itens da loja**, ou o progresso salvo se perde.

Para levar o progresso do PC para o celular: menu **⋯ → Exportar progresso (.json)** num aparelho e **⋯ → Importar progresso** no outro.

## Rodar localmente

Abra o `index.html` com duplo clique. Não precisa de servidor, porque os scripts são comuns (sem `fetch` nem módulos).

## Fontes

Listadas no fim da página. Warframe e as imagens do jogo pertencem à Digital Extremes; este é um guia não oficial.
