# 🎮 Plano — Landing Page Gameficada (Avello Curso)

> **Status:** 📋 Aprovado para execução
> **Criado:** 2026-04-23
> **Autor:** Claude Code (planejador)
> **Executor:** Cursor (pair programming)
> **Auditor:** Claude Code
> **Aprovador final:** André Reis
>
> **Revisado por:** `agent-orchestrator` + `copywriting` + `ui-ux-pro-max`
> **Referência base:** `~/obsidian/avello-brain/03 - Recursos/Playbook - Landing Gameficada/`

---

## 1. 🎯 Objetivo

Substituir a landing atual (`/frontend/app/landing/page.tsx`) por uma **jornada gameficada em 5 atos** que aumente conversão em tráfego pago (Meta Ads) para o curso de IA/Automação.

**Meta de conversão:**
- CTR do anúncio > 3%
- Tempo médio na página > 2 min
- Conclusão da jornada > 20%
- Lead → checkout > 8%

---

## 2. 🧠 Conceito

### Tema narrativo
**"Desbloqueie seu Arsenal de IA"** — o visitante vira **"Operador de IA"** que coleta ferramentas, prompts e fluxos enquanto avança pelos atos. Combina com o produto (14 mil tools, 3500 prompts, 58 fluxos n8n) e responde bem ao público não-técnico.

### Jornada (5 atos)

```
[Ato 1: Hook]          → Sensorial, prende em <3s
       ↓
[Ato 2: Quiz]          → Detecta nível do operador (1-4)
       ↓
[🔔 Agente 0 Liga]     → Interlúdio: personaliza a jornada
       ↓
[Ato 3: Arsenal]       → Mostra as ferramentas se desbloqueando
       ↓
[Ato 4: Hall]          → Prova social (prints + vídeo)
       ↓
[Ato 5: Ativação]      → 2 classes (Free vs Premium) + checkout
```

### Princípios não-negociáveis
1. **Gating obrigatório** — cada ato só abre após conclusão do anterior
2. **Mobile-first 375px** — se não ficar bom em iPhone SE, não lança
3. **Estado em `sessionStorage`** — não perde progresso no refresh
4. **Copy minúsculas** (exceto siglas: IA, CRM, ChatGPT, n8n)
5. **Zero jargão técnico** — "LLM", "tokens", "vectorDB" = fora
6. **Respeita `prefers-reduced-motion`** — animações opcionais
7. **Animar 1-2 elementos por view** — excesso cansa

---

## 3. 🎨 Design System

### Paleta de cores
Híbrido **Cyberpunk UI + Retro-Futurism** — dark base + neon highlights.

| Token              | Hex        | Uso                                     |
|--------------------|------------|-----------------------------------------|
| `bg-base`          | `#09090b`  | Background principal (zinc-950)         |
| `bg-surface`       | `#18181b`  | Cards, painéis (zinc-900)               |
| `bg-elevated`      | `#27272a`  | Elementos elevados (zinc-800)           |
| `neon-cyan`        | `#06b6d4`  | Primary (CTA, progresso, links)         |
| `neon-green`       | `#22c55e`  | Success (desbloqueio, conquistas)       |
| `neon-magenta`     | `#d946ef`  | Acento especial (níveis, raros)         |
| `neon-orange`      | `#f97316`  | Urgência (countdown, "OFERTA")          |
| `text-primary`     | `#fafafa`  | Textos principais (zinc-50)             |
| `text-secondary`   | `#a1a1aa`  | Textos secundários (zinc-400)           |
| `text-muted`       | `#71717a`  | Muted (zinc-500)                        |
| `border-subtle`    | `#27272a`  | Bordas sutis                            |
| `border-glow`      | `#06b6d4`  | Bordas ativas/hover (com glow)          |

**Gradientes-chave:**
- **CTA principal:** `from-cyan-500 to-blue-600`
- **Desbloqueio:** `from-green-500 to-emerald-500`
- **Urgência:** `from-orange-600 to-red-600`
- **Raridade lendária:** `from-fuchsia-500 via-purple-500 to-cyan-500`

### Tipografia

| Fonte              | Uso                          | Peso           |
|--------------------|------------------------------|----------------|
| **Orbitron**       | Headings, números HUD        | 500, 600, 700  |
| **Exo 2**          | Body, copy, parágrafos       | 400, 500, 600  |
| **Share Tech Mono**| HUD, timers, contadores      | 400            |

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&family=Exo+2:wght@400;500;600&family=Share+Tech+Mono&display=swap');
```

**Escala:**
- Hero H1: `clamp(2.5rem, 8vw, 5rem)` / font-weight 700 / letter-spacing -0.02em
- Section H2: `text-3xl md:text-4xl` / font-weight 600
- Body: `text-base md:text-lg` / line-height 1.6
- HUD: `text-sm font-mono uppercase tracking-wider`

### Efeitos & animação
- **Glow neon:** `text-shadow: 0 0 20px currentColor` + `box-shadow: 0 0 40px {color}/40`
- **Scanlines sutis:** overlay `::before` com gradient repetido (opcional, toggle)
- **Glitch text** no Hero (1 vez, breve): keyframe de skew + offset
- **Contadores:** slot-machine effect (número girando até parar)
- **Card flip:** `rotateY(180deg)` com `transform-style: preserve-3d`
- **Confetti:** ao completar quiz e fim da jornada
- **Duration:** 150–300ms micro / 400–600ms transições de ato
- **Easing:** `ease-out` entrando, `ease-in` saindo

### Grid & espaçamento
- **Container max:** `max-w-6xl mx-auto`
- **Padding mobile:** `px-4`
- **Padding desktop:** `px-8`
- **Seção vertical:** `py-16 md:py-24`
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Componentes do HUD (topo fixo)
```
┌─────────────────────────────────────────────────┐
│ [AVELLO]  ⚡ nível 2  [████████░░] 67%   🔊 ⚙️ │
└─────────────────────────────────────────────────┘
```

Altura: `h-14` | Fixo: `fixed top-0` | Z-index: 50 | Blur: `backdrop-blur-md bg-zinc-950/80`

---

## 4. ✍️ Copy dos 5 Atos

### ATO 1 — Hook Sensorial

**Headline (🟢 A):**
> *o que acontece quando 14 mil ferramentas de IA trabalham **pra você**?*

**Alternativa (🟡 B):**
> *você tá a 3 minutos de desbloquear seu arsenal de IA.*

**Alternativa (🟡 C):**
> *descubra em 3 minutos por que 800 operadores cobram R$500 usando R$39.*

**Subheadline:**
> *jornada interativa. sem cadastro. sem cartão.*
> *começa quando você decidir.*

**CTA:** `▶ começar jornada`

**Microcopy abaixo do CTA:**
> *⚡ 800+ operadores ativos · 🎯 3 min de experiência · 🎁 brinde no final*

---

### ATO 2 — Diagnóstico (Quiz)

**Headline:**
> *primeiro, preciso saber onde você tá.*

**Subheadline:**
> *3 perguntas. sem pegadinha.*

#### Pergunta 1 — Experiência
**"você já mexeu com IA pra trabalhar?"**
- [ ] *nunca, só brinquei no chatgpt*
- [ ] *já usei, mas nada sério*
- [ ] *uso toda semana*
- [ ] *vivo disso*

#### Pergunta 2 — Renda
**"quanto você fatura hoje com IA ou automação?"**
- [ ] *zero, quero começar*
- [ ] *até R$ 2k/mês*
- [ ] *entre R$ 2k e R$ 10k/mês*
- [ ] *acima de R$ 10k/mês*

#### Pergunta 3 — Meta
**"o que você quer destravar primeiro?"**
- [ ] *minha primeira venda com IA*
- [ ] *sair do freela e virar recorrência*
- [ ] *escalar o que já faço*
- [ ] *criar meu próprio saas*

**Lógica de cálculo de nível:**
```
pontos = soma das respostas (1-4 por pergunta)
nível 1 (Iniciante)   = 3-4 pontos
nível 2 (Aspirante)   = 5-7 pontos
nível 3 (Freelancer)  = 8-10 pontos
nível 4 (Operador)    = 11-12 pontos
```

**Mensagem pós-quiz (dinâmica):**
> *calculando perfil... ✓*
> *você é **nível {N} — {CLASSE}***
> *aguarda aí. o agente 0 vai te ligar.*

---

### INTERLÚDIO — Ligação do Agente 0

**UI:** Modal fullscreen tipo iPhone call. Avatar circular pulsando. Ringtone 3s. Botão "atender" (verde) + "ignorar" (vermelho — se clicar, alerta "o agente 0 não desiste: atende aí").

**Nome mostrado:** `AGENTE_0`
**Subtítulo:** `chamada criptografada · nv {N}`

**Scripts (4 versões, um por nível):**

#### 🔊 Nível 1 — Iniciante (~35s)
> *fala, recruta. aqui é o agente 0.*
>
> *diagnóstico concluído: você é nível 1 — iniciante.*
> *tradução: você ainda tá na superfície. zero experiência real com IA.*
>
> *boa notícia: você tá no lugar certo, na hora certa.*
> *acabei de separar pra você uma trilha de entrada. 3 módulos.*
> *prompts, fluxo básico e ferramentas grátis.*
>
> *sua missão agora: destravar o arsenal. tem 14 mil ferramentas esperando.*
>
> *continua que eu te mostro.*
>
> *`[beep. fim da chamada.]`*

#### 🔊 Nível 2 — Aspirante (~35s)
> *fala, operador. aqui é o agente 0.*
>
> *diagnóstico: você é nível 2 — aspirante.*
> *já mexeu com IA, mas ainda não transformou isso em dinheiro.*
>
> *padrão conhecido. sei o que tá faltando.*
> *você tem a curiosidade. o que falta é o arsenal organizado.*
>
> *acabei de liberar 6 módulos pra você.*
> *prompts prontos, fluxos n8n testados, templates de venda.*
>
> *sua missão: primeira venda em 7 dias. 3 operadores nível 2 fizeram isso ontem.*
>
> *continua que eu te mostro o caminho.*
>
> *`[beep. fim da chamada.]`*

#### 🔊 Nível 3 — Freelancer (~35s)
> *fala, operador. aqui é o agente 0.*
>
> *nível 3 — freelancer.*
> *você já cobra por automação, mas sabe que tá cobrando pouco.*
>
> *eu vejo seu padrão. você entrega projeto e depois o cliente some.*
> *o problema não é você. é a estrutura.*
>
> *liberei 8 módulos. inclui template de saas branco e recorrência mensal.*
> *como cobrar R$300 por mês em vez de R$500 uma vez só.*
>
> *sua missão: 1º contrato de recorrência em 14 dias.*
>
> *continua. o arsenal tá aberto.*
>
> *`[beep. fim da chamada.]`*

#### 🔊 Nível 4 — Operador (~35s)
> *fala, operador. aqui é o agente 0.*
>
> *nível 4 — operador completo.*
> *você não precisa de curso. precisa de escala.*
>
> *análise: seu gargalo é reutilização. você constrói do zero toda vez.*
>
> *liberei acesso total. 14 mil ferramentas, 30 saas white label.*
> *tudo clonável. tudo revendível.*
>
> *sua missão: 1º saas lançado em 30 dias. margem > 70%.*
>
> *continua. tô te esperando do outro lado.*
>
> *`[beep. fim da chamada.]`*

**Transcrição embaixo do áudio** (acessibilidade + silent viewers).

**CTA pós-ligação:** `▶ continuar missão`

---

### ATO 3 — Arsenal Desbloqueado

**Headline:**
> *arsenal liberado pro seu nível.*

**Subheadline:**
> *passa o olho. tudo isso tá te esperando.*

**Mecânica visual:**
1. Contador slot-machine anima de 0 → números reais:
   - `+3.500` prompts ChatGPT
   - `+2.000` templates n8n
   - `+3.500` prompts Midjourney
   - `+3.000` templates Typebot
   - `+14.000` ferramentas IA
2. 9 cards de módulo flipam sequencialmente (stagger 100ms)
3. Cada card tem:
   - Ícone SVG (Lucide)
   - Título do módulo
   - Contador
   - Badge de raridade (comum/rara/épica/lendária)
   - Badge FREE/PREMIUM
4. 1 preview real (GIF) de fluxo n8n rodando
5. SFX: loot drop a cada card (se som ativo)

**Badges de raridade:**
| Raridade  | Cor                    | Módulos                                          |
|-----------|------------------------|--------------------------------------------------|
| Comum     | `text-zinc-400`        | Ferramentas grátis                               |
| Rara      | `text-cyan-400`        | Prompts ChatGPT, Midjourney                      |
| Épica     | `text-fuchsia-400`     | n8n, Typebot                                     |
| Lendária  | `gradient cyan→fuchsia`| Self-Hosted, GitHub Membros, Infraestrutura      |

**CTA final da seção:** `▼ ver quem já tá usando`

---

### ATO 4 — Hall dos Operadores

**Headline:**
> *operadores como você, 30 dias depois.*

**Subheadline:**
> *prints reais. nada de atriz contratada.*

**3 cards de depoimento (reusa `/public/images/social-proof/`):**

**Card 1 — Gustavo (Nível 2 → 3):**
- Print: `gustavo.png`
- Destaque: **"é um atalho pronto"**
- Métrica: `R$ 39 → R$ 250 em 12 dias`

**Card 2 — Vitória (Nível 1 → 2):**
- Print: `vitoria.png`
- Destaque: **"cobrei R$250 usando R$39"**
- Métrica: `ROI: 6.4x · primeiro mês`

**Card 3 — Matheus (Nível 3 → 4):**
- Print: `matheus.png`
- Destaque: **"R$500 + R$300/mês de recorrência"**
- Métrica: `R$ 8.100 em 90 dias`

**+ Vídeo depoimento** (YouTube Short ID `g9T6TSR30Tc`, já integrado — mantém modal vertical)

**Barra de progresso motivacional:**
> *você desbloqueou **80%** da jornada. falta 1 ato.*

**CTA:** `▼ ativar operador completo`

---

### ATO 5 — Ativação

**Headline:**
> *ativar arsenal completo.*

**Subheadline:**
> *tudo o que você viu. um preço. um clique.*

**Classe única — Operador Completo:**

#### ⚔️ Operador Completo
- Preço: ~~R$ 199~~ **R$ 59,99/ano** (70% OFF)
- Badge dourado: `ITEM LENDÁRIO · -70%`
- **Tudo desbloqueado:**
  - Todos os 9 módulos
  - 3.500 prompts ChatGPT organizados
  - 3.500 prompts Midjourney
  - 3.000 templates Typebot
  - 2.000 templates n8n (uso comercial liberado)
  - 14.000 ferramentas IA categorizadas
  - 350 softwares self-hosted
  - GitHub membros (acesso privado)
  - Infraestrutura completa
  - 🎁 Bônus: 30 SaaS white label
- Garantia: *7 dias. dinheiro de volta sem pergunta.*
- CTA: `⚡ ativar operador` (CTA primário, grande, glow cyan)

**Countdown (topo da seção):**
> *⏱️ oferta de lançamento expira em `{HH}:{MM}:{SS}`*
> (24h reinicia por visitante via localStorage)

**Microcopy final:**
> *800+ operadores ativos · acesso imediato · sem mensalidade escondida*

**FAQ (6 perguntas, accordion):**
1. **funciona mesmo pra quem tá começando?**
   > *sim. o arsenal é categorizado por nível. você vê só o que precisa.*
2. **o que acontece depois que eu pago?**
   > *acesso imediato. login na hora. nada de esperar 24h.*
3. **funciona sem saber programar?**
   > *sim. 90% do arsenal é "copia e cola". o resto tem vídeo passo a passo.*
4. **posso revender o que tá dentro?**
   > *sim. uso comercial liberado.*
5. **e se eu não gostar?**
   > *7 dias pra testar. se não servir, devolvemos 100%. sem perguntar.*
6. **preço vai subir?**
   > *sim. R$ 59,99 é preço de lançamento. sobe pra R$ 199 quando a oferta fecha.*

**CTA final (após FAQ):**
`⚡ ativar meu operador agora`

---

## 5. 🏗️ Arquitetura Técnica

### Stack (nova)
| Tecnologia        | Versão  | Uso                                    |
|-------------------|---------|----------------------------------------|
| Next.js           | 15.x    | Já existe                              |
| React             | 19.x    | Já existe                              |
| Tailwind CSS      | 3.x     | Já existe                              |
| **Framer Motion** | 11.x    | Animações, transições, flip, stagger   |
| **Zustand**       | 4.x     | Estado global do jogo                  |
| **Howler.js**     | 2.x     | Áudio (ring, SFX, voz do Agente 0)     |
| **canvas-confetti**| 1.x    | Confetes ao completar                  |
| Lucide React      | 0.x     | Ícones (já deve estar)                 |

**Instalar:**
```bash
pnpm add framer-motion zustand howler canvas-confetti
pnpm add -D @types/howler @types/canvas-confetti
```

### Estado global (Zustand)

```typescript
// lib/game/store.ts
type Ato = 0 | 1 | 2 | 3 | 4 | 5
type Nivel = 1 | 2 | 3 | 4
type ClasseNivel = 'Iniciante' | 'Aspirante' | 'Freelancer' | 'Operador'

interface GameState {
  // progresso
  atoAtual: Ato
  progresso: number            // 0-100
  nivel: Nivel | null
  classe: ClasseNivel | null

  // quiz
  respostasQuiz: [number, number, number] | null

  // áudio
  somAtivo: boolean
  reducedMotion: boolean

  // conquistas
  conquistas: string[]
  ligacaoAtendida: boolean

  // ações
  avancarAto: () => void
  responderQuiz: (respostas: [number, number, number]) => void
  atenderLigacao: () => void
  toggleSom: () => void
  resetJogo: () => void

  // persistência
  hydrate: () => void
}
```

Persistência em `sessionStorage` via middleware `persist` do Zustand.

---

## 6. 📁 Estrutura de Arquivos

```
frontend/
├── app/
│   └── landing/
│       ├── page.tsx                    [REESCRITA — orquestra atos]
│       └── page.tsx.v1.backup          [backup da atual]
│
├── components/
│   └── landing-game/                   [NOVA pasta]
│       ├── hud/
│       │   ├── progress-hud.tsx        [barra topo: nível + XP + som]
│       │   ├── som-toggle.tsx
│       │   └── nivel-badge.tsx
│       │
│       ├── shared/
│       │   ├── ato-wrapper.tsx         [wrapper com gating]
│       │   ├── achievement-toast.tsx   [notificação estilo jogo]
│       │   ├── glitch-text.tsx         [efeito glitch no H1]
│       │   └── scanlines.tsx           [overlay opcional]
│       │
│       ├── atos/
│       │   ├── ato-1-hook.tsx
│       │   ├── ato-2-quiz.tsx
│       │   ├── ato-3-arsenal.tsx
│       │   ├── ato-4-hall.tsx
│       │   └── ato-5-ativacao.tsx
│       │
│       ├── ligacao/
│       │   ├── agente-0-modal.tsx      [modal fullscreen call]
│       │   ├── call-ui.tsx             [UI estilo iPhone]
│       │   ├── avatar-pulsante.tsx
│       │   └── transcricao.tsx         [texto sincronizado]
│       │
│       └── arsenal/
│           ├── card-modulo.tsx         [flip card]
│           ├── contador-slot.tsx       [slot machine]
│           └── badge-raridade.tsx
│
├── lib/
│   └── game/
│       ├── store.ts                    [Zustand store]
│       ├── levels.ts                   [cálculo de nível + classes]
│       ├── sounds.ts                   [Howler config]
│       ├── achievements.ts             [lista de conquistas]
│       ├── scripts-agente-0.ts         [4 scripts de voz]
│       └── modulos.ts                  [dados dos 9 módulos]
│
└── public/
    ├── audio/
    │   └── agente-0/
    │       ├── ringtone.mp3
    │       ├── beep-fim.mp3
    │       ├── nivel-1.mp3             [TBD: ElevenLabs]
    │       ├── nivel-2.mp3
    │       ├── nivel-3.mp3
    │       └── nivel-4.mp3
    │
    ├── sfx/
    │   ├── loot.mp3
    │   ├── level-up.mp3
    │   ├── achievement.mp3
    │   └── click-hud.mp3
    │
    └── images/
        ├── social-proof/               [já existe]
        │   ├── gustavo.png
        │   ├── vitoria.png
        │   └── matheus.png
        └── demos/
            └── fluxo-n8n.gif           [TBD: capturar da plataforma]
```

---

## 7. 📦 Plano de Execução (3 Entregas)

### 🎬 ENTREGA 1 — Fundação + Atos 1, 2 e Ligação

**Objetivo:** validar tom, paleta, áudio do Agente 0 e sensação geral.

**Escopo:**
- [ ] Instalar deps (Framer Motion, Zustand, Howler, confetti)
- [ ] Configurar fontes (Orbitron + Exo 2 + Share Tech Mono)
- [ ] Criar Zustand store (`lib/game/store.ts`)
- [ ] Criar HUD fixo topo (`progress-hud.tsx`)
- [ ] Criar wrapper de ato com gating (`ato-wrapper.tsx`)
- [ ] Criar ATO 1 (Hook + glitch text + CTA)
- [ ] Criar ATO 2 (Quiz 3 perguntas + cálculo de nível)
- [ ] Criar modal Agente 0 (call UI + avatar pulsante)
- [ ] Gravar/gerar 4 áudios via ElevenLabs (voz robótica masculina)
- [ ] Adicionar ringtone + beep
- [ ] Transcrição sincronizada
- [ ] Scanlines overlay (toggle)
- [ ] `prefers-reduced-motion` aplicado
- [ ] Backup da landing antiga
- [ ] Trocar `/landing/page.tsx` para orquestrar atos 1, 2 + ligação
- [ ] Testar em 375px, 768px, 1024px

**Critério de aceite:**
- Fluxo Hook → Quiz → Ligação roda sem travas
- 4 níveis testados (quiz devolve nível certo)
- Áudio toca e pausa
- Gating: ato 3 não aparece ainda (placeholder)
- Mobile 375px perfeito
- Lighthouse mobile > 80

**⏸️ Checkpoint:** André aprova o tom/visual antes de seguir.

---

### 🎬 ENTREGA 2 — Ato 3 (Arsenal Desbloqueado)

**Objetivo:** o coração visual da conversão.

**Escopo:**
- [ ] Criar `modulos.ts` com dados dos 9 módulos
- [ ] Contador slot-machine (5 contadores)
- [ ] 9 cards de módulo com flip 3D
- [ ] Badges de raridade (comum/rara/épica/lendária)
- [ ] Stagger animation (cards aparecem em sequência)
- [ ] SFX de loot a cada flip
- [ ] 1 GIF preview de fluxo n8n
- [ ] CTA final → dispara ato 4
- [ ] Conquista desbloqueada: "Arsenal Liberado"
- [ ] `prefers-reduced-motion`: flip vira fade simples

**Critério de aceite:**
- Contadores animam suavemente (sem travar)
- Cards flipam no hover + stagger inicial
- Badge de raridade visível e consistente
- SFX opt-in
- Mobile: grid 1 col, desktop: grid 3 col
- Sem layout shift (CLS < 0.1)

**⏸️ Checkpoint:** André aprova antes de seguir.

---

### 🎬 ENTREGA 3 — Atos 4 e 5 + Polimento

**Objetivo:** fechar o funil de conversão.

**Escopo:**
- [ ] ATO 4: reusar prints + vídeo YouTube Short existentes
- [ ] Enquadrar prints como "cards de ranking"
- [ ] Badge: "você desbloqueou 80% da jornada"
- [ ] ATO 5: 2 classes lado a lado (Free/Premium)
- [ ] Badge "ITEM LENDÁRIO · -80%"
- [ ] Countdown 24h via localStorage
- [ ] FAQ accordion (6 perguntas)
- [ ] CTA final com scroll suave
- [ ] Confetti ao completar jornada
- [ ] Integrar checkout (URL a definir com André)
- [ ] Pixel Meta Ads (já deve existir)
- [ ] SEO: meta tags, OG image, título
- [ ] Testes E2E básicos (Playwright já configurado)
- [ ] Audit final

**Critério de aceite:**
- Jornada completa testável do início ao fim
- Todos CTAs funcionam
- Countdown persiste no localStorage
- FAQ expande/colapsa
- Lighthouse mobile > 85
- CLS < 0.1, LCP < 2.5s
- Acessibilidade WCAG AA (contraste, ARIA, keyboard nav)

**⏸️ Checkpoint final:** André aprova + merge na main.

---

## 8. 🚫 O que NÃO fazer

1. ❌ **NÃO** pular o gating — cada ato só desbloqueia após completar anterior
2. ❌ **NÃO** usar emojis como ícones (usar Lucide/Heroicons SVG)
3. ❌ **NÃO** usar `any` em TypeScript
4. ❌ **NÃO** commitar `console.log` no código final
5. ❌ **NÃO** criar chaves de API no código (usar `.env`)
6. ❌ **NÃO** animar 5+ elementos ao mesmo tempo (máx 2 por view)
7. ❌ **NÃO** ignorar `prefers-reduced-motion`
8. ❌ **NÃO** usar scale no hover (causa layout shift — use opacity/color)
9. ❌ **NÃO** criar formulário de e-mail no Ato 5 (vai direto pro checkout)
10. ❌ **NÃO** usar capitalização em headlines/CTAs (só minúsculas, exceto siglas)
11. ❌ **NÃO** adicionar features não previstas sem aprovação (ex: chat bot, popup exit-intent)
12. ❌ **NÃO** criar mais de 1 CTA primário no Ato 5
13. ❌ **NÃO** duplicar código — extrair em `ato-wrapper.tsx` / `shared/`

---

## 9. ✅ Critérios de Conclusão (global)

### Funcionalidade
- [ ] 5 atos sequenciais com gating
- [ ] Estado persistido em sessionStorage
- [ ] Quiz calcula nível corretamente
- [ ] Ligação do Agente 0 toca áudio certo por nível
- [ ] Som toggle (on/off) funcionando
- [ ] Countdown funcionando
- [ ] CTA final leva pro checkout
- [ ] Reset de jogo disponível (debug)

### Design & UX
- [ ] Mobile 375px perfeito (sem horizontal scroll)
- [ ] Tablet 768px funcional
- [ ] Desktop 1024px+ elegante
- [ ] Paleta aplicada consistentemente
- [ ] Tipografia carregando (FOUT tratado)
- [ ] Todas animações respeitam `reduced-motion`
- [ ] Cursor-pointer em todos clicáveis
- [ ] Focus states visíveis
- [ ] Sem layout shift (CLS < 0.1)

### Performance
- [ ] Lighthouse mobile > 85
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] Bundle JS < 300kb gzipped
- [ ] Imagens WebP otimizadas
- [ ] Áudios preload on-demand (só após Ato 2)
- [ ] Lazy load do vídeo YouTube

### Acessibilidade (WCAG AA)
- [ ] Contraste ≥ 4.5:1 em todos textos
- [ ] Alt text em todas imagens
- [ ] ARIA labels em botões de ícone
- [ ] Keyboard nav funcional
- [ ] Modal do Agente 0 com focus trap
- [ ] Transcrição da voz do agente

### Código
- [ ] Zero `any` em TS
- [ ] Zero `console.log` em prod
- [ ] Componentes modulares (1 responsabilidade)
- [ ] ESLint sem warnings
- [ ] TypeScript sem erros
- [ ] Nomes descritivos

### Analytics
- [ ] Pixel Meta Ads disparando em eventos-chave:
  - `ViewContent` (ato 1)
  - `Lead` (após quiz / nível detectado)
  - `InitiateCheckout` (clique no CTA final)
  - `Purchase` (pós-checkout, via pixel no sucesso)

---

## 10. ✅ Decisões Finais do André

Todas as decisões fechadas em 2026-04-23:

| # | Item                    | Decisão                                                       |
|---|-------------------------|---------------------------------------------------------------|
| 1 | **Tom do Agente 0**     | 🎖️ Militar/sério (combina com voz robótica, estilo "missão") |
| 2 | **Nome**                | "Agente 0"                                                    |
| 3 | **Checkout**            | Stripe Checkout Session (via API, customizável)               |
| 4 | **Som padrão**          | Off + prompt "🔊 ativar som" no início do Ato 1               |
| 5 | **Countdown**           | 24h por visitante (localStorage, reinicia pra cada um)        |
| 6 | **TTS Agente 0**        | Gerar 4 áudios via ElevenLabs na Entrega 1                    |
| 7 | **Branch de trabalho**  | `feat/landing-gameficada`                                     |
| 8 | **Repositório**         | `andrersreis-cyber/Avello.curso`                              |

### APIs necessárias no `frontend/.env.local`

```bash
# === Stripe (checkout) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_PREMIUM=price_...                    # pegar no Stripe Dashboard
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com         # usado nas success/cancel URLs

# === ElevenLabs (voz do Agente 0) ===
ELEVENLABS_API_KEY=sk_elevenlabs_...
ELEVENLABS_VOICE_ID=...                              # voz robótica masculina (ex: "Josh" ou custom)
ELEVENLABS_MODEL_ID=eleven_multilingual_v2           # suporta PT-BR
```

⚠️ **Importante:** `.env.local` **NUNCA** é commitado. O arquivo `.env.example` será atualizado pra documentar as chaves necessárias sem expor valores.

---

## 11. 🔗 Referências

- **Playbook-fonte:** `~/obsidian/avello-brain/03 - Recursos/Playbook - Landing Gameficada/`
  - `00 - Framework.md` (os 5 atos)
  - `01 - Ato 1 Hook Sensorial.md`
  - `02 - Ato 2 Diagnóstico da Dor.md`
  - `03 - Ato 3 Demo Ao Vivo.md`
  - `04 - Ato 4 Prova Emocional.md`
  - `05 - Ato 5 Oferta & Ativação.md`
- **Landing atual:** `/frontend/app/landing/page.tsx`
- **Docs atuais:** `/frontend/LANDING_DOCS.md`
- **Case-fonte:** Operação 24/7 (primeiro produto com framework gamificado)
- **Instruções globais:** `~/.claude/CLAUDE.md`

---

## 12. 📝 Histórico

| Data       | Evento                                                        |
|------------|---------------------------------------------------------------|
| 2026-04-23 | Plano criado. Revisado por agent-orchestrator + copywriting + ui-ux-pro-max |

---

**🎯 Pronto para execução. Cursor pode começar a Entrega 1.**

---

## 13. 🚀 Como o Cursor deve começar

1. **Criar branch:**
   ```bash
   cd /Users/andrereis/projetos/Avello.curso
   git checkout -b feat/landing-gameficada
   ```

2. **Instalar dependências:**
   ```bash
   cd frontend
   pnpm add framer-motion zustand howler canvas-confetti
   pnpm add -D @types/howler @types/canvas-confetti
   ```

3. **Criar `.env.local` a partir do `.env.example`** e pedir pro André preencher.

4. **Seguir ordem de arquivos da Seção 6** — começar pelos mais fundamentais:
   - `lib/game/store.ts` (Zustand)
   - `lib/game/levels.ts`
   - `lib/game/sounds.ts`
   - `components/landing-game/hud/progress-hud.tsx`
   - `components/landing-game/shared/ato-wrapper.tsx`
   - Depois atos 1, 2 e ligação

5. **Rodar dev:**
   ```bash
   pnpm dev
   ```
   Testar em `http://localhost:3000/landing`

6. **Ao terminar Entrega 1:** abrir PR e chamar Claude Code pra auditar.

---

## 14. 🔍 Checklist de Auditoria (Claude Code)

Após cada entrega, Claude audita:

**Qualidade:**
- [ ] Zero `any` em TypeScript
- [ ] Zero `console.log`
- [ ] Sem código duplicado
- [ ] Nomes descritivos
- [ ] Componentes com responsabilidade única

**Segurança:**
- [ ] `.env.local` não commitado
- [ ] Chaves API só no server-side (nunca `NEXT_PUBLIC_*` em secret)
- [ ] Inputs validados (Zod ou similar no quiz/checkout)
- [ ] Stripe webhook com verificação de assinatura

**Performance:**
- [ ] Lighthouse mobile > 85
- [ ] LCP < 2.5s
- [ ] Sem re-renders desnecessários
- [ ] Áudios preload só após Ato 2
- [ ] Imagens em WebP

**UX/Acessibilidade:**
- [ ] Mobile 375px sem horizontal scroll
- [ ] `prefers-reduced-motion` respeitado
- [ ] Focus states visíveis
- [ ] ARIA labels em ícones
- [ ] Transcrição da voz do Agente 0

**Copy:**
- [ ] Minúsculas consistentes (exceto siglas)
- [ ] Zero jargão técnico
- [ ] CTAs com verbo + benefício

Veredicto: ✅ Aprovado · ⚠️ Atenção · ❌ Bloqueante
