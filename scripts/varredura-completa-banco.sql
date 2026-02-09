-- ============================================
-- SCRIPT: Varredura Completa do Banco de Dados
-- ============================================
-- Objetivo: Identificar TODAS as inconsistências entre auth.users e public.usuarios
-- Data: 07/02/2026
-- Como usar: Copiar e colar no SQL Editor do Supabase Dashboard

-- ============================================
-- 📊 SEÇÃO 1: ESTATÍSTICAS GERAIS
-- ============================================

-- 1.1 Total de registros por tabela
SELECT 
  'ESTATÍSTICAS GERAIS' as secao,
  '---' as detalhe;

SELECT 
  'auth.users' as tabela,
  COUNT(*) as total_registros
FROM auth.users
UNION ALL
SELECT 
  'public.usuarios' as tabela,
  COUNT(*) as total_registros
FROM public.usuarios
UNION ALL
SELECT 
  'n8n_workflows' as tabela,
  COUNT(*) as total_registros
FROM n8n_workflows
UNION ALL
SELECT 
  'prompts_chatgpt' as tabela,
  COUNT(*) as total_registros
FROM prompts_chatgpt;

-- 1.2 Usuários por plano
SELECT 
  'USUÁRIOS POR PLANO' as secao,
  '---' as detalhe;

SELECT 
  plano,
  COUNT(*) as quantidade,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.usuarios), 2) as percentual
FROM public.usuarios
GROUP BY plano
ORDER BY quantidade DESC;

-- ============================================
-- 🔍 SEÇÃO 2: USUÁRIOS ÓRFÃOS (CRÍTICO!)
-- ============================================

SELECT 
  '🚨 USUÁRIOS ÓRFÃOS (SEM PERFIL)' as secao,
  '---' as detalhe;

-- 2.1 Contar usuários órfãos
SELECT 
  'Total de usuários órfãos' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '❌ CRÍTICO'
  END as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- 2.2 Listar usuários órfãos (se existirem)
SELECT 
  au.id,
  au.email,
  au.created_at as cadastrado_em,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    SPLIT_PART(au.email, '@', 1)
  ) as nome_extraido,
  '❌ SEM PERFIL' as status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- ⚠️ SEÇÃO 3: PERFIS ÓRFÃOS (INCONSISTÊNCIA)
-- ============================================

SELECT 
  '⚠️ PERFIS ÓRFÃOS (SEM AUTH)' as secao,
  '---' as detalhe;

-- 3.1 Perfis que existem mas não têm usuário em auth.users
SELECT 
  'Perfis sem auth.users' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '⚠️ ATENÇÃO'
  END as status
FROM public.usuarios u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.id IS NULL;

-- 3.2 Listar perfis órfãos (se existirem)
SELECT 
  u.id,
  u.email,
  u.nome,
  u.plano,
  u.created_at,
  '⚠️ SEM AUTH' as status
FROM public.usuarios u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.id IS NULL
ORDER BY u.created_at DESC;

-- ============================================
-- 🔄 SEÇÃO 4: INCONSISTÊNCIAS DE EMAIL
-- ============================================

SELECT 
  '🔄 EMAILS INCONSISTENTES' as secao,
  '---' as detalhe;

-- 4.1 Emails diferentes entre auth.users e usuarios
SELECT 
  'Emails não sincronizados' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '⚠️ ATENÇÃO'
  END as status
FROM auth.users au
INNER JOIN public.usuarios u ON au.id = u.id
WHERE au.email != u.email;

-- 4.2 Listar emails inconsistentes
SELECT 
  au.id,
  au.email as email_auth,
  u.email as email_usuarios,
  u.nome,
  u.plano,
  '⚠️ EMAILS DIFERENTES' as status
FROM auth.users au
INNER JOIN public.usuarios u ON au.id = u.id
WHERE au.email != u.email
ORDER BY u.created_at DESC;

-- ============================================
-- 📅 SEÇÃO 5: USUÁRIOS RECENTES (FEV/2026)
-- ============================================

SELECT 
  '📅 USUÁRIOS CADASTRADOS EM FEV/2026' as secao,
  '---' as detalhe;

-- 5.1 Usuários em auth.users (fevereiro)
SELECT 
  'auth.users (fev/2026)' as origem,
  COUNT(*) as quantidade
FROM auth.users
WHERE created_at >= '2026-02-01';

-- 5.2 Usuários em public.usuarios (fevereiro)
SELECT 
  'public.usuarios (fev/2026)' as origem,
  COUNT(*) as quantidade
FROM public.usuarios
WHERE created_at >= '2026-02-01';

-- 5.3 Listar todos os usuários de fevereiro com status
SELECT 
  au.id,
  au.email,
  au.created_at as cadastrado_em,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ TEM PERFIL'
    ELSE '❌ SEM PERFIL (ÓRFÃO)'
  END as status_perfil,
  u.plano,
  u.nome
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE au.created_at >= '2026-02-01'
ORDER BY au.created_at DESC;

-- ============================================
-- 💰 SEÇÃO 6: INCONSISTÊNCIAS DE PLANO PREMIUM
-- ============================================

SELECT 
  '💰 VALIDAÇÃO DE PLANOS PREMIUM' as secao,
  '---' as detalhe;

-- 6.1 Usuários premium sem data de início
SELECT 
  'Premium sem premium_since' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '⚠️ ATENÇÃO'
  END as status
FROM public.usuarios
WHERE plano = 'premium' AND premium_since IS NULL;

-- 6.2 Listar premium sem data
SELECT 
  id,
  email,
  nome,
  plano,
  premium_since,
  created_at,
  '⚠️ PREMIUM SEM DATA' as status
FROM public.usuarios
WHERE plano = 'premium' AND premium_since IS NULL
ORDER BY created_at DESC;

-- 6.3 Usuários free com premium_since preenchido
SELECT 
  'Free com premium_since' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '⚠️ INCONSISTÊNCIA'
  END as status
FROM public.usuarios
WHERE plano = 'free' AND premium_since IS NOT NULL;

-- 6.4 Listar free com data premium
SELECT 
  id,
  email,
  nome,
  plano,
  premium_since,
  created_at,
  '⚠️ FREE COM DATA PREMIUM' as status
FROM public.usuarios
WHERE plano = 'free' AND premium_since IS NOT NULL
ORDER BY created_at DESC;

-- ============================================
-- 📝 SEÇÃO 7: VALIDAÇÃO DE DADOS
-- ============================================

SELECT 
  '📝 VALIDAÇÃO DE DADOS' as secao,
  '---' as detalhe;

-- 7.1 Usuários sem nome
SELECT 
  'Usuários sem nome' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '⚠️ ATENÇÃO'
  END as status
FROM public.usuarios
WHERE nome IS NULL OR TRIM(nome) = '';

-- 7.2 Listar usuários sem nome
SELECT 
  id,
  email,
  nome,
  plano,
  created_at,
  '⚠️ SEM NOME' as status
FROM public.usuarios
WHERE nome IS NULL OR TRIM(nome) = ''
ORDER BY created_at DESC;

-- 7.3 Emails inválidos (sem @)
SELECT 
  'Emails inválidos' as problema,
  COUNT(*) as quantidade,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ OK'
    ELSE '❌ CRÍTICO'
  END as status
FROM public.usuarios
WHERE email NOT LIKE '%@%';

-- 7.4 Listar emails inválidos
SELECT 
  id,
  email,
  nome,
  plano,
  '❌ EMAIL INVÁLIDO' as status
FROM public.usuarios
WHERE email NOT LIKE '%@%'
ORDER BY created_at DESC;

-- ============================================
-- 🎯 SEÇÃO 8: RESUMO EXECUTIVO
-- ============================================

SELECT 
  '🎯 RESUMO EXECUTIVO' as secao,
  '---' as detalhe;

WITH stats AS (
  SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth,
    (SELECT COUNT(*) FROM public.usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id WHERE u.id IS NULL) as orfaos,
    (SELECT COUNT(*) FROM public.usuarios WHERE plano = 'premium') as premium,
    (SELECT COUNT(*) FROM public.usuarios WHERE plano = 'free') as free,
    (SELECT COUNT(*) FROM public.usuarios WHERE plano = 'premium' AND premium_since IS NULL) as premium_sem_data,
    (SELECT COUNT(*) FROM public.usuarios WHERE nome IS NULL OR TRIM(nome) = '') as sem_nome
)
SELECT 
  'Total auth.users' as metrica,
  total_auth as valor,
  CASE WHEN total_auth > 0 THEN '✅' ELSE '❌' END as status
FROM stats
UNION ALL
SELECT 
  'Total usuarios' as metrica,
  total_usuarios as valor,
  CASE WHEN total_usuarios > 0 THEN '✅' ELSE '❌' END as status
FROM stats
UNION ALL
SELECT 
  'Usuários órfãos' as metrica,
  orfaos as valor,
  CASE WHEN orfaos = 0 THEN '✅ OK' ELSE '❌ CRÍTICO' END as status
FROM stats
UNION ALL
SELECT 
  'Usuários premium' as metrica,
  premium as valor,
  '✅' as status
FROM stats
UNION ALL
SELECT 
  'Usuários free' as metrica,
  free as valor,
  '✅' as status
FROM stats
UNION ALL
SELECT 
  'Premium sem data' as metrica,
  premium_sem_data as valor,
  CASE WHEN premium_sem_data = 0 THEN '✅ OK' ELSE '⚠️' END as status
FROM stats
UNION ALL
SELECT 
  'Usuários sem nome' as metrica,
  sem_nome as valor,
  CASE WHEN sem_nome = 0 THEN '✅ OK' ELSE '⚠️' END as status
FROM stats;

-- ============================================
-- 🔧 SEÇÃO 9: AÇÕES RECOMENDADAS
-- ============================================

SELECT 
  '🔧 AÇÕES RECOMENDADAS' as secao,
  '---' as detalhe;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id WHERE u.id IS NULL) > 0 
    THEN '❌ CRÍTICO: Executar script de correção de usuários órfãos'
    ELSE '✅ OK: Não há usuários órfãos'
  END as acao_1;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM public.usuarios WHERE plano = 'premium' AND premium_since IS NULL) > 0 
    THEN '⚠️ ATENÇÃO: Corrigir datas premium_since para usuários premium'
    ELSE '✅ OK: Todos os premium têm data'
  END as acao_2;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM public.usuarios WHERE nome IS NULL OR TRIM(nome) = '') > 0 
    THEN '⚠️ ATENÇÃO: Preencher nomes faltantes'
    ELSE '✅ OK: Todos os usuários têm nome'
  END as acao_3;

SELECT 
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    )
    THEN '❌ CRÍTICO: Criar trigger automática para novos usuários'
    ELSE '✅ OK: Trigger já existe'
  END as acao_4;

-- ============================================
-- ✅ FIM DA VARREDURA
-- ============================================

SELECT 
  '✅ VARREDURA COMPLETA FINALIZADA' as resultado,
  NOW() as executado_em;
