# Automação de fine-tuning e uso de modelo OpenAI

**Descrição:**
Fluxo que baixa um arquivo de treinamento, envia para a plataforma OpenAI para fine-tuning e utiliza o modelo resultante para responder mensagens de chat.

**Ferramentas:**
• Google Drive: Armazenamento e fornecimento do arquivo de treinamento (.jsonl) e possibilidade de conversão de documentos.
• OpenAI (API / Plataforma): Recebe o arquivo (upload), executa o fine-tuning (jobs) e disponibiliza o modelo customizado para uso em chamadas de chat.

**Funcionalidades:**
• Download do arquivo de treinamento: Baixa um arquivo .jsonl armazenado no Google Drive, com opção de conversão de documentos.
• Upload do arquivo para treinamento: Envia o arquivo baixado para a plataforma OpenAI com o propósito de fine-tune.
• Criação do job de fine-tuning: Inicia um job de fine-tuning na API da OpenAI especificando o arquivo de treinamento e o modelo base.
• Utilização do modelo customizado em chat: Encaminha mensagens de chat para o modelo fine-tuned (identificador ft:...) para gerar respostas.
• Gatilhos de execução: Permite iniciar o processo manualmente para testes e receber mensagens via webhook para atendimento em tempo real.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1uOV6D5tNIq4z2trNBRSGlZJeWgzn2CHh/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
