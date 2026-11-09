'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/authService';
import { loadPreferences } from '@/features/settings/services/preferencesService';
import { useHistoryStep } from '@/hooks/useHistoryStep';
import { validateLogin } from '../utils/validateLogin';

const HOME_ROUTE = '/';
const ONBOARDING_ROUTE = '/onboarding';
const GATE = 0;
const FORM = 1;

// step: gate (pergunta inicial) | form (e-mail e senha).
// As duas etapas ficam no histórico: o gesto de voltar do sistema leva do formulário de volta à pergunta.
export function useLogin() {
  const router = useRouter();
  const [stepIndex, goTo, goBack] = useHistoryStep(GATE);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const step = stepIndex === FORM ? 'form' : 'gate';

  // Ao voltar para a pergunta, limpa os avisos de erro do formulário.
  useEffect(() => {
    if (stepIndex === GATE) {
      setErrors({});
      setSubmitError('');
    }
  }, [stepIndex]);

  const openForm = () => goTo(FORM);
  const backToGate = goBack;

  // Substituir (e não empilhar) ao sair do login: o gesto de voltar nunca devolve à tela de login.
  const skip = () => router.replace(HOME_ROUTE);

  const changeField = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError('');
  };

  const submit = async () => {
    const found = validateLogin(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      await login(values);
      // Primeiro acesso: passa pela configuração inicial antes da tela inicial.
      router.replace(loadPreferences().onboarded ? HOME_ROUTE : ONBOARDING_ROUTE);
    } catch {
      setSubmitError('Não foi possível entrar. Verifique os dados e tente novamente.');
      setSubmitting(false);
    }
  };

  return { step, values, errors, submitError, submitting, openForm, backToGate, skip, changeField, submit };
}
