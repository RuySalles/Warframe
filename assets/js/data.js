// =============================================================================
// Conteúdo do guia: evento, missões, loja da Praghasa e arcanos.
// Para mudar preços, textos ou itens, edite só este arquivo.
//
// ATENÇÃO: nunca mude nem reaproveite o `id` dos itens da loja.
// O progresso salvo no navegador está ligado a esse id.
// Item novo → id novo. Item que saiu → apague a linha (o id não volta a ser usado).
// =============================================================================

window.TB_DATA = {
  event: {
    // 17/11/2026 11:00 EST = 16:00 UTC = 13:00 em Brasília
    endsAtUtc: Date.UTC(2026, 10, 17, 16, 0, 0),
  },

  // rating: 1 a 5 (quanto de Moonflesh a missão rende)
  // tags: usadas pelos filtros da tabela (mf = só Moonflesh, relic = relíquias, nidus = Nidus)
  missions: [
    { node: 'Zabala', type: 'Survival (Dark Sector)', rating: 5, bonus: 'Plastídeos e Mutagen Samples de quebra', when: 'Padrão: só Moonflesh, o mais rápido', tags: ['mf'] },
    { node: 'Nimus', type: 'Survival', rating: 5, bonus: '—', when: 'Alternativa à Zabala', tags: ['mf'] },
    { node: 'Xini', type: 'Interception', rating: 4, bonus: 'Neo ~70% (A); Axi 100% (B e C)*', when: 'Se você precisa de relíquias Axi', tags: ['relic'] },
    { node: 'Kala-azar', type: 'Defense (Dark Sector)', rating: 3, bonus: 'Neo 70% (A); Axi 50% (B) e 70% (C)*', when: 'Relíquias, com pausa entre ondas', tags: ['relic'] },
    { node: 'Akkad', type: 'Defense (Dark Sector)', rating: 3, bonus: 'Lith 50% (B); Meso 50% (C)*', when: 'Relíquias de nível baixo', tags: ['relic'] },
    { node: 'Oestrus', type: 'Infested Salvage', rating: 3, bonus: 'Partes do Nidus + Neo e Axi*', when: 'Se ainda não tem o Nidus', tags: ['nidus', 'relic'] },
    { node: 'Locus Alerts', type: 'Operation Alert', rating: 5, bonus: '+50 / +75 fixo; cheio de Eximus', when: 'Sempre primeiro', tags: ['mf'] },
  ],

  // tier: prioridade de compra (1 = primeiro). A calculadora usa esse número.
  shop: [
    {
      title: 'P1 — Progresso real (compre primeiro)', tier: 1, items: [
        { id: 'crim', name: 'Tauforged Crimson Archon Shard', cost: 375, note: 'Compra única' },
        { id: 'azure', name: 'Tauforged Azure Archon Shard', cost: 375, note: 'Compra única' },
        { id: 'amber', name: 'Tauforged Amber Archon Shard', cost: 375, note: 'Compra única' },
        { id: 'core', name: 'Legendary Core', cost: 500, note: 'Compra única · maximiza qualquer mod' },
      ],
    },
    {
      title: 'P2 — Armas (Mastery Rank)', tier: 2, items: [
        { id: 'haalvu', name: 'Haalvu', cost: 150, note: 'Rifle automático Sentient' },
        { id: 'spectra', name: 'Spectra Vandal', cost: 150, note: 'Volta de evento antigo' },
        { id: 'basmu', name: 'Basmu Blueprint', cost: 125, note: 'Volta de evento antigo' },
      ],
    },
    {
      title: 'P3 — Exclusivos do Taubound (nunca voltam)', tier: 3, items: [
        { id: 'dham', name: 'Dhampyre Syandana', cost: 500 },
        { id: 'khad', name: 'Khadati Sumdali', cost: 250 },
        { id: 'vacis', name: 'Vacis Amp Skin', cost: 175 },
        { id: 'honor', name: 'The Moon Killer Honoria', cost: 175, note: 'Título' },
        { id: 'cg1', name: 'Contegorus Greaves', cost: 175, note: 'Libera com 30% da comunidade' },
        { id: 'cg2', name: 'Contegorus Pauldrons', cost: 175, note: 'Libera com 60% da comunidade' },
        { id: 'cg3', name: 'Contegorus Chest Plate', cost: 175, note: 'Libera com 90% da comunidade' },
        { id: 'floof', name: 'Natah Neolyst Floof', cost: 125 },
        { id: 'soma', name: 'Devourer (Somachord)', cost: 125 },
        { id: 'gl1', name: 'Arturos Vessel Glyph', cost: 100 },
        { id: 'gl2', name: 'Zioa Vessel Glyph', cost: 100 },
        { id: 'gl3', name: 'Neolyst Natah Glyph', cost: 100 },
        { id: 'sig', name: 'Taubound Sigil', cost: 100 },
        { id: 'emb', name: 'Epoch Operation Vessel Emblem', cost: 100 },
        // Está na lista oficial de recompensas, mas sem preço publicado. cost: null = "?" e fica fora dos totais.
        { id: 'mortem', name: 'Eris Mortem', cost: null, note: 'Preço a confirmar no jogo · fora dos totais' },
      ],
    },
    {
      title: 'P4 — Cosméticos que voltaram', tier: 4, items: [
        { id: 'valdur', name: 'Valdur’s Syandana', cost: 175 },
        { id: 'cort', name: 'Cortege Supulchrax Skin', cost: 125 },
        { id: 'morg', name: 'Morgha Supulchrax Skin', cost: 125 },
        { id: 'ball', name: 'The Ballroom Simulacrum', cost: 125 },
        { id: 'krios', name: 'Krios Signa', cost: 100 },
        { id: 'nk1', name: 'Naktavyre Shoulder Armor', cost: 75 },
        { id: 'nk2', name: 'Naktavyre Chest Armor', cost: 75 },
        { id: 'nk3', name: 'Naktavyre Leg Armor', cost: 75 },
        { id: 'e1', name: 'Sling Stone Emblem', cost: 75 },
        { id: 'e2', name: 'Arid Fear Emblem', cost: 75 },
        { id: 'e3', name: 'Breeding Grounds Emblem', cost: 75 },
        { id: 'rift', name: 'Rift Sigil', cost: 75 },
        { id: 'c1', name: 'Phased Clan Sigil', cost: 50 },
        { id: 'c2', name: 'Glyphed Clan Sigil', cost: 50 },
        { id: 'c3', name: 'Gilded Clan Sigil', cost: 50 },
      ],
    },
  ],

  // Cada arcano chega ao R5 com 21 cópias; o limite na loja é 42 por tipo.
  // O nome é a chave do progresso salvo: não renomeie.
  arcanes: [
    { name: 'Melee Influence', cost: 8, note: 'Você usa no Orthos Prime (R2): faltam 15' },
    { name: 'Melee Exposure', cost: 8 },
    { name: 'Melee Animosity', cost: 8 },
    { name: 'Melee Vortex', cost: 8 },
    { name: 'Melee Afflictions', cost: 8 },
    { name: 'Melee Fortification', cost: 5 },
    { name: 'Melee Retaliation', cost: 5 },
    { name: 'Arcane Battery', cost: 8 },
    { name: 'Arcane Ice Storm', cost: 8 },
    { name: 'Secondary Fortifier', cost: 8 },
    { name: 'Secondary Surge', cost: 8 },
  ],

  // Quantidades oferecidas no seletor de cada arcano
  arcaneAmounts: [
    { copies: 21, label: 'R5 (21)' },
    { copies: 42, label: '2× R5 (42)' },
    { copies: 15, label: 'R2→R5 (15)' },
    { copies: 10, label: 'R3 (10)' },
  ],

  // Seleção inicial (antes de o visitante marcar qualquer coisa)
  arcaneDefaults: {
    'Melee Influence': { on: true, q: 15 },
  },
};
