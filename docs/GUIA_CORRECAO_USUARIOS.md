# 🔧 GUIA: Correção de Usuários Órfãos

**Problema:** Usuários cadastrados em 08-09/02 não aparecem na tabela `usuarios`  
**Causa:** RLS bloqueando inserções + falta de trigger automática  
**Solução:** 3 scripts SQL para executar no Supabase Dashboard

---

## 📋 PASSO A PASSO

### ✅ PASSO 1: Verificar Usuários Órfãos

**Objetivo:** Descobrir quantos usuários estão sem perfil

1. Abrir Supabase Dashboard
2. Ir em **SQL Editor** (menu lateral esquerdo)
3. Clicar em **New Query**
4. Copiar e colar o conteúdo de: `scripts/verificar-usuarios-orfaos.sql`
5. Clicar em **Run** (ou pressionar Ctrl+Enter)

**O que esperar:**
- Verá quantos usuários existem em `auth.users`
- Verá quais usuários NÃO têm perfil em `usuarios`
- Verá a comparação entre as duas tabelas

**Exemplo de resultado esperado:**
```
Total auth.users: 10
Total usuarios: 4
Usuários órfãos: 6  ← PROBLEMA!
```

---

### ✅ PASSO 2: Corrigir Usuários Órfãos

**Objetivo:** Criar perfis para usuários que estão sem

⚠️ **ATENÇÃO:** Execute este script APENAS se o Passo 1 mostrou usuários órfãos!

1. No SQL Editor, criar **New Query**
2. Copiar e colar o conteúdo de: `scripts/corrigir-usuarios-orfaos.sql`
3. Clicar em **Run**

**O que vai acontecer:**
- Script vai criar perfis em `usuarios` para todos os usuários órfãos
- Plano será definido como `free` para todos
- Nomes serão extraídos dos metadados do Google ou do email

**Resultado esperado:**
```
✅ X perfis criados com sucesso
✅ 0 usuários órfãos restantes
```

---

### ✅ PASSO 3: Criar Trigger Automática

**Objetivo:** Garantir que futuros cadastros sempre criem perfil automaticamente

1. No SQL Editor, criar **New Query**
2. Copiar e colar o conteúdo de: `scripts/criar-trigger-auto-perfil.sql`
3. Clicar em **Run**

**O que vai acontecer:**
- Cria função `handle_new_user()` que insere perfil automaticamente
- Cria trigger `on_auth_user_created` que executa a função
- Trigger usa `SECURITY DEFINER` (ignora RLS)

**Resultado esperado:**
```
✅ Função criada: public.handle_new_user()
✅ Trigger criada: on_auth_user_created
```

---

## 🧪 COMO TESTAR SE FUNCIONOU

### Teste 1: Verificar Correção dos Órfãos

Execute no SQL Editor:

```sql
-- Deve retornar 0
SELECT COUNT(*) as usuarios_orfaos
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;
```

**Resultado esperado:** `0`

---

### Teste 2: Testar Trigger com Novo Cadastro

1. Abrir plataforma em aba anônima
2. Criar novo usuário teste (email + senha)
3. Executar no SQL Editor:

```sql
-- Verificar se perfil foi criado automaticamente
SELECT 
  au.email,
  u.plano,
  u.nome,
  CASE WHEN u.id IS NOT NULL THEN '✅ PERFIL CRIADO' ELSE '❌ FALHOU' END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE au.email = 'SEU_EMAIL_TESTE@gmail.com';
```

**Resultado esperado:** `✅ PERFIL CRIADO`

---

### Teste 3: Testar Cadastro via Google

1. Criar outro usuário via Google OAuth
2. Executar mesma query acima
3. Verificar se perfil foi criado

---

## 📊 QUERIES ÚTEIS PARA MONITORAMENTO

### Ver todos os usuários com status:

```sql
SELECT 
  au.email,
  au.created_at,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ OK'
    ELSE '❌ SEM PERFIL'
  END as status,
  u.plano
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
ORDER BY au.created_at DESC;
```

### Ver usuários cadastrados hoje:

```sql
SELECT 
  u.email,
  u.nome,
  u.plano,
  u.created_at
FROM public.usuarios u
WHERE DATE(u.created_at) = CURRENT_DATE
ORDER BY u.created_at DESC;
```

### Contar usuários por plano:

```sql
SELECT 
  plano,
  COUNT(*) as quantidade
FROM public.usuarios
GROUP BY plano;
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "permission denied for table auth.users"

**Causa:** Usando anon key ao invés de service role key

**Solução:** 
- Verificar se MCP está configurado com `SUPABASE_SERVICE_ROLE_KEY`
- OU executar scripts diretamente no SQL Editor do Dashboard (recomendado)

---

### Erro: "duplicate key value violates unique constraint"

**Causa:** Tentando criar perfil que já existe

**Solução:** Script já tem `ON CONFLICT (id) DO NOTHING`, então é seguro. Pode ignorar.

---

### Trigger não está funcionando

**Verificar se trigger existe:**

```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Se não existir, executar novamente:** `scripts/criar-trigger-auto-perfil.sql`

---

### Usuários continuam órfãos após trigger

**Possíveis causas:**

1. **Trigger não foi criada:** Verificar com query acima
2. **Erro na função:** Ver logs do Supabase
3. **RLS bloqueando:** Trigger usa `SECURITY DEFINER`, então não deveria bloquear

**Debug:**

```sql
-- Ver se função existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

---

## 📝 CHECKLIST DE EXECUÇÃO

### Fase 1: Diagnóstico
- [ ] Executar `verificar-usuarios-orfaos.sql`
- [ ] Anotar quantos usuários órfãos existem
- [ ] Verificar emails dos usuários órfãos

### Fase 2: Correção
- [ ] Executar `corrigir-usuarios-orfaos.sql`
- [ ] Verificar quantos perfis foram criados
- [ ] Confirmar que não restam órfãos

### Fase 3: Prevenção
- [ ] Executar `criar-trigger-auto-perfil.sql`
- [ ] Verificar se trigger foi criada
- [ ] Testar com novo cadastro manual
- [ ] Testar com novo cadastro Google

### Fase 4: Validação
- [ ] Logar com usuário que estava órfão
- [ ] Verificar se plataforma funciona
- [ ] Verificar se templates carregam
- [ ] Confirmar que plano está correto

---

## 🎯 RESULTADO ESPERADO

### Antes:
```
auth.users: 10 usuários
usuarios: 4 usuários
órfãos: 6 usuários ❌
```

### Depois:
```
auth.users: 10 usuários
usuarios: 10 usuários
órfãos: 0 usuários ✅
trigger: ativa ✅
```

---

## 💡 PRÓXIMOS PASSOS

Após executar todos os scripts:

1. ✅ Avisar usuários órfãos que podem fazer login
2. ✅ Monitorar novos cadastros por 24h
3. ✅ Verificar se trigger está funcionando
4. ✅ Adicionar logs no código frontend (opcional)
5. ✅ Documentar processo para equipe

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verificar logs do Supabase Dashboard
2. Executar queries de debug acima
3. Verificar políticas RLS da tabela `usuarios`
4. Consultar documentação do Supabase sobre triggers

---

**Tempo estimado:** 10-15 minutos  
**Complexidade:** Baixa  
**Impacto:** Alto (resolve problema crítico)

---

**Pronto para executar?** Comece pelo Passo 1! 🚀
