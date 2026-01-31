# Processamento de dados de IA de chamadas de vendas

**Descrição:**
Processa dados de IA gerados a partir de chamadas de vendas para atualizar registros existentes e criar objetos de caso de uso e feedback de produto em bases de dados.

**Ferramentas:**
• Gong: fonte das chamadas de vendas e contexto de reunião.
• Serviço de IA externo: gera a análise e extração de informações das chamadas (AIoutput).
• Notion: armazena e atualiza páginas em bases de dados como AI use-case e Product Feedback.
• CRMs (Pipedrive/Salesforce) - integração planejada: possibilidade de sincronizar oportunidades e dados comerciais no futuro.

**Funcionalidades:**
• Receber dados de IA de outro fluxo: recebe o payload com metadados da chamada e o resultado da análise de IA.
• Verificar menção de IA na chamada: determina se a chamada contém referências relevantes a IA/ML.
• Atualizar registro da chamada com resumo de IA: grava checkbox e resumo de IA no registro da chamada existente.
• Detectar e criar caso de uso de IA: quando identificado, cria uma página na base de casos de uso preenchendo propriedades relevantes (empresa, departamento, necessidade de RAG, etc.).
• Detectar e criar feedback de produto: quando houver feedbacks, divide a lista em itens e cria páginas relacionadas na base de Product Feedback, relacionando-as à chamada.
• Gerenciar limitação de taxa: insere esperas controladas antes de operações de criação para evitar rate limiting.
• Agrupar e mesclar threads de dados: agrega itens gerados e adiciona contexto adicional (como resposta de IA) antes de finalizar operações.
• Mapear propriedades para armazenamento: transforma campos do output de IA e metadados da chamada em propriedades das bases de dados alvo.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1lyqAIvs_SXyRYWEUTvh4MpMEPt9HuJ0M/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
