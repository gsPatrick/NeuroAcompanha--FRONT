'use client';

import dynamic from 'next/dynamic';
import BrandMark from '@/components/ui/atoms/BrandMark/BrandMark';
import { APP_NAME } from '@/constants/brand';
import styles from './AppShell.module.css';

// Tela de abertura: já vai no HTML (aparece na hora, antes de qualquer JavaScript) com o símbolo e o nome.
// Isso evita a piscada em branco enquanto o app carrega, e combina com a tela de abertura do iOS.
function Splash() {
  return (
    <div className={styles.splash} role="status" aria-label={`Abrindo ${APP_NAME}`}>
      <BrandMark size="md" />
      <p className={styles.name}>{APP_NAME}</p>
    </div>
  );
}

// O Framework7 acessa window/document ao iniciar, então só roda no navegador.
const AppShellClient = dynamic(() => import('./AppShellClient'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function AppShell({ children }) {
  return <AppShellClient>{children}</AppShellClient>;
}
