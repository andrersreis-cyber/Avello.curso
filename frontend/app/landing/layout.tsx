import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avello — +18.000 Recursos de IA e Automação',
  description: 'Acesse +18.000 recursos de IA: workflows, prompts, templates e automações. Plataforma completa para quem quer acelerar com inteligência artificial.',
  openGraph: {
    title: 'Avello — +18.000 Recursos de IA e Automação',
    description: 'Acesse +18.000 recursos de IA: workflows, prompts, templates e automações.',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
