import { getCondition } from '../data/neurodivergences';

// Seleção do cadastro: { id: 'tea', levels: { suporte: '2' } }  ->  ['TEA', 'Nível 2']
// Cada parte vira uma etiqueta pequena e separada na tela (mais compacto que um texto único e comprido).
export function formatConditionParts(selection) {
  const condition = getCondition(selection.id);
  if (!condition) return [];

  const levels = condition.levelGroups
    .map((group) => group.options.find((option) => option.id === selection.levels?.[group.id])?.label)
    .filter(Boolean);

  return [condition.label, ...levels];
}

// Lista de neurodivergências do aluno, cada uma em partes: [['TEA', 'Nível 2'], ['TDAH', 'Combinada']]
export function formatConditionList(selections = []) {
  return selections.map(formatConditionParts).filter((parts) => parts.length > 0);
}
