#!/usr/bin/env node
/**
 * Gera os ambients e stingers da landing gameficada via ElevenLabs Sound Effects.
 * Lê credenciais de .env.local. Salva em public/audio/.
 *
 * Uso:
 *   node scripts/gerar-ambients.mjs            # gera todos
 *   node scripts/gerar-ambients.mjs ato1 ato3  # só os especificados
 *
 * API: https://api.elevenlabs.io/v1/sound-generation
 *      duration_seconds: 0.5 - 22 (max 22)
 *      prompt_influence: 0-1 (default 0.3; maior = mais fiel ao prompt)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/audio')

function loadEnv(path) {
  const content = readFileSync(path, 'utf8')
  return Object.fromEntries(
    content
      .split('\n')
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => {
        const [k, ...v] = l.split('=')
        return [k.trim(), v.join('=').trim().replace(/^["']|["']$/g, '')]
      }),
  )
}

const env = loadEnv(resolve(ROOT, '.env.local'))
const { ELEVENLABS_API_KEY } = env

if (!ELEVENLABS_API_KEY) {
  console.error('[x] faltando ELEVENLABS_API_KEY em .env.local')
  process.exit(1)
}

/**
 * Catálogo de sound effects pra gerar.
 * Cada entrada: { file, prompt, duration, influence }.
 * duration em segundos (0.5 - 22). influence 0-1 (default 0.3).
 */
const CATALOGO = {
  ato1: {
    file: 'ambient-ato1.mp3',
    prompt:
      'cinematic briefing room atmosphere, low analog drone, subtle radio static, distant clock ticking, quiet suspense, eerie and tense, loopable',
    duration: 22,
    influence: 0.4,
  },
  ato2: {
    file: 'ambient-ato2.mp3',
    prompt:
      'digital scanning ambient, subtle heartbeat pulse, cyberpunk hum, analyzing data sound, tense computer processing, loopable',
    duration: 22,
    influence: 0.45,
  },
  ato3: {
    file: 'ambient-ato3.mp3',
    prompt:
      'futuristic vault opening atmosphere, synth pad reveal, shimmering arpeggios, data center humming, triumphant but restrained, loopable',
    duration: 22,
    influence: 0.4,
  },
  ato5: {
    file: 'ambient-ato5.mp3',
    prompt:
      'rising cinematic tension, ticking clock intensifying, pressure build-up, urgent countdown atmosphere, loopable',
    duration: 22,
    influence: 0.5,
  },
  riser: {
    file: 'riser-stinger.mp3',
    prompt:
      'cinematic riser build-up ending with sharp stinger impact, 3 seconds, suspenseful to powerful climax, trailer style',
    duration: 3,
    influence: 0.55,
  },
  heartbeat: {
    file: 'heartbeat-intensify.mp3',
    prompt:
      'human heartbeat starting slow and intensifying over 5 seconds, cinematic tension, bass-heavy, thump thump',
    duration: 5,
    influence: 0.5,
  },
}

async function gerarSfx(key, config) {
  const url = 'https://api.elevenlabs.io/v1/sound-generation'
  const body = {
    text: config.prompt,
    duration_seconds: config.duration,
    prompt_influence: config.influence,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`HTTP ${res.status} em ${key}: ${msg.slice(0, 300)}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const out = resolve(OUT_DIR, config.file)
  writeFileSync(out, buf)
  return { path: out, bytes: buf.length }
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  const args = process.argv.slice(2)
  const alvos =
    args.length > 0
      ? args.filter((a) => CATALOGO[a])
      : Object.keys(CATALOGO)

  if (alvos.length === 0) {
    console.error(`[x] nenhum alvo válido. opções: ${Object.keys(CATALOGO).join(', ')}`)
    process.exit(1)
  }

  console.log(`[*] gerando ${alvos.length} sound effects via ElevenLabs...`)
  console.log(`    saída: ${OUT_DIR.replace(ROOT, '.')}`)
  console.log('')

  for (const key of alvos) {
    const cfg = CATALOGO[key]
    process.stdout.write(`    [${key}] ${cfg.file} (${cfg.duration}s)... `)
    const t0 = Date.now()
    try {
      const { path, bytes } = await gerarSfx(key, cfg)
      const dt = ((Date.now() - t0) / 1000).toFixed(1)
      console.log(`ok (${(bytes / 1024).toFixed(0)} kB, ${dt}s)`)
    } catch (err) {
      console.log(`falhou: ${err.message}`)
    }
  }

  console.log('')
  console.log('[v] concluído.')
  console.log('')
  console.log('arquivos gerados:')
  for (const key of alvos) {
    const p = resolve(OUT_DIR, CATALOGO[key].file)
    if (existsSync(p)) {
      const s = statSync(p)
      console.log(`    ${CATALOGO[key].file}  (${(s.size / 1024).toFixed(0)} kB)`)
    }
  }
}

main().catch((err) => {
  console.error('[x] falhou:', err.message)
  process.exit(1)
})
