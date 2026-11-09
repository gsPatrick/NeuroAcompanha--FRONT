import LandingCta from '@/components/ui/organisms/LandingCta/LandingCta';
import LandingDevice from '@/components/ui/organisms/LandingDevice/LandingDevice';
import LandingFeatures from '@/components/ui/organisms/LandingFeatures/LandingFeatures';
import LandingFooter from '@/components/ui/organisms/LandingFooter/LandingFooter';
import LandingHero from '@/components/ui/organisms/LandingHero/LandingHero';
import LandingMoments from '@/components/ui/organisms/LandingMoments/LandingMoments';
import LandingNav from '@/components/ui/organisms/LandingNav/LandingNav';
import LandingPrivacy from '@/components/ui/organisms/LandingPrivacy/LandingPrivacy';
import LandingStatement from '@/components/ui/organisms/LandingStatement/LandingStatement';
import LandingSteps from '@/components/ui/organisms/LandingSteps/LandingSteps';
import styles from './LandingTemplate.module.css';

// Página de apresentação do sistema (pública, fora do app). Arco: chegar -> entender a ideia -> o que faz -> como funciona
// -> no celular -> cuidado -> agir. Sem fotos: as telas são desenhadas em HTML e CSS e não usam nomes de pessoas.
// A página rola dentro de um contêiner próprio (o Framework7 trava a rolagem do documento no resto do app).
export default function LandingTemplate() {
  return (
    <div id="landing-scroll" className={styles.page}>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingStatement />
        <LandingFeatures />
        <LandingMoments />
        <LandingSteps />
        <LandingDevice />
        <LandingPrivacy />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
