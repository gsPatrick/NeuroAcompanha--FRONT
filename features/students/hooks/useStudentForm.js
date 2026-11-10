'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/core/api/apiClient';
import { useChildren } from '@/features/children/hooks/useChildren';
import { useHistoryStep } from '@/hooks/useHistoryStep';
import { createStudent, updateStudent } from '../services/studentsService';
import { copyRoutineDay, createStudentDraft, setConditionLevel, setRoutineDay, toggleCondition } from '../utils/studentDraft';

const MIN_NAME_LENGTH = 2;

// Mesmas etapas do cadastro inicial, para UM aluno: nome -> foto -> neurodivergências -> rotina (e Salvar).
export const STUDENT_FORM_STEPS = ['name', 'photo', 'neuro', 'routine'];

// "Novo aluno" (sem `childId`) e "Editar aluno" (com `childId`). status: loading | missing | ready.
// As etapas ficam no histórico: o gesto de voltar do sistema volta UMA etapa, em vez de sair da tela.
export function useStudentForm(childId) {
  const router = useRouter();
  const { status: listStatus, children } = useChildren();
  const [draft, setDraft] = useState(null);
  const [stepIndex, goToStep, goBack] = useHistoryStep(0);
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isEdit = Boolean(childId);
  const existing = isEdit ? children.find((child) => child.id === childId) : null;

  // O rascunho nasce uma vez, quando a lista chega: o aluno atual (editar) ou um em branco (novo).
  useEffect(() => {
    if (draft || listStatus !== 'success') return;
    if (isEdit) {
      if (existing) setDraft(structuredClone(existing));
    } else {
      setDraft(createStudentDraft(children.length));
    }
  }, [draft, listStatus, isEdit, existing, children.length]);

  useEffect(() => {
    setNameError('');
  }, [stepIndex]);

  // Sem rascunho: ainda carregando (ou só falta o efeito acima criá-lo) ou não existe (aluno de outra AT, sem conexão...).
  let status = 'ready';
  if (!draft) {
    const aboutToCreate = listStatus === 'success' && (!isEdit || existing);
    status = listStatus === 'loading' || aboutToCreate ? 'loading' : 'missing';
  }

  const change = (update) => setDraft((current) => update(current));

  const setName = (name) => {
    setNameError('');
    change((current) => ({ ...current, name }));
  };

  const next = () => {
    if (STUDENT_FORM_STEPS[stepIndex] === 'name' && draft.name.trim().length < MIN_NAME_LENGTH) {
      setNameError('Informe o nome do aluno.');
      return;
    }
    goToStep(Math.min(stepIndex + 1, STUDENT_FORM_STEPS.length - 1));
  };

  // Primeira etapa: sair da tela. Nas outras: voltar uma etapa (igual ao gesto do sistema).
  const back = () => (stepIndex === 0 ? router.back() : goBack());

  const save = async () => {
    if (draft.name.trim().length < MIN_NAME_LENGTH) {
      setSaveError('Informe o nome do aluno.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const saved = isEdit ? await updateStudent(draft) : await createStudent(draft);
      router.replace(`/criancas/${saved.id}`);
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.message : 'Não foi possível salvar. Tente de novo.');
      setSaving(false);
    }
  };

  return {
    isEdit,
    status,
    draft,
    step: STUDENT_FORM_STEPS[stepIndex] ?? STUDENT_FORM_STEPS[0],
    stepIndex,
    isLast: stepIndex >= STUDENT_FORM_STEPS.length - 1,
    nameError,
    saving,
    saveError,
    setName,
    setPhoto: (photo) => change((current) => ({ ...current, photo })),
    toggleCondition: (conditionId) => change((current) => toggleCondition(current, conditionId)),
    setLevel: (conditionId, groupId, optionId) => change((current) => setConditionLevel(current, conditionId, groupId, optionId)),
    setRoutineDay: (dayValue, patch) => change((current) => setRoutineDay(current, dayValue, patch)),
    copyRoutineDay: (dayValue) => change((current) => copyRoutineDay(current, dayValue)),
    next,
    back,
    save,
  };
}
