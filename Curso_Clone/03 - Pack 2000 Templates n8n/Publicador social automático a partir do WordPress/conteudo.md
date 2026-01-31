# Publicador social automático a partir do WordPress

**Descrição:**
Automatiza a criação e publicação de legendas e imagens para múltiplas redes sociais com base no conteúdo de um post do WordPress, usando modelos de IA e integração com APIs de redes sociais e planilha.

**Ferramentas:**
• WordPress: CMS de onde o conteúdo do post é recuperado para criação das publicações.
• Google Sheets: Planilha usada para fornecer IDs de posts e registrar o status das publicações.
• OpenRouter (modelo de linguagem): Serviço de modelo de linguagem usado para gerar as legendas adaptadas a cada plataforma.
• OpenAI (geração de imagens): Serviço de geração de imagens usado para criar ativos visuais para as publicações.
• X (Twitter): Rede social para publicação de posts concisos e engajadores.
• Facebook Graph / Instagram API: APIs usadas para publicar fotos e legendas no Facebook e no Instagram.
• LinkedIn: Rede social profissional usada para publicar conteúdo com tom mais formal e direcionado a negócios.

**Funcionalidades:**
• Leitura de planilha Google Sheets: Busca o ID do post do WordPress para processar.
• Recuperação do post do WordPress: Obtém título, conteúdo e link do artigo especificado.
• Geração de legendas por IA: Cria textos otimizados e adaptados para LinkedIn, Instagram, Facebook e Twitter (X), respeitando tom e limite de cada plataforma.
• Parser de saída estruturada: Transforma a resposta do modelo de IA em campos separados por plataforma.
• Geração de imagens por IA: Cria imagens específicas para Instagram e para Facebook/LinkedIn com tamanhos apropriados.
• Publicação automática: Envia posts com texto e imagens para X, LinkedIn, Facebook e Instagram via suas APIs.
• Atualização da planilha: Marca, por linha, quais plataformas foram publicadas com sucesso.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/173lyrK7t9kht1tsZjzYJHQCMKiP5eGIi/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
