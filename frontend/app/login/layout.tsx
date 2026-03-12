import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar | Avello',
  description: 'Acesse sua conta Avello e aproveite os recursos de IA.',
  openGraph: {
    title: 'Entrar | Avello',
    description: 'Acesse sua conta Avello e aproveite os recursos de IA.',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
