import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar Conta | Avello',
  description: 'Crie sua conta gratuita e comece a usar os recursos de IA da Avello.',
  openGraph: {
    title: 'Criar Conta | Avello',
    description: 'Crie sua conta gratuita e comece a usar os recursos de IA da Avello.',
  },
}

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
