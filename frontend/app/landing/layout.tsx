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

export const metadata: Metadata = {
  title: 'avello — desbloqueie seu arsenal de ia',
  description:
    'jornada interativa em 5 atos. descubra seu nível, libere ferramentas e entre para os 800+ operadores ativos.',
  openGraph: {
    title: 'avello — desbloqueie seu arsenal de ia',
    description:
      'jornada interativa em 5 atos. descubra seu nível, libere ferramentas e entre para os 800+ operadores ativos.',
  },
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
