-- ============================================
-- TABELA DE USUÁRIOS
-- ============================================

-- Criar tabela de usuários (vinculada ao Auth)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    plano VARCHAR(50) DEFAULT 'free' CHECK (plano IN ('free', 'premium', 'vip')),
    data_assinatura TIMESTAMPTZ,
    data_expiracao TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    afiliado_codigo VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_plano ON usuarios(plano);

-- RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver apenas seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil" ON usuarios
    FOR SELECT USING (auth.uid() = id);

-- Política: usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil" ON usuarios
    FOR UPDATE USING (auth.uid() = id);

-- Política: permitir inserção durante signup
CREATE POLICY "Permitir inserção durante signup" ON usuarios
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- INSERIR USUÁRIO PREMIUM PARA TESTE
-- ============================================

-- Inserir o usuário andre.rsreis@gmail.com como premium
INSERT INTO usuarios (id, email, nome, plano, data_assinatura)
SELECT 
    id,
    email,
    raw_user_meta_data->>'nome',
    'premium',
    NOW()
FROM auth.users
WHERE email = 'andre.rsreis@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    plano = 'premium',
    data_assinatura = NOW(),
    updated_at = NOW();
