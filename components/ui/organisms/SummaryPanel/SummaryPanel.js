import { SUMMARY_FIELDS } from '@/features/records/data/prancheta';
import styles from './SummaryPanel.module.css';

// Resumo do dia (fim da prancheta): cinco campos de texto, salvos enquanto ela escreve. `readOnly`: só para ler.
export default function SummaryPanel({ summary, onChange, readOnly = false }) {
  return (
    <div className={styles.panel}>
      {SUMMARY_FIELDS.map((field) => (
        <div key={field.key} className={styles.field}>
          <label className={styles.label} htmlFor={`summary-${field.key}`}>
            {field.label}
          </label>
          <textarea
            id={`summary-${field.key}`}
            className={styles.textarea}
            rows={field.key === 'family' ? 4 : 2}
            value={summary[field.key] ?? ''}
            readOnly={readOnly}
            onChange={(event) => onChange?.(field.key, event.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
