import InstallTemplate from '@/components/ui/templates/InstallTemplate/InstallTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Instalar · ${APP_NAME}` };

export default function InstallPage() {
  return <InstallTemplate />;
}
