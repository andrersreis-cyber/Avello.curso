# 🎯 Plano Tático — Entrega 3 (Atos 4 + 5 + Polimento Final)

> **Audiência:** Cursor (executor).
> **Referência estratégica:** `PLANO_LANDING_GAMEFICADA.md` §7 + §4 (copy).
> **Criado:** 2026-04-23 · **Branch:** `feat/landing-gameficada` · **Base:** commit `167d5ca`
> **Executor:** Cursor · **Auditor:** Claude Code · **Aprovador:** André

---

## 1. 🎯 Objetivo

Fechar o funil. O visitante chega ao Ato 4 (prova social real) → Ato 5 (ativação: oferta única R$ 59,99 → Stripe Checkout). Ao completar a jornada, confetti celebra a conversão.

Resultado: **landing gameficada 100% funcional, publicável em tráfego pago**.

---

## 2. 📌 Decisões de produto (FINAIS, não alterar sem aprovação)

| Item | Valor |
|------|-------|
| **Classe** | 1 única — Operador Completo (plano master atualizado 2026-04-23) |
| **Preço âncora** | R$ 199 (riscado na UI) |
| **Preço ofertado** | R$ 59,99/ano (pagamento único, acesso de 1 ano) |
| **Badge desconto** | 70% OFF |
| **Stripe mode** | `payment` (compra única, NÃO `subscription`) |
| **Valor Stripe** | `5999` centavos · currency `brl` |
| **Acesso pós-compra** | gerenciado no backend existente (webhook já funciona) |
| **Garantia** | 7 dias reembolso |
| **Countdown** | 24h por visitante (localStorage) |

---

## 3. 📁 Arquivos

### Criar

| Path (dentro de `frontend/`) | Responsabilidade |
|------------------------------|------------------|
| `lib/game/oferta.ts` | Dados da oferta (preço, itens inclusos, FAQ, depoimentos) |
| `lib/game/pixel.ts` | Wrappers tipados dos eventos Meta (`trackViewContent`, `trackLead`, `trackInitiateCheckout`) |
| `components/landing-game/atos/ato-4-hall.tsx` | Hall dos Operadores — orquestrador |
| `components/landing-game/atos/ato-5-ativacao.tsx` | Ativação — orquestrador |
| `components/landing-game/hall/card-depoimento.tsx` | Card de depoimento com print + métrica |
| `components/landing-game/hall/video-short.tsx` | Player YouTube Short em modal |
| `components/landing-game/ativacao/card-oferta.tsx` | Card de oferta único (preço + lista + CTA) |
| `components/landing-game/ativacao/countdown-24h.tsx` | Contador regressivo HH:MM:SS |
| `components/landing-game/ativacao/faq-accordion.tsx` | FAQ com 6 perguntas em `<details>` |

### Editar

| Path | O que muda |
|------|------------|
| `app/landing/page.tsx` | Plugar `<Ato4Hall>` e `<Ato5Ativacao>` · handler `handleEntrarAto5` com conquista "hall_visto" · handler `handleAtivarOperador` que dispara pixel + confetti + redireciona pro Stripe |
| `app/landing/layout.tsx` | Meta tags OG + SEO (título, descrição, OG image) — só se faltar; auditar antes |

### NÃO criar (reusar existente)

- **`app/api/checkout/route.ts`** — **JÁ EXISTE**. Antes de mexer, ler o código atual. Se o Price ID atual já é R$ 59,99, só consumir. Se é outro valor, adicionar parâmetro `plano` ou criar novo Price ID no Stripe e plugar via env.
- **`components/facebook-pixel.tsx`** — **JÁ EXISTE**. O `lib/game/pixel.ts` novo apenas **consome** `window.fbq` (tipos já declarados em `types/fbq.d.ts`).

---

## 4. 🧩 Types + dados (`lib/game/oferta.ts`)

```typescript
export interface ItemOferta {
  texto: string
  destaque?: boolean  // bold + ícone check neon
}

export interface Depoimento {
  id: string
  nome: string
  nivelAntes: 1 | 2 | 3 | 4
  nivelDepois: 1 | 2 | 3 | 4
  imagem: string          // path em /public/images/social-proof/
  destaque: string        // frase curta em aspas (hero do card)
  metrica: string         // ex: "R$ 39 → R$ 250 em 12 dias"
}

export interface PerguntaFAQ {
  pergunta: string
  resposta: string
}

export const PRECO_ANCORA_REAIS = 199
export const PRECO_OFERTA_REAIS = 59.99
export const PRECO_OFERTA_CENTAVOS = 5999       // pro Stripe
export const DESCONTO_PERCENT = 70
export const COUNTDOWN_HORAS = 24
export const COUNTDOWN_STORAGE_KEY = 'avello_countdown_start_v1'

export const ITENS_OFERTA: readonly ItemOferta[] = [
  { texto: 'todos os 9 módulos desbloqueados', destaque: true },
  { texto: '3.500 prompts ChatGPT organizados' },
  { texto: '3.500 prompts Midjourney' },
  { texto: '3.000 templates Typebot' },
  { texto: '2.000 templates n8n (uso comercial liberado)' },
  { texto: '14 mil ferramentas IA categorizadas' },
  { texto: '350 softwares self-hosted' },
  { texto: 'GitHub de membros (acesso privado)' },
  { texto: 'infraestrutura completa' },
  { texto: '🎁 bônus: 30 SaaS white label', destaque: true },
] as const

export const DEPOIMENTOS: readonly Depoimento[] = [
  {
    id: 'gustavo',
    nome: 'Gustavo',
    nivelAntes: 2, nivelDepois: 3,
    imagem: '/images/social-proof/gustavo.png',
    destaque: 'é um atalho pronto',
    metrica: 'R$ 39 → R$ 250 em 12 dias',
  },
  {
    id: 'vitoria',
    nome: 'Vitória',
    nivelAntes: 1, nivelDepois: 2,
    imagem: '/images/social-proof/vitoria.png',
    destaque: 'cobrei R$ 250 usando R$ 39',
    metrica: 'ROI: 6.4x · primeiro mês',
  },
  {
    id: 'matheus',
    nome: 'Matheus',
    nivelAntes: 3, nivelDepois: 4,
    imagem: '/images/social-proof/matheus.png',
    destaque: 'R$ 500 + R$ 300/mês de recorrência',
    metrica: 'R$ 8.100 em 90 dias',
  },
] as const

export const VIDEO_SHORT_ID = 'g9T6TSR30Tc'  // YouTube Short, mantém o atual

export const FAQ: readonly PerguntaFAQ[] = [
  {
    pergunta: 'funciona mesmo pra quem tá começando?',
    resposta: 'sim. o arsenal é categorizado por nível. você vê só o que precisa.',
  },
  {
    pergunta: 'o que acontece depois que eu pago?',
    resposta: 'acesso imediato. login na hora. nada de esperar 24h.',
  },
  {
    pergunta: 'funciona sem saber programar?',
    resposta: 'sim. 90% do arsenal é "copia e cola". o resto tem vídeo passo a passo.',
  },
  {
    pergunta: 'posso revender o que tá dentro?',
    resposta: 'sim. uso comercial liberado.',
  },
  {
    pergunta: 'e se eu não gostar?',
    resposta: '7 dias pra testar. se não servir, devolvemos 100%. sem perguntar.',
  },
  {
    pergunta: 'preço vai subir?',
    resposta: 'sim. R$ 59,99 é preço de lançamento. sobe pra R$ 199 quando a oferta fecha.',
  },
] as const
```

---

## 5. 🎖 Ato 4 — Hall dos Operadores

### Copy (conforme plano master §4 Ato 4)

- **Headline:** *"operadores como você, 30 dias depois."*
- **Subheadline:** *"prints reais. nada de atriz contratada."*
- **Progress bar motivacional:** *"você desbloqueou **80%** da jornada. falta 1 ato."*
- **CTA:** `▼ ativar operador completo`

### Layout (`ato-4-hall.tsx`)

1. **Header** (mesmo padrão dos outros atos — pill + H2 + subhead)
2. **Grid de 3 cards de depoimento** (mobile: 1 col, desktop: 3 col)
3. **Vídeo Short** (centralizado, embaixo do grid, thumbnail clicável → modal)
4. **Progress bar 80%** com microcopy
5. **CTA** que chama `onAvancar()`

### `CardDepoimento` — layout

- Container: `rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden`
- Print: `<Image>` do next/image com `aspect-ratio` fixo (manter proporção sem CLS), `priority` só se `first`
- Rodapé do card:
  - Destaque em aspas, font-orbitron font-semibold text-lg text-neon-cyan
  - Métrica em text-sm text-zinc-400 font-exo2
  - Nome + nível: text-xs font-hud uppercase tracking-wider `Gustavo · nível 2 → 3`

### `VideoShort` — player

- Thumbnail do YouTube (`https://img.youtube.com/vi/{id}/maxresdefault.jpg`)
- Aspect-ratio 9:16 (vertical, Short)
- Ícone play centralizado + shadow
- Click → abre modal fullscreen com iframe `https://www.youtube.com/embed/{id}?autoplay=1`
- Modal respeita ESC pra fechar + click fora fecha
- Lazy load: só monta o iframe quando modal abre (economiza bundle)

### Progress bar motivacional

- Barra horizontal 80% preenchida
- Gradiente cyan→green
- Texto em hud abaixo: *"você desbloqueou 80% · falta 1 ato"*

---

## 6. ⚔️ Ato 5 — Ativação

### Copy (plano master §4 Ato 5 — atualizado com classe única)

- **Headline:** *"ativar arsenal completo."*
- **Subheadline:** *"tudo o que você viu. um preço. um clique."*
- **Microcopy final:** *"800+ operadores ativos · acesso imediato · sem mensalidade escondida"*

### Layout (`ato-5-ativacao.tsx`)

1. **Countdown 24h** no topo (destaque cyan/laranja, tabular-nums)
2. **Header** — pill + H2 + subhead
3. **Card de oferta único** (centralizado, máx `max-w-xl mx-auto`)
4. **FAQ accordion** (6 perguntas)
5. **CTA final** após FAQ (duplicação intencional, melhora conversão)
6. **Microcopy trust** abaixo do CTA

### `CardOferta` — estrutura

```
┌──────────────────────────────────────────┐
│          ⚔️ OPERADOR COMPLETO             │ <- badge dourado ITEM LENDÁRIO -70%
│                                          │
│   ~~R$ 199~~   R$ 59,99/ano              │ <- preço âncora riscado + atual
│                                          │
│   ✓ todos os 9 módulos desbloqueados    │
│   ✓ 3.500 prompts ChatGPT...            │
│   ✓ ...                                  │ <- lista de 10 itens
│   🎁 bônus: 30 SaaS white label          │ <- com destaque amber
│                                          │
│   ╔════════════════════════════════╗    │
│   ║  ⚡ ATIVAR OPERADOR            ║    │ <- CTA primário gigante
│   ╚════════════════════════════════╝    │
│                                          │
│   🔒 pagamento seguro · Stripe           │ <- trust signals
│   ⏱ garantia 7 dias · reembolso total    │
└──────────────────────────────────────────┘
```

- Background: `bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/30`
- Borda: `border-2 border-amber-500/50 shadow-[0_0_48px_rgba(245,158,11,0.25)]`
- Badge topo: pill dourado `ITEM LENDÁRIO · -70% OFF`
- Preço âncora (R$ 199): `line-through text-zinc-500 text-lg`
- Preço ofertado (R$ 59,99): `font-orbitron font-bold text-5xl md:text-6xl text-zinc-50`, com `/ano` menor em exo2 text-zinc-400
- Lista: check icons (CheckCircle2) text-neon-green w-5 h-5
- Item com `destaque: true`: `font-semibold text-zinc-50` (não destacados ficam zinc-300)
- CTA: gradient cyan→blue, `min-h-[64px]`, shadow forte, full-width dentro do card
- Trust signals: ícones Lock + ShieldCheck text-neon-green

### Integração do clique do CTA

No handler `handleAtivarOperador`:

```typescript
const handleAtivarOperador = useCallback(async () => {
  playSfx('levelUp', somAtivo)
  trackInitiateCheckout(PRECO_OFERTA_REAIS)
  // Confetti antes do redirect (visual de celebração ~800ms)
  dispararConfetti()
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'landing-gameficada' }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  } catch {
    // fallback: avisa o user que tentar de novo
    alert('ops, tenta de novo em 1 minuto.')
  }
}, [somAtivo])
```

**IMPORTANTE:** antes de implementar o `fetch`, **ler `app/api/checkout/route.ts`** pra confirmar o contrato (POST body esperado, formato de resposta). Se o endpoint atual não aceita `source`, adicionar — senão ignorar o body.

---

## 7. ⏱ Countdown 24h (`countdown-24h.tsx`)

### Comportamento

- Cada visitante tem 24h contadas a partir da **primeira visita**
- Armazena timestamp em `localStorage[COUNTDOWN_STORAGE_KEY]` como ISO string
- Se não existe → cria
- Se expirou → mostra `00:00:00` (não reinicia; é 1 ciclo)
- Atualiza a cada 1 segundo via `setInterval`
- Cleanup do interval no unmount

### Types + skeleton

```typescript
interface CountdownRemaining {
  horas: number
  minutos: number
  segundos: number
  expirou: boolean
}

function lerInicio(): Date {
  if (typeof window === 'undefined') return new Date()
  const existente = localStorage.getItem(COUNTDOWN_STORAGE_KEY)
  if (existente) return new Date(existente)
  const agora = new Date()
  localStorage.setItem(COUNTDOWN_STORAGE_KEY, agora.toISOString())
  return agora
}

function calcularRestante(inicio: Date): CountdownRemaining { /* ... */ }
```

### Layout

- Faixa estreita no topo do Ato 5, centralizada
- Ícone relógio (Lucide `Clock`) + texto: *"oferta de lançamento expira em"* + contador
- Cor: laranja (`text-neon-orange`) quando < 1h restante, caso contrário `text-neon-cyan`
- Formato: `HH:MM:SS` em `font-hud font-bold tabular-nums text-xl`

### Acessibilidade

- `role="timer" aria-live="polite"` — screen reader atualiza a cada minuto, não segundo (evitar spam)
- Esconder o SS do aria-live: atualizar um texto separado com `aria-hidden` pro visual, e outro sem os segundos pro AL

---

## 8. ❓ FAQ accordion (`faq-accordion.tsx`)

### Pattern

- Usar `<details><summary>` nativo (acessibilidade grátis, keyboard grátis, dependência zero)
- CSS custom pro estilo cyberpunk (já existe `details[open] > div` no globals.css)
- `<summary>` mostra a pergunta + ícone ChevronDown (rotate 180° quando open)
- Conteúdo: resposta em text-zinc-300 font-exo2

### Layout

```tsx
<section className="max-w-2xl mx-auto space-y-3">
  <h3 className="font-orbitron font-bold text-xl text-center mb-6">perguntas frequentes</h3>
  {FAQ.map((item, i) => (
    <details key={i} className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 list-none">
        <span className="font-orbitron font-semibold text-zinc-100">{item.pergunta}</span>
        <ChevronDown className="w-5 h-5 text-neon-cyan transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 text-zinc-300 font-exo2">{item.resposta}</div>
    </details>
  ))}
</section>
```

---

## 9. 🎉 Confetti ao ativar (`page.tsx` helper)

Já temos `canvas-confetti` instalado. Criar helper `lib/game/confetti.ts`:

```typescript
import confetti from 'canvas-confetti'

export function dispararConfetti(): void {
  const cores = ['#06b6d4', '#22c55e', '#d946ef', '#f59e0b']
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: cores,
    disableForReducedMotion: true,
  })
  window.setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.65 },
      colors: cores,
      disableForReducedMotion: true,
    })
  }, 250)
}
```

Dispara no clique do CTA do Ato 5, **antes do redirect** — o usuário vê a celebração antes de sair da página.

---

## 10. 📊 Pixel Meta Ads (`lib/game/pixel.ts`)

### Wrapper tipado

```typescript
interface LeadProperties {
  nivel: 1 | 2 | 3 | 4
  classe: string
}

export function trackViewContent(contentName: string): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'ViewContent', { content_name: contentName })
}

export function trackLead(properties: LeadProperties): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'Lead', {
    content_name: `nível ${properties.nivel} · ${properties.classe}`,
    nivel: properties.nivel,
  })
}

export function trackInitiateCheckout(valor: number): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'InitiateCheckout', {
    value: valor,
    currency: 'BRL',
    content_name: 'operador-completo',
  })
}
```

`Purchase` **NÃO** é disparado aqui — é responsabilidade da página `/loja/sucesso` (já existe). Fora do escopo da Entrega 3.

### Onde disparar

| Evento | Onde | Quando |
|--------|------|--------|
| `ViewContent` | `page.tsx`, dentro de `handleIniciarJornada` | CTA "começar jornada" do Ato 1 |
| `Lead` | `page.tsx`, dentro de `handleConcluirQuiz` | após calcular nível |
| `InitiateCheckout` | `page.tsx`, dentro de `handleAtivarOperador` | clique do CTA do Ato 5 |

Não disparar em `useEffect` ou `onMount` — regra geral de pixel: só em **ações claras do usuário**.

---

## 11. 🧭 SEO + metadata (`app/landing/layout.tsx`)

### Verificar o que já tem

O `layout.tsx` atual já tem `metadata` básico. Auditar e, se faltar:

```typescript
export const metadata: Metadata = {
  title: 'avello — desbloqueie seu arsenal de IA em 3 minutos',
  description: 'jornada interativa em 5 atos. descubra seu nível, libere 14 mil ferramentas + 9 módulos por R$ 59,99/ano. 800+ operadores ativos.',
  openGraph: {
    title: 'avello — desbloqueie seu arsenal de IA',
    description: 'jornada interativa em 5 atos. R$ 59,99/ano. 800+ operadores ativos.',
    type: 'website',
    images: [{ url: '/images/og-landing.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}
```

**NÃO criar** `/images/og-landing.jpg` se não existir — deixar como TODO no final.

---

## 12. 🎮 Integração completa no `page.tsx`

### Novos imports

```typescript
import { Ato4Hall } from '@/components/landing-game/atos/ato-4-hall'
import { Ato5Ativacao } from '@/components/landing-game/atos/ato-5-ativacao'
import { dispararConfetti } from '@/lib/game/confetti'
import { trackViewContent, trackLead, trackInitiateCheckout } from '@/lib/game/pixel'
import { PRECO_OFERTA_REAIS } from '@/lib/game/oferta'
```

### Handlers novos / ajustados

```typescript
const handleIniciarJornada = useCallback(() => {
  if (!somAtivo) toggleSom()
  playSfx('click', true)
  trackViewContent('landing-gameficada-iniciada')     // NOVO
  lancarConquista('jornada_iniciada', 'jornada iniciada')
  avancarPara(2)
}, [avancarPara, lancarConquista, somAtivo, toggleSom])

const handleConcluirQuiz = useCallback(
  (respostas: RespostasQuiz) => {
    responderQuiz(respostas)
    const perfil = calcularNivel(respostas)
    trackLead({ nivel: perfil.nivel, classe: perfil.classe })  // NOVO
    lancarConquista('diagnostico_completo', 'diagnóstico concluído')
    setLigacaoAberta(true)
  },
  [responderQuiz, lancarConquista],
)

const handleEntrarAto5 = useCallback(() => {
  playSfx('whoosh', somAtivo)
  lancarConquista('hall_visto', 'hall dos operadores')
}, [somAtivo, lancarConquista])

const handleAtivarOperador = useCallback(async () => {
  playSfx('levelUp', somAtivo)
  trackInitiateCheckout(PRECO_OFERTA_REAIS)
  dispararConfetti()
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'landing-gameficada' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch (err) {
    // deixar o user saber (não é silent failure)
    alert('erro ao abrir checkout. tenta de novo em 1 minuto.')
  }
}, [somAtivo])
```

**Importa `calcularNivel` de `@/lib/game/levels`** pra derivar perfil dentro do handler.

### JSX — adicionar após `<AtoWrapper atoId={3}>`

```tsx
<AtoWrapper atoId={4} atoAtual={atoAtual}>
  <Ato4Hall
    onEntrar={handleEntrarAto4 /* agora SÓ avança, não dispara conquista arsenal */}
    onAvancar={handleEntrarAto5 + avançar pra 5}
    somAtivo={somAtivo}
  />
</AtoWrapper>

<AtoWrapper atoId={5} atoAtual={atoAtual}>
  <Ato5Ativacao
    onEntrar={handleEntrarAto5}
    onAtivar={handleAtivarOperador}
    somAtivo={somAtivo}
  />
</AtoWrapper>
```

**OBS:** ajustar `handleEntrarAto4` existente — hoje ele faz whoosh + avançar. Agora o whoosh deve disparar ao **entrar** no Ato 4 (via `onEntrar` do Ato4Hall), e o avanço pro Ato 5 vem do CTA do Ato 4 (via `onAvancar`). Separar responsabilidades como no padrão Ato 3.

---

## 13. 🚫 O que NÃO fazer

1. ❌ **NÃO** criar nova rota `/api/checkout` — reusar a existente, ler primeiro
2. ❌ **NÃO** hardcodar o preço dentro do endpoint — usar `STRIPE_PRICE_ID_PREMIUM` do env
3. ❌ **NÃO** usar `any` em TypeScript
4. ❌ **NÃO** disparar `Purchase` do pixel na landing (é da `/loja/sucesso`)
5. ❌ **NÃO** disparar pixel em `useEffect`/mount — só em ações do user
6. ❌ **NÃO** criar depoimentos fictícios — usar os 3 existentes em `/public/images/social-proof/`
7. ❌ **NÃO** autoplay o vídeo Short sem click do user (ASD blocker + ruim de UX)
8. ❌ **NÃO** persistir o checkout state — é fluxo one-shot
9. ❌ **NÃO** usar `window.open()` pro Stripe — usar `window.location.href` (mantém contexto)
10. ❌ **NÃO** usar `alert()` como UX final — OK como fallback last-resort
11. ❌ **NÃO** adicionar comparação Free vs Premium — decisão do usuário foi "só 1 classe"
12. ❌ **NÃO** fazer o confetti antes da validação do checkout (pode falhar) — disparar ANTES do `fetch` é OK porque é celebração simbólica, mesmo que checkout falhe
13. ❌ **NÃO** esquecer `prefers-reduced-motion` (confetti tem `disableForReducedMotion`)
14. ❌ **NÃO** usar emojis como ícones — só Lucide (🔒 🎁 ⚡ ⏱ usados em copy são OK, visuais são Lucide)

---

## 14. ✅ Critérios de conclusão

### Funcional
- [ ] Atos 4 e 5 renderizam nos wrappers correspondentes
- [ ] Countdown 24h funciona entre refreshes (localStorage)
- [ ] Countdown mostra `00:00:00` quando expira (não reinicia)
- [ ] Vídeo Short abre em modal + fecha com ESC + click fora
- [ ] FAQ expande/colapsa em click e keyboard (Enter/Space)
- [ ] CTA do Ato 4 avança pro Ato 5 + dispara whoosh
- [ ] CTA do Ato 5 → dispara confetti + pixel `InitiateCheckout` + redireciona pro Stripe
- [ ] Pixel dispara nos 3 eventos corretos
- [ ] Conquistas disparam toast: `hall_visto`, mais (se adicionar)
- [ ] `prefers-reduced-motion`: confetti desabilitado, animations simplificadas

### Visual
- [ ] Ato 4: grid 1 col mobile, 3 col desktop, sem overflow 375px
- [ ] Ato 5: card de oferta centrado `max-w-xl`, aspect-ratio estável
- [ ] Badge dourado "ITEM LENDÁRIO · -70% OFF" visível
- [ ] Preço riscado (R$ 199) e preço atual (R$ 59,99) hierarquizados
- [ ] CLS < 0.1 (abrir DevTools Performance)
- [ ] Lighthouse mobile > 85
- [ ] CTA do Ato 5 mínimo `min-h-[64px]`, feedback tátil `active:scale-95`

### Técnico
```bash
cd frontend
pnpm exec tsc --noEmit           # zero erros
pnpm lint | grep -E "atos/ato-[45]|hall|ativacao|oferta|pixel|confetti"  # zero novos erros
pnpm exec next build             # build passa
```

### Analytics
- [ ] `ViewContent` disparado no clique "começar jornada"
- [ ] `Lead` disparado no final do quiz
- [ ] `InitiateCheckout` disparado no CTA "ativar operador"
- [ ] Valores numéricos corretos (value: 59.99, currency: BRL)

### Acessibilidade
- [ ] Todos os cards/botões interativos com `aria-label` ou texto visível
- [ ] Modal do vídeo: focus trap + restaura foco no close
- [ ] Countdown: `aria-live="polite"`, atualiza sem spam
- [ ] FAQ: `<details>/<summary>` nativo (a11y grátis)
- [ ] Contrast ratio 4.5:1 em todos os textos

---

## 15. 🚀 Ordem de implementação

O Cursor deve seguir **nesta ordem** — cada passo é testável isoladamente:

1. `lib/game/oferta.ts` — types + dados + constantes
2. `lib/game/pixel.ts` — wrappers tipados
3. `lib/game/confetti.ts` — helper + ciente de reduced-motion
4. `components/landing-game/hall/card-depoimento.tsx`
5. `components/landing-game/hall/video-short.tsx`
6. `components/landing-game/atos/ato-4-hall.tsx`
7. `components/landing-game/ativacao/card-oferta.tsx`
8. `components/landing-game/ativacao/countdown-24h.tsx`
9. `components/landing-game/ativacao/faq-accordion.tsx`
10. `components/landing-game/atos/ato-5-ativacao.tsx`
11. **Ler `app/api/checkout/route.ts`** e validar contrato
12. `app/landing/page.tsx` — handlers + JSX dos atos 4 e 5
13. Auditar `app/landing/layout.tsx` e adicionar metadata se faltar

Após cada passo, rodar `pnpm dev` e validar visualmente.

---

## 16. ✅ Ao terminar

1. **Rodar todos os comandos do §14 "Técnico"**
2. **Testar jornada completa** no browser (desktop + mobile responsive)
3. **Verificar logs do pixel** via Meta Pixel Helper (extension Chrome) — 3 eventos disparando
4. **Testar checkout** em **modo test** do Stripe (se configurado) — não fazer compra real sem confirmar com André
5. **Commitar** na `feat/landing-gameficada`:
   ```
   feat(landing-game): entrega 3 — atos 4 + 5 + stripe + pixel
   ```
6. **Chamar Claude Code** pra auditar
7. **Corrigir** o que for apontado
8. **Checkpoint final com André** → se aprovado, merge `feat/landing-gameficada` → `main`

---

## 17. 📝 Dependências novas (provavelmente zero)

Auditar antes de instalar:
- `canvas-confetti` — **JÁ INSTALADO** (verificar em `package.json`)
- `lucide-react` — **JÁ INSTALADO**
- `stripe` / `@stripe/stripe-js` — **JÁ INSTALADO** (usado na rota existente)

Se tudo já existe, não rodar `pnpm add`. Zero deps novas = meta.
