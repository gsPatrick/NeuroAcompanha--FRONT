import { ApiError, apiDownload, apiRequest } from '@/core/api/apiClient';

const POLL_EVERY_MS = 2500;
const GIVE_UP_AFTER_MS = 4 * 60 * 1000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Relatório da semana (a que contém `weekStart`), ou null se ainda não foi gerado.
export async function getWeekReport(childId, weekStart) {
  try {
    return await apiRequest(`/children/${childId}/reports/${weekStart}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Manda gerar (a API responde na hora e redige em segundo plano). Se já estiver sendo gerado, só acompanha.
export async function requestWeekReport(childId, weekStart) {
  try {
    return await apiRequest(`/children/${childId}/reports`, { method: 'POST', body: { weekStart } });
  } catch (error) {
    if (error instanceof ApiError && error.code === 'REPORT_IN_PROGRESS') return getWeekReport(childId, weekStart);
    throw error;
  }
}

// Espera a geração terminar (status deixa de ser "generating"). Falha com mensagem clara se demorar demais.
export async function waitForWeekReport(childId, weekStart, report) {
  const startedAt = Date.now();
  let current = report;
  while (current?.status === 'generating') {
    if (Date.now() - startedAt > GIVE_UP_AFTER_MS) throw new Error('O relatório está demorando. Tente de novo em instantes.');
    await wait(POLL_EVERY_MS);
    current = await getWeekReport(childId, weekStart);
  }
  return current;
}

export const downloadWeekReportPdf = (childId, weekStart) => apiDownload(`/children/${childId}/reports/${weekStart}/download`, { query: { format: 'pdf' } });
