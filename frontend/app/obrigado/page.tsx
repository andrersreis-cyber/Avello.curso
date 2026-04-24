'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  PhoneCall,
  Shield,
  Sparkles,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useAuth } from '@/contexts/auth-context'

interface SessionInfo {
  email: string
  paymentStatus: string
}

const MENSAGEM_AGENTE_0 = [
  'transmissão recebida.',
  'pagamento confirmado, operador.',
  '9 módulos liberados. acesso vitalício ao arsenal ativo.',
  'último passo: define uma senha pra eu te reconhecer nas próximas missões.',
]

function ObrigadoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { signIn } = useAuth()

  // Estado do "voice print" do agente 0
  const [mensagemIdx, setMensagemIdx] = useState(0)
  const [mensagemCompleta, setMensagemCompleta] = useState(false)

  // Estado da session
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [carregandoSession, setCarregandoSession] = useState(true)
  const [erroSession, setErroSession] = useState<string | null>(null)

  // Formulário
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [ativando, setAtivando] = useState(false)
  const [erroAtivacao, setErroAtivacao] = useState<string | null>(null)

  // Busca dados da session no Stripe
  useEffect(() => {
    if (!sessionId) {
      setErroSession('link de acesso inválido. volte à página de checkout.')
      setCarregandoSession(false)
      return
    }
    let cancelado = false
    fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('session inválida')
        return res.json()
      })
      .then((data) => {
        if (cancelado) return
        const email = (data?.customer_email || data?.customer_details?.email) as string | undefined
        const paymentStatus = (data?.payment_status || 'paid') as string
        if (!email) {
          setErroSession('email não localizado na sessão.')
          return
        }
        setSession({ email: email.toLowerCase().trim(), paymentStatus })
      })
      .catch(() => {
        if (!cancelado) setErroSession('não consegui validar sua compra. tenta recarregar a página.')
      })
      .finally(() => {
        if (!cancelado) setCarregandoSession(false)
      })
    return () => {
      cancelado = true
    }
  }, [sessionId])

  // Animação "voice print" do agente 0 — revela linhas sequencialmente
  useEffect(() => {
    if (mensagemIdx >= MENSAGEM_AGENTE_0.length) {
      setMensagemCompleta(true)
      return
    }
    const delay = mensagemIdx === 0 ? 800 : 1400
    const timer = setTimeout(() => setMensagemIdx((i) => i + 1), delay)
    return () => clearTimeout(timer)
  }, [mensagemIdx])

  // Confetti celebrativo no mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const duration = 2200
    const end = Date.now() + duration
    const colors = ['#06b6d4', '#22c55e', '#a3e635']

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const senhaValida = useMemo(() => senha.length >= 6, [senha])
  const podeAtivar = senhaValida && !ativando && !!session

  async function handleAtivar(e: React.FormEvent) {
    e.preventDefault()
    if (!podeAtivar || !session) return

    setAtivando(true)
    setErroAtivacao(null)

    try {
      const res = await fetch('/api/ativar-conta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          senha,
          nome: nome.trim() || undefined,
        }),
      })
      const data = (await res.json()) as { email?: string; error?: string; success?: boolean }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'erro ao ativar conta')
      }

      // Faz login com a senha recém criada
      const { error: signInError } = await signIn(session.email, senha)
      if (signInError) {
        // Ativou mas falhou login — redireciona pro login manual
        router.push('/login?ativado=1')
        return
      }

      // Tudo certo — cai no dashboard (home autenticada)
      router.push('/')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'erro desconhecido'
      setErroAtivacao(msg)
      setAtivando(false)
    }
  }

  // Estados de erro crítico (sem session válida)
  if (erroSession) {
    return (
      <main className="min-h-dvh bg-zinc-950 text-zinc-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-400" aria-hidden />
          </div>
          <h1 className="font-orbitron font-bold text-2xl mb-3">acesso não validado</h1>
          <p className="text-zinc-400 mb-6">{erroSession}</p>
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-orbitron text-sm"
          >
            voltar pra landing
          </Link>
          <p className="mt-6 text-xs text-zinc-500">
            problemas com o acesso?{' '}
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              fala com o suporte no whatsapp
            </a>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Backdrop cinematográfico */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),transparent_55%),radial-gradient(circle_at_20%_100%,rgba(6,182,212,0.08),transparent_60%)]"
      />

      <div className="max-w-xl mx-auto px-4 py-10 md:py-14">
        {/* Header: status de missão */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.25em] text-emerald-300 border border-emerald-500/40 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            transmissão ativa
          </span>
        </div>

        {/* Cena Agente 0 — card estilo "ligação em curso" */}
        <div className="relative bg-zinc-900/70 backdrop-blur-sm border border-cyan-500/25 rounded-2xl p-6 md:p-8 mb-8 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
          {/* Avatar agente 0 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-300/50">
                <PhoneCall className="w-6 h-6 md:w-7 md:h-7 text-zinc-950" aria-hidden />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-hud text-[10px] uppercase tracking-[0.25em] text-cyan-300 mb-1">
                agente 0
              </p>
              <p className="font-orbitron font-bold text-base md:text-lg truncate">
                comando central
              </p>
              <p className="font-exo2 text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                transmissão criptografada
              </p>
            </div>
          </div>

          {/* Mensagens progressivas */}
          <div className="space-y-3 min-h-[160px]" aria-live="polite">
            {MENSAGEM_AGENTE_0.slice(0, mensagemIdx + 1).map((linha, i) => {
              const visivel = i < mensagemIdx || (i === mensagemIdx && mensagemIdx < MENSAGEM_AGENTE_0.length)
              if (!visivel) return null
              return (
                <p
                  key={i}
                  className="text-zinc-200 font-exo2 text-sm md:text-base leading-relaxed animate-[fadeIn_.5s_ease-out]"
                  style={{
                    animationFillMode: 'backwards',
                    animationDelay: '0.1s',
                  }}
                >
                  <span className="text-cyan-400 mr-2">›</span>
                  {linha}
                </p>
              )
            })}
          </div>

          {/* Waveform decorativo */}
          <div className="flex items-center justify-center gap-1 mt-5 pt-5 border-t border-zinc-800/70">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="w-1 bg-cyan-400/50 rounded-full"
                style={{
                  height: mensagemCompleta ? '8px' : `${6 + Math.abs(Math.sin(i + mensagemIdx)) * 16}px`,
                  animation: mensagemCompleta
                    ? undefined
                    : `pulse 0.6s ease-in-out ${i * 60}ms infinite alternate`,
                  transition: 'height 0.3s',
                }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        {/* Formulário de ativação */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-7 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden />
            <h2 className="font-orbitron font-bold text-lg md:text-xl">ativar acesso</h2>
          </div>

          {/* Email (readonly, da session) */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5 font-hud">
              seu email (do pagamento)
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                value={carregandoSession ? 'carregando...' : session?.email ?? ''}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 font-mono text-sm cursor-not-allowed"
                aria-label="email da compra"
              />
            </div>
          </div>

          <form onSubmit={handleAtivar} className="space-y-4">
            {/* Nome opcional */}
            <div>
              <label htmlFor="nome" className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5 font-hud">
                como quer ser chamado? <span className="text-zinc-600">(opcional)</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" aria-hidden />
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="ex: matheus"
                  maxLength={80}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5 font-hud">
                defina sua senha <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" aria-hidden />
                <input
                  id="senha"
                  type={senhaVisivel ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="mínimo 6 caracteres"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-12 py-3 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                  aria-label={senhaVisivel ? 'ocultar senha' : 'mostrar senha'}
                >
                  {senhaVisivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-1.5">
                use essa senha toda vez que entrar em avello
              </p>
            </div>

            {/* Erro */}
            {erroAtivacao && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300"
              >
                {erroAtivacao}
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={!podeAtivar}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[56px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-sm md:text-base shadow-[0_0_40px_rgba(6,182,212,0.45)] active:scale-95 transition-all"
            >
              {ativando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                  ativando arsenal...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" aria-hidden />
                  ativar meu acesso
                </>
              )}
            </button>
          </form>
        </div>

        {/* Garantia + suporte */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-zinc-900/40 rounded-xl p-4 border border-zinc-800">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden />
            <p className="text-xs text-zinc-400">
              7 dias de garantia incondicional.{' '}
              <span className="text-zinc-200">não gostou? devolvemos 100%.</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/40 rounded-xl p-4 border border-zinc-800">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden />
            <p className="text-xs text-zinc-400">
              problemas com o acesso?{' '}
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                suporte no whatsapp
              </a>
              {' '}— resposta em até 1h.
            </p>
          </div>
        </div>

        {/* Footer legal */}
        <div className="mt-12 pt-6 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-600">
            <Link href="/privacidade" className="hover:text-zinc-400">
              política de privacidade
            </Link>
            {' · '}
            <Link href="/termos" className="hover:text-zinc-400">
              termos de uso
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          from {
            transform: scaleY(0.6);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </main>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-zinc-950 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </main>
      }
    >
      <ObrigadoContent />
    </Suspense>
  )
}
