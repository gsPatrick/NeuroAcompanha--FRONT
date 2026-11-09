'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import { appendBlock, recordId } from '@/features/records/services/recordsStore';
import { newBlock } from '@/features/routine/utils/routine';
import { toDateKey } from '@/utils/calendar';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './NewBlockTemplate.module.css';

// Tela para acrescentar um momento ao dia de hoje (outra aula, uma brincadeira a mais...): ela só digita o nome.
export default function NewBlockTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {({ child }) => <NewBlockForm child={child} />}
    </RecordScreen>
  );
}

function NewBlockForm({ child }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const title = name.trim();

  const submit = async (event) => {
    event.preventDefault();
    if (!title) return;
    setSaving(true);
    setError('');
    try {
      await appendBlock(recordId(child.id, toDateKey(new Date())), newBlock('other', title));
      // Volta ao registro, que reabre já no momento novo.
      router.back();
    } catch {
      setError('Não foi possível salvar. Tente de novo.');
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.texts}>
        <p className={styles.student}>{child.name}</p>
        <h1 className={styles.title}>Novo momento</h1>
        <p className={styles.description}>Dê um nome, por exemplo: Aula de Inglês, Recreio, Passeio.</p>
      </div>

      <AppInput label="Nome do momento" name="blockName" autoCapitalize="sentences" autoComplete="off" autoFocus value={name} onChange={setName} />

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <AppButton type="submit" fullWidth loading={saving} disabled={!title}>
        Adicionar ao dia
      </AppButton>
    </form>
  );
}
