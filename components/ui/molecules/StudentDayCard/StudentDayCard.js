'use client';

import { useId, useState } from 'react';
import AppAvatar from '../../atoms/AppAvatar/AppAvatar';
import AppButton from '../../atoms/AppButton/AppButton';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import PuzzleMark from '../../atoms/PuzzleMark/PuzzleMark';
import styles from './StudentDayCard.module.css';

// Cartão do aluno quando a AT atende UM aluno: só o banner (degradê azul-claro com curvas ao fundo),
// com foto, nome e diagnóstico. Ao tocar nele, abre embaixo uma sanfona com duas ações, uma sobre a outra:
// "Iniciar registro" e "Atendimento suspenso" (liga/desliga).
export default function StudentDayCard({ appointment, suspended = false, onToggleSuspended, onStartRecord }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  // Dia em que a AT não atende este aluno (pela rotina): o banner só informa, não abre ações.
  const attends = appointment.attendsToday !== false;

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.banner}
        aria-expanded={attends ? open : undefined}
        disabled={!attends}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.top}>
          {/* Curvas translúcidas ao fundo, como na referência. */}
          <svg className={styles.swirl} viewBox="0 0 220 180" fill="none" aria-hidden="true" focusable="false">
            <path d="M170 -20C120 20 215 55 160 105S125 175 160 205" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
            <path d="M215 10C185 45 230 80 200 125" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
          </svg>

          <span className={styles.puzzle}>
            <PuzzleMark size={40} />
          </span>

          <span className={styles.identity}>
            <AppAvatar
              photo={appointment.photo}
              person={appointment.avatar}
              initials={appointment.child.slice(0, 1)}
              size="xxl"
            />
            <span className={styles.texts}>
              <span className={styles.name}>{appointment.child}</span>
              <span className={styles.tags}>
                {(appointment.diagnoses ?? []).flatMap((parts) =>
                  parts.map((label, index) => (
                    <span key={`${parts[0]}-${label}`} className={`${styles.diagnosis} ${index === 0 ? styles.diagnosisMain : ''}`}>
                      {label}
                    </span>
                  )),
                )}
                {suspended ? <span className={styles.suspended}>Suspenso hoje</span> : null}
                {attends ? null : <span className={styles.off}>Não atende hoje</span>}
              </span>
            </span>
          </span>

          {attends ? (
            <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
              <AppIcon name="chevronRight" size={20} />
            </span>
          ) : null}
        </span>
      </button>

      {/* Sanfona: abre e fecha animando a altura. `inert` tira os botões do foco enquanto fechada. */}
      <div id={panelId} className={`${styles.panel} ${open ? styles.panelOpen : ''}`} inert={!open || !attends}>
        <div className={styles.panelInner}>
          <div className={styles.actions}>
            <AppButton icon="notes" fullWidth onClick={() => onStartRecord(appointment)}>
              Iniciar registro
            </AppButton>
            <AppButton
              variant="outline"
              icon="close"
              fullWidth
              pressed={suspended}
              onClick={() => onToggleSuspended(appointment)}
            >
              Atendimento suspenso
            </AppButton>
          </div>
        </div>
      </div>
    </article>
  );
}
