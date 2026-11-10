import EditProfileTemplate from '@/components/ui/templates/EditProfileTemplate/EditProfileTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Editar perfil · ${APP_NAME}` };

export default function EditProfilePage() {
  return <EditProfileTemplate />;
}
