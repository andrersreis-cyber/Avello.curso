'use client'

import { useCallback, useEffect, useState } from 'react'
import { ProgressHud } from '@/components/landing-game/hud/progress-hud'
import { AtoWrapper } from '@/components/landing-game/shared/ato-wrapper'
import { AchievementToast } from '@/components/landing-game/shared/achievement-toast'
import { Ato1Hook } from '@/components/landing-game/atos/ato-1-hook'
import { Ato2Quiz } from '@/components/landing-game/atos/ato-2-quiz'
import { Ato3Arsenal } from '@/components/landing-game/atos/ato-3-arsenal'
import { Ato4Leaderboard } from '@/components/landing-game/atos/ato-4-leaderboard'
import { Ato5Ativacao } from '@/components/landing-game/atos/ato-5-ativacao'
import { Agente0Modal } from '@/components/landing-game/ligacao/agente-0-modal'
import { CentralIntel } from '@/components/landing-game/central-intel/central-intel'
import { useGameStore } from '@/lib/game/store'
import { calcularNivel, type RespostasQuiz } from '@/lib/game/levels'
import {
  playSfx,
  playAmbientPorAto,
  pauseAmbient,
  stopAmbient,
  setAmbientVolume,
  type AtoAmbient,
} from '@/lib/game/sounds'
import { dispararConfetti } from '@/lib/game/confetti'
import {
  trackViewContent,
  trackLead,
  trackInitiateCheckout,
} from '@/lib/game/pixel'
import { PRECO_OFERTA_REAIS } from '@/lib/game/oferta'

export default function LandingPage() {
  const atoAtual = useGameStore((s) => s.atoAtual)
  const progresso = useGameStore((s) => s.progresso)
  const nivel = useGameStore((s) => s.nivel)
  const classe = useGameStore((s) => s.classe)
  const somAtivo = useGameStore((s) => s.somAtivo)
  const conquistas = useGameStore((s) => s.conquistas)
  const xpTotal = useGameStore((s) => s.xpTotal)
  const hydrated = useGameStore((s) => s.hydrated)
  const avancarPara = useGameStore((s) => s.avancarPara)
  const responderQuiz = useGameStore((s) => s.responderQuiz)
  const atenderLigacao = useGameStore((s) => s.atenderLigacao)
  const toggleSom = useGameStore((s) => s.toggleSom)
  const adicionarConquista = useGameStore((s) => s.adicionarConquista)
  const setNome = useGameStore((s) => s.setNome)

  const [ligacaoAberta, setLigacaoAberta] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [erroCheckout, setErroCheckout] = useState<string | null>(null)

  const lancarConquista = useCallback(
    (id: string, rotulo: string) => {
      if (conquistas.includes(id)) return
      adicionarConquista(id)
      setToast(rotulo)
      playSfx('levelUp', somAtivo)
    },
    [adicionarConquista, conquistas, somAtivo],
  )

  const handleIniciarJornada = useCallback(
    (nome: string | null) => {
      if (!somAtivo) toggleSom()
      playSfx('click', true)
      setNome(nome)
      trackViewContent('landing-gameficada-iniciada')
      lancarConquista('jornada_iniciada', 'jornada iniciada')
      avancarPara(2)
    },
    [avancarPara, lancarConquista, setNome, somAtivo, toggleSom],
  )

  const handleConcluirQuiz = useCallback(
    (respostas: RespostasQuiz) => {
      responderQuiz(respostas)
      const perfil = calcularNivel(respostas)
      trackLead({ nivel: perfil.nivel, classe: perfil.classe })
      lancarConquista('diagnostico_completo', 'diagnóstico concluído')
      setLigacaoAberta(true)
    },
    [responderQuiz, lancarConquista],
  )

  const handleLigacaoAtendida = useCallback(() => {
    atenderLigacao()
    lancarConquista('agente_0_atendido', 'agente 0 atendido')
    setAmbientVolume(0.08)
  }, [atenderLigacao, lancarConquista])

  const handleLigacaoEncerrada = useCallback(() => {
    setLigacaoAberta(false)
    setAmbientVolume(null)
    avancarPara(3)
  }, [avancarPara])

  const handleEntrarAto3 = useCallback(() => {
    playSfx('whoosh', somAtivo)
    lancarConquista('arsenal_liberado', 'arsenal liberado')
  }, [somAtivo, lancarConquista])

  const handleAvancarPara4 = useCallback(() => {
    avancarPara(4)
  }, [avancarPara])

  const handleEntrarAto4 = useCallback(() => {
    playSfx('whoosh', somAtivo)
    lancarConquista('leaderboard_visto', 'leaderboard acessado')
  }, [somAtivo, lancarConquista])

  const handleAvancarPara5 = useCallback(() => {
    playSfx('whoosh', somAtivo)
    avancarPara(5)
  }, [somAtivo, avancarPara])

  const handleAtivarOperador = useCallback(async () => {
    playSfx('levelUp', somAtivo)
    setErroCheckout(null)
    trackInitiateCheckout(PRECO_OFERTA_REAIS)
    dispararConfetti()
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'operador_anual', source: 'landing' }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setErroCheckout('erro ao abrir checkout. tenta de novo em 1 minuto.')
      }
    } catch {
      setErroCheckout('erro ao abrir checkout. tenta de novo em 1 minuto.')
    }
  }, [somAtivo])

  // Ambient sonoro cinematográfico muda com o ato. Crossfade suave entre eles.
  // Só dispara depois que o usuário ativou som (gesto explícito => permite autoplay).
  useEffect(() => {
    if (!somAtivo) {
      pauseAmbient()
      return
    }
    // Ato 0 (não iniciado) cai pro 1 (hook). Tudo entre 1-5 tem ambient próprio.
    const atoAmbient = (atoAtual >= 1 && atoAtual <= 5
      ? atoAtual
      : 1) as AtoAmbient
    playAmbientPorAto(atoAmbient, true)
    return () => {
      // Ao desmontar a page (ex: navegar pra outra rota), para tudo.
      stopAmbient()
    }
  }, [somAtivo, atoAtual])

  // Duck o ambient enquanto a ligação tá aberta (voz do agente ganha o palco).
  useEffect(() => {
    if (!somAtivo) return
    setAmbientVolume(ligacaoAberta ? 0.08 : null)
  }, [ligacaoAberta, somAtivo])

  if (!hydrated) {
    return (
      <main
        className="min-h-dvh bg-zinc-950 text-zinc-50 flex items-center justify-center"
        aria-label="carregando jornada"
      >
        <div className="font-hud text-xs uppercase tracking-[0.3em] text-neon-cyan animate-pulse">
          inicializando...
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh bg-zinc-950 text-zinc-50 font-exo2">
      <ProgressHud
        progresso={progresso}
        nivel={nivel}
        classe={classe}
        somAtivo={somAtivo}
        xpTotal={xpTotal}
        onToggleSom={toggleSom}
      />

      <AchievementToast label={toast} onDismiss={() => setToast(null)} />

      {erroCheckout && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] max-w-md mx-auto px-4 w-full"
        >
          <div className="flex items-start gap-3 rounded-xl border border-orange-500/50 bg-zinc-900/95 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex-1 text-sm text-orange-200 font-exo2">
              {erroCheckout}
            </div>
            <button
              type="button"
              onClick={() => setErroCheckout(null)}
              aria-label="fechar aviso de erro"
              className="text-zinc-400 hover:text-zinc-200 transition-colors font-hud text-xs uppercase tracking-wider cursor-pointer"
            >
              fechar
            </button>
          </div>
        </div>
      )}

      <div className="pt-14">
        <AtoWrapper atoId={1} atoAtual={atoAtual}>
          <Ato1Hook onAvancar={handleIniciarJornada} />
        </AtoWrapper>

        <AtoWrapper atoId={2} atoAtual={atoAtual}>
          <Ato2Quiz onConcluir={handleConcluirQuiz} somAtivo={somAtivo} />
        </AtoWrapper>

        <AtoWrapper atoId={3} atoAtual={atoAtual}>
          <Ato3Arsenal
            onEntrar={handleEntrarAto3}
            onAvancar={handleAvancarPara4}
            somAtivo={somAtivo}
          />
        </AtoWrapper>

        {atoAtual >= 3 && <CentralIntel />}

        <AtoWrapper atoId={4} atoAtual={atoAtual}>
          <Ato4Leaderboard
            onEntrar={handleEntrarAto4}
            onAvancar={handleAvancarPara5}
            somAtivo={somAtivo}
          />
        </AtoWrapper>

        <AtoWrapper atoId={5} atoAtual={atoAtual}>
          <Ato5Ativacao onAtivar={handleAtivarOperador} />
        </AtoWrapper>
      </div>

      <Agente0Modal
        aberto={ligacaoAberta}
        nivel={nivel}
        classe={classe}
        somAtivo={somAtivo}
        onAtendida={handleLigacaoAtendida}
        onEncerrar={handleLigacaoEncerrada}
      />
    </main>
  )
}
