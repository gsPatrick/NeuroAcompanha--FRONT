import EditBlockTemplate from '@/components/ui/templates/EditBlockTemplate/EditBlockTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Mudar momento · ${APP_NAME}` };

export default function EditBlockPage() {
  return <EditBlockTemplate />;
}
