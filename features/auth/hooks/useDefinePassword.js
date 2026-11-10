'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/core/api/apiClient';
import { defineFirstPassword } from '../services/authService';
import { routeAfterLogin } from '../utils/afterLogin';
import { offerFaceId } from '../utils/offerFaceId';

const MIN_LENGTH = 8;

// Primeiro acesso: a AT escolhe a própria senha (no lugar da provisória). Depois oferece o Face ID e segue.
export function useDefinePassword() {
  const router = useRouter();
  const [values, setValues] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const changeField = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError('');
  };

  const submit = async () => {
    const found = {};
    if (values.password.length < MIN_LENGTH) found.password = `Use ao menos ${MIN_LENGTH} caracteres.`;
    if (values.confirm !== values.password) found.confirm = 'As senhas não são iguais.';
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const { hasChildren } = await defineFirstPassword(values.password);
      await offerFaceId();
      router.replace(routeAfterLogin({ hasChildren }));
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Não foi possível salvar a senha. Tente de novo.');
      setSubmitting(false);
    }
  };

  return { values, errors, submitError, submitting, changeField, submit };
}
