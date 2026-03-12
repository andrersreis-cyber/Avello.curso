# Tasks de Performance e Qualidade - Avello

> Documento de tarefas para execução sequencial. Cada task é independente.
> Após cada task, rodar `pnpm build` para validar que nada quebrou.

---

## FASE 1 — Crítico (Segurança + Estabilidade)

### TASK 1.1 — Error Boundaries nas rotas principais
**Objetivo:** Evitar tela branca quando Supabase ou API falha.

**Arquivos a criar:**
- `frontend/app/error.tsx` — Error boundary raiz
- `frontend/app/landing/error.tsx` — Landing page
- `frontend/app/loja/sucesso/error.tsx` — Página de sucesso pós-pagamento

**Requisitos:**
- Usar `'use client'` (obrigatório para error boundaries)
- Mostrar mensagem amigável com botão "Tentar novamente" (`reset()`)
- Estilizar com Tailwind seguindo o design existente (fundo escuro, texto claro)
- Logar o erro com `console.error` apenas em dev (`process.env.NODE_ENV === 'development'`)

**Exemplo de estrutura:**
```tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center text-white">
        <h2>Algo deu errado</h2>
        <button onClick={reset}>Tentar novamente</button>
      </div>
    </div>
  )
}
```

**Validação:** `pnpm build` sem erros.

---

### TASK 1.2 — Corrigir vulnerabilidade innerHTML (XSS)
**Objetivo:** Remover uso de innerHTML em `demo-section.tsx`.

**Arquivo:** `frontend/components/landing/demo-section.tsx` (linha ~57)

**O que fazer:**
- Substituir `placeholder.innerHTML = ...` por criação segura de elementos DOM
- Usar `document.createElement` + `textContent` ao invés de template string com innerHTML
- Manter o mesmo visual (emoji 🖥️, label, texto auxiliar)

**Validação:** Verificar que a demo section renderiza igual no `/landing`. Build sem erros.

---

### TASK 1.3 — Facebook Pixel com next/script
**Objetivo:** Trocar dangerouslySetInnerHTML por componente otimizado do Next.js.

**Arquivo:** `frontend/components/facebook-pixel.tsx`

**O que fazer:**
- Importar `Script` de `next/script`
- Usar `<Script id="fb-pixel" strategy="afterInteractive">` para o script inline
- Usar `<Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />` para o SDK
- Remover o `dangerouslySetInnerHTML`
- Manter o `useEffect` para tracking de pageview em mudança de rota
- Manter o `<noscript>` fallback como está

**Validação:** Facebook Pixel Events devem continuar disparando (verificar no Facebook Pixel Helper extension). Build sem erros.

---

### TASK 1.4 — Implementar TODOs do Webhook Stripe
**Objetivo:** Tratar eventos `customer.subscription.deleted` e `invoice.payment_failed`.

**Arquivo:** `frontend/app/api/webhooks/stripe/route.ts`

**O que fazer no `customer.subscription.deleted`:** (linha ~120)
- Buscar o usuario pelo `stripe_customer_id` na tabela `usuarios`
- Atualizar `plano` para `'pendente'` e `premium_since` para `null`
- Logar a ação

**O que fazer no `invoice.payment_failed`:** (linha ~133)
- Buscar o usuario pelo `stripe_customer_id`
- Logar o evento (não revogar acesso ainda, Stripe tenta novamente)
- Opcionalmente: marcar um campo `payment_warning` no usuario (se existir na tabela)

**IMPORTANTE:**
- Usar `supabaseAdmin` (service role) para as queries, igual aos outros handlers no mesmo arquivo
- Seguir o mesmo padrão de logging existente no arquivo
- Não alterar a lógica dos outros event handlers

**Validação:** Build sem erros. Testar com Stripe CLI: `stripe trigger customer.subscription.deleted`

---

## FASE 2 — Performance de Carregamento

### TASK 2.1 — Dynamic imports para modais
**Objetivo:** Lazy load dos modais pesados que só abrem por interação do usuário.

**Arquivo:** `frontend/app/page.tsx` (imports no topo)

**O que fazer:**
- Substituir imports estáticos dos modais por `dynamic`:
```tsx
import dynamic from 'next/dynamic'

const WorkflowModal = dynamic(() => import('@/components/workflow-modal').then(m => ({ default: m.WorkflowModal })), { ssr: false })
const PromptModal = dynamic(() => import('@/components/prompt-modal').then(m => ({ default: m.PromptModal })), { ssr: false })
const TypebotModal = dynamic(() => import('@/components/typebot-modal').then(m => ({ default: m.TypebotModal })), { ssr: false })
const BonusModal = dynamic(() => import('@/components/bonus-modal').then(m => ({ default: m.BonusModal })), { ssr: false })
```
- Se algum modal usa export default, ajustar o import accordingly
- Verificar se cada modal exporta named ou default e adaptar

**IMPORTANTE:** Não alterar props nem lógica dos modais. Apenas mudar como são importados.

**Validação:** Abrir cada modal no app e verificar que funciona. Build sem erros.

---

### TASK 2.2 — Trocar `<img>` por `next/image`
**Objetivo:** Otimizar imagens com lazy loading, WebP e sizing automático.

**Arquivos:**
1. `frontend/components/header.tsx` (linha ~57) — Logo
2. `frontend/app/landing/page.tsx` — Imagens na landing

**O que fazer:**
- Importar `Image` de `next/image`
- Substituir `<img src="/images/logo-avello.png" ... />` por:
```tsx
<Image src="/images/logo-avello.png" alt="Avello" width={32} height={32} className="rounded-lg" />
```
- Para imagens de tamanho fixo: usar `width` e `height` explícitos
- Para imagens responsivas: usar `fill` com container `relative`
- Manter todas as classes CSS existentes

**IMPORTANTE:** Não alterar imagens que vêm de URLs dinâmicas do Supabase (essas já estão configuradas no next.config.ts).

**Validação:** Visual idêntico ao atual. Build sem erros.

---

### TASK 2.3 — Remover console.logs de produção
**Objetivo:** Limpar logs que vazam informação no browser do usuário.

**Arquivos afetados (todos no `frontend/`):**
- `app/page.tsx`
- `contexts/auth-context.tsx`
- `app/api/webhooks/stripe/route.ts`
- `app/api/checkout/route.ts`
- `app/api/checkout-desconto/route.ts`
- `app/api/fix-profile/route.ts`
- `app/cadastro/page.tsx`
- `app/loja/sucesso/page.tsx`
- `lib/affiliate.ts`
- E outros que encontrar

**O que fazer:**
- **Arquivos client-side (componentes, contextos):** Remover todos os `console.log`. Manter `console.error` apenas dentro de catch blocks.
- **Arquivos server-side (API routes em `app/api/`):** Manter logs mas envolver com check de ambiente:
```tsx
if (process.env.NODE_ENV === 'development') {
  console.log(...)
}
```
- **Exceção:** Os `console.error` em catch blocks de API routes podem ficar (útil para debugging em produção via logs do servidor)

**Validação:** `grep -r "console.log" frontend/app frontend/components frontend/contexts frontend/lib --include="*.tsx" --include="*.ts"` deve retornar zero nos arquivos client-side. Build sem erros.

---

## FASE 3 — SEO e Metadata

### TASK 3.1 — Metadata para páginas públicas
**Objetivo:** Melhorar indexação no Google e preview em redes sociais.

**Arquivos a editar:**
1. `frontend/app/landing/page.tsx`
2. `frontend/app/login/page.tsx`
3. `frontend/app/cadastro/page.tsx`
4. `frontend/app/termos/page.tsx`
5. `frontend/app/privacidade/page.tsx`
6. `frontend/app/recuperar-senha/page.tsx`

**O que fazer em cada arquivo:**
- Adicionar export de `metadata` (ou `generateMetadata` se precisar de dados dinâmicos):
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Título da Página | Avello',
  description: 'Descrição relevante da página em até 160 caracteres.',
  openGraph: {
    title: 'Título da Página | Avello',
    description: 'Descrição relevante.',
  },
}
```

**Títulos sugeridos:**
- Landing: `"Avello — +18.000 Recursos de IA e Automação"`
- Login: `"Entrar | Avello"`
- Cadastro: `"Criar Conta | Avello"`
- Termos: `"Termos de Uso | Avello"`
- Privacidade: `"Política de Privacidade | Avello"`
- Recuperar Senha: `"Recuperar Senha | Avello"`

**IMPORTANTE:** Se a página for `'use client'`, metadata export não funciona. Nesse caso, mover a metadata para um `layout.tsx` na mesma pasta.

**Validação:** Build sem erros. Verificar `<title>` e `<meta>` no HTML gerado.

---

## FASE 4 — Otimização de Runtime

### TASK 4.1 — Migrar queries Supabase para React Query
**Objetivo:** Cachear dados e evitar re-fetch a cada troca de módulo.

**Arquivo:** `frontend/app/page.tsx`

**O que fazer:**
- Identificar as funções `loadItems` e `loadCategories` (queries Supabase no useEffect)
- Criar hooks customizados usando `useQuery` do `@tanstack/react-query`:
```tsx
// hooks/use-module-items.ts
export function useModuleItems(module: string, page: number, search: string) {
  return useQuery({
    queryKey: ['module-items', module, page, search],
    queryFn: () => fetchItems(module, page, search),
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
```
- Substituir os `useState` + `useEffect` de loading/data pelos hooks
- Manter a mesma lógica de fetch, apenas wrappear em React Query
- O `isLoading` do useQuery substitui o estado manual

**Arquivos a criar:**
- `frontend/hooks/use-module-items.ts`
- `frontend/hooks/use-module-categories.ts`

**IMPORTANTE:**
- O provider de React Query já existe em `frontend/providers/query-provider.tsx`
- Seguir o mesmo padrão de `frontend/hooks/use-module-counts.ts`
- Não alterar a UI, apenas a camada de data fetching

**Validação:** Trocar entre módulos deve ser mais rápido (cache hit). Build sem erros.

---

### TASK 4.2 — Mover URLs hardcoded para env vars
**Objetivo:** Centralizar endpoints externos para fácil manutenção.

**Arquivos:**
- `frontend/app/cadastro/page.tsx` (~linha 69)
- `frontend/app/api/webhooks/stripe/route.ts` (~linha 162)

**O que fazer:**
- Adicionar ao `.env.local` (ou `.env`):
```
N8N_WEBHOOK_BASE_URL=https://n8nwebhook.agenteflowia.com
```
- Nos arquivos, substituir URL hardcoded:
```tsx
// Antes
fetch('https://n8nwebhook.agenteflowia.com/webhook/lead_new', ...)

// Depois
fetch(`${process.env.N8N_WEBHOOK_BASE_URL}/webhook/lead_new`, ...)
```
- Para o arquivo client-side (cadastro), usar `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL`
- Para o server-side (webhook), usar `N8N_WEBHOOK_BASE_URL`

**Validação:** Webhooks continuam funcionando. Build sem erros.

---

### TASK 4.3 — Validação de URL no window.open
**Objetivo:** Prevenir abertura de URLs maliciosas.

**Arquivo:** `frontend/components/content-grid.tsx` (~linha 144)

**O que fazer:**
- Antes de `window.open(item.url, '_blank')`, validar:
```tsx
if (item.url && (item.url.startsWith('https://') || item.url.startsWith('http://'))) {
  window.open(item.url, '_blank', 'noopener,noreferrer')
}
```
- Adicionar `noopener,noreferrer` para segurança

**Validação:** Links externos continuam abrindo normalmente. Build sem erros.

---

### TASK 4.4 — Cleanup do requestAnimationFrame
**Objetivo:** Evitar memory leak na animação de confetti.

**Arquivo:** `frontend/app/loja/sucesso/page.tsx` (~linha 117)

**O que fazer:**
- Guardar o ID do `requestAnimationFrame` em uma ref
- No cleanup do `useEffect`, cancelar com `cancelAnimationFrame`
```tsx
const frameRef = useRef<number>()

useEffect(() => {
  const frame = () => {
    confetti({...})
    if (Date.now() < end) {
      frameRef.current = requestAnimationFrame(frame)
    }
  }
  frameRef.current = requestAnimationFrame(frame)

  return () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }
}, [])
```

**Validação:** Animação de confetti funciona normalmente na página de sucesso. Build sem erros.

---

## Checklist de Execução

Após cada TASK:
- [ ] `cd frontend && pnpm build` — deve compilar sem erros
- [ ] Testar a feature afetada no browser
- [ ] Commitar com mensagem descritiva: `fix: [task X.Y] descrição`

Ordem de execução recomendada:
1. TASK 1.1 → 1.2 → 1.3 → 1.4 (segurança primeiro)
2. TASK 2.1 → 2.2 → 2.3 (performance)
3. TASK 3.1 (SEO)
4. TASK 4.1 → 4.2 → 4.3 → 4.4 (otimização)
