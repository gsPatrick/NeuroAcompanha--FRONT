// Preferências de uso (NÃO sensíveis): quantidade de crianças por dia, dia do relatório por id de criança
// e se o onboarding já foi feito. Nomes e dados das crianças nunca são guardados aqui.
const STORAGE_KEY = 'neuro-acompanha:preferences';

export const DEFAULT_PREFERENCES = {
  onboarded: false,
  dailyChildren: 1,
  reportDays: {},
};

export function loadPreferences() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    // Armazenamento bloqueado (ex.: janela privada): segue com o padrão.
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Sem persistência: a escolha vale só nesta sessão.
  }
}
