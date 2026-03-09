'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import '../cadastro/phone-input.css'

export default function CompletarCadastroPage() {
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não está logado, redireciona para login
    if (!user) {
      router.push('/login')
      return
    }

    // Se já tem telefone, redireciona para home
    if (profile?.telefone) {
      router.push('/')
    }
  }, [user, profile, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar telefone
    if (!telefone) {
      setError('Por favor, insira seu telefone.')
      setLoading(false)
      return
    }

    if (!isValidPhoneNumber(telefone, 'BR')) {
      setError('Por favor, insira um telefone válido.')
      setLoading(false)
      return
    }

    try {
      // Atualizar perfil com telefone
      const response = await fetch('/api/fix-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          nome: profile?.nome || user?.user_metadata?.nome || user?.user_metadata?.full_name,
          telefone,
          plano: profile?.plano || 'starter',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar telefone')
      }

      // Redirecionar para home
      router.push('/')
    } catch (err: any) {
      console.error('❌ Erro ao salvar telefone:', err)
      setError('Erro ao salvar telefone. Tente novamente.')
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete seu cadastro
          </h1>
          <p className="text-zinc-400">
            Precisamos do seu telefone para continuar
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-10" />
              <PhoneInput
                international
                defaultCountry="BR"
                value={telefone}
                onChange={(value) => setTelefone(value || '')}
                placeholder="(11) 99999-9999"
                className="phone-input-custom"
                inputClassName="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Usaremos seu telefone apenas para contato importante sobre sua conta
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
