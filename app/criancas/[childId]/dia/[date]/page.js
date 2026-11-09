import DayReportTemplate from '@/components/ui/templates/DayReportTemplate/DayReportTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Dia · ${APP_NAME}` };

export default function DayReportPage() {
  return <DayReportTemplate />;
}
