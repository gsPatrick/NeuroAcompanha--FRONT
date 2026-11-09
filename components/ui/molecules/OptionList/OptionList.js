import styles from './OptionList.module.css';

// Escolha de uma opção entre várias, uma por linha, com título e descrição curta (grupo de opções acessível).
// options: [{ id, label, description? }]
export default function OptionList({ options, value, onChange, label }) {
  return (
    <div className={styles.list} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`${styles.option} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(option.id)}
          >
            <span className={styles.radio} aria-hidden="true" />
            <span className={styles.texts}>
              <span className={styles.label}>{option.label}</span>
              {option.description ? <span className={styles.description}>{option.description}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
