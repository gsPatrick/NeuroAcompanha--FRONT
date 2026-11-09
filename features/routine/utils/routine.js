import { ROUTINE_DAYS } from '../data/days';

// Rotina de um aluno: para cada dia da semana (chave = Date#getDay), se a AT atende, se há acolhimento e quais aulas.
//   { 1: { attends: true, welcome: true, classes: ['Português', 'Matemática'] }, ..., 0: { attends: false, ... } }
// Lanche e Brincadeiras entram em todo dia de atendimento (ver buildDayBlocks).
export const DEFAULT_CLASSES = ['Português', 'Matemática'];

export function createDefaultRoutine() {
  const routine = {};
  ROUTINE_DAYS.forEach(({ value }) => {
    const weekday = value >= 1 && value <= 5;
    routine[value] = { attends: weekday, welcome: weekday, classes: weekday ? [...DEFAULT_CLASSES] : [] };
  });
  return routine;
}

// Rotina de exemplo: dias em que atende (o resto não atende), com acolhimento e aulas iguais.
export function createRoutine({ days, welcome = true, classes = DEFAULT_CLASSES }) {
  const routine = createDefaultRoutine();
  ROUTINE_DAYS.forEach(({ value }) => {
    const attends = days.includes(value);
    routine[value] = { attends, welcome: attends && welcome, classes: attends ? [...classes] : [] };
  });
  return routine;
}

// Rotina de exemplo com aulas diferentes em cada dia: { [dia]: { welcome, classes } }. Dia fora da lista = não atende.
export function createWeeklyRoutine(week) {
  const routine = createDefaultRoutine();
  ROUTINE_DAYS.forEach(({ value }) => {
    const day = week[value];
    routine[value] = day
      ? { attends: true, welcome: day.welcome, classes: [...day.classes] }
      : { attends: false, welcome: false, classes: [] };
  });
  return routine;
}

export const getRoutineDay = (routine, date = new Date()) => routine?.[date.getDay()] ?? null;

export const attendsOn = (routine, date = new Date()) => Boolean(getRoutineDay(routine, date)?.attends);

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Blocos do dia, na ordem: Acolhimento (se houver), Aulas, Lanche e Brincadeiras.
// kind: welcome | class | snack | play | other (usado para escolher as perguntas da prancheta).
export function buildDayBlocks(routine, date = new Date()) {
  const day = getRoutineDay(routine, date);
  if (!day?.attends) return [];

  return [
    ...(day.welcome ? [{ id: newId(), kind: 'welcome', title: 'Acolhimento' }] : []),
    ...day.classes
      .filter((name) => name.trim())
      .map((name) => ({ id: newId(), kind: 'class', title: name.trim() })),
    { id: newId(), kind: 'snack', title: 'Lanche' },
    { id: newId(), kind: 'play', title: 'Brincadeiras' },
  ];
}

export const newBlock = (kind, title) => ({ id: newId(), kind, title: title.trim() });

// Resumo curto de um dia para as telas de cadastro: "Acolhimento · 2 aulas" ou "Não atende".
export function describeDay(day) {
  if (!day?.attends) return 'Não atende';
  const classes = day.classes.filter((name) => name.trim()).length;
  const parts = [];
  if (day.welcome) parts.push('Acolhimento');
  parts.push(classes === 1 ? '1 aula' : `${classes} aulas`);
  return parts.join(' · ');
}

// "Atende: Seg · Qua · Sex" (ou "Sem dias de atendimento").
export function describeAttendanceDays(routine) {
  const days = ROUTINE_DAYS.filter(({ value }) => routine?.[value]?.attends).map(({ short }) => short);
  return days.length ? `Atende: ${days.join(' · ')}` : 'Sem dias de atendimento';
}
