import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Senha | Avello',
  description: 'Recupere o acesso à sua conta Avello. Enviaremos um link de redefinição por email.',
  openGraph: {
    title: 'Recuperar Senha | Avello',
    description: 'Recupere o acesso à sua conta Avello. Enviaremos um link de redefinição por email.',
  },
}

export default function RecuperarSenhaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
