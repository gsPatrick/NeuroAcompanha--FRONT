'use client';

import { useState } from 'react';
import styles from './YesNoQuestion.module.css';

// Uma pergunta da prancheta: Sim / Não (tocar de novo limpa) e um campo de observação que abre sob demanda.
// `obsOnly`: perguntas que pedem só texto. `value`: { answer: 'yes' | 'no' | null, obs }.
export default function YesNoQuestion({ label, obsOnly = false, value, onChange }) {
  const answer = value?.answer ?? null;
  const obs = value?.obs ?? '';
  const [obsOpen, setObsOpen] = useState(Boolean(obs) || obsOnly);

  const choose = (option) => onChange({ answer: answer === option ? null : option });

  return (
    <div className={styles.question}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        {obsOnly ? null : (
          <div className={styles.choices} role="group" aria-label={label}>
            <button type="button" className={`${styles.choice} ${answer === 'yes' ? styles.yes : ''}`} aria-pressed={answer === 'yes'} onClick={() => choose('yes')}>
              Sim
            </button>
            <button type="button" className={`${styles.choice} ${answer === 'no' ? styles.no : ''}`} aria-pressed={answer === 'no'} onClick={() => choose('no')}>
              Não
            </button>
          </div>
        )}
      </div>

      {obsOpen ? (
        <input
          className={styles.obs}
          value={obs}
          placeholder={obsOnly ? 'Escreva aqui' : 'Observação'}
          aria-label={`Observação: ${label}`}
          onChange={(event) => onChange({ obs: event.target.value })}
        />
      ) : (
        <button type="button" className={styles.addObs} onClick={() => setObsOpen(true)}>
          + Observação
        </button>
      )}
    </div>
  );
}
