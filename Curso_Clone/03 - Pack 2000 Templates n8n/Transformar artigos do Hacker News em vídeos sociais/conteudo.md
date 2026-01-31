# Transformar artigos do Hacker News em vídeos sociais

**Descrição:**
Este fluxo busca artigos do Hacker News, identifica os relacionados a IA/automação, gera resumos, imagens e vídeos e publica/armazen a mídia resultante.

**Ferramentas:**
• Hacker News: fonte pública de artigos e links para processamento.
• OpenAI: geração e análise de texto, criação de blurbs e uso de modelos multimodais (análise de imagem e TTS).
• Leonardo.ai: melhoria de prompts e geração de imagens a partir de prompts.
• RunwayML: conversão de imagens em vídeos (image-to-video) usando modelos de vídeo.
• Creatomate: montagem e renderização final do vídeo com cenas, legendas e áudio.
• Minio/S3: armazenamento de objetos para guardar os ativos gerados.
• Dropbox: opção para armazenar ou sincronizar arquivos gerados.
• Google Drive: opção de armazenamento e atualização de arquivos na nuvem.
• Microsoft OneDrive: opção adicional de armazenamento em nuvem.
• YouTube: plataforma de hospedagem e publicação de vídeos.
• X (Twitter): plataforma social para compartilhamento dos vídeos.
• Instagram: plataforma social para compartilhamento visual.
• LinkedIn: plataforma social para publicação profissional e distribuição do conteúdo.

**Funcionalidades:**
• Coleta de artigos: obtém itens do Hacker News e limita a quantidade a processar.
• Análise de relevância: determina se o artigo é sobre IA ou automação e extrai um resumo e URL de imagem.
• Preparação de conteúdo: cria título curto, blurb para newsletter, dois resumos curtos e prompts de imagem otimizados.
• Geração de imagens: melhora prompts e gera imagens a partir dos prompts fornecidos.
• Geração de vídeos a partir de imagens: converte imagens em clipes de vídeo utilizando modelos de geração de vídeo.
• Edição e montagem: combina vídeos, imagens, legendas e vozes (TTS) em uma composição final para publicação.
• Análise de imagem: valida e descreve imagens geradas para garantir relevância ao conteúdo.
• Gerenciamento assíncrono: usa esperas e checagens para tratar jobs longos de geração e evitar rate limits.
• Armazenamento de ativos: faz upload dos arquivos gerados para armazenamento em nuvem/objeto.
• Publicação em redes sociais: prepara e encaminha os vídeos para plataformas sociais e serviços de nuvem para distribuição.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/11UDHdNbwdbvmoE_7zFJMsUjrW0dezJ8J/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
