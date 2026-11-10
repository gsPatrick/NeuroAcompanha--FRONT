'use client';

import { useState } from 'react';
import { Page } from 'framework7-react';
import { useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import { ApiError } from '@/core/api/apiClient';
import { useUser } from '@/features/user/hooks/useUser';
import { updateUser } from '@/features/user/services/userService';
import screen from '../RecordScreen/RecordScreen.module.css';
import styles from '../NewBlockTemplate/NewBlockTemplate.module.css';

const MIN_NAME_LENGTH = 2;

// Editar o perfil da profissional: o nome (sai como "Aplicadora" no relatório) e a descrição (a função que aparece
// embaixo do nome). A foto se troca direto no perfil, pelo botão de câmera.
export default function EditProfileTemplate() {
  const router = useRouter();
  const { status, user } = useUser();

  return (
    <Page noNavbar noToolbar>
      <main className={screen.screen}>
        <header className={screen.header}>
          <button type="button" className={screen.back} onClick={() => router.back()}>
            <AppIcon name="arrowLeft" size={20} />
            Voltar
          </button>
        </header>

        {status === 'loading' ? (
          <div className={screen.loading}>
            <AppSkeleton shape="title" />
            <AppSkeleton shape="title" short />
          </div>
        ) : null}
        {status === 'error' ? <EmptyState icon="alert" title="Não foi possível carregar" description="Verifique a conexão e tente novamente." /> : null}
        {status === 'success' ? <ProfileForm user={user} onDone={() => router.back()} /> : null}
      </main>
    </Page>
  );
}

function ProfileForm({ user, onDone }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (fullName.trim().length < MIN_NAME_LENGTH) {
      setError('Informe o seu nome.');
      return;
    }
    if (!role.trim()) {
      setError('Escreva a descrição, por exemplo: Acompanhante terapêutica (AT).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateUser({ fullName: fullName.trim(), role: role.trim() });
      onDone();
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : 'Não foi possível salvar. Tente de novo.');
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.texts}>
        <h1 className={styles.title}>Editar perfil</h1>
        <p className={styles.description}>O nome aparece como aplicadora no relatório. A descrição fica embaixo do seu nome no perfil.</p>
      </div>

      <AppInput label="Nome" name="fullName" autoCapitalize="words" autoComplete="name" value={fullName} onChange={setFullName} disabled={saving} />
      <AppInput label="Descrição" name="role" autoCapitalize="sentences" autoComplete="off" value={role} onChange={setRole} disabled={saving} />

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <AppButton type="submit" fullWidth loading={saving}>
        Salvar
      </AppButton>
    </form>
  );
}
