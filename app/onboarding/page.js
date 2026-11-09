import OnboardingTemplate from '@/components/ui/templates/OnboardingTemplate/OnboardingTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Configuração inicial · ${APP_NAME}` };

export default function OnboardingPage() {
  return <OnboardingTemplate />;
}
