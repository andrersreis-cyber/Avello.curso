# Correções Implementadas - Avello

## Data: 09/02/2026

---

## 1. Problema: Usuários não apareciam na tabela `usuarios`

### Causa Raiz
- RLS (Row Level Security) bloqueava inserções diretas na tabela `usuarios`
- Não havia mecanismo automático de criação de perfil após signup

### Solução Implementada
✅ Criada API route `/api/fix-profile` que usa `SUPABASE_SERVICE_ROLE_KEY`  
✅ `auth-context.tsx` atualizado para chamar a API após signup  
✅ `app/auth/callback/route.ts` atualizado para chamar a API após OAuth  
✅ Service role key bypassa RLS e garante criação do perfil  

### Arquivos Modificados
- `frontend/app/api/fix-profile/route.ts` (criado)
- `frontend/contexts/auth-context.tsx`
- `frontend/app/auth/callback/route.ts`
- `frontend/.env.local` (adicionada `SUPABASE_SERVICE_ROLE_KEY`)

---

## 2. Problema: Plataforma travava e voltava para plano grátis

### Causa Raiz
- Cliente não revalidava perfil após webhook do Stripe
- Estado local ficava desatualizado após upgrade

### Solução Implementada
✅ Adicionada função `refreshProfile()` no `AuthContext`  
✅ Polling inteligente na página `/loja/sucesso`  
✅ Revalidação automática após detecção de pagamento  

### Arquivos Modificados
- `frontend/contexts/auth-context.tsx`
- `frontend/app/loja/sucesso/page.tsx`

---

## 3. Script de Correção de Órfãos

### Executado com Sucesso
✅ `scripts/SOLUCAO_SEM_PERMISSOES.sql`  
- Corrigiu usuários existentes sem perfil  
- Criou perfis faltantes com plano `free`  

---

## Variáveis de Ambiente Necessárias

### Local (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://pgjcvdmbpluewhpephhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_WEBHOOK_SECRET=webhook_secret_12345_super_secreto
```

### Netlify (Production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRÍTICO - Adicionar manualmente**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_WEBHOOK_SECRET`

---

## Status Atual

✅ Correção implementada e testada localmente  
✅ Código commitado na branch `deploy-clean`  
⏳ Aguardando deploy no Netlify (problemas temporários com GitHub)  

---

## Próximos Passos

1. Aguardar GitHub se estabilizar
2. Deploy automático do Netlify
3. Testar criação de novo usuário em produção
4. Validar que perfil é criado automaticamente

---

## Observações

- Todos os arquivos de análise temporária foram removidos
- Mantida apenas documentação essencial
- Script `SOLUCAO_SEM_PERMISSOES.sql` mantido para referência futura
