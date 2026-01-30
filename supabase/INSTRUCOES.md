# Instruções para Configurar o Banco de Dados

## Passo 1: Executar o Schema

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard/project/pgjcvdmbpluewhpephhx

2. Vá para **SQL Editor** (menu lateral esquerdo)

3. Clique em **New Query**

4. Cole o conteúdo do arquivo `schema.sql` (está nesta mesma pasta)

5. Clique em **Run** (ou Ctrl+Enter)

6. Verifique se todas as tabelas foram criadas em **Table Editor**

## Passo 2: Verificar as Tabelas

Após executar, você deve ver as seguintes tabelas:
- ✅ categories
- ✅ n8n_workflows
- ✅ prompts_chatgpt
- ✅ prompts_midjourney
- ✅ typebot_templates
- ✅ saas
- ✅ bonus
- ✅ bonus_items
- ✅ ferramentas

## Passo 3: Executar Importação

Depois de criar as tabelas, volte aqui e execute:

```bash
cd "c:\Users\andre\curso low"
node scripts/import_data.js
```

## Problemas Comuns

### Erro "relation already exists"
Se as tabelas já existem, o script as deleta primeiro. Se der erro, execute:
```sql
DROP TABLE IF EXISTS bonus_items CASCADE;
DROP TABLE IF EXISTS bonus CASCADE;
DROP TABLE IF EXISTS ferramentas CASCADE;
DROP TABLE IF EXISTS saas CASCADE;
DROP TABLE IF EXISTS typebot_templates CASCADE;
DROP TABLE IF EXISTS prompts_midjourney CASCADE;
DROP TABLE IF EXISTS prompts_chatgpt CASCADE;
DROP TABLE IF EXISTS n8n_workflows CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
```

Depois execute o schema novamente.
