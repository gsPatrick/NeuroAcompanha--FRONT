'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/authService';
import { loadPreferences } from '@/features/settings/services/preferencesService';
import { validateLogin } from '../utils/validateLogin';

const HOME_ROUTE = '/';
const ONBOARDING_ROUTE = '/onboarding';

// step: gate (pergunta inicial) | form (e-mail e senha)
export function useLogin() {
  const router = useRouter();
  const [step, setStep] = useState('gate');
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openForm = () => setStep('form');

  const backToGate = () => {
    setStep('gate');
    setErrors({});
    setSubmitError('');
  };

  const skip = () => router.push(HOME_ROUTE);

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
      router.push(loadPreferences().onboarded ? HOME_ROUTE : ONBOARDING_ROUTE);
    } catch {
      setSubmitError('Não foi possível entrar. Verifique os dados e tente novamente.');
      setSubmitting(false);
    }
  };

  return { step, values, errors, submitError, submitting, openForm, backToGate, skip, changeField, submit };
}
