-- ============================================
-- SCRIPT: Criar Trigger Automática para Perfis
-- ============================================
-- Objetivo: Criar automaticamente perfil em public.usuarios quando usuário é criado em auth.users
-- Como usar: Copiar e colar no SQL Editor do Supabase Dashboard
-- ⚠️ IMPORTANTE: Execute este script APÓS corrigir os usuários órfãos existentes

-- ============================================
-- 1. CRIAR FUNÇÃO QUE CRIA O PERFIL
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com privilégios elevados (ignora RLS)
SET search_path = public
AS $$
BEGIN
  -- Inserir novo perfil na tabela usuarios
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
  ON CONFLICT (id) DO NOTHING; -- Evita erro se já existir
  
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. CRIAR TRIGGER NA TABELA auth.users
-- ============================================
-- Remove trigger antiga se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria nova trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. VERIFICAR SE TRIGGER FOI CRIADA
-- ============================================
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- 4. COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================
COMMENT ON FUNCTION public.handle_new_user() IS 
'Função trigger que cria automaticamente um perfil em public.usuarios quando um novo usuário é criado em auth.users. Executa com SECURITY DEFINER para ignorar RLS.';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
'Trigger que executa handle_new_user() após cada INSERT em auth.users, garantindo que todo usuário tenha um perfil.';

-- ============================================
-- ✅ TRIGGER CRIADA COM SUCESSO!
-- ============================================
-- A partir de agora, TODOS os novos usuários terão perfil criado automaticamente
-- Isso funciona para:
-- - Cadastro manual (email + senha)
-- - Cadastro via Google OAuth
-- - Qualquer outro método de autenticação

-- ============================================
-- 🧪 COMO TESTAR
-- ============================================
-- 1. Criar um novo usuário na plataforma
-- 2. Verificar se aparece em auth.users
-- 3. Verificar se aparece automaticamente em public.usuarios
-- 4. Conferir se o plano está como 'free'

-- Query para testar:
-- SELECT au.id, au.email, u.plano 
-- FROM auth.users au 
-- LEFT JOIN public.usuarios u ON au.id = u.id 
-- WHERE au.created_at >= NOW() - INTERVAL '5 minutes';
