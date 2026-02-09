-- ============================================
-- SCRIPT: Verificar Usuários Órfãos
-- ============================================
-- Objetivo: Encontrar usuários em auth.users que NÃO têm perfil em public.usuarios
-- Como usar: Copiar e colar no SQL Editor do Supabase Dashboard

-- ============================================
-- 1. VERIFICAR TODOS OS USUÁRIOS EM auth.users
-- ============================================
SELECT 
  'Total de usuários em auth.users' as descricao,
  COUNT(*) as quantidade
FROM auth.users;

-- ============================================
-- 2. VERIFICAR USUÁRIOS CADASTRADOS EM FEV/2026
-- ============================================
SELECT 
  id,
  email,
  created_at,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Sem nome') as nome
FROM auth.users
WHERE created_at >= '2026-02-01'
ORDER BY created_at DESC;

-- ============================================
-- 3. ENCONTRAR USUÁRIOS ÓRFÃOS (SEM PERFIL)
-- ============================================
SELECT 
  au.id,
  au.email,
  au.created_at,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    SPLIT_PART(au.email, '@', 1)
  ) as nome_extraido,
  'ÓRFÃO - SEM PERFIL' as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- 4. COMPARAÇÃO: auth.users vs public.usuarios
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM public.usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id WHERE u.id IS NULL) as usuarios_orfaos;

-- ============================================
-- 5. DETALHES DE USUÁRIOS COM E SEM PERFIL
-- ============================================
SELECT 
  au.id,
  au.email,
  au.created_at as cadastrado_em,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ TEM PERFIL'
    ELSE '❌ SEM PERFIL (ÓRFÃO)'
  END as status,
  u.plano,
  u.nome
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
ORDER BY au.created_at DESC;
