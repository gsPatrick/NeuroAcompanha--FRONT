'use client';

import { useRef, useState } from 'react';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import { cropToSquare } from '../../utils/cropToSquare';
import styles from './StudentPhotoStep.module.css';

// Passo "foto": opcional. Sem foto, vale uma ilustração (não identifica a criança).
// O seletor de arquivo do iPhone já oferece "Tirar foto" e "Fototeca".
export default function StudentPhotoStep({ student, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      onChange(await cropToSquare(file));
    } catch {
      setError('Não foi possível usar essa foto. Tente outra.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.step}>
      <span className={styles.frame}>
        <AppAvatar
          photo={student.photo ?? undefined}
          person={student.avatar}
          initials={student.name.slice(0, 1)}
          size="xxl"
          shape="circle"
        />
      </span>

      <div className={styles.actions}>
        <AppButton variant="secondary" icon="camera" fullWidth loading={busy} onClick={() => inputRef.current?.click()}>
          {student.photo ? 'Trocar foto' : 'Escolher foto'}
        </AppButton>
        {student.photo ? (
          <AppButton variant="tertiary" fullWidth onClick={() => onChange(null)}>
            Remover foto
          </AppButton>
        ) : null}
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <p className={styles.hint}>Opcional. Use a foto só com a autorização do responsável.</p>

      <input ref={inputRef} className={styles.fileInput} type="file" accept="image/*" onChange={handleFile} tabIndex={-1} />
    </div>
  );
}
