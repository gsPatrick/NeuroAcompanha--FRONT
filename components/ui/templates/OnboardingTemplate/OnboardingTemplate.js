'use client';

import { Page } from 'framework7-react';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import ProgressBar from '@/components/ui/molecules/ProgressBar/ProgressBar';
import DailyChildrenSetting from '@/features/settings/components/DailyChildrenSetting/DailyChildrenSetting';
import { useOnboarding } from '@/features/settings/hooks/useOnboarding';
import NeurodivergenceStep from '@/features/students/components/NeurodivergenceStep/NeurodivergenceStep';
import StudentNameStep from '@/features/students/components/StudentNameStep/StudentNameStep';
import StudentPhotoStep from '@/features/students/components/StudentPhotoStep/StudentPhotoStep';
import { formatConditionList } from '@/features/students/utils/formatConditions';
import styles from './OnboardingTemplate.module.css';

const firstNameOf = (name) => name.trim().split(/\s+/)[0] || '';

// Título e descrição de cada etapa (o nome do aluno entra nos textos quando já foi digitado).
function getCopy(step, student, count) {
  const firstName = student ? firstNameOf(student.name) : '';

  switch (step.type) {
    case 'quantity':
      return {
        title: 'Quantos alunos você atende?',
        description: 'Em seguida você cadastra cada um: nome, foto e neurodivergências.',
      };
    case 'name':
      return {
        title: count > 1 ? `Qual é o nome do aluno ${step.student + 1}?` : 'Qual é o nome do aluno?',
        description: 'Como ele(a) é chamado(a) no dia a dia.',
      };
    case 'photo':
      return {
        title: firstName ? `Foto de ${firstName}` : 'Foto do aluno',
        description: 'Ajuda a reconhecer o aluno de relance.',
      };
    case 'neuro':
      return {
        title: firstName ? `Neurodivergências de ${firstName}` : 'Neurodivergências',
        description: 'Marque uma ou mais e informe o nível que consta no laudo. O nível é opcional.',
      };
    default:
      return {
        title: 'Tudo pronto!',
        description: count > 1 ? 'Seus alunos foram cadastrados.' : 'Seu aluno foi cadastrado.',
      };
  }
}

export default function OnboardingTemplate() {
  const onboarding = useOnboarding();
  const { step, student, count, steps, stepIndex } = onboarding;
  const copy = getCopy(step, student, count);
  const isLast = step.type === 'done';
  const isFirst = step.type === 'quantity';

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <BrandLockup size="sm" />
            {student && count > 1 ? (
              <span className={styles.counter}>
                Aluno {step.student + 1} de {count}
              </span>
            ) : null}
          </div>
          <ProgressBar current={stepIndex + 1} total={steps.length} label="Progresso do cadastro" />
        </header>

        <section key={`${step.type}-${step.student ?? ''}`} className={styles.body} aria-live="polite">
          <div className={styles.texts}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.description}>{copy.description}</p>
          </div>

          {step.type === 'quantity' ? (
            <DailyChildrenSetting value={count} onChange={onboarding.changeCount} />
          ) : null}

          {step.type === 'name' ? (
            <StudentNameStep
              value={student.name}
              error={onboarding.nameError}
              onChange={(value) => onboarding.setName(step.student, value)}
              onSubmit={onboarding.next}
            />
          ) : null}

          {step.type === 'photo' ? (
            <StudentPhotoStep student={student} onChange={(photo) => onboarding.setPhoto(step.student, photo)} />
          ) : null}

          {step.type === 'neuro' ? (
            <NeurodivergenceStep
              selections={student.conditions}
              onToggle={(conditionId) => onboarding.toggleCondition(step.student, conditionId)}
              onChangeLevel={(conditionId, groupId, optionId) =>
                onboarding.setLevel(step.student, conditionId, groupId, optionId)
              }
            />
          ) : null}

          {isLast ? <Summary students={onboarding.students} /> : null}

          {isLast && onboarding.saveError ? (
            <p className={styles.error} role="alert">
              {onboarding.saveError}
            </p>
          ) : null}
        </section>

        <footer className={styles.footer}>
          {isLast ? (
            <div className={styles.finish}>
              <AppButton fullWidth loading={onboarding.saving} onClick={onboarding.finish}>
                Começar
              </AppButton>
              <AppButton variant="tertiary" fullWidth disabled={onboarding.saving} onClick={onboarding.back}>
                Voltar
              </AppButton>
            </div>
          ) : (
            <div className={styles.bar}>
              <div className={styles.barStart}>
                <AppButton variant="tertiary" onClick={isFirst ? onboarding.skip : onboarding.back}>
                  {isFirst ? 'Pular' : 'Voltar'}
                </AppButton>
              </div>
              <div className={styles.barEnd}>
                <AppButton variant="accentIcon" icon="arrowRight" ariaLabel="Continuar" onClick={onboarding.next} />
              </div>
            </div>
          )}
        </footer>
      </main>
    </Page>
  );
}

// Resumo final: cada aluno cadastrado, com foto (ou ilustração) e as neurodivergências informadas.
function Summary({ students }) {
  return (
    <ul className={styles.summary}>
      {students.map((student) => (
        <li key={student.id} className={styles.summaryRow}>
          <AppAvatar
            photo={student.photo ?? undefined}
            person={student.avatar}
            initials={student.name.slice(0, 1)}
            size="lg"
            shape="circle"
          />
          <div className={styles.summaryTexts}>
            <span className={styles.summaryName}>{student.name.trim()}</span>
            <span className={styles.summaryTags}>
              {formatConditionList(student.conditions).flatMap((parts) =>
                parts.map((label, index) => (
                  <span key={`${parts[0]}-${label}`} className={`${styles.tag} ${index === 0 ? styles.tagMain : ''}`}>
                    {label}
                  </span>
                )),
              )}
              {student.conditions.length === 0 ? <span className={styles.none}>Sem neurodivergência informada</span> : null}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
