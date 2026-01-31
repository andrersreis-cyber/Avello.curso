# Guia Completo: Criar Campanha Meta Ads para Avello

## ✅ Checklist Antes de Começar

- [ ] Pixel ID configurado no Netlify (`NEXT_PUBLIC_FACEBOOK_PIXEL_ID`)
- [ ] Pixel funcionando (testar com Facebook Pixel Helper)
- [ ] Criativos prontos (imagens 1080x1080px)
- [ ] Conta do Meta Business criada
- [ ] Cartão de crédito cadastrado no Meta Ads

---

## Passo 1: Acessar Meta Ads Manager

1. Acesse: **https://business.facebook.com/adsmanager**
2. Faça login com sua conta do Facebook
3. Selecione a conta de anúncios: **"Avello automações"**

---

## Passo 2: Criar Nova Campanha

1. Clique no botão verde **"+ Criar"** (canto superior esquerdo)
2. Selecione o objetivo: **"Vendas"** ou **"Conversões"**
   - ⚠️ **IMPORTANTE:** Escolha "Conversões" se quiser otimizar para compras
   - Escolha "Vendas" se quiser uma campanha mais simples

---

## Passo 3: Configurar Nível da Campanha

### Nome da Campanha
```
Avello - Conversão - R$ 39/ano
```

### Orçamento da Campanha
- **Orçamento diário:** R$ 30,00
- **Ou orçamento total:** Deixe em branco (usar diário)

### Objetivo de Compra
- Selecione: **"Conversões"**
- Evento de conversão: **"Purchase"** (Compra)
- Pixel: Selecione seu Pixel (ID: 1382631856941384)

### A/B Testing
- Deixe desativado por enquanto

### Configurações de Orçamento
- **Estratégia de orçamento:** "Orçamento diário"
- **Valor:** R$ 30,00

Clique em **"Avançar"**

---

## Passo 4: Configurar Conjunto de Anúncios

### Nome do Conjunto
```
Avello - Interesse Automação - Teste
```

### Pixel e Eventos
- ✅ Pixel já selecionado automaticamente
- Evento de conversão: **"Purchase"**
- Valor de conversão: Deixe em branco (ou configure se quiser)

### Otimização e Entrega
- **Otimizar para:** "Conversões"
- **Evento de conversão:** "Purchase"
- **Janela de atribuição:** "1 dia após visualização ou 7 dias após clique"
- **Tipo de cobrança:** "CPC" (Custo por Clique) ou "CPA" (Custo por Conversão)

### Orçamento do Conjunto
- **Orçamento diário:** R$ 30,00
- (Ou deixe usar o orçamento da campanha)

### Agendamento
- **Início:** Hoje
- **Fim:** Deixe em branco (campanha contínua)

### Público

#### Criar Novo Público Personalizado

**Nome:** `Avello - Interesse Automação`

**Localização:**
- **Países:** Brasil
- **Cidades (opcional):** São Paulo, Rio de Janeiro, Belo Horizonte, Brasília, Curitiba

**Idade:** 25-45 anos

**Gênero:** Todos

**Detalhamento:**

**Interesses (escolha 3-5):**
- ✅ Automação
- ✅ Marketing Digital
- ✅ Empreendedorismo
- ✅ Inteligência Artificial
- ✅ SaaS (Software as a Service)

**Comportamentos:**
- ✅ Compradores online
- ✅ Pequenos empresários

**Mais opções:**
- **Idiomas:** Português (Brasil)

**Tamanho estimado do público:** 
- Deve aparecer algo como: "1.000.000 - 2.000.000 pessoas"
- Se estiver muito pequeno (< 100k), adicione mais interesses
- Se estiver muito grande (> 5M), adicione mais restrições

### Posicionamentos

**Recomendado para começar:**
- ✅ **Feed do Facebook**
- ✅ **Stories do Facebook**
- ✅ **Feed do Instagram**
- ✅ **Stories do Instagram**
- ✅ **Reels do Instagram**

**Deixe desmarcado por enquanto:**
- ❌ Audience Network (pode ter qualidade menor)
- ❌ Mensagens (requer configuração extra)

### Otimização de Entrega
- ✅ **Deixe padrão:** "Otimizar para conversões"

Clique em **"Avançar"**

---

## Passo 5: Criar Anúncios

### Nome do Anúncio
```
Avello - Benefício Principal - Teste A
```

### Formato
- Selecione: **"Imagem única"** ou **"Carrossel"**

### Criativos

#### Opção A: Imagem Única (Recomendado para começar)

1. **Fazer upload da imagem:**
   - Clique em **"Fazer upload"**
   - Selecione sua imagem (1080x1080px)
   - Aguarde o upload

2. **Texto primário:**
```
Automatize seu negócio com +6.000 recursos de IA. Templates n8n, prompts ChatGPT, SaaS white label e muito mais. Comece grátis agora!
```

3. **Headline:**
```
6.000+ Recursos de IA em 1 Só Lugar
```

4. **Descrição:**
```
Comece grátis. Upgrade quando quiser.
```

5. **CTA (Call to Action):**
```
Começar Grátis
```

#### Opção B: Carrossel (5 slides)

1. **Fazer upload das 5 imagens:**
   - Slide 1: Gancho
   - Slide 2: Templates n8n
   - Slide 3: Prompts IA
   - Slide 4: SaaS White Label
   - Slide 5: Preço + CTA

2. **Texto primário:** (mesmo do Opção A)

3. **Headline:** (mesmo do Opção A)

4. **Descrição:** (mesmo do Opção A)

5. **CTA:** (mesmo do Opção A)

### Link

**URL do site:**
```
https://avello.netlify.app/loja
```

**Parâmetros do link (opcional):**
```
utm_source=facebook&utm_medium=cpc&utm_campaign=conversao_39_ano
```

**Tela de destino:**
- Selecione: **"Loja"** ou deixe padrão

### Configurações Adicionais

**Nome do site:** Avello

**Descrição do site:** 
```
+6.000 recursos de IA: templates, prompts e SaaS
```

**Imagem:** (já feito no upload)

---

## Passo 6: Criar Variações (Teste A/B)

### Criar 2-3 Anúncios Diferentes

**Anúncio 1: Benefício**
- Imagem: Benefício principal
- Headline: "6.000+ Recursos de IA em 1 Só Lugar"
- Texto: Foco em benefícios

**Anúncio 2: Urgência**
- Imagem: Desconto 80% OFF
- Headline: "80% OFF - Apenas R$ 3,25/mês"
- Texto: Foco em desconto

**Anúncio 3: Prova Social**
- Imagem: Depoimentos/estatísticas
- Headline: "Usado por 500+ Empresas"
- Texto: Foco em credibilidade

---

## Passo 7: Revisar e Publicar

### Revisão Final

Verifique:
- ✅ Pixel configurado corretamente
- ✅ Evento "Purchase" selecionado
- ✅ Público com tamanho adequado (100k - 5M)
- ✅ Orçamento: R$ 30/dia
- ✅ Criativos carregados
- ✅ Link correto: https://avello.netlify.app/loja
- ✅ CTA configurado

### Publicar

1. Clique em **"Publicar"** ou **"Revisar"**
2. Revise todos os detalhes
3. Clique em **"Confirmar"**

---

## Passo 8: Monitorar Campanha

### Primeiras 24-48 horas

**O que observar:**
- **Impressões:** Quantas pessoas viram o anúncio
- **Cliques:** Quantas pessoas clicaram
- **CTR (Taxa de Cliques):** Deve ser 1-3%
- **CPC (Custo por Clique):** R$ 0,50 - R$ 2,00
- **Conversões:** Quantas compras foram feitas
- **CPA (Custo por Aquisição):** R$ 20 - R$ 50 (ideal)

### Métricas Esperadas (7 dias)

**Investimento:** R$ 210 (R$ 30/dia × 7 dias)

**Resultados esperados:**
- Cliques: 200-400
- Conversões: 5-15 vendas
- CPA: R$ 20-50 por venda
- ROAS: 3x ou mais (R$ 195+ em vendas para R$ 210 investidos)

### Otimizações

**Se CPA > R$ 70:**
- Pausar anúncio
- Testar novo criativo
- Ajustar público

**Se CPA < R$ 50:**
- Aumentar orçamento para R$ 50/dia
- Escalar campanha
- Criar lookalike audiences

---

## Configurações Avançadas (Opcional)

### Lookalike Audiences (Após ter 50+ conversões)

1. Vá em **"Públicos"** → **"Criar público"**
2. Selecione **"Lookalike"**
3. Escolha seu Pixel como fonte
4. Selecione **"Purchase"** como evento
5. Escolha **1%** de similaridade
6. Salve e use na próxima campanha

### Conversões Personalizadas

1. Vá em **"Eventos"** → **"Conversões Personalizadas"**
2. Crie eventos como:
   - "Iniciou Checkout" (InitiateCheckout)
   - "Visualizou Produto" (ViewContent)
   - "Adicionou ao Carrinho" (AddToCart)

### Testes A/B Automáticos

1. Na criação da campanha, ative **"Teste A/B"**
2. Teste diferentes:
   - Criativos
   - Headlines
   - Públicos
   - Posicionamentos

---

## Troubleshooting

### Pixel não está rastreando

1. Instale extensão **Facebook Pixel Helper** no Chrome
2. Acesse seu site
3. Verifique se aparece: "Pixel encontrado: 1382631856941384"
4. Se não aparecer, verifique:
   - Variável `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` no Netlify
   - Redeploy do site
   - Console do navegador (F12) para erros

### Campanha não está gerando conversões

**Possíveis causas:**
- Público muito amplo → Restringir interesses
- Criativo não atrativo → Testar novos designs
- Link quebrado → Verificar URL
- Preço muito alto → Testar desconto maior

### CPA muito alto (> R$ 70)

**Soluções:**
1. Pausar anúncio atual
2. Criar novo anúncio com:
   - Headline diferente
   - Criativo diferente
   - Público mais específico
3. Testar carrossel ao invés de imagem única

---

## Checklist Final

Antes de publicar, confirme:

- [ ] Pixel ID configurado no Netlify
- [ ] Pixel testado e funcionando
- [ ] Criativos prontos (1080x1080px)
- [ ] Público configurado (100k - 5M pessoas)
- [ ] Orçamento definido (R$ 30/dia)
- [ ] Link correto (https://avello.netlify.app/loja)
- [ ] CTA configurado
- [ ] Evento "Purchase" selecionado
- [ ] Cartão de crédito cadastrado

---

## Próximos Passos Após Lançar

1. **Dia 1-2:** Monitorar métricas básicas (impressões, cliques)
2. **Dia 3-5:** Analisar primeiras conversões
3. **Dia 7:** Fazer primeira otimização (pausar anúncios ruins, escalar bons)
4. **Dia 14:** Criar lookalike audiences (se tiver 50+ conversões)
5. **Dia 30:** Análise completa e planejamento próximo mês

---

## Suporte

Se tiver dúvidas durante a criação:
- Meta Ads Help Center: https://www.facebook.com/business/help
- Suporte do Meta: Dentro do Ads Manager → Ajuda → Falar com suporte

---

**Boa sorte com sua campanha! 🚀**
