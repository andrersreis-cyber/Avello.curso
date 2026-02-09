# 🔍 ANÁLISE DO PROBLEMA: Plataforma Trava e Volta para Plano Grátis

**Data:** 07/02/2026  
**Branch:** `analise/correcao`  
**Severidade:** 🔴 CRÍTICA

---

## 📋 SINTOMAS REPORTADOS

1. ❌ Plataforma trava
2. ❌ Usuário premium é rebaixado para plano grátis automaticamente
3. ❌ Templates não carregam
4. ❌ Sistema fica inoperante
5. ❌ Erro no console: `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` (Stripe)

---

## 🔎 CAUSAS IDENTIFICADAS

### 1. **PROBLEMA PRINCIPAL: Falta de Revalidação do Perfil**

**Localização:** `frontend/contexts/auth-context.tsx`

**Problema:**
```typescript
// Linha 40-56: fetchProfile é chamado apenas:
// 1. No mount inicial (getSession)
// 2. No onAuthStateChange

// ❌ NÃO há revalidação após:
// - Pagamento bem-sucedido
// - Atualização do plano no banco
// - Retorno da página de sucesso
```

**Consequência:**
- Usuário paga
- Webhook atualiza banco (plano = 'premium')
- Mas o contexto React mantém cache antigo (plano = 'free')
- Usuário vê plano grátis mesmo sendo premium no banco

---

### 2. **PROBLEMA SECUNDÁRIO: Erro de Rede do Stripe**

**Erro no Console:**
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
m.stripe.com/6:1
```

**Causa:**
- Tentativa de carregar script do Stripe
- Possível bloqueio de rede/firewall
- Ou URL incorreta

**Impacto:**
- Não impede funcionamento
- Mas pode causar lentidão
- Gera erros no console

---

### 3. **PROBLEMA TERCIÁRIO: Race Condition**

**Cenário:**
```
1. Usuário faz pagamento
2. Stripe redireciona para /loja/sucesso
3. Página carrega ANTES do webhook processar
4. fetchProfile busca dados antigos (ainda 'free')
5. Webhook atualiza banco (agora 'premium')
6. Mas contexto React já tem cache 'free'
```

**Resultado:**
- Dados desatualizados no frontend
- Usuário premium vê interface de free
- Templates não carregam (bloqueados por isPremium)

---

## 🛠️ SOLUÇÕES PROPOSTAS

### ✅ SOLUÇÃO 1: Adicionar Método de Revalidação Manual

**Implementar:**
```typescript
// auth-context.tsx
const refreshProfile = async () => {
  if (user) {
    const userProfile = await fetchProfile(user.id)
    setProfile(userProfile)
  }
}

// Expor no contexto
const value = {
  // ... outros valores
  refreshProfile, // ← NOVO
}
```

**Usar em:**
- Página de sucesso (`/loja/sucesso`)
- Após retorno do Stripe
- Quando detectar inconsistência

---

### ✅ SOLUÇÃO 2: Polling Inteligente na Página de Sucesso

**Implementar:**
```typescript
// /loja/sucesso/page.tsx
useEffect(() => {
  const checkPremiumStatus = async () => {
    await refreshProfile()
    
    // Se ainda não é premium, tentar novamente
    if (!isPremium) {
      setTimeout(checkPremiumStatus, 2000) // 2s
    }
  }
  
  checkPremiumStatus()
}, [])
```

**Benefício:**
- Aguarda webhook processar
- Atualiza automaticamente quando banco atualizar
- Máximo 5 tentativas (10 segundos)

---

### ✅ SOLUÇÃO 3: Listener de Mudanças no Banco (Realtime)

**Implementar:**
```typescript
// auth-context.tsx
useEffect(() => {
  if (!user) return
  
  // Escutar mudanças na tabela usuarios
  const channel = supabase
    .channel('profile-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'usuarios',
        filter: `id=eq.${user.id}`
      },
      (payload) => {
        console.log('🔄 Perfil atualizado:', payload.new)
        setProfile(payload.new as UserProfile)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [user?.id])
```

**Benefício:**
- Atualização em tempo real
- Sem polling
- Resposta instantânea quando webhook atualizar

---

### ✅ SOLUÇÃO 4: Corrigir Erro do Stripe

**Verificar:**
1. URL correta do script Stripe
2. Carregar apenas quando necessário
3. Adicionar fallback se falhar

**Implementar:**
```typescript
// Carregar Stripe apenas na página de checkout
if (typeof window !== 'undefined' && window.location.pathname === '/loja') {
  // Carregar script
}
```

---

## 📊 PRIORIDADE DE IMPLEMENTAÇÃO

### 🔴 URGENTE (Implementar AGORA):
1. ✅ **Solução 1** - Método refreshProfile
2. ✅ **Solução 2** - Polling na página de sucesso

### 🟡 IMPORTANTE (Implementar DEPOIS):
3. ✅ **Solução 3** - Realtime listener (melhor UX)
4. ✅ **Solução 4** - Corrigir erro Stripe

---

## 🧪 TESTES NECESSÁRIOS

### Cenário 1: Pagamento Bem-Sucedido
```
1. Usuário free acessa /loja
2. Clica em "Comprar Premium"
3. Paga no Stripe
4. Redireciona para /loja/sucesso
5. ✅ DEVE mostrar "Processando..."
6. ✅ DEVE atualizar para premium automaticamente
7. ✅ DEVE liberar todos templates
```

### Cenário 2: Webhook Lento
```
1. Simular webhook com delay de 5s
2. Página de sucesso deve fazer polling
3. ✅ DEVE atualizar quando webhook processar
4. ✅ NÃO DEVE travar
```

### Cenário 3: Usuário Premium Existente
```
1. Usuário já premium faz login
2. ✅ DEVE carregar perfil premium
3. ✅ DEVE manter premium durante sessão
4. ✅ NÃO DEVE voltar para free
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Adicionar método `refreshProfile` no auth-context
- [ ] Implementar polling na página /loja/sucesso
- [ ] Adicionar realtime listener (opcional)
- [ ] Corrigir carregamento do Stripe
- [ ] Adicionar logs de debug
- [ ] Testar cenário de pagamento
- [ ] Testar com webhook lento
- [ ] Testar usuário premium existente
- [ ] Documentar mudanças

---

## 🎯 RESULTADO ESPERADO

Após implementação:
- ✅ Usuário paga → Vira premium instantaneamente
- ✅ Templates carregam normalmente
- ✅ Plataforma não trava
- ✅ Sem erros no console
- ✅ UX fluida e confiável

---

**Próximo passo:** Implementar Soluções 1 e 2 (críticas)
