import { createDefaultRoutine, DEFAULT_CLASSES } from '@/features/routine/utils/routine';
import { pickDefaultAvatar } from './defaultAvatar';

// Rascunho de aluno (cadastro inicial e "Novo aluno"/"Editar"): funções puras que devolvem um aluno novo, sem mexer no original.

// crypto.randomUUID só existe em conexão segura (HTTPS/localhost): sem ela, usa um id aleatório simples.
const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createStudentDraft = (index) => ({
  id: newId(),
  order: index,
  name: '',
  photo: null,
  avatar: pickDefaultAvatar(index),
  conditions: [],
  routine: createDefaultRoutine(),
});

export function toggleCondition(student, conditionId) {
  const exists = student.conditions.some((condition) => condition.id === conditionId);
  const conditions = exists
    ? student.conditions.filter((condition) => condition.id !== conditionId)
    : [...student.conditions, { id: conditionId, levels: {} }];
  return { ...student, conditions };
}

export function setConditionLevel(student, conditionId, groupId, optionId) {
  const conditions = student.conditions.map((condition) =>
    condition.id === conditionId ? { ...condition, levels: { ...condition.levels, [groupId]: optionId } } : condition,
  );
  return { ...student, conditions };
}

export function setRoutineDay(student, dayValue, patch) {
  const day = { ...student.routine[dayValue], ...patch };
  // Voltar a atender num dia sem aulas traz as aulas padrão de volta, para não começar vazio.
  if (patch.attends && day.classes.length === 0) day.classes = [...DEFAULT_CLASSES];
  return { ...student, routine: { ...student.routine, [dayValue]: day } };
}

// Repete o acolhimento e as aulas de um dia nos outros dias em que o aluno é atendido.
export function copyRoutineDay(student, dayValue) {
  const source = student.routine[dayValue];
  const routine = Object.fromEntries(
    Object.entries(student.routine).map(([key, day]) => [key, day.attends ? { ...day, welcome: source.welcome, classes: [...source.classes] } : day]),
  );
  return { ...student, routine };
}
