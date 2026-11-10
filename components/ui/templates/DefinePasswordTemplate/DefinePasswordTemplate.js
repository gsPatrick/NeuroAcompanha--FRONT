'use client';

import { Page } from 'framework7-react';
import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import IllustrationGrid from '@/components/ui/molecules/IllustrationGrid/IllustrationGrid';
import DefinePasswordForm from '@/features/auth/components/DefinePasswordForm/DefinePasswordForm';
import { useDefinePassword } from '@/features/auth/hooks/useDefinePassword';
import styles from '../LoginTemplate/LoginTemplate.module.css';

// Primeiro acesso, com senha provisória: mesma tela da entrada (ilustrações + painel azul), só que pede a senha nova.
export default function DefinePasswordTemplate() {
  const password = useDefinePassword();

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <section className={styles.art}>
          <div className={styles.brand}>
            <BrandLockup />
          </div>
          <div className={styles.gridArea}>
            <IllustrationGrid compact />
          </div>
        </section>

        <section className={`${styles.panel} ${styles.panelForm}`} aria-live="polite">
          <div className={styles.step}>
            <DefinePasswordForm
              values={password.values}
              errors={password.errors}
              submitError={password.submitError}
              submitting={password.submitting}
              onChange={password.changeField}
              onSubmit={password.submit}
            />
          </div>
        </section>
      </main>
    </Page>
  );
}
