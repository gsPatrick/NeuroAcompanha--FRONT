import NewBlockTemplate from '@/components/ui/templates/NewBlockTemplate/NewBlockTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Novo momento · ${APP_NAME}` };

export default function NewBlockPage() {
  return <NewBlockTemplate />;
}
