# Sincronizar playlist Spotify → YouTube

**Descrição:**
Mantém uma playlist do YouTube sincronizada com uma playlist do Spotify, usando armazenamento persistente para rastrear faixas e correspondências de vídeos.

**Ferramentas:**
• Spotify API: Fonte das faixas e metadados da playlist (snapshot_id, título, artista, duração).
• YouTube Data API v3 / YouTube Playlist: Pesquisa de vídeos, obtenção de metadados (duração) e gerenciamento da playlist de destino.
• Supabase (Postgres): Armazenamento persistente das faixas, IDs de vídeos e flags de estado (youtube_video_id, to_delete).
• Discord Webhook: Envio de notificações sobre correspondências ou falhas.

**Funcionalidades:**
• Detecção de alterações na playlist do Spotify: Verifica se houve mudanças usando snapshot_id antes de processar.
• Sincronização unidirecional: Propaga adições e remoções da playlist Spotify para a playlist do YouTube.
• Importação para banco persistente: Adiciona faixas novas ao banco de dados com título, artista e duração.
• Marcação para exclusão: Marca entradas do banco com to_delete quando removidas da playlist Spotify.
• Busca inteligente no YouTube: Pesquisa vídeos usando título e artista e avalia os top resultados com base na duração (tolerância configurada).
• Adição automática ao YouTube: Adiciona o vídeo correspondente à playlist do YouTube e grava o ID do vídeo no banco.
• Marcação NOTFOUND: Sinaliza faixas sem correspondência encontrada para tentativas futuras.
• Verificação e recuperação: Detecta vídeos removidos do YouTube, limpa o ID no banco para re-pesquisar e permite re-tentativas periódicas.
• Exclusão condicional do banco: Remove registros marcados para exclusão quando apropriado.
• Agendamentos múltiplos: Executa verificações periódicas (hora a hora, diariamente e mensalmente) e inclui um processo de espera para checagens repetidas.
• Notificações opcionais: Envia notificações sobre correspondências falhadas ou adições bem-sucedidas via webhook.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1nQbahabY-xosCSx8Q_xNq3TIWXfwj5Ke/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
