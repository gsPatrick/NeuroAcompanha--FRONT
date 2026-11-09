import { Fraunces, Inter } from 'next/font/google';
import './landing.css';

// Duas fontes, só na landing: Fraunces (títulos) e Inter (texto). Carregadas pelo Next (sem pedir nada ao Google em tempo de uso).
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['400', '500', '600'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'], display: 'swap' });

export default function LandingLayout({ children }) {
  return <div className={`landing-root ${fraunces.variable} ${inter.variable}`}>{children}</div>;
}
