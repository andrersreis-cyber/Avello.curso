# 🎯 Plano Tático — Entrega 2 (Ato 3: Arsenal Desbloqueado)

> **Audiência:** Cursor (executor).
> **Referência estratégica:** `PLANO_LANDING_GAMEFICADA.md` §7 + §4 (copy do Ato 3).
> **Criado:** 2026-04-23 · **Branch:** `feat/landing-gameficada` · **Base:** commit `8094253`
> **Executor:** Cursor · **Auditor:** Claude Code · **Aprovador:** André

---

## 1. 🎯 Objetivo

Construir o **Ato 3 — "Arsenal Desbloqueado"**. Após a ligação do Agente 0, o visitante vê:
- 5 contadores animando (slot-machine) com os números do arsenal
- 9 cards de módulo com **flip 3D** + badge de raridade
- CTA final que avança pro Ato 4

É o **coração visual da conversão**. Não vende ainda — mostra o tamanho do arsenal.

**Gating:** só renderiza quando `atoAtual === 3`.

---

## 2. 📁 Arquivos

### Criar

| Path (dentro de `frontend/`) | Responsabilidade |
|------------------------------|------------------|
| `lib/game/modulos.ts` | Types + dados dos 9 módulos + 5 contadores |
| `components/landing-game/arsenal/badge-raridade.tsx` | Badge colorido por raridade |
| `components/landing-game/arsenal/contador-slot.tsx` | Contador animado (0 → valor) |
| `components/landing-game/arsenal/card-modulo.tsx` | Card flipável com ícone + badge |
| `components/landing-game/atos/ato-3-arsenal.tsx` | Orquestrador (header + grids + CTA) |

### Editar

| Path | O que muda |
|------|------------|
| `app/landing/page.tsx` | Remover placeholder "próximo ato · em preparação" e plugar `<Ato3Arsenal>` dentro de `<AtoWrapper atoId={3}>` |

### NÃO tocar

- `lib/game/store.ts` — o schema atual (`conquistas`, `avancarPara`) já atende
- `lib/game/sounds.ts` — `playSfx('loot')` e `playSfx('whoosh')` já existem
- Componentes do Ato 1/2/ligação — entrega 1 tá fechada

---

## 3. 🧩 Types (não inventar outros)

Dentro de `lib/game/modulos.ts`:

```typescript
export type Raridade = 'comum' | 'rara' | 'epica' | 'lendaria'
export type Tier = 'free' | 'premium'

export interface Modulo {
  id: string
  nome: string
  descricao: string        // 1 linha de microcopy
  iconeKey: IconeKey       // chave do mapa de ícones Lucide (ver §5)
  raridade: Raridade
  tier: Tier
  ordem: number            // 1..9 para stagger
}

export interface Contador {
  id: string
  valor: number
  sufixo: string           // ex: "prompts ChatGPT"
  duracaoMs: number        // duração da animação slot-machine
}

// Tipo estreito: só os ícones que realmente usamos.
export type IconeKey =
  | 'MessageSquareText'
  | 'Image'
  | 'Bot'
  | 'Workflow'
  | 'Wrench'
  | 'Server'
  | 'Github'
  | 'Network'
  | 'Boxes'
```

---

## 4. 🔢 Dados fixos (copiar exato)

### 5 contadores

```typescript
export const CONTADORES: readonly Contador[] = [
  { id: 'prompts-chatgpt',    valor: 3500,  sufixo: 'prompts ChatGPT',   duracaoMs: 1800 },
  { id: 'templates-n8n',      valor: 2000,  sufixo: 'templates n8n',     duracaoMs: 1600 },
  { id: 'prompts-midjourney', valor: 3500,  sufixo: 'prompts Midjourney', duracaoMs: 1800 },
  { id: 'templates-typebot',  valor: 3000,  sufixo: 'templates Typebot',  duracaoMs: 1600 },
  { id: 'ferramentas-ia',     valor: 14000, sufixo: 'ferramentas IA',     duracaoMs: 2400 },
] as const
```

### 9 módulos (ordem define o stagger)

```typescript
export const MODULOS: readonly Modulo[] = [
  { id: 'prompts-chatgpt',    nome: 'Prompts ChatGPT',      descricao: '3500 prompts validados por categoria',       iconeKey: 'MessageSquareText', raridade: 'rara',     tier: 'premium', ordem: 1 },
  { id: 'prompts-midjourney', nome: 'Prompts Midjourney',   descricao: '3500 prompts pra imagem profissional',       iconeKey: 'Image',              raridade: 'rara',     tier: 'premium', ordem: 2 },
  { id: 'templates-typebot',  nome: 'Templates Typebot',    descricao: '3000 fluxos de chatbot prontos',             iconeKey: 'Bot',                raridade: 'epica',    tier: 'premium', ordem: 3 },
  { id: 'templates-n8n',      nome: 'Templates n8n',        descricao: '2000 automações testadas em produção',       iconeKey: 'Workflow',           raridade: 'epica',    tier: 'free',    ordem: 4 },
  { id: 'ferramentas-ia',     nome: 'Ferramentas IA',       descricao: '14 mil ferramentas categorizadas por uso',   iconeKey: 'Wrench',             raridade: 'comum',    tier: 'premium', ordem: 5 },
  { id: 'self-hosted',        nome: 'Self-Hosted',          descricao: '350 softwares pra rodar no seu servidor',    iconeKey: 'Server',             raridade: 'lendaria', tier: 'premium', ordem: 6 },
  { id: 'github-membros',     nome: 'GitHub de Membros',    descricao: 'acesso privado ao repo de operadores',       iconeKey: 'Github',             raridade: 'lendaria', tier: 'premium', ordem: 7 },
  { id: 'infraestrutura',     nome: 'Infraestrutura',       descricao: 'setup de SaaS white label pronto pra clonar', iconeKey: 'Network',            raridade: 'lendaria', tier: 'premium', ordem: 8 },
  { id: 'saas-white-label',   nome: '30 SaaS White Label',  descricao: 'aplicações prontas pra revender no seu nome', iconeKey: 'Boxes',              raridade: 'lendaria', tier: 'premium', ordem: 9 },
] as const
```

---

## 5. 🎨 Mapa de ícones (mesmo arquivo `modulos.ts`)

Importe do `lucide-react` e exponha um **mapa tipado** — nunca busque ícone por string em runtime.

```typescript
import {
  MessageSquareText, Image, Bot, Workflow, Wrench,
  Server, Github, Network, Boxes,
  type LucideIcon,
} from 'lucide-react'

export const ICONES_MODULO: Record<IconeKey, LucideIcon> = {
  MessageSquareText, Image, Bot, Workflow, Wrench,
  Server, Github, Network, Boxes,
}
```

No card, usar: `const Icon = ICONES_MODULO[modulo.iconeKey]`.

---

## 6. 🎨 Paleta por raridade

| Raridade  | Texto                                           | Borda                   | Fundo                                         |
|-----------|-------------------------------------------------|-------------------------|-----------------------------------------------|
| comum     | `text-zinc-400`                                 | `border-zinc-700`       | `bg-zinc-800/40`                              |
| rara      | `text-cyan-400`                                 | `border-cyan-500/50`    | `bg-cyan-500/10`                              |
| epica     | `text-fuchsia-400`                              | `border-fuchsia-500/50` | `bg-fuchsia-500/10`                           |
| lendaria  | `bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-300` | `border-cyan-500/50` (com glow rosa no shadow) | `bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10` |

**Badge (`BadgeRaridade`):** pill pequeno, `font-hud text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border`.

---

## 7. 🧱 Componentes

### 7.1 `BadgeRaridade`

**Props:** `{ raridade: Raridade }`

**Layout:** pill conforme §6. Uma linha. Nada de ícone dentro do badge.

### 7.2 `ContadorSlot`

**Props:** `{ contador: Contador, ativar: boolean }`

**Comportamento:**
- Começa exibindo `0`.
- Quando `ativar === true`, anima de `0` até `valor` com easing **ease-out-cubic** durante `duracaoMs`.
- Respeita `prefers-reduced-motion`: pula direto pro valor final, sem animação.
- Usa `requestAnimationFrame` (não `setInterval`).
- Formata o número com separador de milhar **"."** (pt-BR): `valor.toLocaleString('pt-BR')`.

**Layout:**
- `flex-col items-center`
- Número: `font-orbitron font-bold text-5xl md:text-6xl text-zinc-50 tabular-nums`
- Prefixo `+`: `text-neon-cyan text-3xl mr-1`
- Sufixo: `mt-2 text-xs md:text-sm text-zinc-400 font-hud uppercase tracking-wider`

### 7.3 `CardModulo`

**Props:** `{ modulo: Modulo, somAtivo: boolean, onFlip?: () => void }`

**Estrutura 3D:**
- Container: `perspective-1000` (utility custom via `style`), `w-full h-[220px]`
- Flipper: `relative w-full h-full transition-transform duration-600 [transform-style:preserve-3d]`, rotação `[transform:rotateY(180deg)]` quando `flipped === true`
- Frente: `absolute inset-0 [backface-visibility:hidden]` — conteúdo normal
- Verso: `absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]` — "✓ DESBLOQUEADO"

**Estado:**
- `flipped: boolean` interno
- **Desktop:** `onMouseEnter` → flip(true), `onMouseLeave` → flip(false)
- **Mobile (touch):** ao entrar no viewport, flip(true) por 900ms depois flip(false) — mostra desbloqueio uma vez
- **Click/Tap em qualquer device:** toggle flip

**SFX:**
- A cada transição pra `flipped=true`: `playSfx('loot', somAtivo)`
- Chamar `onFlip?.()` junto (pro orquestrador saber)

**Reduced motion:**
- Zera a rotação (`[transform-style:flat]`)
- Em vez de flip, faz um fade rápido (opacity 1 → 0.7 → 1) pra indicar desbloqueio
- Sem SFX? Não — mantém SFX (é opt-in via `somAtivo`)

**Frente (layout):**
```
┌─────────────────────────────────┐
│  [🔧 icone 40px]      [BADGE]   │
│                                 │
│  Nome do Módulo                 │
│  descrição em uma linha         │
│                                 │
│  [TIER: FREE ou PREMIUM]        │
└─────────────────────────────────┘
```
- Container: `rounded-xl border bg-zinc-900/80 p-5 flex flex-col gap-3`
- Borda: cor baseada em raridade (ver §6)
- Ícone: top-left, cor text-neon-cyan (ou gradient pra lendária)
- Badge: top-right (flex-row justify-between)
- Nome: `font-orbitron font-semibold text-lg text-zinc-50`
- Descrição: `text-sm text-zinc-400 font-exo2`
- Tier badge embaixo:
  - FREE: `text-zinc-500 border-zinc-700 bg-zinc-800` (sutil)
  - PREMIUM: `text-amber-300 border-amber-500/40 bg-amber-500/10` (destacado)

**Verso (layout):**
- Mesmo container, fundo com gradient leve baseado na raridade
- Ícone `CheckCircle2` grande (60px) text-neon-green centralizado
- Texto "DESBLOQUEADO" `font-orbitron font-bold text-xl neon-text-green`
- Microcopy `arsenal liberado pra você` abaixo

### 7.4 `Ato3Arsenal`

**Props:** `{ onAvancar: () => void, somAtivo: boolean }`

**Composição vertical:**
1. **Header:**
   - Pill topo: `ato 3/5 · arsenal desbloqueado` (mesmo estilo do Ato 1)
   - H2 Orbitron: *"arsenal liberado pro seu nível."* + realce `neon-text-cyan`
   - Subheadline: *"passa o olho. tudo isso tá te esperando."*

2. **Grid de contadores (5):**
   - Mobile: `grid-cols-2` (último ocupa full-width ou quebra natural)
   - Desktop: `flex flex-wrap justify-center gap-8 md:gap-12`
   - IntersectionObserver: dispara `ativar=true` em **todos** os contadores quando o Header sai da tela e o grid entra (ver §8)

3. **Grid de módulos (9):**
   - Mobile 1 col · tablet 2 col · desktop 3 col
   - `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
   - Stagger via `framer-motion` `variants` (`staggerChildren: 0.1`, `delayChildren: 0.2`) — mas só ativa quando entra no viewport (`whileInView`, `viewport={{ once: true, amount: 0.15 }}`)

4. **CTA final:**
   - Botão grande `▼ ver quem já tá usando` → chama `onAvancar()`
   - Mesmo padrão visual do Ato 1 (gradient cyan→blue, shadow, min-h-[56px])

---

## 8. 🔗 Integração com store + SFX + ambient

**No `app/landing/page.tsx`:**

```tsx
// Substituir o placeholder "próximo ato · em preparação" por:
<AtoWrapper atoId={3} atoAtual={atoAtual}>
  <Ato3Arsenal
    somAtivo={somAtivo}
    onAvancar={handleEntrarAto4}
  />
</AtoWrapper>
```

**Novo handler no `page.tsx`:**

```typescript
const handleEntrarAto4 = useCallback(() => {
  playSfx('whoosh', somAtivo)
  lancarConquista('arsenal_liberado', 'arsenal liberado')
  avancarPara(4)
}, [somAtivo, lancarConquista, avancarPara])
```

**Disparar conquista ao entrar no Ato 3:**
- Dentro de `Ato3Arsenal`, use `useEffect(() => { ... }, [])` no mount → chama um callback `onEntrar` recebido via props **OU** use `lancarConquista` exposto pelo page.
- Sugestão mais limpa: passar `onEntrar` como prop e o `page.tsx` decide o que fazer.

**Remove do `page.tsx`:** todo o bloco `{atoAtual >= 3 && ( <section ...> próximo ato em preparação ... )}`

---

## 9. 🚫 O que NÃO fazer

1. ❌ **NÃO** usar emojis como ícones — só Lucide mapeado (§5)
2. ❌ **NÃO** usar `any` em TypeScript
3. ❌ **NÃO** criar abstração `<Card>` genérica — `CardModulo` é específico do Ato 3
4. ❌ **NÃO** animar mais de 2 elementos ao mesmo tempo (stagger resolve)
5. ❌ **NÃO** usar `scale` no hover dos cards — **causa layout shift**. Só `rotateY`
6. ❌ **NÃO** usar `backdrop-blur` dentro do card — péssima performance no mobile
7. ❌ **NÃO** fazer import dinâmico de ícones — tudo estático no mapa
8. ❌ **NÃO** adicionar um 10º módulo, trocar ordem ou alterar contadores sem aprovação do André
9. ❌ **NÃO** esquecer `prefers-reduced-motion` (flip → fade simples)
10. ❌ **NÃO** mudar a paleta — seguir §6 exato
11. ❌ **NÃO** fazer fetch/suspense no Ato 3 — é estático
12. ❌ **NÃO** `console.log` em código final

---

## 10. ✅ Critérios de conclusão (auto-checar antes de pedir auditoria)

### Funcional
- [ ] Contadores animam de 0 até valor em ease-out, suavemente em mobile
- [ ] Formatação pt-BR (14.000, não 14,000)
- [ ] 9 cards aparecem com stagger (~100-120ms entre eles)
- [ ] Hover desktop → flip 180° → volta no mouse-leave
- [ ] Mobile: cards flipam automaticamente uma vez ao entrar no viewport
- [ ] Click/Tap em qualquer card → toggle flip
- [ ] Cada flip dispara SFX `loot` (se `somAtivo`)
- [ ] Conquista `arsenal_liberado` dispara toast + SFX `levelUp`
- [ ] CTA "ver quem já tá usando" chama `avancarPara(4)`
- [ ] `prefers-reduced-motion: reduce` → sem rotação, sem stagger pesado

### Visual
- [ ] Grid mobile 1col · tablet 2col · desktop 3col
- [ ] Zero horizontal scroll em 375px, 768px, 1024px, 1440px
- [ ] Badges de raridade visualmente distintas (testar lendária no contraste)
- [ ] CLS < 0.1 (abrir DevTools Performance no dev)
- [ ] Contadores tabular-nums (não dançam)
- [ ] Neon glow consistente com Ato 1/2

### Técnico (rodar tudo antes de entregar)
```bash
cd frontend
pnpm exec tsc --noEmit            # zero erros
pnpm lint | grep -E "landing-game|lib/game"   # zero novos erros nos arquivos criados
pnpm exec next build              # build passa
```

### Acessibilidade
- [ ] Cards com `role="button" aria-label="módulo X - ver detalhes"`
- [ ] Keyboard: `Tab` navega pelos cards, `Enter/Space` faz flip
- [ ] Contadores com `aria-label` descritivo
- [ ] Focus ring visível em keyboard nav

---

## 11. 🚀 Ordem de implementação

O Cursor deve seguir essa ordem — cada passo compila sem quebrar o anterior:

1. **`lib/game/modulos.ts`** — types + mapa de ícones + dados
2. **`components/landing-game/arsenal/badge-raridade.tsx`** — standalone, sem deps internas
3. **`components/landing-game/arsenal/contador-slot.tsx`** — standalone, animação pura
4. **`components/landing-game/arsenal/card-modulo.tsx`** — usa Badge + ícones
5. **`components/landing-game/atos/ato-3-arsenal.tsx`** — compõe tudo
6. **`app/landing/page.tsx`** — troca placeholder por `<Ato3Arsenal>`

Após o passo 6, rodar `pnpm dev`, testar na jornada real, depois rodar os comandos técnicos do §10.

---

## 12. ✅ Ao terminar

1. **Auto-check:** rodar tsc + lint + build (§10)
2. **Commitar** na branch `feat/landing-gameficada`:
   ```
   feat(landing-game): entrega 2 — ato 3 arsenal desbloqueado
   ```
3. **Chamar o Claude Code** pra auditar (veredicto: ✅ / ⚠️ / ❌)
4. **Corrigir** o que for apontado
5. **Checkpoint com André** antes de começar a Entrega 3
