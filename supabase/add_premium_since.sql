-- Adiciona campo para controlar quando usuário virou premium
-- Isso permite bloquear conteúdos exclusivos por 7 dias após a compra (período de garantia)

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ DEFAULT NULL;

-- Atualizar usuários que já são premium (usar created_at como data de início)
UPDATE usuarios 
SET premium_since = created_at 
WHERE plano = 'premium' AND premium_since IS NULL;

-- Comentário explicativo
COMMENT ON COLUMN usuarios.premium_since IS 'Data em que o usuário se tornou premium. Usado para controlar período de garantia de 7 dias.';
