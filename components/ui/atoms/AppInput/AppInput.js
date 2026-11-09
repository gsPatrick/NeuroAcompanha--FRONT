'use client';

import { useId, useState } from 'react';
import AppIcon from '../AppIcon/AppIcon';
import styles from './AppInput.module.css';

// Campo com label fixa, erro associado (aria) e, para senha, botão de mostrar/ocultar.
// Fonte >= 16px para o iOS não aplicar zoom ao focar.
export default function AppInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  inputMode,
  autoCapitalize = 'none',
  disabled = false,
  autoFocus = false,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={`${styles.control} ${error ? styles.invalid : ''}`}>
        <input
          id={id}
          name={name}
          className={styles.input}
          type={isPassword && revealed ? 'text' : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />

        {isPassword ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <AppIcon name={revealed ? 'eyeOff' : 'eye'} size={20} />
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
