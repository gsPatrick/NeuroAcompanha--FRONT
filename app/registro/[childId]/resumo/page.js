import SummaryTemplate from '@/components/ui/templates/SummaryTemplate/SummaryTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Resumo do dia · ${APP_NAME}` };

export default function SummaryPage() {
  return <SummaryTemplate />;
}
