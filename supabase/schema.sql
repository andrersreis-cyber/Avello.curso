-- ============================================
-- SCHEMA DO BANCO DE DADOS - PLATAFORMA DE CURSOS
-- Epic 2 - Organização dos Dados
-- ============================================

-- Limpar tabelas existentes (cuidado em produção!)
DROP TABLE IF EXISTS bonus_items CASCADE;
DROP TABLE IF EXISTS bonus CASCADE;
DROP TABLE IF EXISTS ferramentas CASCADE;
DROP TABLE IF EXISTS saas CASCADE;
DROP TABLE IF EXISTS typebot_templates CASCADE;
DROP TABLE IF EXISTS prompts_midjourney CASCADE;
DROP TABLE IF EXISTS prompts_chatgpt CASCADE;
DROP TABLE IF EXISTS n8n_workflows CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- 1. CATEGORIAS (Módulos principais)
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    emoji VARCHAR(10),
    ordem INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias principais
INSERT INTO categories (slug, nome, descricao, emoji, ordem) VALUES
('n8n-workflows', 'Pack +2500 Workflows n8n', 'Fluxos de automação prontos para usar', '📦', 1),
('prompts-chatgpt', 'Pack +5700 Prompts ChatGPT', 'Prompts organizados por categoria para IA', '💬', 2),
('prompts-midjourney', 'Pack +500 Prompts Midjourney', 'Prompts criativos para geração de imagens', '🎨', 3),
('typebot-templates', 'Pack +500 Templates Typebot', 'Chatbots prontos para usar', '🤖', 4),
('saas-whitelabel', '+30 SaaS White Label', 'Softwares prontos para revender', '⚡', 5),
('bonus', '+8 Bônus Exclusivos', 'Conteúdo extra especial', '🌟', 6),
('ferramentas', 'Ferramentas Gratuitas', 'Ferramentas úteis sem custo', '🆓', 7);

-- ============================================
-- 2. WORKFLOWS N8N
-- ============================================
CREATE TABLE n8n_workflows (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    nome VARCHAR(500) NOT NULL,
    descricao TEXT,
    subcategoria VARCHAR(255),
    fonte VARCHAR(100), -- 'zie619', 'awesome', 'wassupjay'
    arquivo_path VARCHAR(500),
    fluxo_json JSONB,
    tags TEXT[],
    ferramentas TEXT[],
    is_active BOOLEAN DEFAULT true,
    downloads INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX idx_n8n_nome ON n8n_workflows USING gin(to_tsvector('portuguese', nome));
CREATE INDEX idx_n8n_subcategoria ON n8n_workflows(subcategoria);
CREATE INDEX idx_n8n_fonte ON n8n_workflows(fonte);
CREATE INDEX idx_n8n_tags ON n8n_workflows USING gin(tags);

-- ============================================
-- 3. PROMPTS CHATGPT
-- ============================================
CREATE TABLE prompts_chatgpt (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    categoria_prompt VARCHAR(255) NOT NULL,
    prompt_br TEXT NOT NULL,
    prompt_en TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX idx_prompts_gpt_categoria ON prompts_chatgpt(categoria_prompt);
CREATE INDEX idx_prompts_gpt_busca ON prompts_chatgpt USING gin(to_tsvector('portuguese', prompt_br));

-- ============================================
-- 4. PROMPTS MIDJOURNEY
-- ============================================
CREATE TABLE prompts_midjourney (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    categoria_prompt VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    descricao TEXT,
    prompt_br TEXT,
    prompt_en TEXT,
    imagem_url TEXT,
    tipo VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_prompts_mj_categoria ON prompts_midjourney(categoria_prompt);

-- ============================================
-- 5. TEMPLATES TYPEBOT
-- ============================================
CREATE TABLE typebot_templates (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    nome_original VARCHAR(500),
    nome_resumido VARCHAR(255),
    descricao TEXT,
    link_drive TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    downloads INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_typebot_nome ON typebot_templates USING gin(to_tsvector('portuguese', nome_resumido));

-- ============================================
-- 6. SAAS WHITE LABEL
-- ============================================
CREATE TABLE saas (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    link TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. BÔNUS
-- ============================================
CREATE TABLE bonus (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bonus_items (
    id SERIAL PRIMARY KEY,
    bonus_id INT REFERENCES bonus(id) ON DELETE CASCADE,
    titulo VARCHAR(500),
    descricao TEXT,
    link TEXT,
    ordem INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. FERRAMENTAS
-- ============================================
CREATE TABLE ferramentas (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    categoria_ferramenta VARCHAR(255),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    link TEXT,
    is_free BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ferramentas_categoria ON ferramentas(categoria_ferramenta);

-- ============================================
-- 9. VIEWS PARA O FRONTEND
-- ============================================

-- View de estatísticas por categoria
CREATE OR REPLACE VIEW vw_category_stats AS
SELECT 
    c.id,
    c.slug,
    c.nome,
    c.emoji,
    c.ordem,
    COALESCE(n8n.total, 0) + 
    COALESCE(gpt.total, 0) + 
    COALESCE(mj.total, 0) + 
    COALESCE(tb.total, 0) + 
    COALESCE(saas.total, 0) + 
    COALESCE(bonus.total, 0) + 
    COALESCE(ferr.total, 0) AS total_items
FROM categories c
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM n8n_workflows WHERE is_active GROUP BY category_id) n8n ON n8n.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM prompts_chatgpt WHERE is_active GROUP BY category_id) gpt ON gpt.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM prompts_midjourney WHERE is_active GROUP BY category_id) mj ON mj.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM typebot_templates WHERE is_active GROUP BY category_id) tb ON tb.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM saas WHERE is_active GROUP BY category_id) saas ON saas.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM bonus WHERE is_active GROUP BY category_id) bonus ON bonus.category_id = c.id
LEFT JOIN (SELECT category_id, COUNT(*) as total FROM ferramentas WHERE is_active GROUP BY category_id) ferr ON ferr.category_id = c.id
WHERE c.is_active
ORDER BY c.ordem;

-- ============================================
-- 10. RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_chatgpt ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_midjourney ENABLE ROW LEVEL SECURITY;
ALTER TABLE typebot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (para conteúdo ativo)
CREATE POLICY "Leitura pública de categorias" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de workflows" ON n8n_workflows FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de prompts GPT" ON prompts_chatgpt FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de prompts MJ" ON prompts_midjourney FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de typebot" ON typebot_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de saas" ON saas FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de bonus" ON bonus FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura pública de bonus items" ON bonus_items FOR SELECT USING (true);
CREATE POLICY "Leitura pública de ferramentas" ON ferramentas FOR SELECT USING (is_active = true);

-- ============================================
-- 11. FUNÇÕES ÚTEIS
-- ============================================

-- Função para busca global
CREATE OR REPLACE FUNCTION search_content(search_term TEXT)
RETURNS TABLE (
    tipo VARCHAR,
    id INT,
    nome VARCHAR,
    descricao TEXT,
    categoria VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    -- Workflows
    SELECT 'workflow'::VARCHAR, w.id, w.nome::VARCHAR, w.descricao, w.subcategoria
    FROM n8n_workflows w
    WHERE w.is_active AND (
        w.nome ILIKE '%' || search_term || '%' OR
        w.descricao ILIKE '%' || search_term || '%' OR
        w.subcategoria ILIKE '%' || search_term || '%'
    )
    UNION ALL
    -- Prompts ChatGPT
    SELECT 'prompt_gpt'::VARCHAR, p.id, p.categoria_prompt::VARCHAR, p.prompt_br, p.categoria_prompt
    FROM prompts_chatgpt p
    WHERE p.is_active AND (
        p.prompt_br ILIKE '%' || search_term || '%' OR
        p.categoria_prompt ILIKE '%' || search_term || '%'
    )
    UNION ALL
    -- Prompts Midjourney
    SELECT 'prompt_mj'::VARCHAR, m.id, m.nome::VARCHAR, m.descricao, m.categoria_prompt
    FROM prompts_midjourney m
    WHERE m.is_active AND (
        m.nome ILIKE '%' || search_term || '%' OR
        m.descricao ILIKE '%' || search_term || '%'
    )
    UNION ALL
    -- Typebot
    SELECT 'typebot'::VARCHAR, t.id, t.nome_resumido::VARCHAR, t.descricao, 'Typebot'::VARCHAR
    FROM typebot_templates t
    WHERE t.is_active AND (
        t.nome_resumido ILIKE '%' || search_term || '%' OR
        t.descricao ILIKE '%' || search_term || '%'
    )
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_n8n_workflows_updated_at BEFORE UPDATE ON n8n_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FIM DO SCHEMA
-- ============================================
