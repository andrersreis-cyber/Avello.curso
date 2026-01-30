-- ============================================
-- ÍNDICES DE PERFORMANCE
-- Execute no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Habilitar extensão pg_trgm (necessária para busca textual)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- PASSO 2: Índices básicos (B-tree) - funcionam sem extensão
CREATE INDEX IF NOT EXISTS idx_prompts_chatgpt_categoria ON prompts_chatgpt(categoria_prompt);
CREATE INDEX IF NOT EXISTS idx_prompts_midjourney_categoria ON prompts_midjourney(categoria_prompt);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_plano ON usuarios(plano);

-- PASSO 3: Índices para busca textual (GIN com pg_trgm)
-- Só execute após o PASSO 1 ter sucesso
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_nome ON n8n_workflows USING gin(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_descricao ON n8n_workflows USING gin(descricao gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prompts_chatgpt_prompt ON prompts_chatgpt USING gin(prompt_br gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prompts_midjourney_nome ON prompts_midjourney USING gin(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_typebot_templates_nome ON typebot_templates USING gin(nome_resumido gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_saas_nome ON saas USING gin(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bonus_nome ON bonus USING gin(nome gin_trgm_ops);

-- ============================================
-- FUNÇÃO RPC PARA CONTAGEM DE CATEGORIAS
-- Mais eficiente que buscar todos os registros
-- ============================================

CREATE OR REPLACE FUNCTION get_category_counts(table_name text)
RETURNS TABLE(categoria text, count bigint) AS $$
BEGIN
  IF table_name = 'prompts_chatgpt' THEN
    RETURN QUERY 
      SELECT COALESCE(categoria_prompt, 'Outros') as categoria, COUNT(*) as count
      FROM prompts_chatgpt
      GROUP BY categoria_prompt
      ORDER BY count DESC;
  ELSIF table_name = 'prompts_midjourney' THEN
    RETURN QUERY 
      SELECT COALESCE(categoria_prompt, 'Outros') as categoria, COUNT(*) as count
      FROM prompts_midjourney
      GROUP BY categoria_prompt
      ORDER BY count DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;
