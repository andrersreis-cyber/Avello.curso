# Fluxo de Extração de Dados de PDFs para Planilhas Google com IA

**Descrição:**
Fluxo que observa uma pasta do Google Drive em busca de novos PDFs, converte páginas em imagens, extrai texto, identifica o tipo de documento com IA (Invoice, Resume ou Shipping Label) e extrai dados estruturados, gravando-os nas planilhas Google correspondentes.

**Ferramentas:**
• Google Drive: Serviço de armazenamento e monitoramento de pastas para disparar fluxos.
• Google Sheets: Planilhas usadas para armazenar os dados extraídos.
• OpenAI API: IA para classificar o tipo de documento e extrair dados estruturados (Invoice, Resume, Shipping Label).
• pdfrest: Serviço externo para converter páginas de PDF em imagens para processamento.

**Funcionalidades:**
• Monitorar uma pasta do Google Drive e iniciar a automação quando um novo arquivo é criado.
• Converter páginas de PDF em imagens para processamento.
• Extrair o texto do PDF para uso posterior.
• Identificar o tipo de documento (Invoice, Resume, Shipping Label) usando IA.
• Extrair dados estruturados relevantes para cada tipo de documento.
• Gerar blocos de imagem para múltiplas páginas quando necessário.
• Gravar os dados extraídos nas planilhas Google correspondentes (Invoices, Resumes, Shipping Labels).
• Encaminhar os dados para a planilha correta com base no tipo de documento.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1D2rHzUMV-ssRQx6bovKiTchgQu5kind5/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
