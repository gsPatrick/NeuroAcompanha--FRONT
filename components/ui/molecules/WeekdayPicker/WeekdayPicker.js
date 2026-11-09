import { WEEKDAYS } from '@/constants/weekdays';
import { haptic } from '@/utils/haptics';
import styles from './WeekdayPicker.module.css';

// Escolha de um único dia da semana (grupo de opções acessível).
export default function WeekdayPicker({ value, onChange, label }) {
  return (
    <div className={styles.group} role="radiogroup" aria-label={label}>
      {WEEKDAYS.map((day) => {
        const selected = day.value === value;
        return (
          <button
            key={day.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={day.long}
            className={`${styles.chip} ${selected ? styles.selected : ''}`}
            onClick={() => {
              haptic();
              onChange(day.value);
            }}
          >
            {day.short}
          </button>
        );
      })}
    </div>
  );
}
