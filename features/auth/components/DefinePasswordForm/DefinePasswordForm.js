import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import styles from '../LoginForm/LoginForm.module.css';

// Mesmo formato do formulário de entrada: título, campos e botão.
export default function DefinePasswordForm({ values, errors, submitError, submitting, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Defina sua senha</h2>
      </div>

      <div className={styles.fields}>
        <AppInput
          label="Nova senha"
          name="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="Ao menos 8 caracteres"
          value={values.password}
          error={errors.password}
          onChange={onChange('password')}
          disabled={submitting}
        />
        <AppInput
          label="Repita a senha"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Digite de novo"
          value={values.confirm}
          error={errors.confirm}
          onChange={onChange('confirm')}
          disabled={submitting}
        />
      </div>

      {submitError ? (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <AppButton type="submit" fullWidth loading={submitting}>
          Salvar senha
        </AppButton>
      </div>
    </form>
  );
}
