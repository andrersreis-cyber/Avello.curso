'use client'

import { useCallback, useEffect, useState } from 'react'
import { ProgressHud } from '@/components/landing-game/hud/progress-hud'
import { AtoWrapper } from '@/components/landing-game/shared/ato-wrapper'
import { AchievementToast } from '@/components/landing-game/shared/achievement-toast'
import { Ato1Hook } from '@/components/landing-game/atos/ato-1-hook'
import { Ato2Quiz } from '@/components/landing-game/atos/ato-2-quiz'
import { Ato3Arsenal } from '@/components/landing-game/atos/ato-3-arsenal'
import { Agente0Modal } from '@/components/landing-game/ligacao/agente-0-modal'
import { useGameStore } from '@/lib/game/store'
import type { RespostasQuiz } from '@/lib/game/levels'
import {
  playSfx,
  playAmbient,
  pauseAmbient,
  stopAmbient,
  setAmbientVolume,
} from '@/lib/game/sounds'

export default function LandingPage() {
  const atoAtual = useGameStore((s) => s.atoAtual)
  const progresso = useGameStore((s) => s.progresso)
  const nivel = useGameStore((s) => s.nivel)
  const classe = useGameStore((s) => s.classe)
  const somAtivo = useGameStore((s) => s.somAtivo)
  const conquistas = useGameStore((s) => s.conquistas)
  const hydrated = useGameStore((s) => s.hydrated)
  const avancarPara = useGameStore((s) => s.avancarPara)
  const responderQuiz = useGameStore((s) => s.responderQuiz)
  const atenderLigacao = useGameStore((s) => s.atenderLigacao)
  const toggleSom = useGameStore((s) => s.toggleSom)
  const adicionarConquista = useGameStore((s) => s.adicionarConquista)

  const [ligacaoAberta, setLigacaoAberta] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const lancarConquista = useCallback(
    (id: string, rotulo: string) => {
      if (conquistas.includes(id)) return
      adicionarConquista(id)
      setToast(rotulo)
      playSfx('levelUp', somAtivo)
    },
    [adicionarConquista, conquistas, somAtivo],
  )

  const handleIniciarJornada = useCallback(() => {
    if (!somAtivo) toggleSom()
    playSfx('click', true)
    lancarConquista('jornada_iniciada', 'jornada iniciada')
    avancarPara(2)
  }, [avancarPara, lancarConquista, somAtivo, toggleSom])

  const handleConcluirQuiz = useCallback(
    (respostas: RespostasQuiz) => {
      responderQuiz(respostas)
      lancarConquista('diagnostico_completo', 'diagnóstico concluído')
      setLigacaoAberta(true)
    },
    [responderQuiz, lancarConquista],
  )

  const handleLigacaoAtendida = useCallback(() => {
    atenderLigacao()
    lancarConquista('agente_0_atendido', 'agente 0 atendido')
    setAmbientVolume(0.1)
  }, [atenderLigacao, lancarConquista])

  const handleLigacaoEncerrada = useCallback(() => {
    setLigacaoAberta(false)
    setAmbientVolume(0.35)
    avancarPara(3)
  }, [avancarPara])

  const handleEntrarAto3 = useCallback(() => {
    playSfx('whoosh', somAtivo)
    lancarConquista('arsenal_liberado', 'arsenal liberado')
  }, [somAtivo, lancarConquista])

  const handleEntrarAto4 = useCallback(() => {
    playSfx('whoosh', somAtivo)
    avancarPara(4)
  }, [somAtivo, avancarPara])

  // Ambient sonoro de tensão toca durante toda a jornada.
  // Só dispara depois que o usuário ativou som (gesto explícito => permite autoplay).
  useEffect(() => {
    if (!somAtivo) {
      pauseAmbient()
      return
    }
    playAmbient(true, 0.35)
    return () => {
      // Ao desmontar a page (ex: navegar pra outra rota), para tudo.
      stopAmbient()
    }
  }, [somAtivo])

  // Duck o ambient enquanto a ligação tá aberta (voz do agente ganha o palco).
  useEffect(() => {
    if (!somAtivo) return
    setAmbientVolume(ligacaoAberta ? 0.1 : 0.35)
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
        onToggleSom={toggleSom}
      />

      <AchievementToast label={toast} onDismiss={() => setToast(null)} />

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
            onAvancar={handleEntrarAto4}
            somAtivo={somAtivo}
          />
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
