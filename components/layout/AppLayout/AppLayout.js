'use client';

import { Page, Navbar, NavLeft, NavRight, Toolbar } from 'framework7-react';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import styles from './AppLayout.module.css';

// Moldura padrão das telas: conteúdo + navegação inferior.
// Com `title`, mostra a barra superior com título grande (iOS). Sem `title`, a tela
// traz o próprio cabeçalho (ver AppHeader).
// Navbar e Toolbar precisam ser filhos diretos do Page para o Framework7 posicioná-los.
export default function AppLayout({ title, navLeft, navRight, children }) {
  return (
    <Page>
      {title ? (
        <Navbar title={title} large largeTransparent>
          {navLeft ? <NavLeft>{navLeft}</NavLeft> : null}
          {navRight ? <NavRight>{navRight}</NavRight> : null}
        </Navbar>
      ) : null}
      <Toolbar tabbar icons bottom>
        <BottomNavigation />
      </Toolbar>
      <div className={styles.content}>{children}</div>
    </Page>
  );
}
