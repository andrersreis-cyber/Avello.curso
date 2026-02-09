-- ============================================
-- 🔧 SOLUÇÃO ALTERNATIVA - SEM PERMISSÕES ESPECIAIS
-- ============================================
-- Data: 07/02/2026
-- Problema: Não temos permissão de owner em auth.users
-- Solução: Usar Database Webhooks ou criar trigger via Dashboard
-- 
-- ⚠️ IMPORTANTE: Execute este script no Supabase Dashboard → SQL Editor
-- ============================================

-- ============================================
-- 📊 PARTE 1: DIAGNÓSTICO
-- ============================================

SELECT '📊 DIAGNÓSTICO' as secao;

-- 1.1 Total de usuários em cada tabela
SELECT 
  'Total em auth.users' as metrica,
  COUNT(*) as valor
FROM auth.users
UNION ALL
SELECT 
  'Total em usuarios' as metrica,
  COUNT(*) as valor
FROM public.usuarios;

-- 1.2 Identificar usuários órfãos
SELECT 
  '🚨 USUÁRIOS ÓRFÃOS' as secao;

SELECT 
  COUNT(*) as total_orfaos,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Nenhum órfão'
    ELSE '❌ ÓRFÃOS ENCONTRADOS'
  END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- 1.3 Listar órfãos (se existirem)
SELECT 
  au.id,
  au.email,
  au.created_at,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    SPLIT_PART(au.email, '@', 1)
  ) as nome_extraido
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- 🔧 PARTE 2: CORREÇÃO DE ÓRFÃOS (SEM TRIGGER)
-- ============================================

SELECT '🔧 CORRIGINDO ÓRFÃOS' as secao;

-- 2.1 Criar perfis para todos os órfãos
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

-- 2.2 Verificar resultado
SELECT 
  '✅ Resultado da correção' as titulo,
  COUNT(*) as perfis_criados
FROM public.usuarios
WHERE created_at >= NOW() - INTERVAL '10 seconds';

-- ============================================
-- ✅ PARTE 3: VERIFICAÇÃO FINAL
-- ============================================

SELECT '✅ VERIFICAÇÃO FINAL' as secao;

-- 3.1 Verificar órfãos restantes
SELECT 
  'Órfãos restantes' as verificacao,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CORRIGIDO'
    ELSE '❌ AINDA HÁ PROBLEMAS'
  END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- 3.2 Estatísticas finais
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
  'Órfãos restantes' as metrica,
  COUNT(*) as valor
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- 3.3 Listar todos os usuários
SELECT 
  u.id,
  u.email,
  u.nome,
  u.plano,
  u.created_at,
  CASE 
    WHEN u.created_at >= NOW() - INTERVAL '1 minute' THEN '🆕 RECÉM CRIADO'
    ELSE '✅ JÁ EXISTIA'
  END as status
FROM public.usuarios u
ORDER BY u.created_at DESC;

-- ============================================
-- ✅ CONCLUSÃO
-- ============================================

SELECT 
  '✅ CORREÇÃO DE ÓRFÃOS CONCLUÍDA!' as resultado,
  NOW() as executado_em;

SELECT 
  '⚠️ TRIGGER NÃO PODE SER CRIADA' as aviso,
  'Use Database Webhooks no Dashboard' as solucao;
