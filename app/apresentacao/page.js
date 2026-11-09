import LandingTemplate from '@/components/ui/templates/LandingTemplate/LandingTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = {
  title: `${APP_NAME} · Registro do atendimento terapêutico`,
  description:
    'Aplicativo para acompanhantes terapêuticas registrarem o dia de cada criança com poucos toques e transformarem a semana em relatório.',
};

export default function PresentationPage() {
  return <LandingTemplate />;
}
