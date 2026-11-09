import LoginTemplate from '@/components/ui/templates/LoginTemplate/LoginTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Entrar · ${APP_NAME}` };

export default function LoginPage() {
  return <LoginTemplate />;
}
