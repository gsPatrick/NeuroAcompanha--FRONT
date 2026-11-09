import AppInput from '@/components/ui/atoms/AppInput/AppInput';

// Passo "nome" do cadastro do aluno. Enter avança (formulário com um único campo).
export default function StudentNameStep({ value, error, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AppInput
        label="Nome do aluno"
        name="studentName"
        placeholder="Ex.: Maria Fernanda"
        autoComplete="off"
        autoCapitalize="words"
        value={value}
        error={error}
        onChange={onChange}
      />
    </form>
  );
}
