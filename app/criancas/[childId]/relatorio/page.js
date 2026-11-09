import ReportTemplate from '@/components/ui/templates/ReportTemplate/ReportTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Relatório · ${APP_NAME}` };

export default function ReportPage() {
  return <ReportTemplate />;
}
