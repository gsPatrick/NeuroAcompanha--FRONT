import AgendaTemplate from '@/components/ui/templates/AgendaTemplate/AgendaTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Agenda · ${APP_NAME}` };

export default function AgendaPage() {
  return <AgendaTemplate />;
}
