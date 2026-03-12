import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | Avello',
  description: 'Termos de uso da plataforma Avello. Leia as condições de uso do serviço.',
  openGraph: {
    title: 'Termos de Uso | Avello',
    description: 'Termos de uso da plataforma Avello. Leia as condições de uso do serviço.',
  },
}

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
