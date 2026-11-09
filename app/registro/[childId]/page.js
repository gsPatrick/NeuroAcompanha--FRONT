import RecordTemplate from '@/components/ui/templates/RecordTemplate/RecordTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Registro do dia · ${APP_NAME}` };

export default function RecordPage() {
  return <RecordTemplate />;
}
