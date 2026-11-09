'use client';

import YesNoQuestion from '@/components/ui/molecules/YesNoQuestion/YesNoQuestion';
import AppPreview from '@/components/ui/molecules/AppPreview/AppPreview';
import styles from './PranchetaPreview.module.css';

const QUESTIONS = [
  { label: 'Fez sozinho(a)?', answer: 'yes' },
  { label: 'Terminou as atividades?', answer: 'yes' },
  { label: 'Desistiu no meio?', answer: 'no' },
  { label: 'Manteve a concentração?', answer: 'yes' },
  { label: 'Precisou de redirecionamento?', answer: null },
  { label: 'Pediu ajuda?', answer: 'yes' },
];

// Demonstração da prancheta de observação: perguntas com Sim e Não.
export default function PranchetaPreview() {
  return (
    <AppPreview>
      <h3 className={styles.title}>Atividades e atenção</h3>
      <div className={styles.box}>
        {QUESTIONS.map((question) => (
          <YesNoQuestion key={question.label} label={question.label} value={{ answer: question.answer, obs: '' }} onChange={() => {}} />
        ))}
      </div>
    </AppPreview>
  );
}
