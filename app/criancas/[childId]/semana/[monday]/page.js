import WeekReportTemplate from '@/components/ui/templates/WeekReportTemplate/WeekReportTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Relatório da semana · ${APP_NAME}` };

export default function WeekReportPage() {
  return <WeekReportTemplate />;
}
