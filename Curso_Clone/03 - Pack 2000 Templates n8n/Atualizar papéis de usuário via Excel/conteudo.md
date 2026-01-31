# Atualizar papéis de usuário via Excel

**Descrição:**
Atualiza os papéis (roles) de usuários em uma instância Zammad com base em dados contidos em um arquivo Excel hospedado por URL.

**Ferramentas:**
• Zammad: Instância de gestão de tickets/usuários cuja API é usada para buscar e atualizar usuários.
• Servidor HTTP com arquivo Excel: Local onde o arquivo Excel (Users.txt/xlsx) está hospedado e é baixado via URL.

**Funcionalidades:**
• Definição de variáveis básicas: Configura URL base do Zammad e fonte do arquivo Excel.
• Download do arquivo Excel via URL: Recupera o arquivo de origem hospedado por HTTP.
• Extração de dados do Excel: Lê e transforma o conteúdo do arquivo em registros utilizáveis.
• Normalização para objeto de usuário: Mapeia colunas do Excel para um objeto universal contendo email e role_ids.
• Busca de usuário por email na plataforma: Consulta a API do Zammad para localizar o usuário correspondente ao email.
• Mesclagem de dados locais com resultados da busca: Combina informações do Excel com os dados retornados pela API para preparar atualização.
• Atualização de papéis via API: Envia requisição PUT para atualizar o campo role_ids do usuário no Zammad.
• Tratamento de erros controlado: Continua execução quando atualização falha, permitindo registros com problemas sem interromper todo o fluxo.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1nobb0WgMhuvbH3NI4_MyMmOgh7nW_1p4/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
