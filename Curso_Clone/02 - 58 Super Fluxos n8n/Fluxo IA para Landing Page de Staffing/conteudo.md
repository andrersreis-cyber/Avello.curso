# Fluxo IA para Landing Page de Staffing

**Descrição:**
Este fluxo automatiza a geração de conteúdo para landing pages voltadas a automação em staffing, reunindo dados de entrada, gerando conteúdos por seções via IA e consolidando tudo em uma configuração de página pronta para uso.

**Ferramentas:**
• Anthropic Chat Model: Modelo de IA utilizado para gerar conteúdo textual.
• LangChain: Framework usado para orquestrar prompts, conectar modelos de IA e estruturar saídas.

**Funcionalidades:**
• Trigger manual: Inicia a automação ao clicar em Test workflow.
• Preparação de dados: Carrega informações de Background Information, incluindo domínio, público-alvo, título do site, tipo de empresa, caso de uso e prompts de apresentação.
• Expansão de itens: Divide o input em itens individuais para processamento.
• Processamento iterativo: Percorre itens em lotes e aplica geração de conteúdo por item.
• Geração de conteúdo por IA: Usa um modelo de IA para criar hero, subtítulo, CTA, pain points e outras seções da landing page.
• Parser de saída estruturado: Converte saídas da IA em uma estrutura previsível para uso.
• Criação de configuração RAW: Monta a configuração da landing page com header, descrição, imagens, vídeo e depoimentos.
• Finalização da configuração: Ajusta formatos (remove quebras) e produz o output final.
• Agrupamento de conteúdo: Agrupa conteúdos para formar o conteúdo final da página.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1MO4TPlWWNnM700ou8LzV9IdaGKkqUqSt/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
