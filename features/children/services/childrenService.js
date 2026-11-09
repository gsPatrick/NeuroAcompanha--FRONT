import { loadStudents } from '@/features/students/services/studentsStore';
import { formatConditionList } from '@/features/students/utils/formatConditions';
import { childrenMock } from './children.mock';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Alunos cadastrados no onboarding (guardados no aparelho).
// `diagnoses` já vem pronto para exibir: uma lista de neurodivergências, cada uma em partes (['TEA', 'Nível 2']).
export async function getRegisteredChildren() {
  const students = await loadStudents();
  return students.map((student) => ({ ...student, diagnoses: formatConditionList(student.conditions) }));
}

// Cada AT só enxerga as crianças vinculadas a ela (a regra de acesso é do backend).
// Sem alunos cadastrados, usa os dados de exemplo. MOCK: simula a latência da rede.
export async function getChildren() {
  await wait(300);
  const registered = await getRegisteredChildren();
  return registered.length ? registered : structuredClone(childrenMock);
}
