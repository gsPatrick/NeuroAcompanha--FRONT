import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import styles from './LoginGate.module.css';

// Primeira etapa do painel: confirma a intenção antes de mostrar o formulário.
// Com `onFaceId` (aparelho com Face ID ligado), o Face ID vira o caminho principal e e-mail/senha fica logo abaixo.
export default function LoginGate({ onConfirm, onSkip, onFaceId, enteringWithFaceId = false }) {
  return (
    <>
      <div className={styles.texts}>
        <h2 className={styles.title}>Você deseja fazer login?</h2>
        <p className={styles.description}>Entre para acessar seus atendimentos e registros.</p>
      </div>
      <div className={styles.actions}>
        {onFaceId ? (
          <AppButton fullWidth icon="user" loading={enteringWithFaceId} onClick={onFaceId}>
            Entrar com Face ID
          </AppButton>
        ) : null}
        <AppButton variant={onFaceId ? 'outline' : 'primary'} fullWidth disabled={enteringWithFaceId} onClick={onConfirm}>
          {onFaceId ? 'Entrar com e-mail e senha' : 'Sim, entrar'}
        </AppButton>
        <AppButton variant="tertiary" fullWidth onClick={onSkip}>
          Agora não
        </AppButton>
      </div>
    </>
  );
}
