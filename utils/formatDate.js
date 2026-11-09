const LOCALE = 'pt-BR';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Ex.: "Segunda-feira, 9 de novembro"
export function formatLongDate(date = new Date()) {
  const text = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return capitalize(text);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
