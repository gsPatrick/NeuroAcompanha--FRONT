import styles from './SegmentedControl.module.css';

// Duas ou mais opções lado a lado, uma escolhida (como no iOS). `options`: [{ value, label }].
export default function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div className={styles.control} role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
