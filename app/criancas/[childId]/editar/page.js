import StudentFormTemplate from '@/components/ui/templates/StudentFormTemplate/StudentFormTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Editar aluno · ${APP_NAME}` };

export default function EditStudentPage() {
  return <StudentFormTemplate mode="edit" />;
}
