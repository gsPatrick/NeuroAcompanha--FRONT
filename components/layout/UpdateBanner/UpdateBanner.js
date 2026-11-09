import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import styles from './UpdateBanner.module.css';

// Aviso discreto de versão nova, acima da barra de baixo. Aparece quando a atualização não pôde ser aplicada
// sozinha (o app estava aberto, ou numa tela de formulário). Tocar em "Atualizar" recarrega o app.
export default function UpdateBanner({ visible, onUpdate }) {
  if (!visible) return null;

  return (
    <div className={styles.banner} role="status">
      <p className={styles.text}>Nova versão disponível</p>
      <AppButton size="md" onClick={onUpdate}>
        Atualizar
      </AppButton>
    </div>
  );
}
