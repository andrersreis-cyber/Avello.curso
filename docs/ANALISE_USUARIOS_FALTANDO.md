# 🔍 ANÁLISE: Usuários Faltando na Tabela `usuarios`

**Data:** 07/02/2026  
**Branch:** `analise/correcao`  
**Problema:** Usuários que se cadastraram entre 08-09/02 não aparecem na tabela `usuarios`

---

## 📊 SITUAÇÃO ATUAL

### Dados da Tabela `usuarios`:
```
Total de usuários: 4
Último cadastro: 30/01/2026

1. andre.produtart@gmail.com - 30/01/2026 - Premium
2. thamirissc@gmail.com - 30/01/2026 - Free
3. keilacorteletti@gmail.com - 30/01/2026 - Premium
4. andre.rsreis@gmail.com - 30/01/2026 - Premium
```

**❌ PROBLEMA:** Usuários que se cadastraram em 08-09/02 NÃO aparecem!

---

## 🔎 INVESTIGAÇÃO DO FLUXO DE CADASTRO

### 1. **Cadastro Manual (Email + Senha)**

**Arquivo:** `frontend/contexts/auth-context.tsx` (linhas 106-130)

```typescript
const signUp = async (email: string, password: string, nome: string) => {
  // 1️⃣ Cria usuário no auth.users
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: { nome, full_name: nome },
    },
  })

  // 2️⃣ TENTA criar perfil na tabela usuarios
  if (!error && data.user) {
    await supabase.from('usuarios').upsert({
      id: data.user.id,
      email,
      nome,
      plano: 'free',
    })
  }

  return { error: error as Error | null }
}
```

**⚠️ PROBLEMA IDENTIFICADO:**
- A inserção na tabela `usuarios` usa **anon key** (cliente)
- Se houver **RLS (Row Level Security)** ativo, a inserção **FALHA SILENCIOSAMENTE**
- O erro **NÃO é tratado** (sem `catch`)
- O usuário é criado no `auth.users` mas **não** na tabela `usuarios`

---

### 2. **Cadastro via Google OAuth**

**Arquivo:** `frontend/app/auth/callback/route.ts` (linhas 44-61)

```typescript
if (!error && data.user) {
  // 1️⃣ Verifica se perfil já existe
  const { data: existingProfile } = await supabase
    .from('usuarios')
    .select('id')
    .eq('id', data.user.id)
    .single()

  // 2️⃣ Se não existe, TENTA criar
  if (!existingProfile) {
    await supabase.from('usuarios').insert({
      id: data.user.id,
      email: data.user.email!,
      nome: data.user.user_metadata?.full_name || ...,
      plano: 'free',
    })
  }
}
```

**⚠️ MESMO PROBLEMA:**
- Usa **anon key** no servidor
- Se RLS bloquear, **falha silenciosamente**
- Erro **não é tratado**

---

## 🎯 CAUSAS RAIZ IDENTIFICADAS

### Causa 1: **RLS (Row Level Security) Bloqueando Inserções**

**Política provável:**
```sql
-- Usuários só podem inserir seus próprios registros
CREATE POLICY "Users can insert own profile"
ON usuarios FOR INSERT
WITH CHECK (auth.uid() = id);
```

**Problema:**
- Durante `signUp()`, o usuário ainda **não está autenticado**
- `auth.uid()` retorna `NULL`
- Inserção é **bloqueada**

---

### Causa 2: **Falta de Tratamento de Erro**

**Código atual:**
```typescript
// ❌ Erro é ignorado
await supabase.from('usuarios').upsert({ ... })
```

**Deveria ser:**
```typescript
// ✅ Erro é capturado e logado
const { error: profileError } = await supabase.from('usuarios').upsert({ ... })
if (profileError) {
  console.error('❌ Erro ao criar perfil:', profileError)
}
```

---

### Causa 3: **Falta de Database Trigger**

**Solução ideal:** Trigger automática no Supabase

```sql
-- Trigger que cria automaticamente o perfil quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome, plano)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger executado após inserção em auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Benefícios:**
- ✅ Executa com privilégios elevados (SECURITY DEFINER)
- ✅ Ignora RLS
- ✅ Garante que SEMPRE cria o perfil
- ✅ Não depende do código do frontend

---

## 🛠️ SOLUÇÕES PROPOSTAS

### ✅ SOLUÇÃO 1: Criar Database Trigger (RECOMENDADO)

**Prioridade:** 🔴 CRÍTICA  
**Complexidade:** Baixa  
**Impacto:** Alto

**Implementação:**

1. Acessar Supabase Dashboard → SQL Editor
2. Executar o script da trigger acima
3. Testar criando novo usuário

**Vantagens:**
- ✅ Resolve problema para TODOS os cadastros futuros
- ✅ Funciona para cadastro manual E Google OAuth
- ✅ Não depende de código do frontend
- ✅ Ignora RLS automaticamente

**Desvantagens:**
- ⚠️ Não corrige usuários já cadastrados (precisa de script separado)

---

### ✅ SOLUÇÃO 2: Usar Service Role Key no Backend

**Prioridade:** 🟡 MÉDIA  
**Complexidade:** Média  
**Impacto:** Médio

**Criar API Route:** `frontend/app/api/auth/create-profile/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { userId, email, nome } = await request.json()
  
  // Usar SERVICE ROLE KEY (ignora RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← SERVICE ROLE
  )
  
  const { error } = await supabase.from('usuarios').upsert({
    id: userId,
    email,
    nome,
    plano: 'free',
  })
  
  if (error) {
    console.error('❌ Erro ao criar perfil:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
```

**Atualizar `auth-context.tsx`:**

```typescript
const signUp = async (email: string, password: string, nome: string) => {
  const { data, error } = await supabase.auth.signUp({ ... })

  if (!error && data.user) {
    // Chamar API com service role
    await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.user.id,
        email,
        nome,
      }),
    })
  }

  return { error: error as Error | null }
}
```

**Vantagens:**
- ✅ Ignora RLS (usa service role)
- ✅ Tratamento de erro adequado
- ✅ Controle total no backend

**Desvantagens:**
- ⚠️ Mais código para manter
- ⚠️ Requer configuração de env vars

---

### ✅ SOLUÇÃO 3: Ajustar Política RLS

**Prioridade:** 🟡 MÉDIA  
**Complexidade:** Baixa  
**Impacto:** Médio

**SQL:**

```sql
-- Permitir inserção durante cadastro (sem auth.uid())
CREATE POLICY "Allow insert during signup"
ON usuarios FOR INSERT
WITH CHECK (true); -- ⚠️ Cuidado: permite qualquer inserção

-- OU (mais seguro):
CREATE POLICY "Allow insert with matching id"
ON usuarios FOR INSERT
WITH CHECK (
  -- Permite se o ID existe em auth.users
  EXISTS (SELECT 1 FROM auth.users WHERE id = usuarios.id)
);
```

**Vantagens:**
- ✅ Simples de implementar
- ✅ Resolve problema imediatamente

**Desvantagens:**
- ⚠️ Pode criar brecha de segurança
- ⚠️ Precisa ser bem pensado

---

### ✅ SOLUÇÃO 4: Script de Correção para Usuários Existentes

**Prioridade:** 🔴 URGENTE (para corrigir histórico)  
**Complexidade:** Baixa  
**Impacto:** Alto

**Script SQL:**

```sql
-- Inserir perfis faltantes para usuários em auth.users
INSERT INTO public.usuarios (id, email, nome, plano)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    SPLIT_PART(au.email, '@', 1)
  ) as nome,
  'free' as plano
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL -- Usuários que NÃO têm perfil
  AND au.created_at >= '2026-02-08' -- Apenas usuários recentes
ON CONFLICT (id) DO NOTHING;
```

**Como executar:**
1. Supabase Dashboard → SQL Editor
2. Colar script acima
3. Executar
4. Verificar quantos registros foram criados

**Vantagens:**
- ✅ Corrige usuários já cadastrados
- ✅ Execução única
- ✅ Seguro (usa ON CONFLICT)

---

## 📋 PLANO DE AÇÃO RECOMENDADO

### Fase 1: Correção Imediata (AGORA)

1. ✅ **Executar script de correção** (Solução 4)
   - Criar perfis para usuários de 08-09/02
   - Verificar quantos foram criados

2. ✅ **Criar Database Trigger** (Solução 1)
   - Garantir que futuros cadastros funcionem
   - Testar com novo usuário

### Fase 2: Melhorias (DEPOIS)

3. ⚠️ **Adicionar tratamento de erro** no código
   - Logar erros de inserção
   - Alertar se falhar

4. ⚠️ **Revisar políticas RLS**
   - Garantir que não bloqueiam cadastro
   - Manter segurança

5. ⚠️ **Adicionar testes**
   - Testar cadastro manual
   - Testar cadastro Google
   - Verificar se perfil é criado

---

## 🧪 COMO VERIFICAR SE FOI CORRIGIDO

### Teste 1: Verificar usuários em auth.users
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE created_at >= '2026-02-08'
ORDER BY created_at DESC;
```

### Teste 2: Verificar perfis criados
```sql
SELECT u.id, u.email, u.created_at, p.plano
FROM auth.users u
LEFT JOIN public.usuarios p ON u.id = p.id
WHERE u.created_at >= '2026-02-08'
ORDER BY u.created_at DESC;
```

### Teste 3: Encontrar usuários sem perfil
```sql
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;
```

---

## 📊 CHECKLIST DE RESOLUÇÃO

### Imediato:
- [ ] Executar query para verificar usuários em `auth.users` (08-09/02)
- [ ] Executar script de correção (Solução 4)
- [ ] Verificar quantos perfis foram criados
- [ ] Testar login de usuário corrigido

### Preventivo:
- [ ] Criar Database Trigger (Solução 1)
- [ ] Testar trigger com novo cadastro
- [ ] Adicionar logs de erro no código
- [ ] Revisar políticas RLS
- [ ] Documentar processo

### Validação:
- [ ] Criar usuário teste manual
- [ ] Criar usuário teste via Google
- [ ] Verificar se ambos aparecem em `usuarios`
- [ ] Testar login e acesso

---

## 💡 CONCLUSÃO

### Problema: 🔴 CRÍTICO

**Usuários conseguem se cadastrar mas:**
- ✅ São criados em `auth.users` (podem fazer login)
- ❌ NÃO são criados em `usuarios` (plataforma não funciona)
- ❌ Ficam "órfãos" no sistema

**Causa raiz:**
- RLS bloqueando inserções durante cadastro
- Falta de trigger automática no banco
- Falta de tratamento de erro no código

**Solução:**
1. **AGORA:** Script de correção + Database Trigger
2. **DEPOIS:** Melhorar código e adicionar logs

---

**Próximo passo:** Executar queries de verificação e script de correção via MCP Supabase.
