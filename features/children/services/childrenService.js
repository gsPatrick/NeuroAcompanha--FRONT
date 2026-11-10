import { loadStudents } from '@/features/students/services/studentsService';

// Cada AT só enxerga as crianças vinculadas a ela (a regra de acesso é da API).
// `diagnoses` já vem pronto para exibir: uma lista de neurodivergências, cada uma em partes (['TEA', 'Nível 2']).
export const getChildren = () => loadStudents();
