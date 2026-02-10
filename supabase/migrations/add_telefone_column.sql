-- ============================================
-- ADICIONAR COLUNA TELEFONE NA TABELA USUARIOS
-- ============================================

-- Adicionar coluna telefone
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Criar índice para buscas por telefone
CREATE INDEX IF NOT EXISTS idx_usuarios_telefone ON usuarios(telefone);

-- Comentário da coluna
COMMENT ON COLUMN usuarios.telefone IS 'Telefone do usuário no formato E.164 (+5511999999999)';
