# Exportar notícias YCombinator para planilha e enviar por email

**Descrição:**
Busca a página principal do Y Combinator (Hacker News), extrai títulos e URLs das notícias, gera uma planilha com os resultados e envia por email como anexo.

**Ferramentas:**
• Hacker News (news.ycombinator.com): fonte pública das notícias a serem extraídas.
• Servidor SMTP/Serviço de email: entrega do arquivo de planilha por email como anexo.
• Formato de planilha (XLSX/CSV): formato de saída utilizado para armazenar e compartilhar as notícias.

**Funcionalidades:**
• Gatilho manual: inicia o fluxo quando o usuário aciona a execução.
• Requisição HTTP à página de notícias: obtém o HTML da página principal do Y Combinator (Hacker News).
• Extração de HTML: captura títulos e links das notícias usando seletores CSS (.storylink).
• Separação de listas: transforma os arrays de títulos e de URLs em listas de itens individuais.
• União por índice: combina cada título com seu respectivo URL, mantendo a correspondência por posição.
• Geração de arquivo de planilha: cria um arquivo de planilha nomeado com a data atual (ex: Ycombinator_news_YYYY-MM-DD) com a aba "Latest news" contendo os pares título/URL.
• Envio por email com anexo: envia a planilha gerada por email usando credenciais SMTP.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1XqwzedAPQQGvqrnvKtGRNo67gchp9N_j/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
