-- Adicionar coluna arquivo_json à tabela n8n_workflows
ALTER TABLE n8n_workflows 
ADD COLUMN IF NOT EXISTS arquivo_json JSONB;

-- Criar índice para busca no JSON
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_arquivo_json 
ON n8n_workflows USING gin(arquivo_json);

-- Verificar se foi criado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'n8n_workflows' AND column_name = 'arquivo_json';
