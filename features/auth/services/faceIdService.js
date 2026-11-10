import { browserSupportsWebAuthn, platformAuthenticatorIsAvailable, startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { apiRequest } from '@/core/api/apiClient';
import { openSession } from './authService';

// Face ID / biometria do aparelho (WebAuthn). O aparelho guarda a chave privada e só a libera com o rosto/digital;
// a API guarda a pública e confere a assinatura. Nada de senha digitada.
const ENABLED_KEY = 'neuro-acompanha:face-id';
const ASKED_KEY = 'neuro-acompanha:face-id-asked';

const read = (key) => {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};
const write = (key, on) => {
  try {
    if (on) window.localStorage.setItem(key, '1');
    else window.localStorage.removeItem(key);
  } catch {
    // Sem armazenamento: o app só não lembra a escolha.
  }
};

// O aparelho tem Face ID / digital / bloqueio de tela biométrico, e o endereço é seguro (HTTPS ou localhost)?
export async function isFaceIdSupported() {
  try {
    return browserSupportsWebAuthn() && (await platformAuthenticatorIsAvailable());
  } catch {
    return false;
  }
}

export const isFaceIdEnabledHere = () => read(ENABLED_KEY);
export const wasFaceIdOffered = () => read(ASKED_KEY);
export const rememberFaceIdOffered = () => write(ASKED_KEY, true);

// Liga o Face ID neste aparelho (a AT já está logada). Lança se ela cancelar ou o aparelho recusar.
export async function enableFaceId() {
  const { options, challengeToken } = await apiRequest('/auth/passkeys/register/options', { method: 'POST' });
  const response = await startRegistration({ optionsJSON: options });
  await apiRequest('/auth/passkeys/register/verify', { method: 'POST', body: { challengeToken, response, deviceName: 'Este aparelho' } });
  write(ENABLED_KEY, true);
}

// Entra só com o Face ID. Resolve como o login por senha: { hasChildren, mustChangePassword }.
export async function loginWithFaceId() {
  const { options, challengeToken } = await apiRequest('/auth/passkeys/login/options', { method: 'POST' });
  const response = await startAuthentication({ optionsJSON: options });
  try {
    return await openSession(await apiRequest('/auth/passkeys/login/verify', { method: 'POST', body: { challengeToken, response } }));
  } catch (error) {
    // A API não conhece mais esta credencial (ex.: Face ID desligado em outro aparelho): volta a pedir senha.
    if (error.code === 'PASSKEY_UNKNOWN') write(ENABLED_KEY, false);
    throw error;
  }
}

// Desliga o Face ID (em todos os aparelhos da AT): ela volta a entrar com a senha.
export async function disableFaceId() {
  await apiRequest('/auth/passkeys', { method: 'DELETE' });
  write(ENABLED_KEY, false);
}
