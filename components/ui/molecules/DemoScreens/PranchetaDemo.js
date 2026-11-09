import styles from './DemoScreens.module.css';

const QUESTIONS = [
  { label: 'Fez sozinho(a)?', answer: 'yes' },
  { label: 'Terminou as atividades?', answer: 'yes' },
  { label: 'Desistiu no meio?', answer: 'no' },
  { label: 'Manteve a concentração?', answer: 'yes' },
  { label: 'Precisou de redirecionamento?', answer: null },
  { label: 'Pediu ajuda?', answer: 'yes' },
];

// Tela de demonstração: perguntas da prancheta com Sim e Não.
export default function PranchetaDemo() {
  return (
    <>
      <p className={styles.groupTitle}>Atenção e atividades</p>
      <div>
        {QUESTIONS.map((question) => (
          <div key={question.label} className={styles.question}>
            <span>{question.label}</span>
            <span className={styles.answers}>
              <span className={`${styles.answer} ${question.answer === 'yes' ? styles.yes : ''}`}>Sim</span>
              <span className={`${styles.answer} ${question.answer === 'no' ? styles.no : ''}`}>Não</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
