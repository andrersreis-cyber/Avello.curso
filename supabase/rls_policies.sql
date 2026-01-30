-- ============================================
-- POLÍTICAS RLS - PERMITIR LEITURA PÚBLICA
-- Execute no SQL Editor do Supabase
-- ============================================

-- Habilitar RLS em todas as tabelas de conteúdo
ALTER TABLE n8n_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_chatgpt ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_midjourney ENABLE ROW LEVEL SECURITY;
ALTER TABLE typebot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferramentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir leitura pública n8n_workflows" ON n8n_workflows;
DROP POLICY IF EXISTS "Permitir leitura pública prompts_chatgpt" ON prompts_chatgpt;
DROP POLICY IF EXISTS "Permitir leitura pública prompts_midjourney" ON prompts_midjourney;
DROP POLICY IF EXISTS "Permitir leitura pública typebot_templates" ON typebot_templates;
DROP POLICY IF EXISTS "Permitir leitura pública saas" ON saas;
DROP POLICY IF EXISTS "Permitir leitura pública bonus" ON bonus;
DROP POLICY IF EXISTS "Permitir leitura pública bonus_items" ON bonus_items;
DROP POLICY IF EXISTS "Permitir leitura pública ferramentas" ON ferramentas;
DROP POLICY IF EXISTS "Permitir leitura pública categories" ON categories;

-- Criar políticas de leitura pública (SELECT)
CREATE POLICY "Permitir leitura pública n8n_workflows" 
ON n8n_workflows FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública prompts_chatgpt" 
ON prompts_chatgpt FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública prompts_midjourney" 
ON prompts_midjourney FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública typebot_templates" 
ON typebot_templates FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública saas" 
ON saas FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública bonus" 
ON bonus FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública bonus_items" 
ON bonus_items FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública ferramentas" 
ON ferramentas FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir leitura pública categories" 
ON categories FOR SELECT 
TO anon, authenticated
USING (true);

-- Verificar se as políticas foram criadas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
