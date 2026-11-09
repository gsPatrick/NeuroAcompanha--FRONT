import NumberStepper from '@/components/ui/molecules/NumberStepper/NumberStepper';
import styles from './DailyChildrenSetting.module.css';

const MAX_STUDENTS = 6;

// Quantos alunos a AT atende (define quantos cadastros o onboarding pede).
export default function DailyChildrenSetting({ value, onChange }) {
  return (
    <div className={styles.setting}>
      <NumberStepper
        value={value}
        min={1}
        max={MAX_STUDENTS}
        onChange={onChange}
        unit={['aluno', 'alunos']}
        label="Quantidade de alunos"
      />
      <p className={styles.hint}>
        {value === 1 ? 'Você vai cadastrar 1 aluno.' : `Você vai cadastrar ${value} alunos, um de cada vez.`}
      </p>
    </div>
  );
}
