'use client';

import dynamic from 'next/dynamic';
import styles from './AppShell.module.css';

// O Framework7 acessa window/document ao iniciar, então só roda no navegador.
// Enquanto carrega, mostramos apenas o fundo do app para não piscar.
const AppShellClient = dynamic(() => import('./AppShellClient'), {
  ssr: false,
  loading: () => <div className={styles.splash} aria-hidden="true" />,
});

export default function AppShell({ children }) {
  return <AppShellClient>{children}</AppShellClient>;
}
