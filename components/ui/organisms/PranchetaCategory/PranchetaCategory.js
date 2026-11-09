'use client';

import { useId, useState } from 'react';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import YesNoQuestion from '../../molecules/YesNoQuestion/YesNoQuestion';
import styles from './PranchetaCategory.module.css';

// Uma categoria da prancheta (ex.: Atenção) em sanfona. O cabeçalho mostra quantas perguntas já têm resposta.
// `answers`: { [pergunta]: { answer, obs } } deste bloco.
export default function PranchetaCategory({ category, answers, onAnswer }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const answered = category.questions.filter((question) => answers?.[question.key]?.answer || answers?.[question.key]?.obs?.trim()).length;

  return (
    <section className={styles.category}>
      <button type="button" className={styles.header} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)}>
        <span className={styles.title}>{category.title}</span>
        <span className={styles.meta}>
          {answered ? <span className={styles.count}>{answered}</span> : null}
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
            <AppIcon name="chevronRight" size={18} />
          </span>
        </span>
      </button>

      {open ? (
        <div id={panelId} className={styles.body}>
          {category.questions.map((question) => (
            <YesNoQuestion
              key={question.key}
              label={question.label}
              obsOnly={question.obsOnly}
              value={answers?.[question.key]}
              onChange={(patch) => onAnswer(question.key, patch)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
