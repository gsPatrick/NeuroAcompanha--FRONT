'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import { recordId, removeBlockFromDay, renameBlockInDay } from '@/features/records/services/recordsStore';
import { toDateKey } from '@/utils/calendar';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './EditBlockTemplate.module.css';

// Tela de mudar o momento que estava aberto: primeiro pergunta o que fazer (Trocar o nome ou Remover);
// "Trocar" pede o nome novo, "Remover" pede a confirmação. Vale só para o dia de hoje.
export default function EditBlockTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {({ child, record }) => <EditBlockFlow child={child} record={record} />}
    </RecordScreen>
  );
}

function EditBlockFlow({ child, record }) {
  const router = useRouter();
  // Momento que estava aberto (o cursor); sem cursor, o registro abriu no primeiro.
  const block = record.blocks.find((item) => item.id === record.cursor) ?? record.blocks[0];
  const [mode, setMode] = useState('choose'); // choose | rename | remove
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const title = name.trim();
  const id = recordId(child.id, toDateKey(new Date()));

  if (!block) {
    return (
      <div className={styles.form}>
        <p className={styles.description}>Este dia não tem momentos para mudar.</p>
        <AppButton variant="outline" fullWidth onClick={() => router.back()}>
          Voltar
        </AppButton>
      </div>
    );
  }

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
      router.back();
    } catch {
      setError('Não foi possível salvar. Tente de novo.');
      setBusy(false);
    }
  };

  const rename = (event) => {
    event.preventDefault();
    if (title) run(() => renameBlockInDay(id, block.id, title));
  };

  return (
    <div className={styles.form}>
      <div className={styles.texts}>
        <p className={styles.student}>{child.name}</p>
        <h1 className={styles.title}>{block.title}</h1>
        <p className={styles.description}>
          {mode === 'choose' ? 'O que você quer fazer com este momento? Vale só para hoje.' : null}
          {mode === 'rename' ? 'Escreva o nome que vai substituir este.' : null}
          {mode === 'remove' ? 'Remover este momento e tudo o que foi marcado nele hoje?' : null}
        </p>
      </div>

      {mode === 'choose' ? (
        <div className={styles.choices}>
          <AppButton fullWidth onClick={() => setMode('rename')}>
            Trocar o nome
          </AppButton>
          <AppButton variant="outline" fullWidth onClick={() => setMode('remove')}>
            Remover o momento
          </AppButton>
          <AppButton variant="tertiary" fullWidth onClick={() => router.back()}>
            Cancelar
          </AppButton>
        </div>
      ) : null}

      {mode === 'rename' ? (
        <form className={styles.choices} onSubmit={rename} noValidate>
          <AppInput label="Nome novo" name="blockName" placeholder={block.title} autoCapitalize="sentences" autoComplete="off" autoFocus value={name} onChange={setName} />
          <AppButton type="submit" fullWidth loading={busy} disabled={!title}>
            Trocar
          </AppButton>
          <AppButton variant="tertiary" fullWidth disabled={busy} onClick={() => setMode('choose')}>
            Voltar
          </AppButton>
        </form>
      ) : null}

      {mode === 'remove' ? (
        <div className={styles.choices}>
          <AppButton variant="destructive" fullWidth loading={busy} onClick={() => run(() => removeBlockFromDay(id, block.id))}>
            Remover mesmo
          </AppButton>
          <AppButton variant="tertiary" fullWidth disabled={busy} onClick={() => setMode('choose')}>
            Voltar
          </AppButton>
        </div>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
