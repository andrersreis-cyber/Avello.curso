# 🔧 SOLUÇÃO: Criar Trigger via Dashboard do Supabase

**Problema:** Erro `must be owner of relation users`  
**Causa:** SQL Editor não tem permissão para criar trigger em `auth.users`  
**Solução:** Usar interface do Dashboard para criar trigger

---

## 🚀 SOLUÇÃO EM 2 ETAPAS

### ✅ ETAPA 1: Corrigir Órfãos (SEM TRIGGER)

**Script:** `scripts/SOLUCAO_SEM_PERMISSOES.sql`

**O que faz:**
- ✅ Identifica órfãos
- ✅ Cria perfis para todos
- ✅ Valida correção
- ⚠️ NÃO cria trigger (requer permissão)

**Como executar:**
1. Abrir Supabase Dashboard
2. SQL Editor → New Query
3. Copiar conteúdo de `scripts/SOLUCAO_SEM_PERMISSOES.sql`
4. Executar

**Tempo:** 2 minutos

---

### ✅ ETAPA 2: Criar Trigger via Dashboard

Como não podemos criar a trigger via SQL, vamos usar **Database Webhooks** do Supabase.

---

## 🎯 OPÇÃO A: Database Webhooks (RECOMENDADO)

### Vantagens:
- ✅ Não precisa de permissões especiais
- ✅ Interface visual do Dashboard
- ✅ Mais fácil de configurar
- ✅ Funciona igual a trigger

### Como configurar:

#### Passo 1: Criar API Route no seu projeto

**Arquivo:** `frontend/app/api/auth/sync-user/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    
    // Validar webhook do Supabase
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extrair dados do usuário
    const { record } = payload
    const userId = record.id
    const email = record.email
    const fullName = record.raw_user_meta_data?.full_name || 
                     record.raw_user_meta_data?.name || 
                     email.split('@')[0]

    // Usar service role para criar perfil
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Criar perfil
    const { error } = await supabase
      .from('usuarios')
      .upsert({
        id: userId,
        email,
        nome: fullName,
        plano: 'free',
      })

    if (error) {
      console.error('Erro ao criar perfil:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

#### Passo 2: Adicionar variável de ambiente

**Arquivo:** `.env.local`

```bash
SUPABASE_WEBHOOK_SECRET=seu_secret_aqui_123456
```

#### Passo 3: Configurar webhook no Supabase Dashboard

1. Abrir Supabase Dashboard
2. Ir em **Database** → **Webhooks**
3. Clicar em **Create a new hook**
4. Configurar:
   - **Name:** `sync_user_profile`
   - **Table:** `auth.users`
   - **Events:** `Insert`
   - **Type:** `HTTP Request`
   - **Method:** `POST`
   - **URL:** `https://SEU_DOMINIO.com/api/auth/sync-user` (ou ngrok para teste local)
   - **HTTP Headers:**
     ```
     authorization: Bearer seu_secret_aqui_123456
     content-type: application/json
     ```
5. Clicar em **Create Webhook**

#### Passo 4: Testar

1. Criar novo usuário na plataforma
2. Verificar logs do webhook no Dashboard
3. Confirmar que perfil foi criado

---

## 🎯 OPÇÃO B: Contatar Supabase Support

Se Database Webhooks não funcionar, você pode:

1. Abrir ticket no Supabase Support
2. Solicitar criação de trigger em `auth.users`
3. Fornecer o SQL:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome, plano, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1),
      'Usuário'
    ),
    'free',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎯 OPÇÃO C: Usar Edge Function (Alternativa)

### Criar Edge Function no Supabase:

```typescript
// supabase/functions/sync-user-profile/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('usuarios').upsert({
      id: record.id,
      email: record.email,
      nome: record.raw_user_meta_data?.full_name || record.email.split('@')[0],
      plano: 'free',
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

---

## 📋 RESUMO

### O que fazer AGORA:

1. ✅ **Executar:** `scripts/SOLUCAO_SEM_PERMISSOES.sql`
   - Corrige órfãos existentes
   - Tempo: 2 minutos

2. ⏳ **Escolher e implementar:**
   - **Opção A:** Database Webhooks (recomendado)
   - **Opção B:** Contatar Supabase Support
   - **Opção C:** Edge Function

### Recomendação:

**👉 Opção A (Database Webhooks)** é a melhor porque:
- ✅ Não precisa de suporte
- ✅ Interface visual
- ✅ Funciona imediatamente
- ✅ Fácil de testar e debugar

---

## 🧪 COMO TESTAR

### Após configurar webhook:

1. Criar novo usuário (aba anônima)
2. Verificar no Dashboard:
   - **Database** → **Webhooks** → Ver logs
   - **Table Editor** → `usuarios` → Verificar se perfil foi criado

3. Executar SQL:
```sql
SELECT 
  au.email,
  u.nome,
  u.plano,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ PERFIL CRIADO'
    ELSE '❌ FALHOU'
  END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE au.created_at >= NOW() - INTERVAL '5 minutes'
ORDER BY au.created_at DESC;
```

---

## ⚠️ IMPORTANTE

### Por que o erro aconteceu:

O schema `auth` é gerenciado pelo Supabase e você não tem permissão de `owner` nele.

**Soluções que NÃO funcionam:**
- ❌ Criar trigger via SQL Editor
- ❌ Modificar tabela `auth.users`
- ❌ Alterar permissões do schema `auth`

**Soluções que FUNCIONAM:**
- ✅ Database Webhooks
- ✅ Edge Functions
- ✅ API Routes com service role
- ✅ Supabase Support criar trigger

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Executar `scripts/SOLUCAO_SEM_PERMISSOES.sql` (AGORA)
2. ⏳ Implementar Database Webhook (20 min)
3. ✅ Testar criando novo usuário
4. ✅ Monitorar por 24h

---

**Tempo total:** ~30 minutos  
**Resultado:** Problema resolvido permanentemente

---

**Data:** 07/02/2026  
**Status:** Solução alternativa documentada
