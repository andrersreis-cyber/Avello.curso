import { Howl } from 'howler'

export type SfxKey =
  | 'ringtone'
  | 'beep'
  | 'click'
  | 'levelUp'
  | 'loot'
  | 'whoosh'
  | 'tensionSpike'
  | 'riser'
  | 'heartbeat'

interface SfxConfig {
  src: string[]
  volume: number
  loop?: boolean
  preload?: boolean
}

const CATALOG: Record<SfxKey, SfxConfig> = {
  ringtone: { src: ['/audio/agente-0/ringtone.mp3'], volume: 0.65, loop: true },
  beep: { src: ['/audio/agente-0/beep-fim.mp3'], volume: 0.8 },
  click: { src: ['/sfx/click-hud.mp3'], volume: 0.7 },
  levelUp: { src: ['/sfx/level-up.mp3'], volume: 0.65 },
  loot: { src: ['/sfx/loot.mp3'], volume: 0.6 },
  whoosh: { src: ['/sfx/whoosh.mp3'], volume: 0.55 },
  tensionSpike: { src: ['/sfx/tension-spike.mp3'], volume: 0.55 },
  riser: { src: ['/audio/riser-stinger.mp3'], volume: 0.85 },
  heartbeat: { src: ['/audio/heartbeat-intensify.mp3'], volume: 0.7 },
}

const cache = new Map<SfxKey, Howl>()

function getHowl(key: SfxKey): Howl | null {
  if (typeof window === 'undefined') return null
  if (cache.has(key)) return cache.get(key)!

  const cfg = CATALOG[key]
  const howl = new Howl({
    src: cfg.src,
    volume: cfg.volume,
    loop: cfg.loop ?? false,
    preload: cfg.preload ?? false,
    html5: true,
  })
  cache.set(key, howl)
  return howl
}

/**
 * Toca um SFX curto. Retorna o ID do Howler para permitir stop posterior.
 * Silencioso em SSR e quando som está desativado.
 */
export function playSfx(key: SfxKey, enabled: boolean): number | null {
  if (!enabled) return null
  const howl = getHowl(key)
  if (!howl) return null
  return howl.play()
}

export function stopSfx(key: SfxKey): void {
  const howl = cache.get(key)
  howl?.stop()
}

export function stopAll(): void {
  cache.forEach((howl) => howl.stop())
}

/**
 * Cria/pega um Howl para a voz do Agente 0 (áudio dedicado por nível).
 * Usado separadamente do catálogo fixo porque o src varia em runtime.
 */
export function criarHowlAgente0(src: string): Howl | null {
  if (typeof window === 'undefined') return null
  return new Howl({
    src: [src],
    volume: 0.85,
    html5: true,
    preload: true,
  })
}

/* ============================================================
 * Ambient por ato — 4 trilhas cinematográficas com crossfade.
 *
 * - Ato 1 (hook):      briefing room, static rádio, drone baixo
 * - Ato 2 (quiz):      scanning, heartbeat pulse, hum digital
 * - Ato 3 (arsenal):   vault opening, synth pad reveal
 * - Ato 5 (ativação):  pressão, ticking crescendo
 *
 * Ato 4 (leaderboard) herda o ambient do ato 3 — mantém clima
 * de "conquista" sem quebrar o tom. Se preferir silêncio, passa
 * `null` em `playAmbientPorAto`.
 * ============================================================ */

export type AtoAmbient = 1 | 2 | 3 | 4 | 5

const AMBIENT_SRC: Record<AtoAmbient, string> = {
  1: '/audio/ambient-ato1.mp3',
  2: '/audio/ambient-ato2.mp3',
  3: '/audio/ambient-ato3.mp3',
  4: '/audio/ambient-ato3.mp3', // herda ato 3
  5: '/audio/ambient-ato5.mp3',
}

const AMBIENT_VOLUME: Record<AtoAmbient, number> = {
  1: 0.32,
  2: 0.28,
  3: 0.3,
  4: 0.3,
  5: 0.42, // mais alto no ato de pressão
}

const CROSSFADE_MS = 600

let ambientAtual: { ato: AtoAmbient; howl: Howl } | null = null
let ambientProximo: Howl | null = null
let habilitado = false

function criarAmbientHowl(src: string, volumeInicial: number): Howl {
  return new Howl({
    src: [src],
    volume: volumeInicial,
    loop: true,
    html5: true,
    preload: true,
  })
}

/**
 * Troca o ambient pro ato especificado com crossfade.
 * - Se mesmo ato, não faz nada.
 * - Se som desabilitado, só registra o desejo de ato (sem tocar).
 */
export function playAmbientPorAto(ato: AtoAmbient, enabled: boolean): void {
  if (typeof window === 'undefined') return

  habilitado = enabled

  // Som off → silencia tudo
  if (!enabled) {
    if (ambientAtual) {
      const { howl } = ambientAtual
      howl.fade(howl.volume(), 0, 400)
      window.setTimeout(() => howl.pause(), 420)
    }
    return
  }

  // Mesmo ato e já tocando → nada a fazer
  if (ambientAtual?.ato === ato && ambientAtual.howl.playing()) return

  const src = AMBIENT_SRC[ato]
  const vol = AMBIENT_VOLUME[ato]

  // Primeira chamada
  if (!ambientAtual) {
    const h = criarAmbientHowl(src, 0)
    h.play()
    h.fade(0, vol, CROSSFADE_MS)
    ambientAtual = { ato, howl: h }
    return
  }

  // Crossfade: sobe o novo, desce o antigo
  const antigo = ambientAtual
  ambientProximo = criarAmbientHowl(src, 0)
  ambientProximo.play()
  ambientProximo.fade(0, vol, CROSSFADE_MS)
  antigo.howl.fade(antigo.howl.volume(), 0, CROSSFADE_MS)

  window.setTimeout(() => {
    antigo.howl.stop()
    antigo.howl.unload()
  }, CROSSFADE_MS + 100)

  ambientAtual = { ato, howl: ambientProximo }
  ambientProximo = null
}

/**
 * Ajusta temporariamente o volume do ambient atual. Útil pra "duckar" durante
 * a ligação do Agente 0 (voz toma o palco). Passa `null` pra restaurar o padrão.
 */
export function setAmbientVolume(vol: number | null): void {
  if (!ambientAtual || !habilitado) return
  const volFinal = vol ?? AMBIENT_VOLUME[ambientAtual.ato]
  ambientAtual.howl.fade(ambientAtual.howl.volume(), volFinal, 400)
}

/**
 * Para tudo. Chamado ao desmontar a landing.
 */
export function stopAmbient(): void {
  if (ambientAtual) {
    ambientAtual.howl.stop()
    ambientAtual.howl.unload()
    ambientAtual = null
  }
  if (ambientProximo) {
    ambientProximo.stop()
    ambientProximo.unload()
    ambientProximo = null
  }
}

/* ============================================================
 * Compat com API antiga (page.tsx ainda usa).
 * Redireciona para a nova lógica por ato, mantendo comportamento
 * básico de liga/desliga sem quebrar chamadas existentes.
 * ============================================================ */

export function playAmbient(enabled: boolean): void {
  // Legado: inicia no ato 1 se nenhum ato foi setado ainda.
  if (!ambientAtual) {
    playAmbientPorAto(1, enabled)
  } else {
    playAmbientPorAto(ambientAtual.ato, enabled)
  }
}

export function pauseAmbient(): void {
  if (!ambientAtual) return
  const { howl } = ambientAtual
  howl.fade(howl.volume(), 0, 400)
  window.setTimeout(() => howl.pause(), 420)
}
