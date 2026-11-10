import QuickMark from '../QuickMark/QuickMark';
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

  // Escolha de uma opção e caixinha: as mesmas linhas com bolinha das marcações rápidas.
  if (type === 'choice') {
    return (
      <div className={styles.block}>
        <span className={styles.label}>{label}</span>
        <div className={styles.options} role="group" aria-label={label}>
          {options.map((option) => (
            <QuickMark key={option} label={option} selected={answer === option} onMark={readOnly ? undefined : () => toggle(option)} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'check') {
    return (
      <div className={styles.block}>
        <QuickMark label={label} selected={answer === 'yes'} onMark={readOnly ? undefined : () => toggle('yes')} />
      </div>
    );
  }

  // Sim / Não: duas bolinhas lado a lado; a marcada ganha o X.
  return (
    <div className={styles.question}>
      <span className={styles.label}>{label}</span>
      <div className={styles.choices} role="group" aria-label={label}>
        {[
          ['yes', 'Sim'],
          ['no', 'Não'],
        ].map(([value, text]) => (
          <button key={value} type="button" className={styles.choice} aria-pressed={answer === value} onClick={() => toggle(value)}>
            <span className={`${styles.bubble} ${answer === value ? styles.bubbleOn : ''}`} aria-hidden="true">
              {answer === value ? <Cross /> : null}
            </span>
            <span className={styles.choiceText}>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
