'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    setLoading(false)

    if (error) {
      setError('Erro ao enviar email. Verifique se o email está correto.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Email Enviado!</h1>
          
          <p className="text-zinc-400 mb-6">
            Enviamos um link de recuperação para <strong className="text-white">{email}</strong>. 
            Verifique sua caixa de entrada e spam.
          </p>

          <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 mb-6">
            <p className="text-sm text-zinc-400">
              O link expira em <strong className="text-white">1 hora</strong>. 
              Se não receber, você pode solicitar novamente.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
            >
              Enviar novamente
            </button>
            
            <Link
              href="/login"
              className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all text-center"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-white">AVELLO</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
          <p className="text-zinc-400 mb-8">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Link de Recuperação
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center">
            <Mail className="w-12 h-12 text-cyan-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Esqueceu sua senha?
          </h2>
          
          <p className="text-zinc-400 mb-6">
            Não se preocupe! Acontece com todo mundo. Basta informar seu email 
            que enviaremos instruções para criar uma nova senha.
          </p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-medium">1</div>
              <span>Digite seu email cadastrado</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-medium">2</div>
              <span>Receba o link no seu email</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-medium">3</div>
              <span>Crie uma nova senha segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
