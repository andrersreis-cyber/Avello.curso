# Guia: Teste do Pixel da Meta (Eventos e Duplicação)

Este guia ajuda a verificar se todos os eventos estão sendo marcados corretamente e se não há duplicação.

---

## 1. Ferramentas Necessárias

1. **Meta Pixel Helper** (extensão Chrome): [Chrome Web Store](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoediolfilbgdomgpfkj)
2. **Acesso ao Gerenciador de Eventos**: [business.facebook.com](https://business.facebook.com) → Pixels → Seu Pixel → Testar eventos

---

## 2. Eventos Implementados (Referência)

| Evento | Nome no Meta (PT-BR) | Onde dispara | Parâmetros principais |
|--------|----------------------|---------------|------------------------|
| **PageView** | PageView / Evento personalizado | Todas as páginas | — |
| **Lead** | Lead | Hero, Social Proof, cadastro Google, "Começar Grátis" | content_name, content_category |
| **Subscribe** | Assinar | Cadastro completo (email/senha) | content_name, status |
| **InitiateCheckout** | Iniciar Finalização da Compra | **Loja** — "Assinar Agora" ou "Comprar" | content_name, content_ids, value, currency |
| **Purchase** | Comprar | **Loja/sucesso** (após pagamento Stripe) | value, currency, content_name |

**Importante:** "Assinar" (Subscribe) é do cadastro. "Iniciar Finalização da Compra" (InitiateCheckout) é da Loja. São eventos diferentes.

---

## 3. Como Testar no Gerenciador de Eventos

### Passo 1: Ativar o Modo de Teste
1. Acesse **Gerenciador de Eventos** no Meta Business Suite
2. Selecione seu Pixel
3. Clique em **"Testar eventos"** no menu lateral
4. Informe a URL do seu site (ex: `https://seu-dominio.com` ou `http://localhost:3000` para testes locais)
5. Clique em **"Abrir site"** para iniciar a sessão de teste

### Passo 2: Navegar pelo Site
Com a sessão de teste ativa, navegue pelo site e execute as ações abaixo. Os eventos aparecerão em tempo quase real no painel.

---

## 4. Checklist de Eventos (o que deve aparecer)

### ✅ PageView
- **Esperado:** 1 evento por carregamento de página
- **Teste:** Abra a landing → 1 PageView. Navegue para /loja → mais 1 PageView
- **Duplicação?** Se aparecer 2 PageView na mesma página (ex: ao carregar /landing), há duplicação

### ✅ Lead
- **Esperado:** 1 evento por clique em "Começar Grátis" ou ao iniciar cadastro Google
- **Teste:** Clique em 1 botão "Começar Grátis" → 1 Lead. Clique em outro → mais 1 Lead (se outro contexto)
- **Duplicação?** Se ao clicar **uma vez** aparecerem 2 Lead, há duplicação

### ✅ Subscribe
- **Esperado:** 1 evento ao completar cadastro com email/senha
- **Teste:** Cadastre um novo usuário → 1 Subscribe
- **Duplicação?** Se ao enviar o formulário 1 vez aparecerem 2 Subscribe, há duplicação

### ✅ InitiateCheckout

**Nome no Meta (PT-BR):** pode aparecer como **"Iniciar Finalização da Compra"**.

- **Esperado:** 1 evento por clique em "Assinar Agora" ou "Comprar" na página da **Loja**
- **Pré-requisito:** você precisa estar **logado** (a Loja exige autenticação)

**Passo a passo:**
1. Faça login no site
2. Acesse a página **Loja** (`/loja`) pelo menu ou link "Fazer Upgrade"
3. Com "Testar eventos" ativo, clique em **"Assinar Agora"** (plano principal) ou **"Comprar"** (outro produto)
4. O site redireciona para o Stripe em seguida — o evento deve aparecer no painel antes do redirect

**Se não aparecer:**
- Confirme que está em **produção** (ou ngrok) — localhost pode não enviar eventos
- Use o **Meta Pixel Helper** (extensão) na aba da Loja antes de clicar — ele mostra os eventos disparados

### ✅ Purchase

**Nome no Meta (PT-BR):** pode aparecer como **"Comprar"**.

- **Esperado:** 1 evento por compra concluída na página de sucesso
- **Pré-requisito:** concluir o pagamento no checkout do Stripe

**Passo a passo:**
1. Na Loja, clique em "Assinar Agora" (ou "Comprar")
2. No Stripe, use um **cartão de teste**: `4242 4242 4242 4242`
   - Validade: qualquer data futura (ex: 12/30)
   - CVC: qualquer 3 dígitos
   - Nome e CEP: preencha conforme solicitado
3. Conclua o pagamento no Stripe
4. Você será redirecionado para `/loja/sucesso` — o evento **Purchase** é disparado nessa página

**Se não aparecer:**
- O Purchase só dispara **após confirmação** do Stripe (página de sucesso)
- Teste em **produção** — em localhost a API de verificação pode falhar
- Verifique no console do navegador se há erro ao chamar `/api/stripe/verify-session`

**Duplicação?** Se ao receber a página de sucesso 1 vez aparecerem 2 Purchase, há duplicação

---

## 5. Como Identificar Duplicação

| Sintoma | Possível causa | O que revisar |
|---------|----------------|---------------|
| 2 PageView ao carregar 1 página | Pixel carregado 2x ou `PageView` chamado em mais de um lugar | `facebook-pixel.tsx` e `layout.tsx` |
| 2 Lead ao clicar 1 vez | Evento em `onClick` e em outro handler (ex: `onSubmit`) | Componentes que disparam Lead |
| 2 Subscribe ao cadastrar | `fbq('track','Subscribe')` chamado 2x no fluxo | `app/cadastro/page.tsx` |
| 2 InitiateCheckout | Handler chamado 2x ou botão dentro de outro clicável | `app/loja/page.tsx` |
| 2 Purchase | `verifyAndTrack` rodando 2x (ex: `useEffect` com dependências incorretas) | `app/loja/sucesso/page.tsx` |

---

## 6. SubscribedButtonClick (automático)

O Meta pode mostrar **SubscribedButtonClick** como "Conectado automaticamente". Esse evento é inferido pelo Pixel e não vem do nosso código.

- **Não é duplicação** de Lead/Subscribe
- Pode ser ignorado para análise de eventos manuais
- Se quiser evitar: em configurações do Pixel, desative "Configuração automática de eventos" (pode reduzir outros recursos automáticos)

---

## 7. Verificar Valor e Moeda (Purchase)

No Gerenciador de Eventos, ao expandir um evento **Purchase**, confira:
- `value`: número > 0 (ex: 39 para R$ 39,00)
- `currency`: `BRL` (sem símbolos)

Se estiver incorreto ou vazio, revise `app/loja/sucesso/page.tsx` e `app/api/stripe/verify-session/route.ts`.

---

## 8. Teste Local (localhost) vs Produção

### Localhost (http://localhost:3000)
- **"Testar eventos" no Meta:** Aceita `http://localhost:3000` — ao informar a URL e clicar em "Abrir site", o Meta conecta à sessão do seu navegador no localhost.
- **Meta Pixel Helper:** Funciona em qualquer URL, incluindo localhost.
- **Requisitos:** Servidor rodando localmente + `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` no `.env.local`.

### Produção
- Garanta que o deploy está na branch correta.
- Confirme que `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` está definido nas variáveis de ambiente do hosting (Netlify, etc.).

---

## 9. Fluxo Sugerido de Teste

1. Ative "Testar eventos" e abra o site
2. Abra a **landing** → verifique 1 PageView (+ possíveis Lead se clicar CTAs)
3. Clique em **"Começar Grátis"** → verifique 1 Lead
4. Complete o **cadastro** (email/senha) → verifique 1 Subscribe
5. Acesse a **loja** → verifique 1 PageView
6. Clique em **"Assinar Agora"** → verifique 1 InitiateCheckout
7. Conclua uma **compra de teste** → verifique 1 Purchase com value e currency

Em cada passo, confira se o evento aparece **apenas uma vez** por ação.
