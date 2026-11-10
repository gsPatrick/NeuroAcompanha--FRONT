'use client';

import { Page } from 'framework7-react';
import { useParams } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import ProgressBar from '@/components/ui/molecules/ProgressBar/ProgressBar';
import RoutineStep from '@/features/routine/components/RoutineStep/RoutineStep';
import NeurodivergenceStep from '@/features/students/components/NeurodivergenceStep/NeurodivergenceStep';
import StudentNameStep from '@/features/students/components/StudentNameStep/StudentNameStep';
import StudentPhotoStep from '@/features/students/components/StudentPhotoStep/StudentPhotoStep';
import { STUDENT_FORM_STEPS, useStudentForm } from '@/features/students/hooks/useStudentForm';
import styles from '../OnboardingTemplate/OnboardingTemplate.module.css';

const firstNameOf = (name) => name.trim().split(/\s+/)[0] || '';

// Título e descrição de cada etapa (os mesmos do cadastro inicial; o nome do aluno entra nos textos).
function getCopy(step, name, isEdit) {
  const firstName = firstNameOf(name);
  switch (step) {
    case 'name':
      return { title: isEdit ? 'Qual é o nome do aluno?' : 'Qual é o nome do novo aluno?', description: 'Como ele(a) é chamado(a) no dia a dia.' };
    case 'photo':
      return { title: firstName ? `Foto de ${firstName}` : 'Foto do aluno', description: 'Ajuda a reconhecer o aluno de relance.' };
    case 'neuro':
      return {
        title: firstName ? `Neurodivergências de ${firstName}` : 'Neurodivergências',
        description: 'Marque uma ou mais e informe o nível que consta no laudo. O nível é opcional.',
      };
    default:
      return {
        title: firstName ? `Rotina de ${firstName}` : 'Rotina do aluno',
        description: 'Ligue os dias em que você atende. Em cada dia, diga se tem acolhimento e quais são as aulas. Lanche e brincadeiras entram sozinhos.',
      };
  }
}

// "Novo aluno" (/criancas/novo) e "Editar aluno" (/criancas/[id]/editar): os mesmos passos do cadastro inicial
// (nome, foto, neurodivergências e rotina), para um aluno só. O último passo tem o botão Salvar.
export default function StudentFormTemplate({ mode = 'new' }) {
  const { childId } = useParams();
  const form = useStudentForm(mode === 'edit' ? childId : undefined);

  if (form.status !== 'ready') {
    return (
      <Page noNavbar noToolbar>
        <main className={styles.screen}>
          <header className={styles.header}>
            <BrandLockup size="sm" />
          </header>
          <section className={styles.body}>
            {form.status === 'loading' ? (
              <AppSkeleton shape="title" />
            ) : (
              <EmptyState icon="alert" title="Aluno não encontrado" description="Volte e escolha o aluno na lista." />
            )}
          </section>
        </main>
      </Page>
    );
  }

  const { draft, step } = form;
  const copy = getCopy(step, draft.name, form.isEdit);

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <BrandLockup size="sm" />
            <span className={styles.counter}>{form.isEdit ? 'Editar aluno' : 'Novo aluno'}</span>
          </div>
          <ProgressBar current={form.stepIndex + 1} total={STUDENT_FORM_STEPS.length} label="Progresso do cadastro" />
        </header>

        <section key={step} className={styles.body} aria-live="polite">
          <div className={styles.texts}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.description}>{copy.description}</p>
          </div>

          {step === 'name' ? <StudentNameStep value={draft.name} error={form.nameError} onChange={form.setName} onSubmit={form.next} /> : null}
          {step === 'photo' ? <StudentPhotoStep student={draft} onChange={form.setPhoto} /> : null}
          {step === 'neuro' ? <NeurodivergenceStep selections={draft.conditions} onToggle={form.toggleCondition} onChangeLevel={form.setLevel} /> : null}
          {step === 'routine' ? <RoutineStep routine={draft.routine} onChangeDay={form.setRoutineDay} onCopyDay={form.copyRoutineDay} /> : null}

          {form.saveError ? (
            <p className={styles.error} role="alert">
              {form.saveError}
            </p>
          ) : null}
        </section>

        <footer className={styles.footer}>
          {form.isLast ? (
            <div className={styles.finish}>
              <AppButton fullWidth loading={form.saving} onClick={form.save}>
                Salvar
              </AppButton>
              <AppButton variant="tertiary" fullWidth disabled={form.saving} onClick={form.back}>
                Voltar
              </AppButton>
            </div>
          ) : (
            <div className={styles.bar}>
              <div className={styles.barStart}>
                <AppButton variant="tertiary" onClick={form.back}>
                  {form.stepIndex === 0 ? 'Cancelar' : 'Voltar'}
                </AppButton>
              </div>
              <div className={styles.barEnd}>
                <AppButton variant="accentIcon" icon="arrowRight" ariaLabel="Continuar" onClick={form.next} />
              </div>
            </div>
          )}
        </footer>
      </main>
    </Page>
  );
}
