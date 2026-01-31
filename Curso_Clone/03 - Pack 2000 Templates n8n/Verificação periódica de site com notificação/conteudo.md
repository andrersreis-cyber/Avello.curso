# Verificação periódica de site com notificação

**Descrição:**
Verifica periodicamente o conteúdo de uma página web e envia uma notificação via Discord quando a string monitorada não é encontrada.

**Ferramentas:**
• Site alvo (HTTP): página web monitorada para verificação de conteúdo.
• Discord: canal para envio de notificações via webhook.

**Funcionalidades:**
• Agendamento periódicos: executa a verificação a cada hora.
• Requisição HTTP ao site alvo: busca o conteúdo da página configurada.
• Verificação de conteúdo: procura pela string "Out Of Stock" na resposta.
• Notificação condicional: quando a resposta NÃO contém "Out Of Stock", envia uma mensagem "value not found" para um webhook do Discord.
• Notificação positiva configurada (inativa): existe uma mensagem "value found" preparada para envio, porém o fluxo dessa ação não está conectado.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1FJxVAqnHe8KR1Xi2TzWv_bnONj2TzVUC/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
