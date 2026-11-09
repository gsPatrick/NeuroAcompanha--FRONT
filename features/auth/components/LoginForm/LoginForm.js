import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import styles from './LoginForm.module.css';

export default function LoginForm({
  values,
  errors,
  submitError,
  submitting,
  onChange,
  onSubmit,
  onBack,
  onForgotPassword,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <AppButton variant="tertiary" icon="arrowLeft" onClick={onBack} disabled={submitting}>
          Voltar
        </AppButton>
        <h2 className={styles.title}>Entrar</h2>
      </div>

      <div className={styles.fields}>
        <AppInput
          label="E-mail"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="nome@clinica.com.br"
          value={values.email}
          error={errors.email}
          onChange={onChange('email')}
          disabled={submitting}
        />
        <AppInput
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={values.password}
          error={errors.password}
          onChange={onChange('password')}
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
          Entrar
        </AppButton>
        <AppButton variant="tertiary" fullWidth onClick={onForgotPassword} disabled={submitting}>
          Esqueci minha senha
        </AppButton>
      </div>
    </form>
  );
}
