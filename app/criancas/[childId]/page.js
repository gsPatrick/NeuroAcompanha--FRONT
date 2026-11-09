import ChildProfileTemplate from '@/components/ui/templates/ChildProfileTemplate/ChildProfileTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Perfil da criança · ${APP_NAME}` };

export default function ChildProfilePage() {
  return <ChildProfileTemplate />;
}
