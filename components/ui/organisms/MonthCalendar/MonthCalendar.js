'use client';

import { useMemo, useState } from 'react';
import AppIcon from '../../atoms/AppIcon/AppIcon';
import {
  WEEKDAY_INITIALS,
  buildMonthWeeks,
  formatAccessibleDate,
  formatMonthTitle,
  isSameDay,
  toDateKey,
} from '@/utils/calendar';
import styles from './MonthCalendar.module.css';

const STATUS_LABEL = { done: 'atendimento realizado', suspended: 'atendimento suspenso' };

// Calendário do mês em grade quadrada, no estilo do Google Agenda.
// Cores: verde = atendido, amarelo = suspenso, roxo = hoje. Tocar em um dia o seleciona.
// `attendance`: { 'AAAA-MM-DD': 'done' | 'suspended' }. `todaySuspended`: o dia de hoje foi marcado como suspenso.
export default function MonthCalendar({ attendance = {}, todaySuspended = false }) {
  const today = useMemo(() => new Date(), []);
  const [visible, setVisible] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const weeks = useMemo(() => buildMonthWeeks(visible.getFullYear(), visible.getMonth()), [visible]);
  const title = formatMonthTitle(visible);
  const isCurrentMonth = visible.getFullYear() === today.getFullYear() && visible.getMonth() === today.getMonth();

  const changeMonth = (offset) => setVisible((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const goToToday = () => {
    setVisible(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  return (
    <section className={styles.calendar} aria-label={`Calendário de ${title.month} de ${title.year}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {title.month} <span className={styles.year}>{title.year}</span>
        </h2>

        <div className={styles.controls}>
          {isCurrentMonth ? null : (
            <button type="button" className={styles.todayButton} onClick={goToToday}>
              Hoje
            </button>
          )}
          <button type="button" className={`${styles.nav} ${styles.prev}`} aria-label="Mês anterior" onClick={() => changeMonth(-1)}>
            <AppIcon name="chevronRight" size={20} />
          </button>
          <button type="button" className={styles.nav} aria-label="Próximo mês" onClick={() => changeMonth(1)}>
            <AppIcon name="chevronRight" size={20} />
          </button>
        </div>
      </header>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAY_INITIALS.map((initial, index) => (
          <span key={index} className={styles.weekday}>
            {initial}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.flat().map(({ date, inMonth }) => {
          const isToday = isSameDay(date, today);
          const isSelected = selected ? isSameDay(date, selected) : false;
          const status = attendance[toDateKey(date)];

          const classes = [
            styles.cell,
            inMonth ? '' : styles.outside,
            status ? styles[status] : '',
            isToday ? styles.today : '',
            isToday && todaySuspended ? styles.todayFlag : '',
            isSelected ? styles.selected : '',
          ]
            .filter(Boolean)
            .join(' ');

          const statusText = isToday ? 'hoje' : STATUS_LABEL[status];

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={classes}
              aria-label={statusText ? `${formatAccessibleDate(date)}, ${statusText}` : formatAccessibleDate(date)}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isSelected}
              onClick={() => setSelected(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legenda: as cores não dependem só de adivinhação. */}
      <ul className={styles.legend}>
        <li className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotDone}`} aria-hidden="true" />
          Atendido
        </li>
        <li className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotSuspended}`} aria-hidden="true" />
          Suspenso
        </li>
        <li className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotToday}`} aria-hidden="true" />
          Hoje
        </li>
      </ul>
    </section>
  );
}
