'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHistoryStep } from '@/hooks/useHistoryStep';
import { loadStudents, saveStudents } from '@/features/students/services/studentsService';
import { pickDefaultAvatar } from '@/features/students/utils/defaultAvatar';
import { copyRoutineDay, createStudentDraft, setConditionLevel, setRoutineDay, toggleCondition } from '@/features/students/utils/studentDraft';
import { usePreferences } from './usePreferences';

const MIN_NAME_LENGTH = 2;

// Mantém os rascunhos já preenchidos e acrescenta/remove os que faltam para chegar em `count`.
function resize(students, count) {
  return Array.from({ length: count }, (_, index) => students[index] ?? createStudentDraft(index));
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

  const updateOne = (index, change) =>
    setStudents((current) => current.map((item, position) => (position === index ? change(item) : item)));

  const handleToggleCondition = (index, conditionId) => updateOne(index, (item) => toggleCondition(item, conditionId));
  const handleSetLevel = (index, conditionId, groupId, optionId) => updateOne(index, (item) => setConditionLevel(item, conditionId, groupId, optionId));
  const handleSetRoutineDay = (index, dayValue, patch) => updateOne(index, (item) => setRoutineDay(item, dayValue, patch));
  const handleCopyRoutineDay = (index, dayValue) => updateOne(index, (item) => copyRoutineDay(item, dayValue));

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
    toggleCondition: handleToggleCondition,
    setLevel: handleSetLevel,
    setRoutineDay: handleSetRoutineDay,
    copyRoutineDay: handleCopyRoutineDay,
    next,
    back,
    skip,
    finish,
  };
}
