'use client';

import { useRef, useState } from 'react';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import { useToast } from '@/hooks/useToast';
import { cropToSquare } from '../../utils/cropToSquare';
import styles from './PhotoUploadButton.module.css';

// Botão redondo de câmera, para ficar no canto da foto: abre o seletor (no iPhone já oferece "Tirar foto" e "Fototeca"),
// recorta a foto em quadrado e entrega `onPick(dataUrl)`. `onPick` pode ser assíncrono (o botão espera).
export default function PhotoUploadButton({ label = 'Trocar foto', onPick }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const showToast = useToast();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    try {
      await onPick(await cropToSquare(file));
    } catch {
      showToast('Não foi possível salvar a foto. Tente outra.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" className={styles.button} aria-label={label} aria-busy={busy || undefined} disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : <AppIcon name="camera" size={18} />}
      </button>
      <input ref={inputRef} className={styles.fileInput} type="file" accept="image/*" onChange={handleFile} tabIndex={-1} />
    </>
  );
}
