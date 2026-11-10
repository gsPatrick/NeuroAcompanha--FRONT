import { loadPreferences, savePreferences } from '@/features/settings/services/preferencesService';

const HOME_ROUTE = '/';
const ONBOARDING_ROUTE = '/onboarding';
export const DEFINE_PASSWORD_ROUTE = '/definir-senha';

// Para onde ir depois de entrar. Senha provisória -> definir a própria; conta que já tem alunos (ex.: outro aparelho)
// não refaz o cadastro inicial; primeiro acesso passa pela configuração inicial.
export function routeAfterLogin({ hasChildren, mustChangePassword = false }) {
  if (mustChangePassword) return DEFINE_PASSWORD_ROUTE;
  const preferences = loadPreferences();
  if (hasChildren && !preferences.onboarded) savePreferences({ ...preferences, onboarded: true });
  return hasChildren || preferences.onboarded ? HOME_ROUTE : ONBOARDING_ROUTE;
}
