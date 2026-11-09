import SettingsTemplate from '@/components/ui/templates/SettingsTemplate/SettingsTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Ajustes · ${APP_NAME}` };

export default function SettingsPage() {
  return <SettingsTemplate />;
}
