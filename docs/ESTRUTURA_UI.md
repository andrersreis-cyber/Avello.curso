# Estrutura da UI - Área de Membros

## Análise do Sistema Original: segredosdon8n.com

---

## 1. HEADER

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 Área de Membros                                             │
│  [💡] [🌙] [Comunidade] [Loja] [Afiliados] [Suporte] [Sair]    │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes:
- **Logo**: Ícone de robô/IA
- **Título**: "Área de Membros"
- **Navegação**:
  - 💡 Toggle tema (claro/escuro)
  - 🌙 Dark mode indicator
  - Comunidade (link externo)
  - Loja (link externo)
  - Afiliados (programa de afiliados)
  - Suporte (ajuda/FAQ)
  - Sair (logout)

---

## 2. GRID DE MÓDULOS

### Layout: 4 colunas × 3 linhas

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 📦 Pack      │ 💬 Pack      │ 🚀 +58       │ 🎨 3500      │
│ +2000        │ +3500        │ Super        │ Prompts      │
│ Templates    │ Prompts      │ Fluxos       │ Midjourney   │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 🎓 Curso     │ 🤖 +3 Mil    │ 🛠️ +14 Mil   │ ⚙️ +350      │
│ de N8N       │ templates    │ ferramentas  │ Self-Hosted  │
│              │ Typebot      │ IA           │ Softwares    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 🆓 +280      │ ⚡ +30 Saas  │ 🎁 Ferrament │ 🌟 +8 Bônus  │
│ Ferramentas  │ Softwares    │ Parceiras    │ exclusivos   │
│ Gratuitas    │ White Label  │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Estrutura do Card de Módulo:
```tsx
interface ModuleCard {
  icon: string;        // Emoji ou URL da imagem
  title: string;       // "Pack +2000 Templates"
  subtitle: string;    // "Fluxos prontos para usar"
  isSelected: boolean; // Destaque azul quando selecionado
}
```

### Lista Completa de Módulos:

| # | Ícone | Título | Subtítulo |
|---|-------|--------|-----------|
| 1 | 📦 | Pack +2000 Templates | Fluxos prontos para usar |
| 2 | 💬 | Pack +3500 Prompts | Para ChatGPT |
| 3 | 🚀 | +58 Super Fluxos | Super Agentes de IA |
| 4 | 🎨 | 3500 Prompts Midjourney | Prompts criativos |
| 5 | 🎓 | Curso de N8N | Aprenda do zero |
| 6 | 🤖 | +3 Mil templates Typebot | Chatbots prontos |
| 7 | 🛠️ | +14 Mil ferramentas IA | Diretório completo |
| 8 | ⚙️ | +350 Self-Hosted Softwares | Para instalar e usar |
| 9 | 🆓 | + 280 Ferramentas Gratuitas | Sem custo |
| 10 | ⚡ | +30 Saas \| Softwares | White Label |
| 11 | 🎁 | Ferramentas Parceiras | Ferramentas com desconto |
| 12 | 🌟 | +8 Bônus exclusivos | Conteúdo extra |

---

## 3. ÁREA DE CONTEÚDO

### Layout:
```
┌─────────────────────────────────────────────────────────────────┐
│  Título do Módulo                                               │
│  Descrição do módulo selecionado                               │
│                                                                 │
│  🔍 [Buscar por nome, descrição ou funcionalidades...]  [⊞][≡] │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Item 1    │ │   Item 2    │ │   Item 3    │               │
│  │             │ │             │ │             │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Item 4    │ │   Item 5    │ │   Item 6    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes:
- **Título**: Nome do módulo (h3)
- **Descrição**: Texto explicativo
- **Barra de Busca**: Input com placeholder contextual
- **Toggle de Visualização**: Grid (⊞) ou Lista (≡)
- **Cards de Itens**: Layout responsivo em grid

---

## 4. TIPOS DE CONTEÚDO E SEUS CARDS

### 4.1 Cards de Fluxos/Templates (n8n)

```
┌─────────────────────────────────────┐
│  🚀                                 │
│  ┌────────────┐                     │
│  │ Super Fluxo│ (badge roxo)        │
│  └────────────┘                     │
│                                     │
│  Scrape YouTube e Resumo            │
│  Automático                         │
│                                     │
└─────────────────────────────────────┘
```

**Ao clicar → Modal de Detalhes:**

```
┌─────────────────────────────────────────────────────────────────┐
│  🚀 Scrape YouTube e Resumo Automático              [X] Close   │
│  ┌─────────────┐                                                │
│  │Super Agente │                                                │
│  └─────────────┘                                                │
│                                                                 │
│  🆔 Identificação                                               │
│  ┌──────┐                                                       │
│  │  46  │                                                       │
│  └──────┘                                                       │
│                                                                 │
│  📝 Descrição                                                   │
│  Este fluxo usa a API Apify para extrair transcrições...       │
│                                                                 │
│  ⚡ Funcionalidades                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Integração com Apify: busca a execução do ator...     │   │
│  │ • Definição de entrada: recebe a URL do vídeo...        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────┐                                              │
│  │resumo de vídeo│ (tag rosa)                                   │
│  └───────────────┘                                              │
│                                                                 │
│  🛠️ Ferramentas Utilizadas                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Apify: Serviço de automação...                        │   │
│  │ • OpenAI Chat Model: Modelo de linguagem...             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🔧 Workflow de Automação                                       │
│  ┌─────────────────────┬─────────────────────┐                 │
│  │ Visualizar Workflow │ Ver Código JSON     │                 │
│  └─────────────────────┴─────────────────────┘                 │
│                                                                 │
│  [📋 Copiar Código N8N]  [🚀 Acessar Super Fluxo Completo]     │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Cards de Categorias (Prompts)

```
┌─────────────────────────────────────┐
│  💡                                 │
│                                     │
│  Career                             │
│                                     │
│  Career                             │
│  Coleção de prompts sobre Career.   │
│                                     │
└─────────────────────────────────────┘
```

**Ao clicar → Lista de Prompts da categoria**

### 4.3 Cards de Aulas (Curso)

```
┌─────────────────────────────────────┐
│                                     │
│  Aula 01 - Instalando VPS           │
│                                     │
│  ┌────────────────┐                 │
│  │ 📚 Infraestrutura │              │
│  └────────────────┘                 │
│                                     │
└─────────────────────────────────────┘
```

**Ao clicar → Player de Vídeo**

---

## 5. PALETA DE CORES (Dark Theme)

| Elemento | Cor | Hex |
|----------|-----|-----|
| Background | Azul muito escuro | `#0a0a1a` |
| Card Background | Cinza escuro | `#1a1a2e` |
| Card Hover | Cinza médio | `#252540` |
| Primária (seleção) | Azul | `#3B82F6` |
| Sucesso | Verde | `#22C55E` |
| Badge Super Agente | Roxo | `#8B5CF6` |
| Badge Tag | Rosa | `#EC4899` |
| Texto principal | Branco | `#FFFFFF` |
| Texto secundário | Cinza | `#9CA3AF` |
| Card Funcionalidades | Verde escuro | `#134E4A` |
| Card Ferramentas | Azul escuro | `#1E3A5F` |

---

## 6. COMPONENTES REUTILIZÁVEIS

### Lista de Componentes a Criar:

```
/components
├── /layout
│   ├── Header.tsx
│   ├── Sidebar.tsx (módulos)
│   └── Footer.tsx
├── /modules
│   ├── ModuleGrid.tsx
│   └── ModuleCard.tsx
├── /content
│   ├── ContentArea.tsx
│   ├── SearchBar.tsx
│   └── ViewToggle.tsx
├── /cards
│   ├── FluxoCard.tsx
│   ├── PromptCategoryCard.tsx
│   ├── AulaCard.tsx
│   └── ToolCard.tsx
├── /modals
│   ├── FluxoDetailModal.tsx
│   ├── PromptListModal.tsx
│   └── VideoPlayerModal.tsx
├── /ui
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Tabs.tsx
│   └── Card.tsx
└── /icons
    └── ModuleIcons.tsx
```

---

## 7. FUNCIONALIDADES

### 7.1 Busca
- Busca por nome, descrição, funcionalidades
- Filtro contextual por módulo
- Highlight nos resultados

### 7.2 Visualização
- Grid view (padrão): 2-3 colunas
- List view: 1 coluna com mais detalhes

### 7.3 Interações
- Click no módulo → Carrega conteúdo
- Click no item → Abre modal/página de detalhe
- Copiar código → Clipboard API
- Download → File download

### 7.4 Responsividade
- Desktop: Grid 4 colunas de módulos, 3 de itens
- Tablet: Grid 2 colunas
- Mobile: Grid 1 coluna, módulos em scroll horizontal

---

## 8. ESTRUTURA DO BANCO (Supabase)

### Mapeamento UI → Banco:

| UI | Tabela | Campos |
|----|--------|--------|
| Módulo | `modules` | id, name, icon, description, order_index |
| Item/Lição | `lessons` | id, module_id, title, description, content, attachment_url |
| Categoria | (tag no content) | JSON field ou tabela separada |

---

## 9. PRÓXIMOS PASSOS

1. [ ] Criar componentes base (`/components/ui`)
2. [ ] Implementar layout principal
3. [ ] Criar grid de módulos
4. [ ] Implementar área de conteúdo
5. [ ] Criar modais de detalhe
6. [ ] Implementar busca
7. [ ] Conectar com Supabase
8. [ ] Adicionar autenticação
9. [ ] Deploy

---

*Documento gerado em: 2026-01-29*
