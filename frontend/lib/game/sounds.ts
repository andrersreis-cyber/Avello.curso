import { Howl } from 'howler'

export type SfxKey =
  | 'ringtone'
  | 'beep'
  | 'click'
  | 'levelUp'
  | 'loot'
  | 'whoosh'
  | 'tensionSpike'

interface SfxConfig {
  src: string[]
  volume: number
  loop?: boolean
  preload?: boolean
}

const CATALOG: Record<SfxKey, SfxConfig> = {
  ringtone: { src: ['/audio/agente-0/ringtone.mp3'], volume: 0.55, loop: true },
  beep: { src: ['/audio/agente-0/beep-fim.mp3'], volume: 0.7 },
  click: { src: ['/sfx/click-hud.mp3'], volume: 0.35 },
  levelUp: { src: ['/sfx/level-up.mp3'], volume: 0.5 },
  loot: { src: ['/sfx/loot.mp3'], volume: 0.4 },
  whoosh: { src: ['/sfx/whoosh.mp3'], volume: 0.4 },
  tensionSpike: { src: ['/sfx/tension-spike.mp3'], volume: 0.4 },
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

/**
 * Ambient sonoro de tensão que roda em loop durante toda a jornada.
 * Fade-in suave pra não assustar, fade-out suave pra sair.
 */
let ambientHowl: Howl | null = null
let ambientPlaying = false

export function playAmbient(enabled: boolean, targetVolume = 0.35): void {
  if (!enabled || typeof window === 'undefined') return
  if (!ambientHowl) {
    ambientHowl = new Howl({
      src: ['/audio/ambient-tension.mp3'],
      volume: 0,
      loop: true,
      html5: true,
    })
  }
  if (ambientPlaying) return
  ambientPlaying = true
  ambientHowl.play()
  ambientHowl.fade(0, targetVolume, 1500)
}

export function pauseAmbient(): void {
  if (!ambientHowl || !ambientPlaying) return
  const h = ambientHowl
  h.fade(h.volume(), 0, 600)
  window.setTimeout(() => {
    h.pause()
    ambientPlaying = false
  }, 620)
}

export function stopAmbient(): void {
  if (!ambientHowl) return
  ambientHowl.stop()
  ambientPlaying = false
}

export function setAmbientVolume(vol: number): void {
  if (!ambientHowl) return
  ambientHowl.fade(ambientHowl.volume(), vol, 400)
}
