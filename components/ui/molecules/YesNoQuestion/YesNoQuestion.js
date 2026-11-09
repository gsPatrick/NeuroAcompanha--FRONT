// Uma pergunta da prancheta: Sim / Não (tocar de novo limpa). `obsOnly`: perguntas que pedem só texto.
// `value`: { answer: 'yes' | 'no' | null, obs }.
import styles from './YesNoQuestion.module.css';

export default function YesNoQuestion({ label, obsOnly = false, value, onChange }) {
  const answer = value?.answer ?? null;
  const choose = (option) => onChange({ answer: answer === option ? null : option });

  if (obsOnly) {
    return (
      <div className={styles.textQuestion}>
        <label className={styles.label}>
          {label}
          <input
            className={styles.obs}
            value={value?.obs ?? ''}
            placeholder="Escreva aqui"
            onChange={(event) => onChange({ obs: event.target.value })}
          />
        </label>
      </div>
    );
  }

  return (
    <div className={styles.question}>
      <span className={styles.label}>{label}</span>
      <div className={styles.choices} role="group" aria-label={label}>
        <button type="button" className={`${styles.choice} ${answer === 'yes' ? styles.yes : ''}`} aria-pressed={answer === 'yes'} onClick={() => choose('yes')}>
          Sim
        </button>
        <button type="button" className={`${styles.choice} ${answer === 'no' ? styles.no : ''}`} aria-pressed={answer === 'no'} onClick={() => choose('no')}>
          Não
        </button>
      </div>
    </div>
  );
}
