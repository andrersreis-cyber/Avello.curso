-- ============================================================
-- SCHEMA: PROGRAMA DE AFILIADOS
-- ============================================================

-- Tabela de afiliados
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    pix_key VARCHAR(255),
    total_cliques INTEGER DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    total_comissao DECIMAL(10,2) DEFAULT 0.00,
    comissao_percentual DECIMAL(5,2) DEFAULT 30.00, -- 30% de comissão padrão
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cliques/visitas
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer_url TEXT,
    landing_page TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de indicações (leads)
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
    referred_email VARCHAR(255),
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'cancelled')),
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comissões
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE SET NULL,
    order_id VARCHAR(255), -- ID do pedido no Stripe
    valor_venda DECIMAL(10,2) NOT NULL,
    percentual_comissao DECIMAL(5,2) NOT NULL,
    valor_comissao DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de saques
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    pix_key VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_affiliates_codigo ON affiliates(codigo);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_affiliate ON withdrawals(affiliate_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_affiliate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_affiliates_updated_at
    BEFORE UPDATE ON affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_updated_at();

-- Função para gerar código único de afiliado
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_code VARCHAR(20);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Gera código alfanumérico de 8 caracteres
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        
        -- Verifica se já existe
        SELECT EXISTS(SELECT 1 FROM affiliates WHERE codigo = new_code) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura para afiliados (usuário vê apenas seus dados)
CREATE POLICY "Afiliados podem ver seus próprios dados"
    ON affiliates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Afiliados podem ver seus próprios cliques"
    ON affiliate_clicks FOR SELECT
    USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Afiliados podem ver suas próprias indicações"
    ON referrals FOR SELECT
    USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Afiliados podem ver suas próprias comissões"
    ON commissions FOR SELECT
    USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Afiliados podem ver seus próprios saques"
    ON withdrawals FOR SELECT
    USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- View para estatísticas do afiliado
CREATE OR REPLACE VIEW vw_affiliate_stats AS
SELECT 
    a.id,
    a.codigo,
    a.nome,
    a.email,
    a.total_cliques,
    a.total_vendas,
    a.total_comissao,
    a.comissao_percentual,
    (SELECT COUNT(*) FROM referrals r WHERE r.affiliate_id = a.id AND r.status = 'pending') as leads_pendentes,
    (SELECT COUNT(*) FROM referrals r WHERE r.affiliate_id = a.id AND r.status = 'converted') as leads_convertidos,
    (SELECT COALESCE(SUM(valor_comissao), 0) FROM commissions c WHERE c.affiliate_id = a.id AND c.status = 'pending') as comissao_pendente,
    (SELECT COALESCE(SUM(valor_comissao), 0) FROM commissions c WHERE c.affiliate_id = a.id AND c.status = 'approved') as comissao_aprovada,
    (SELECT COALESCE(SUM(valor_comissao), 0) FROM commissions c WHERE c.affiliate_id = a.id AND c.status = 'paid') as comissao_paga
FROM affiliates a
WHERE a.status = 'active';
