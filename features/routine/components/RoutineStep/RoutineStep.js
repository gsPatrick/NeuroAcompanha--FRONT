'use client';

import { useState } from 'react';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSwitch from '@/components/ui/atoms/AppSwitch/AppSwitch';
import { ROUTINE_DAYS } from '../../data/days';
import { describeDay } from '../../utils/routine';
import styles from './RoutineStep.module.css';

// Passo "rotina" do cadastro do aluno: segunda a domingo. Cada dia diz se a AT atende e, se atende, se há
// acolhimento e quais são as aulas (nome da matéria). Lanche e Brincadeiras entram sozinhos em todo dia de atendimento.
export default function RoutineStep({ routine, onChangeDay, onCopyDay }) {
  const [openDay, setOpenDay] = useState(null);

  return (
    <ul className={styles.list}>
      {ROUTINE_DAYS.map((weekday) => {
        const day = routine[weekday.value];
        const open = openDay === weekday.value;

        return (
          <li key={weekday.value} className={`${styles.day} ${day.attends ? '' : styles.off}`}>
            <div className={styles.row}>
              <button
                type="button"
                className={styles.summary}
                aria-expanded={day.attends ? open : undefined}
                disabled={!day.attends}
                onClick={() => setOpenDay(open ? null : weekday.value)}
              >
                <span className={styles.dayName}>{weekday.long}</span>
                <span className={styles.dayInfo}>{describeDay(day)}</span>
              </button>
              {day.attends ? (
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
                  <AppIcon name="chevronRight" size={18} />
                </span>
              ) : null}
              <AppSwitch
                checked={day.attends}
                label={`Atende na ${weekday.long.toLowerCase()}`}
                onChange={(attends) => {
                  onChangeDay(weekday.value, { attends });
                  setOpenDay(attends ? weekday.value : null);
                }}
              />
            </div>

            {day.attends && open ? (
              <DayEditor
                day={day}
                onChange={(patch) => onChangeDay(weekday.value, patch)}
                onCopy={() => onCopyDay(weekday.value)}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function DayEditor({ day, onChange, onCopy }) {
  const setClass = (index, value) =>
    onChange({ classes: day.classes.map((name, position) => (position === index ? value : name)) });
  const removeClass = (index) => onChange({ classes: day.classes.filter((_, position) => position !== index) });
  const addClass = () => onChange({ classes: [...day.classes, ''] });

  return (
    <div className={styles.editor}>
      <div className={styles.welcome}>
        <span className={styles.welcomeText}>Tem acolhimento neste dia</span>
        <AppSwitch checked={day.welcome} label="Tem acolhimento" onChange={(welcome) => onChange({ welcome })} />
      </div>

      <div className={styles.classes}>
        <span className={styles.groupLabel}>Aulas</span>
        {day.classes.map((name, index) => (
          // A ordem é a da lista; a posição serve de chave porque o texto muda a cada tecla.
          <div key={index} className={styles.classRow}>
            <input
              className={styles.input}
              value={name}
              placeholder="Nome da matéria (ex.: Ciências)"
              autoCapitalize="sentences"
              aria-label={`Aula ${index + 1}`}
              onChange={(event) => setClass(index, event.target.value)}
            />
            <button type="button" className={styles.remove} aria-label={`Remover aula ${index + 1}`} onClick={() => removeClass(index)}>
              <AppIcon name="close" size={18} />
            </button>
          </div>
        ))}
        <AppButton variant="outline" size="md" icon="plus" onClick={addClass}>
          Adicionar aula
        </AppButton>
      </div>

      <AppButton variant="tertiary" size="md" onClick={onCopy}>
        Copiar para os outros dias em que atende
      </AppButton>
    </div>
  );
}
