import YesNoQuestion from '../../molecules/YesNoQuestion/YesNoQuestion';
import styles from './PranchetaSection.module.css';

// Uma categoria da prancheta (ex.: Atenção), sempre aberta: título e as perguntas com Sim / Não.
// `answers`: { [pergunta]: { answer, obs } } do momento aberto.
export default function PranchetaSection({ category, answers, onAnswer }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{category.title}</h3>
      <div className={styles.questions}>
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
    </section>
  );
}
