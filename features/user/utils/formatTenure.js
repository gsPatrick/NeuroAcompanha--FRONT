// Tempo desde uma data, por extenso: "1 ano e 8 meses", "5 meses", "12 dias". `since`: data ISO (AAAA-MM-DD).
export function formatTenure(since, now = new Date()) {
  const start = new Date(`${since}T12:00:00`);
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;

  if (months < 1) {
    const days = Math.max(1, Math.floor((now - start) / 86400000));
    return days === 1 ? '1 dia' : `${days} dias`;
  }

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearText = years ? (years === 1 ? '1 ano' : `${years} anos`) : '';
  const monthText = rest ? (rest === 1 ? '1 mês' : `${rest} meses`) : '';
  return [yearText, monthText].filter(Boolean).join(' e ');
}
