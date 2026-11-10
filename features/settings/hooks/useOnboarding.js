'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHistoryStep } from '@/hooks/useHistoryStep';
import { loadStudents, saveStudents } from '@/features/students/services/studentsService';
import { createDefaultRoutine, DEFAULT_CLASSES } from '@/features/routine/utils/routine';
import { pickDefaultAvatar } from '@/features/students/utils/defaultAvatar';
import { usePreferences } from './usePreferences';

const MIN_NAME_LENGTH = 2;

// crypto.randomUUID só existe em conexão segura (HTTPS/localhost): sem ela, usa um id aleatório simples.
const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function createStudent(index) {
  return { id: newId(), order: index, name: '', photo: null, avatar: pickDefaultAvatar(index), conditions: [], routine: createDefaultRoutine() };
}

// Mantém os rascunhos já preenchidos e acrescenta/remove os que faltam para chegar em `count`.
function resize(students, count) {
  return Array.from({ length: count }, (_, index) => students[index] ?? createStudent(index));
}

// Etapas: quantidade -> (nome, foto, neurodivergências, rotina) de cada aluno -> resumo.
function buildSteps(count) {
  const steps = [{ type: 'quantity' }];
  for (let index = 0; index < count; index += 1) {
    steps.push(
      { type: 'name', student: index },
      { type: 'photo', student: index },
      { type: 'neuro', student: index },
      { type: 'routine', student: index },
    );
  }
  steps.push({ type: 'done' });
  return steps;
}

export function useOnboarding() {
  const router = useRouter();
  const preferencesApi = usePreferences();
  const count = preferencesApi.preferences.dailyChildren;

  const [students, setStudents] = useState(() => resize([], count));
  // As etapas ficam no histórico: o gesto/botão de voltar do sistema volta UMA etapa, em vez de sair do cadastro.
  const [rawStepIndex, goToStep, goBack] = useHistoryStep(0);
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const steps = useMemo(() => buildSteps(count), [count]);
  const stepIndex = Math.min(rawStepIndex, steps.length - 1);
  const step = steps[stepIndex];
  const student = step.student === undefined ? null : students[step.student];

  // "Refazer cadastro": parte dos alunos que já existem (com o mesmo id, para os registros e relatórios continuarem deles).
  // Na primeira vez a lista vem vazia e vale o rascunho em branco.
  useEffect(() => {
    let active = true;
    loadStudents()
      .then((existing) => {
        if (!active || !existing.length) return;
        setStudents(existing.map((item, index) => ({ ...item, order: index, avatar: item.avatar ?? pickDefaultAvatar(index) })));
        preferencesApi.setDailyChildren(existing.length);
      })
      .catch(() => {
        // Sem conseguir ler (rede): segue com o rascunho em branco.
      });
    return () => {
      active = false;
    };
    // Só na abertura da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ao mudar de etapa, o aviso de erro do nome some.
  useEffect(() => {
    setNameError('');
  }, [stepIndex]);

  const changeCount = (nextCount) => {
    preferencesApi.setDailyChildren(nextCount);
    setStudents((current) => resize(current, nextCount));
  };

  const updateStudent = (index, patch) =>
    setStudents((current) => current.map((item, position) => (position === index ? { ...item, ...patch } : item)));

  const setName = (index, name) => {
    setNameError('');
    updateStudent(index, { name });
  };

  const setPhoto = (index, photo) => updateStudent(index, { photo });

  const toggleCondition = (index, conditionId) =>
    setStudents((current) =>
      current.map((item, position) => {
        if (position !== index) return item;
        const exists = item.conditions.some((condition) => condition.id === conditionId);
        const conditions = exists
          ? item.conditions.filter((condition) => condition.id !== conditionId)
          : [...item.conditions, { id: conditionId, levels: {} }];
        return { ...item, conditions };
      }),
    );

  const setLevel = (index, conditionId, groupId, optionId) =>
    setStudents((current) =>
      current.map((item, position) => {
        if (position !== index) return item;
        const conditions = item.conditions.map((condition) =>
          condition.id === conditionId ? { ...condition, levels: { ...condition.levels, [groupId]: optionId } } : condition,
        );
        return { ...item, conditions };
      }),
    );

  const setRoutineDay = (index, dayValue, patch) =>
    setStudents((current) =>
      current.map((item, position) => {
        if (position !== index) return item;
        const day = { ...item.routine[dayValue], ...patch };
        // Voltar a atender num dia sem aulas traz as aulas padrão de volta, para não começar vazio.
        if (patch.attends && day.classes.length === 0) day.classes = [...DEFAULT_CLASSES];
        return { ...item, routine: { ...item.routine, [dayValue]: day } };
      }),
    );

  // Repete o acolhimento e as aulas de um dia nos outros dias em que o aluno é atendido.
  const copyRoutineDay = (index, dayValue) =>
    setStudents((current) =>
      current.map((item, position) => {
        if (position !== index) return item;
        const source = item.routine[dayValue];
        const routine = Object.fromEntries(
          Object.entries(item.routine).map(([key, day]) => [
            key,
            day.attends ? { ...day, welcome: source.welcome, classes: [...source.classes] } : day,
          ]),
        );
        return { ...item, routine };
      }),
    );

  const next = () => {
    if (step.type === 'name' && student.name.trim().length < MIN_NAME_LENGTH) {
      setNameError('Informe o nome do aluno.');
      return;
    }
    goToStep(Math.min(stepIndex + 1, steps.length - 1));
  };

  // Voltar uma etapa = voltar no histórico (igual ao gesto do sistema).
  const back = goBack;

  // Pular o cadastro inteiro (só na primeira etapa): segue para a tela inicial com os dados de exemplo.
  const skip = () => {
    preferencesApi.completeOnboarding();
    router.replace('/');
  };

  const finish = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await saveStudents(students.map((item) => ({ ...item, name: item.name.trim() })));
      preferencesApi.completeOnboarding();
      router.replace('/');
    } catch {
      setSaveError('Não foi possível salvar o cadastro. Verifique a conexão e tente de novo.');
      setSaving(false);
    }
  };

  return {
    preferences: preferencesApi.preferences,
    count,
    steps,
    step,
    stepIndex,
    student,
    students,
    nameError,
    saving,
    saveError,
    changeCount,
    setName,
    setPhoto,
    toggleCondition,
    setLevel,
    setRoutineDay,
    copyRoutineDay,
    next,
    back,
    skip,
    finish,
  };
}
