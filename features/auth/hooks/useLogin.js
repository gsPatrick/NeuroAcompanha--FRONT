'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/authService';
import { isFaceIdEnabledHere, isFaceIdSupported, loginWithFaceId } from '../services/faceIdService';
import { routeAfterLogin } from '../utils/afterLogin';
import { offerFaceId } from '../utils/offerFaceId';
import { ApiError } from '@/core/api/apiClient';
import { useToast } from '@/hooks/useToast';
import { useHistoryStep } from '@/hooks/useHistoryStep';
import { validateLogin } from '../utils/validateLogin';

const GATE = 0;
const FORM = 1;

// step: gate (pergunta inicial) | form (e-mail e senha).
// As duas etapas ficam no histórico: o gesto de voltar do sistema leva do formulário de volta à pergunta.
export function useLogin() {
  const router = useRouter();
  const showToast = useToast();
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [enteringWithFaceId, setEnteringWithFaceId] = useState(false);
  const [stepIndex, goTo, goBack] = useHistoryStep(GATE);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const step = stepIndex === FORM ? 'form' : 'gate';

  // O botão do Face ID só aparece em aparelho que tem biometria e já ligou o Face ID.
  useEffect(() => {
    let active = true;
    if (isFaceIdEnabledHere()) isFaceIdSupported().then((supported) => active && setFaceIdAvailable(supported));
    return () => {
      active = false;
    };
  }, []);

  // Ao voltar para a pergunta, limpa os avisos de erro do formulário.
  useEffect(() => {
    if (stepIndex === GATE) {
      setErrors({});
      setSubmitError('');
    }
  }, [stepIndex]);

  const openForm = () => goTo(FORM);
  const backToGate = goBack;

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
      const result = await login(values);
      // Aparelho com biometria: oferece o Face ID uma vez (conta com senha provisória oferece depois de definir a senha).
      if (!result.mustChangePassword) await offerFaceId();
      router.replace(routeAfterLogin(result));
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Não foi possível entrar. Verifique os dados e tente novamente.');
      setSubmitting(false);
    }
  };

  // Entra só com o Face ID (sem e-mail nem senha).
  const signInWithFaceId = async () => {
    setEnteringWithFaceId(true);
    try {
      router.replace(routeAfterLogin(await loginWithFaceId()));
    } catch (error) {
      // Cancelar o pedido do aparelho não é erro.
      if (error?.name !== 'NotAllowedError') {
        showToast('Não foi possível entrar com o Face ID. Use e-mail e senha.');
        if (!isFaceIdEnabledHere()) setFaceIdAvailable(false);
      }
      setEnteringWithFaceId(false);
    }
  };

  return { faceIdAvailable, enteringWithFaceId, signInWithFaceId, step, values, errors, submitError, submitting, openForm, backToGate, changeField, submit };
}
