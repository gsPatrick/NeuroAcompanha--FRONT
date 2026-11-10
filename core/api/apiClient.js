import { clearToken, getToken } from './tokenStore';

// Endereço da API (variável NEXT_PUBLIC_API_URL; ver .env.example). Sem ela, vale a API local de desenvolvimento.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api').replace(/\/$/, '');
const BASE = `${API_URL}/v1`;

// Erro da API (ou de rede): `status` 0 = sem conexão; `code` é o código estável da API (ex.: INVALID_CREDENTIALS).
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Sem internet ou servidor fora do ar: o que ficou pendente deve esperar e tentar de novo depois.
export const isOfflineError = (error) => error instanceof ApiError && (error.status === 0 || error.status >= 500 || error.status === 408 || error.status === 429);

// Erro que não adianta repetir (pedido inválido, sem permissão, não encontrado...). Rede e servidor fora do ar, sim.
export const isPermanentError = (error) =>
  error instanceof ApiError && error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status);

// Sem resposta em tanto tempo = trata como sem conexão (o que está pendente fica na fila e sai depois).
const TIMEOUT_MS = 20000;

const NETWORK_MESSAGE = 'Sem conexão com o servidor. Verifique a internet e tente de novo.';

function buildUrl(path, query) {
  const params = new URLSearchParams(Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null));
  const text = params.toString();
  return `${BASE}${path}${text ? `?${text}` : ''}`;
}

async function send(path, { method = 'GET', body, query } = {}) {
  const token = getToken();
  let response;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    response = await fetch(buildUrl(path, query), {
      signal: controller.signal,
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'NETWORK', NETWORK_MESSAGE);
  } finally {
    clearTimeout(timer);
  }

  if (response.ok) return response;

  const payload = await response.json().catch(() => null);
  const { code = 'HTTP_ERROR', message = 'Não foi possível concluir. Tente de novo.', details } = payload?.error ?? {};

  // Token vencido ou inválido: volta para a entrada. (Senha errada no login também é 401, mas aí não há token.)
  if (response.status === 401 && token) {
    clearToken();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') window.location.replace('/login');
  }
  throw new ApiError(response.status, code, message, details);
}

// Chamada JSON: devolve o conteúdo de `data` da resposta (null quando não há corpo).
export async function apiRequest(path, options) {
  const response = await send(path, options);
  if (response.status === 204) return null;
  const payload = await response.json();
  return payload.data;
}

// Chamada que devolve um arquivo (ex.: o PDF do relatório).
export async function apiDownload(path, options) {
  const response = await send(path, options);
  return response.blob();
}
