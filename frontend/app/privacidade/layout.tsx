import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Avello',
  description: 'Política de privacidade da Avello. Saiba como coletamos e protegemos seus dados.',
  openGraph: {
    title: 'Política de Privacidade | Avello',
    description: 'Política de privacidade da Avello. Saiba como coletamos e protegemos seus dados.',
  },
}

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
