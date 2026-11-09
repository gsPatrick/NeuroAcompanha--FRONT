'use client';

import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import { APP_VERSION, formatVersion } from '@/constants/appVersion';
import { useToast } from '@/hooks/useToast';
import { useAppUpdate } from '../../hooks/useAppUpdate';
import styles from './AppVersionSetting.module.css';

// Versão instalada + botão para buscar atualização na hora (além da checagem automática).
export default function AppVersionSetting() {
  // watch:false: a checagem automática já roda no app inteiro; aqui só a manual.
  const { checking, check, apply } = useAppUpdate({ watch: false });
  const showToast = useToast();

  const handleCheck = async () => {
    const { isNew, serverVersion } = await check();
    if (isNew) {
      apply();
    } else if (serverVersion === null) {
      showToast('Não foi possível verificar. Confira a internet.');
    } else {
      showToast('Você já está na versão mais recente.');
    }
  };

  return (
    <div className={styles.setting}>
      <div className={styles.info}>
        <span className={styles.label}>Versão do app</span>
        <span className={styles.value}>{formatVersion(APP_VERSION)}</span>
      </div>
      <AppButton variant="secondary" size="md" loading={checking} onClick={handleCheck}>
        Buscar atualização
      </AppButton>
    </div>
  );
}
