import DefinePasswordTemplate from '@/components/ui/templates/DefinePasswordTemplate/DefinePasswordTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Definir senha · ${APP_NAME}` };

export default function DefinePasswordPage() {
  return <DefinePasswordTemplate />;
}
