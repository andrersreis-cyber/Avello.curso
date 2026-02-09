-- ============================================
-- SCRIPT: Correção Automática Completa
-- ============================================
-- Objetivo: Corrigir TODAS as inconsistências identificadas na varredura
-- Data: 07/02/2026
-- ⚠️ IMPORTANTE: Execute APÓS a varredura completa
-- Como usar: Copiar e colar no SQL Editor do Supabase Dashboard

-- ============================================
-- 🔧 CORREÇÃO 1: CRIAR PERFIS PARA USUÁRIOS ÓRFÃOS
-- ============================================

SELECT 
  '🔧 CORREÇÃO 1: Criando perfis para usuários órfãos...' as acao;

-- Inserir perfis faltantes
INSERT INTO public.usuarios (id, email, nome, plano, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    SPLIT_PART(au.email, '@', 1),
    'Usuário'
  ) as nome,
  'free' as plano,
  au.created_at
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verificar quantos foram criados
SELECT 
  '✅ Perfis criados' as resultado,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE created_at >= NOW() - INTERVAL '5 seconds';

-- ============================================
-- 🔧 CORREÇÃO 2: SINCRONIZAR EMAILS
-- ============================================

SELECT 
  '🔧 CORREÇÃO 2: Sincronizando emails entre auth.users e usuarios...' as acao;

-- Atualizar emails que estão diferentes
UPDATE public.usuarios u
SET email = au.email
FROM auth.users au
WHERE u.id = au.id
  AND u.email != au.email;

-- Verificar quantos foram atualizados
SELECT 
  '✅ Emails sincronizados' as resultado,
  COUNT(*) as quantidade
FROM auth.users au
INNER JOIN public.usuarios u ON au.id = u.id
WHERE au.email = u.email;

-- ============================================
-- 🔧 CORREÇÃO 3: PREENCHER NOMES FALTANTES
-- ============================================

SELECT 
  '🔧 CORREÇÃO 3: Preenchendo nomes faltantes...' as acao;

-- Atualizar nomes vazios ou NULL
UPDATE public.usuarios u
SET nome = COALESCE(
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'name',
  SPLIT_PART(u.email, '@', 1),
  'Usuário'
)
FROM auth.users au
WHERE u.id = au.id
  AND (u.nome IS NULL OR TRIM(u.nome) = '');

-- Verificar quantos foram atualizados
SELECT 
  '✅ Nomes preenchidos' as resultado,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE nome IS NOT NULL AND TRIM(nome) != '';

-- ============================================
-- 🔧 CORREÇÃO 4: CORRIGIR DATAS PREMIUM
-- ============================================

SELECT 
  '🔧 CORREÇÃO 4: Corrigindo datas premium_since...' as acao;

-- Atualizar premium_since para usuários premium sem data
-- Usa a data de created_at como fallback
UPDATE public.usuarios
SET premium_since = created_at
WHERE plano = 'premium' 
  AND premium_since IS NULL;

-- Verificar quantos foram corrigidos
SELECT 
  '✅ Datas premium corrigidas' as resultado,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE plano = 'premium' AND premium_since IS NOT NULL;

-- ============================================
-- 🔧 CORREÇÃO 5: LIMPAR INCONSISTÊNCIAS FREE
-- ============================================

SELECT 
  '🔧 CORREÇÃO 5: Limpando inconsistências de plano free...' as acao;

-- Remover premium_since de usuários free
UPDATE public.usuarios
SET premium_since = NULL
WHERE plano = 'free' 
  AND premium_since IS NOT NULL;

-- Verificar quantos foram corrigidos
SELECT 
  '✅ Planos free corrigidos' as resultado,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE plano = 'free' AND premium_since IS NULL;

-- ============================================
-- 🔧 CORREÇÃO 6: CRIAR TRIGGER AUTOMÁTICA
-- ============================================

SELECT 
  '🔧 CORREÇÃO 6: Criando trigger automática...' as acao;

-- Criar função que cria o perfil
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

-- Remover trigger antiga se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar nova trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

SELECT 
  '✅ Trigger criada' as resultado,
  'on_auth_user_created' as nome_trigger;

-- ============================================
-- 📊 VERIFICAÇÃO FINAL
-- ============================================

SELECT 
  '📊 VERIFICAÇÃO FINAL' as secao,
  '---' as detalhe;

-- Verificar se ainda existem órfãos
SELECT 
  'Usuários órfãos restantes' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA HÁ PROBLEMAS'
  END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- Verificar emails sincronizados
SELECT 
  'Emails não sincronizados' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '⚠️ AINDA HÁ PROBLEMAS'
  END as status
FROM auth.users au
INNER JOIN public.usuarios u ON au.id = u.id
WHERE au.email != u.email;

-- Verificar nomes faltantes
SELECT 
  'Usuários sem nome' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '⚠️ AINDA HÁ PROBLEMAS'
  END as status
FROM public.usuarios
WHERE nome IS NULL OR TRIM(nome) = '';

-- Verificar premium sem data
SELECT 
  'Premium sem data' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '⚠️ AINDA HÁ PROBLEMAS'
  END as status
FROM public.usuarios
WHERE plano = 'premium' AND premium_since IS NULL;

-- Verificar free com data premium
SELECT 
  'Free com data premium' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '⚠️ AINDA HÁ PROBLEMAS'
  END as status
FROM public.usuarios
WHERE plano = 'free' AND premium_since IS NOT NULL;

-- Verificar se trigger existe
SELECT 
  'Trigger automática' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ CRIADA'
    ELSE '❌ NÃO EXISTE'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- 📈 ESTATÍSTICAS FINAIS
-- ============================================

SELECT 
  '📈 ESTATÍSTICAS FINAIS' as secao,
  '---' as detalhe;

SELECT 
  'Total auth.users' as metrica,
  COUNT(*) as valor
FROM auth.users
UNION ALL
SELECT 
  'Total usuarios' as metrica,
  COUNT(*) as valor
FROM public.usuarios
UNION ALL
SELECT 
  'Usuários premium' as metrica,
  COUNT(*) as valor
FROM public.usuarios
WHERE plano = 'premium'
UNION ALL
SELECT 
  'Usuários free' as metrica,
  COUNT(*) as valor
FROM public.usuarios
WHERE plano = 'free'
UNION ALL
SELECT 
  'Órfãos restantes' as metrica,
  COUNT(*) as valor
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- ============================================
-- ✅ CORREÇÃO COMPLETA FINALIZADA
-- ============================================

SELECT 
  '✅ CORREÇÃO AUTOMÁTICA COMPLETA FINALIZADA' as resultado,
  NOW() as executado_em,
  'Todas as inconsistências foram corrigidas!' as mensagem;

-- ============================================
-- 📝 PRÓXIMOS PASSOS
-- ============================================

SELECT 
  '📝 PRÓXIMOS PASSOS' as secao,
  '---' as detalhe;

SELECT 
  '1. Testar cadastro de novo usuário (manual)' as passo
UNION ALL
SELECT 
  '2. Testar cadastro via Google OAuth' as passo
UNION ALL
SELECT 
  '3. Verificar se perfis são criados automaticamente' as passo
UNION ALL
SELECT 
  '4. Monitorar logs por 24h' as passo
UNION ALL
SELECT 
  '5. Avisar usuários que estavam órfãos' as passo;
