-- ============================================
-- CORRIGIR RLS DA TABELA USUARIOS
-- ============================================

-- Primeiro, verificar se a tabela existe e tem dados
SELECT * FROM usuarios;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção durante signup" ON usuarios;

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: usuários AUTENTICADOS podem ver SEU PRÓPRIO perfil
CREATE POLICY "usuarios_select_own" ON usuarios
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- Política: usuários podem atualizar seu próprio perfil
CREATE POLICY "usuarios_update_own" ON usuarios
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id);

-- Política: permitir inserção (para signup)
CREATE POLICY "usuarios_insert" ON usuarios
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ============================================
-- VERIFICAR SE O USUÁRIO EXISTE
-- ============================================
SELECT 
    u.id,
    u.email,
    u.plano,
    au.email as auth_email
FROM usuarios u
JOIN auth.users au ON u.id = au.id;
