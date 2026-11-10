import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './PranchetaQuestion.module.css';

// Uma pergunta da prancheta, no formato que ela pede (`question.type`):
//   yesno   Sim / Não (tocar de novo limpa)
//   choice  escolher uma opção (tocar de novo limpa)
//   check   uma caixinha para marcar
//   text    um campo de texto
// `value`: { answer, obs }. `onChange` recebe só o que mudou. `readOnly`: só para ler (o relatório do dia).
export default function PranchetaQuestion({ question, value, onChange, readOnly = false }) {
  const { label, type = 'yesno', options = [] } = question;
  const answer = value?.answer ?? null;
  const toggle = (option) => onChange({ answer: answer === option ? null : option });

  if (type === 'text') {
    return (
      <div className={styles.block}>
        <label className={styles.label}>
          {label}
          <input
            className={styles.text}
            value={value?.obs ?? ''}
            placeholder={readOnly ? '' : 'Escreva aqui'}
            readOnly={readOnly}
            onChange={(event) => onChange({ obs: event.target.value })}
          />
        </label>
      </div>
    );
  }

  if (type === 'choice') {
    return (
      <div className={styles.block}>
        <span className={styles.label}>{label}</span>
        <div className={styles.options} role="group" aria-label={label}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.option} ${answer === option ? styles.picked : ''}`}
              aria-pressed={answer === option}
              onClick={() => toggle(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'check') {
    return (
      <button type="button" className={styles.check} aria-pressed={answer === 'yes'} onClick={() => toggle('yes')}>
        <span className={styles.checkLabel}>{label}</span>
        <span className={`${styles.box} ${answer === 'yes' ? styles.boxOn : ''}`}>
          {answer === 'yes' ? <AppIcon name="check" size={18} /> : null}
        </span>
      </button>
    );
  }

  return (
    <div className={styles.question}>
      <span className={styles.label}>{label}</span>
      <div className={styles.choices} role="group" aria-label={label}>
        <button type="button" className={`${styles.choice} ${answer === 'yes' ? styles.yes : ''}`} aria-pressed={answer === 'yes'} onClick={() => toggle('yes')}>
          Sim
        </button>
        <button type="button" className={`${styles.choice} ${answer === 'no' ? styles.no : ''}`} aria-pressed={answer === 'no'} onClick={() => toggle('no')}>
          Não
        </button>
      </div>
    </div>
  );
}
