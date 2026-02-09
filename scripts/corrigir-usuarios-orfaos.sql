-- ============================================
-- SCRIPT: Corrigir Usuários Órfãos
-- ============================================
-- Objetivo: Criar perfis em public.usuarios para usuários que só existem em auth.users
-- ⚠️ ATENÇÃO: Execute APENAS APÓS verificar com o script de verificação
-- Como usar: Copiar e colar no SQL Editor do Supabase Dashboard

-- ============================================
-- 1. CRIAR PERFIS PARA USUÁRIOS ÓRFÃOS
-- ============================================
-- Este comando insere perfis para todos os usuários em auth.users que não têm perfil

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
WHERE u.id IS NULL -- Apenas usuários SEM perfil
ON CONFLICT (id) DO NOTHING; -- Evita duplicação

-- ============================================
-- 2. VERIFICAR QUANTOS FORAM CRIADOS
-- ============================================
-- Execute esta query APÓS o INSERT acima para confirmar

SELECT 
  'Perfis criados com sucesso' as resultado,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE created_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- 3. VERIFICAR SE AINDA EXISTEM ÓRFÃOS
-- ============================================
-- Deve retornar 0 se tudo foi corrigido

SELECT 
  COUNT(*) as usuarios_orfaos_restantes
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- ============================================
-- 4. LISTAR TODOS OS USUÁRIOS APÓS CORREÇÃO
-- ============================================
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
