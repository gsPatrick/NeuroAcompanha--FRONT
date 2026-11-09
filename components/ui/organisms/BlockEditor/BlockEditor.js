'use client';

import { useState } from 'react';
import AppButton from '../../atoms/AppButton/AppButton';
import AppInput from '../../atoms/AppInput/AppInput';
import styles from './BlockEditor.module.css';

// Painel para mudar um momento DO DIA: trocar o nome (ex.: hoje a aula é outra matéria) ou removê-lo.
export default function BlockEditor({ block, onRename, onRemove, onClose }) {
  const [name, setName] = useState(block.title);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const finalName = name.trim();

  const save = () => {
    if (!finalName) return;
    onRename(block.id, finalName);
    onClose();
  };

  return (
    <div className={styles.editor}>
      <AppInput
        label="Nome do momento (mude se hoje for outra aula)"
        name="blockName"
        autoCapitalize="sentences"
        autoComplete="off"
        value={name}
        onChange={setName}
      />

      <div className={styles.actions}>
        {confirmRemove ? (
          <AppButton variant="destructive" size="md" onClick={() => onRemove(block.id)}>
            Remover mesmo
          </AppButton>
        ) : (
          <AppButton variant="tertiary" size="md" onClick={() => setConfirmRemove(true)}>
            Remover
          </AppButton>
        )}
        <span className={styles.spacer} />
        <AppButton variant="outline" size="md" onClick={onClose}>
          Cancelar
        </AppButton>
        <AppButton size="md" disabled={!finalName} onClick={save}>
          Salvar
        </AppButton>
      </div>
    </div>
  );
}
