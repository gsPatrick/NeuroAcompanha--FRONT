import ProfileTemplate from '@/components/ui/templates/ProfileTemplate/ProfileTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Perfil · ${APP_NAME}` };

export default function ProfilePage() {
  return <ProfileTemplate />;
}
