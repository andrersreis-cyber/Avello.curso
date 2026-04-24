import type { Metadata } from 'next'
import { Orbitron, Exo_2, Share_Tech_Mono } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-orbitron',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-exo2',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

// TODO: criar /public/images/og-landing.jpg (1200x630) e plugar em openGraph.images
export const metadata: Metadata = {
  title: 'avello — desbloqueie seu arsenal de IA em 3 minutos',
  description:
    'jornada interativa em 5 atos. descubra seu nível, libere 14 mil ferramentas + 9 módulos por R$ 59,99/ano. 800+ operadores ativos.',
  openGraph: {
    title: 'avello — desbloqueie seu arsenal de IA',
    description:
      'jornada interativa em 5 atos. R$ 59,99/ano. 800+ operadores ativos.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${orbitron.variable} ${exo2.variable} ${shareTechMono.variable}`}
    >
      {children}
    </div>
  )
}
