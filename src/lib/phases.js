export const PHASES = [
  { id: 'ambiente', label: 'Ambiente', color: 'var(--color-ph-ambiente)' },
  { id: 'emozioni', label: 'Emozioni', color: 'var(--color-ph-emozioni)' },
  { id: 'stile', label: 'Stile', color: 'var(--color-ph-stile)' },
  { id: 'materiali', label: 'Materiali', color: 'var(--color-ph-materiali)' },
  { id: 'colore', label: 'Colore', color: 'var(--color-ph-colore)' },
  { id: 'dettagli', label: 'Dettagli', color: 'var(--color-ph-dettagli)' },
  { id: 'arredo', label: 'Arredo', color: 'var(--color-ph-arredo)' }
];

export const phaseIndex = id => {
  if (id === 'completato') return PHASES.length;
  const i = PHASES.findIndex(p => p.id === id);
  return i === -1 ? 0 : i;
};

export const FURNITURE_MODE_LABELS = {
  su_misura: { label: 'Arredo su misura', emoji: '🛋️' },
  sorprendimi: { label: 'Arredo a sorpresa', emoji: '✨' },
  solo_superfici: { label: 'Solo superfici', emoji: '🧱' }
};

export const TAG_COLORS = ['#f2705a', '#8b6cf6', '#4f9dde', '#e0a23b', '#e0457b', '#4fa37a'];

export function welcomeMessage(assistantName) {
  return {
    id: 'welcome',
    role: 'assistant',
    phase: 'ambiente',
    input_type: 'visual_choice',
    allow_free_text: true,
    content: `Ciao, sono ${assistantName}! Ti farò qualche domanda, alcune pratiche e altre un po' sognanti, per scoprire il tuo stile e dare forma alla tua stanza ideale. Da quale ambiente partiamo?`,
    options: [
      { label: 'Bagno', emoji: '🛁', hint: 'Il tuo rifugio quotidiano', colors: ['#9cc5d9', '#e3eef2'] },
      { label: 'Soggiorno', emoji: '🛋️', hint: 'Il cuore della casa', colors: ['#e2b48c', '#f4e7d7'] },
      { label: 'Cucina', emoji: '🍋', hint: 'Profumi e convivialità', colors: ['#b5c99a', '#f1f0e0'] },
      { label: 'Camera da letto', emoji: '🌙', hint: 'Sogni e silenzio', colors: ['#a597d6', '#ece8f6'] }
    ]
  };
}
