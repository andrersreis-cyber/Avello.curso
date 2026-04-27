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
  title: 'avello — 800 operadores ativaram o arsenal nas últimas 72h',
  description:
    '3 minutos separam você deles. jornada interativa em 5 atos + leaderboard + atualizações semanais de Claude Code, Skills e MCPs. R$ 59,99/ano.',
  openGraph: {
    title: 'avello — arsenal de IA com updates semanais',
    description:
      '5 atos. 3 minutos. 14 mil ferramentas + Claude Code, Skills, MCPs, Projects toda semana. R$ 59,99/ano.',
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
