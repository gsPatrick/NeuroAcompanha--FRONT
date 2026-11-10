import { apiRequest } from '@/core/api/apiClient';
import { cachedRequest } from '@/core/offline/cache';
import { createDefaultRoutine } from '@/features/routine/utils/routine';
import { formatConditionList } from '../utils/formatConditions';

// Aluno como as telas usam: o que a API guarda + `diagnoses` já pronto para exibir (['TEA', 'Nível 2'] por neurodivergência).
// Dado sensível de saúde: vem da API e só para quem tem vínculo com a criança.
export const toStudent = (child) => ({
  id: child.id,
  order: child.position,
  name: child.name,
  fullName: child.fullName ?? undefined,
  schoolName: child.schoolName ?? undefined,
  monitorName: child.monitorName ?? undefined,
  supervisorName: child.supervisorName ?? undefined,
  photo: child.photo ?? null,
  avatar: child.avatar ?? undefined,
  conditions: child.conditions ?? [],
  diagnoses: formatConditionList(child.conditions),
  routine: Object.keys(child.routine ?? {}).length ? child.routine : createDefaultRoutine(),
  startedAt: child.startedAt ?? undefined,
});

// Alunos da AT, na ordem do cadastro. Sem internet, vale a última lista guardada no aparelho.
export async function loadStudents() {
  const children = await cachedRequest('children', () => apiRequest('/children'));
  return children.map(toStudent);
}

// Aulas em branco (campo vazio no cadastro) não vão para a API.
const cleanRoutine = (routine) =>
  Object.fromEntries(
    Object.entries(routine ?? {}).map(([weekday, day]) => [
      weekday,
      { attends: Boolean(day.attends), welcome: Boolean(day.welcome), classes: day.classes.map((name) => name.trim()).filter(Boolean) },
    ]),
  );

// Grava o cadastro inteiro de uma vez (o onboarding sempre tem o conjunto completo): quem já existe é atualizado
// (os registros e relatórios ficam), quem é novo é criado e quem saiu da lista é removido.
export async function saveStudents(students) {
  const children = await apiRequest('/children', {
    method: 'PUT',
    body: {
      children: students.map((student) => ({
        id: student.id,
        name: student.name,
        photo: student.photo ?? null,
        avatar: student.avatar,
        conditions: student.conditions,
        routine: cleanRoutine(student.routine),
        ...(student.startedAt ? { startedAt: student.startedAt } : {}),
      })),
    },
  });
  return children.map(toStudent);
}

// Corpo de um aluno para a API (cadastro e edição).
const toPayload = (student) => ({
  name: student.name.trim(),
  photo: student.photo ?? null,
  avatar: student.avatar,
  conditions: student.conditions,
  routine: cleanRoutine(student.routine),
});

// Aluno novo (entra no fim da lista). Resolve com o aluno salvo.
export async function createStudent(student) {
  return toStudent(await apiRequest('/children', { method: 'POST', body: toPayload(student) }));
}

// Edita o cadastro de um aluno (nome, foto, neurodivergências e rotina). Os registros e relatórios dele continuam.
export async function updateStudent(student) {
  return toStudent(await apiRequest(`/children/${student.id}`, { method: 'PATCH', body: toPayload(student) }));
}

// Só a foto (null remove).
export async function updateStudentPhoto(id, photo) {
  return toStudent(await apiRequest(`/children/${id}`, { method: 'PATCH', body: { photo } }));
}
