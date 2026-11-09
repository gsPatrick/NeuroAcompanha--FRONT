import AppButton from '../../atoms/AppButton/AppButton';
import styles from './NumberStepper.module.css';

// Contador com − e +. `unit` recebe singular e plural (ex.: ['criança', 'crianças']).
export default function NumberStepper({ value, min = 1, max = 6, onChange, unit, label }) {
  const [singular, plural] = unit;

  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <AppButton
        variant="icon"
        icon="minus"
        ariaLabel="Diminuir"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      />
      <div className={styles.display} aria-live="polite">
        <span className={styles.value}>{value}</span>
        <span className={styles.unit}>{value === 1 ? singular : plural}</span>
      </div>
      <AppButton
        variant="icon"
        icon="plus"
        ariaLabel="Aumentar"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
}
