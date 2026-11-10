import StudentFormTemplate from '@/components/ui/templates/StudentFormTemplate/StudentFormTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Novo aluno · ${APP_NAME}` };

export default function NewStudentPage() {
  return <StudentFormTemplate mode="new" />;
}
