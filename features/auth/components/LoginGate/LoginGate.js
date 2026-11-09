import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import styles from './LoginGate.module.css';

// Primeira etapa do painel: confirma a intenção antes de mostrar o formulário.
export default function LoginGate({ onConfirm, onSkip }) {
  return (
    <>
      <div className={styles.texts}>
        <h2 className={styles.title}>Você deseja fazer login?</h2>
        <p className={styles.description}>Entre para acessar seus atendimentos e registros.</p>
      </div>
      <div className={styles.actions}>
        <AppButton fullWidth onClick={onConfirm}>
          Sim, entrar
        </AppButton>
        <AppButton variant="tertiary" fullWidth onClick={onSkip}>
          Agora não
        </AppButton>
      </div>
    </>
  );
}
