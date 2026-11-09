'use client';

import { useState } from 'react';
import AppButton from '../../atoms/AppButton/AppButton';
import AppInput from '../../atoms/AppInput/AppInput';
import { BLOCK_KINDS } from '@/features/records/data/prancheta';
import styles from './BlockEditor.module.css';

// Único painel para mudar a rotina DO DIA: trocar o nome do momento aberto (ex.: outra matéria), removê-lo ou
// acrescentar um novo (outra aula, brincadeira...). `block` vazio = adicionar.
export default function BlockEditor({ block, onAdd, onRename, onRemove, onClose }) {
  const [kind, setKind] = useState(BLOCK_KINDS[0]);
  const [name, setName] = useState(block?.title ?? '');
  const [confirmRemove, setConfirmRemove] = useState(false);
  const adding = !block;

  const needsName = adding ? kind.askName : true;
  const finalName = adding && !kind.askName ? kind.defaultTitle : name.trim();

  const save = () => {
    if (!finalName) return;
    if (adding) onAdd(kind.kind, finalName);
    else onRename(block.id, finalName);
    onClose();
  };

  return (
    <div className={styles.editor}>
      {adding ? (
        <div className={styles.kinds} role="radiogroup" aria-label="Tipo de momento">
          {BLOCK_KINDS.map((option) => (
            <button
              key={option.kind}
              type="button"
              role="radio"
              aria-checked={option.kind === kind.kind}
              className={`${styles.kind} ${option.kind === kind.kind ? styles.kindSelected : ''}`}
              onClick={() => setKind(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {needsName ? (
        <AppInput
          label={adding ? kind.placeholder : 'Nome do momento (mude se hoje for outra aula)'}
          name="blockName"
          autoCapitalize="sentences"
          autoComplete="off"
          value={name}
          onChange={setName}
        />
      ) : null}

      <div className={styles.actions}>
        {!adding ? (
          confirmRemove ? (
            <AppButton variant="destructive" size="md" onClick={() => onRemove(block.id)}>
              Remover mesmo
            </AppButton>
          ) : (
            <AppButton variant="tertiary" size="md" onClick={() => setConfirmRemove(true)}>
              Remover
            </AppButton>
          )
        ) : null}
        <span className={styles.spacer} />
        <AppButton variant="outline" size="md" onClick={onClose}>
          Cancelar
        </AppButton>
        <AppButton size="md" disabled={!finalName} onClick={save}>
          {adding ? 'Adicionar' : 'Salvar'}
        </AppButton>
      </div>
    </div>
  );
}
