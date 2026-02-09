# ⚡ EXECUTAR AGORA - Correção Crítica de Usuários

**Status:** 🔴 CRÍTICO  
**Tempo estimado:** 20 minutos  
**Impacto:** ALTO - Restaura funcionamento completo da plataforma

---

## 🎯 OBJETIVO

Corrigir usuários "órfãos" que conseguem fazer login mas a plataforma não funciona.

---

## 📋 CHECKLIST DE EXECUÇÃO

### ✅ PASSO 1: Diagnóstico (5 min)

1. Abrir Supabase Dashboard: https://pgjcvdmbpluewhpephhx.supabase.co
2. Ir em **SQL Editor** (menu lateral esquerdo)
3. Clicar em **New Query**
4. Abrir arquivo: `scripts/varredura-completa-banco.sql`
5. Copiar TODO o conteúdo
6. Colar no SQL Editor
7. Clicar em **Run** (ou Ctrl+Enter)
8. **Anotar:** Quantos usuários órfãos existem?

**Resultado esperado:**
```
Usuários órfãos: X (se > 0, continuar para Passo 2)
```

---

### ✅ PASSO 2: Correção Automática (10 min)

1. No SQL Editor, clicar em **New Query**
2. Abrir arquivo: `scripts/correcao-automatica-completa.sql`
3. Copiar TODO o conteúdo
4. Colar no SQL Editor
5. Clicar em **Run**
6. **Aguardar:** Script executará 6 correções
7. **Verificar:** Seção "VERIFICAÇÃO FINAL"

**Resultado esperado:**
```
✅ Usuários órfãos restantes: 0
✅ Trigger criada: on_auth_user_created
✅ Todas as correções aplicadas
```

---

### ✅ PASSO 3: Validação (5 min)

#### Teste 1: Verificar Trigger

No SQL Editor, executar:

```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Resultado esperado:** 1 linha retornada

#### Teste 2: Verificar Órfãos

No SQL Editor, executar:

```sql
SELECT COUNT(*) as orfaos
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;
```

**Resultado esperado:** `0`

#### Teste 3: Testar Cadastro (OPCIONAL)

1. Abrir plataforma em aba anônima
2. Criar novo usuário teste
3. Executar:

```sql
SELECT u.email, u.plano, u.nome
FROM public.usuarios u
WHERE u.email = 'SEU_EMAIL_TESTE@gmail.com';
```

**Resultado esperado:** 1 linha retornada com plano `free`

---

## 📊 RESUMO DO QUE FOI FEITO

### Scripts Criados:

| Arquivo | Descrição |
|---------|-----------|
| `scripts/verificar-usuarios-orfaos.sql` | Identifica órfãos |
| `scripts/corrigir-usuarios-orfaos.sql` | Cria perfis faltantes |
| `scripts/criar-trigger-auto-perfil.sql` | Trigger automática |
| `scripts/varredura-completa-banco.sql` | Varredura completa |
| `scripts/correcao-automatica-completa.sql` | Correção completa |

### Documentação Criada:

| Arquivo | Descrição |
|---------|-----------|
| `docs/ANALISE_USUARIOS_FALTANDO.md` | Análise técnica |
| `docs/GUIA_CORRECAO_USUARIOS.md` | Guia passo a passo |
| `docs/RELATORIO_VARREDURA_BANCO.md` | Relatório completo |
| `docs/EXECUTAR_AGORA.md` | Este arquivo |

---

## 🎯 O QUE SERÁ CORRIGIDO

### Correção 1: Usuários Órfãos
- Cria perfis para usuários em `auth.users` sem perfil em `usuarios`
- Define plano como `free`
- Extrai nomes dos metadados

### Correção 2: Emails Inconsistentes
- Sincroniza emails entre `auth.users` e `usuarios`
- Garante que emails sejam iguais

### Correção 3: Nomes Faltantes
- Preenche nomes vazios ou NULL
- Extrai de metadados ou email

### Correção 4: Datas Premium
- Corrige `premium_since` para usuários premium sem data
- Usa `created_at` como fallback

### Correção 5: Planos Free
- Remove `premium_since` de usuários free
- Limpa inconsistências

### Correção 6: Trigger Automática
- Cria função `handle_new_user()`
- Cria trigger `on_auth_user_created`
- Garante que futuros cadastros funcionem

---

## ⚠️ IMPORTANTE

### Antes de Executar:

- ✅ Fazer backup do banco (opcional, mas recomendado)
- ✅ Avisar equipe que manutenção está em andamento
- ✅ Ter acesso ao Supabase Dashboard

### Durante Execução:

- ⏳ Não interromper o script
- ⏳ Aguardar todas as correções finalizarem
- ⏳ Ler mensagens de resultado

### Após Execução:

- ✅ Verificar que órfãos = 0
- ✅ Verificar que trigger existe
- ✅ Testar novo cadastro
- ✅ Monitorar por 24h

---

## 🚨 SE ALGO DER ERRADO

### Erro: "permission denied"

**Solução:** Você está usando anon key. Use o SQL Editor do Dashboard (já tem permissões corretas).

### Erro: "duplicate key"

**Solução:** Ignorar. Script usa `ON CONFLICT DO NOTHING`, é seguro.

### Órfãos ainda existem após correção

**Solução:**
1. Verificar se script executou completamente
2. Verificar mensagens de erro
3. Executar novamente se necessário

### Trigger não foi criada

**Solução:**
1. Executar apenas: `scripts/criar-trigger-auto-perfil.sql`
2. Verificar com query de validação

---

## 📞 SUPORTE

Se precisar de ajuda:

1. Verificar logs do Supabase Dashboard
2. Executar queries de debug do relatório
3. Consultar `docs/GUIA_CORRECAO_USUARIOS.md`
4. Verificar políticas RLS da tabela `usuarios`

---

## ✅ CHECKLIST FINAL

Após executar tudo:

- [ ] Órfãos corrigidos (count = 0)
- [ ] Trigger criada e ativa
- [ ] Emails sincronizados
- [ ] Nomes preenchidos
- [ ] Datas premium corretas
- [ ] Planos free limpos
- [ ] Novo cadastro testado
- [ ] Monitoramento ativado

---

## 🎉 SUCESSO!

Se todos os checkboxes estão marcados:

✅ **Problema resolvido!**  
✅ **Plataforma funcionando!**  
✅ **Usuários podem usar normalmente!**

---

**Próximo passo:** Monitorar por 24h e avisar usuários que estavam órfãos que agora podem usar a plataforma.

---

**Data:** 07/02/2026  
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** ~20 minutos  
**Impacto:** ALTO

**⚡ EXECUTE AGORA! ⚡**
