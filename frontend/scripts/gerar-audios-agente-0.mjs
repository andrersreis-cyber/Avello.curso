#!/usr/bin/env node
/**
 * Gera os 4 áudios do Agente 0 via ElevenLabs.
 * Lê credenciais de .env.local. Salva em public/audio/agente-0/nivel-{1..4}.mp3.
 *
 * Uso: node scripts/gerar-audios-agente-0.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/audio/agente-0')

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
const {
  ELEVENLABS_API_KEY,
  ELEVENLABS_VOICE_ID,
  ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2',
} = env

if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
  console.error('[x] faltando ELEVENLABS_API_KEY ou ELEVENLABS_VOICE_ID em .env.local')
  process.exit(1)
}

// Mirror exato de lib/game/scripts-agente-0.ts. Alterou lá? Alterar aqui.
const SCRIPTS = {
  1: [
    'interceptei seu sinal. agente 0 falando.',
    'análise concluída: nível 1. iniciante.',
    'você tá na superfície. nunca rodou ia pra trabalhar — só brincou.',
    'não é crítica. é ponto de partida.',
    '12 operadores nível 1 entraram nas últimas 24 horas. mesmo perfil que o seu.',
    'todos já têm uma automação rodando.',
    'missão pra você: primeira automação no ar em 3 dias.',
    'liberei a trilha curta. ferramentas grátis, prompt base, fluxo simples.',
    'o arsenal abre agora. não pisca.',
    'agente 0. câmbio.',
  ],
  2: [
    'dados confirmados. agente 0 no canal.',
    'você é nível 2. aspirante.',
    'já mexeu com ia. gostou. nunca virou dinheiro.',
    'padrão conhecido. o que falta não é talento — é arsenal organizado.',
    '3 operadores nível 2 fecharam a primeira venda ontem. 250, 400 e 180 reais.',
    'usaram o mesmo pacote que tô liberando pra você agora.',
    'missão: primeira venda em 7 dias.',
    '6 módulos abertos. prompts prontos, fluxos testados, script de venda.',
    'avança. o arsenal tá do outro lado.',
    'agente 0. câmbio.',
  ],
  3: [
    'travei suas respostas no cofre. agente 0.',
    'nível 3. freelancer ativo.',
    'cobra por automação. sabe que tá cobrando pouco.',
    'e tem um padrão. você entrega. o cliente some. começa do zero no próximo.',
    'o problema não é o seu preço. é a estrutura.',
    'troca 500 reais uma vez por 300 reais todo mês. conta aí em 12 meses.',
    'missão: primeiro contrato recorrente em 14 dias.',
    '8 módulos liberados. inclui o template de saas branco e o funil de recorrência.',
    'avança. o arsenal te espera.',
    'agente 0. câmbio.',
  ],
  4: [
    'identificado. agente 0 na linha.',
    'nível 4. operador completo.',
    'pula o curso. isso a gente sabe.',
    'o que te trava é escala. seu gargalo é reutilização — você constrói do zero toda vez.',
    'liberei acesso total. 14 mil ferramentas, 30 saas white label. tudo clonável.',
    '24 operadores nível 4 lançaram saas próprio nos últimos 90 dias.',
    'missão: primeiro saas no ar em 30 dias. margem acima de 70 por cento.',
    'continua. o que vem agora não é curso — é infra.',
    'agente 0. câmbio.',
  ],
}

/**
 * Substitui siglas que o TTS costuma ler como palavra.
 * "ia" (isolado) → "I.A." → ElevenLabs pronuncia letra por letra.
 */
function paraTTS(texto) {
  return texto
    .replace(/\bia\b/gi, 'I.A.')
    .replace(/\bn8n\b/gi, 'ene oito ene')
}

async function gerarVoz(nivel, linhas) {
  const texto = linhas.map(paraTTS).join(' ')
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: texto,
      model_id: ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.58,
        similarity_boost: 0.78,
        style: 0.32,
        use_speaker_boost: true,
      },
    }),
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`HTTP ${res.status} em nivel ${nivel}: ${msg.slice(0, 300)}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const out = resolve(OUT_DIR, `nivel-${nivel}.mp3`)
  writeFileSync(out, buf)
  return { path: out, bytes: buf.length }
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  console.log('[*] gerando 4 áudios com ElevenLabs...')
  console.log(`    model: ${ELEVENLABS_MODEL_ID}`)
  console.log(`    voice: ${ELEVENLABS_VOICE_ID.slice(0, 6)}...${ELEVENLABS_VOICE_ID.slice(-4)}`)

  for (const nivel of [1, 2, 3, 4]) {
    process.stdout.write(`    nivel ${nivel}... `)
    const t0 = Date.now()
    const { path, bytes } = await gerarVoz(nivel, SCRIPTS[nivel])
    const dt = ((Date.now() - t0) / 1000).toFixed(1)
    console.log(`ok (${(bytes / 1024).toFixed(0)} kB, ${dt}s) -> ${path.replace(ROOT, '.')}`)
  }

  console.log('[v] pronto. arquivos em public/audio/agente-0/')
}

main().catch((err) => {
  console.error('[x] falhou:', err.message)
  process.exit(1)
})
