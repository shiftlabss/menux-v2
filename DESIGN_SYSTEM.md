# Menux Design System — Especificação Extraída

> Documento gerado a partir de varredura completa do codebase Menux v3.
> Reflete o **estado atual** do projeto, não um sistema idealizado.
> Última atualização: Fevereiro 2026

---

## Sumário

1. [Fundamentos](#1-fundamentos)
   - 1.1 Tipografia
   - 1.2 Cores
   - 1.3 Espaçamentos
   - 1.4 Border Radius
   - 1.5 Sombras e Elevações
   - 1.6 Z-Index
   - 1.7 Transições
   - 1.8 Estados Visuais
2. [Tokens](#2-tokens)
   - 2.1 Tokens Fundacionais
   - 2.2 Tokens Semânticos
3. [Componentes](#3-componentes)
   - 3.1 Componentes Base (Atômicos)
   - 3.2 Componentes Compostos (Módulos)
   - 3.3 Componentes de Feature
4. [Padrões de Uso](#4-padrões-de-uso)
5. [Arquitetura do Design System](#5-arquitetura-do-design-system)
6. [Avaliação de Aderência](#6-avaliação-de-aderência)
7. [Recomendações para Evolução](#7-recomendações-para-evolução)

---

## 1. Fundamentos

### 1.1 Tipografia

**Famílias Tipográficas**

| Família | Papel | Ocorrências | Uso Real |
|---------|-------|-------------|----------|
| `Bricolage Grotesque` | Display / Heading / UI | 82 | Títulos, botões, labels, preços, nomes |
| `Geist` | Body / Complementar | 33 | Descrições, hints, placeholders, admin panel body |

A família principal é carregada via `<link>` no `index.html`. Geist aparece como fallback para textos secundários e no painel admin.

**Escala de Tamanhos**

| Token Sugerido | Valor | Ocorrências | Uso Real |
|----------------|-------|-------------|----------|
| `text-xs` | 10px | 2 | Tags muito pequenas |
| `text-sm` | 11px | 1 | Hints, timestamps |
| `text-caption` | 12px | 11 | Captions, helper text, badge text |
| `text-label` | 13px | 12 | Section titles, admin labels, subtitles |
| `text-body` | 14px | **42** | Body text (mais frequente) |
| `text-nav` | 15px | 7 | Tabs, navigation items |
| `text-action` | 16px | **39** | Botões, inputs, labels de formulário |
| `text-subtitle` | 18px | 3 | Subtítulos de modais |
| `text-heading` | 20px | 11 | H2, nomes de restaurante, títulos de modais |
| `text-title` | 24px | 6 | Títulos de perfil, nomes grandes |
| `text-hero` | 28px | 1 | Título principal do Studio |
| `text-display` | 32px | 1 | Código de pedido |
| `text-jumbo` | 48px | 1 | Número do pedido (code modal) |

> ⚠️ **Estado atual**: 15 valores únicos. 6 deles são usados menos de 3 vezes. A escala real efetiva é `12/13/14/16/20/24`.

**Pesos**

| Peso | Ocorrências | Uso Real |
|------|-------------|----------|
| 400 (Regular) | 3 | Placeholders, texto leve |
| **500 (Medium)** | **63** | Padrão para quase tudo |
| **600 (SemiBold)** | **26** | Títulos, botões primários, labels |
| 700 (Bold) | 3 | Título do Studio, headings fortes |

> ✅ **Consistente**: Projeto usa basicamente 500 e 600. O padrão visual é 500 para corpo, 600 para ênfase.

**Hierarquia Tipográfica Implícita**

| Nível | Elemento | Font | Tamanho | Peso | Exemplo |
|-------|----------|------|---------|------|---------|
| H1 | `h1` | Bricolage | 24px | Medium (500) | "Bem-vindo ao Menux" |
| H2 | `.restaurant-name`, `.pd-title` | Bricolage | 20px | SemiBold (600) | "Menux Restaurante" |
| H3 | `.section-label`, `.rec-title` | Bricolage | 15-16px | SemiBold (600) | "Entradas" |
| Body | `.item-desc`, `.welcome-subtitle` | Bricolage | 14px | Medium (500) | Descrições de produto |
| Caption | `.helper-text`, `.profile-since` | Geist/Bricolage | 12-13px | 500 | Textos auxiliares |
| Micro | `.admin-hint-text` | Geist | 11px | 400 | Hints do admin |

---

### 1.2 Cores

**Paleta Primitiva (extraída do CSS)**

| Cor | Hex | Ocorrências | Uso Predominante |
|-----|-----|-------------|------------------|
| Preto | `#000000` / `#000` | 15 | Texto primário, fundos de botões |
| Branco | `#FFFFFF` / `#FFF` | 13 | Fundos, texto em botão escuro |
| Cinza 50 | `#FAFAFA` | 2 | Fundos leves (admin items) |
| Cinza 100 | `#F5F5F5` | **20** | Background de inputs, cards, pills |
| Cinza 150 | `#F0F0F0` | 8 | Bordas leves, dividers |
| Cinza 200 | `#E5E5E5` | 15 | Bordas de seções, separadores |
| Cinza 300 | `#D9D9D9` | 7 | Avatar placeholder, bordes secundárias |
| Cinza 400 | `#C4C4C4` | 1 | Botão desabilitado |
| Cinza 500 | `#A3A3A3` | 4 | Texto placeholder |
| Cinza 600 | `#8A8A8A` | 9 | Texto secundário (admin) |
| Cinza 700 | `#7E7E7E` | 15 | Texto secundário principal |
| Cinza 800 | `#666666` / `#666` | 9 | Texto terciário |
| Cinza 900 | `#1A1A1A` | 1 | Título do Studio |
| Azul Accent | `#0085FF` | var | Links, accent, ações secundárias |
| Roxo Brand | `#7A55FD` | 3 | Cor de marca (brandColor default) |
| Verde Sucesso | `#1DB954` | — | Toast success |
| Vermelho Erro | `#E53935` | — | Toast error |
| Vermelho Danger | `#FF4444` | 2 | Texto "excluir conta", danger zone |
| Vermelho Light | `#FFECEC` | 1 | Background do botão logout |
| Laranja Warning | `#FB8C00` | — | Toast warning |
| Azul Info | `#0A84FF` | — | Toast info (dark mode), accent dark |

> ⚠️ **Estado atual**: 40+ valores hex únicos. Existem ao menos **8 tons de cinza** que diferem em 1-3 passos (#F5F5F5, #F4F4F4, #F3F3F3, #F2F2F2, #F0F0F0). Existem **3 vermelhos** diferentes (#FF4D4D, #FF4444, #FF3B30). A maioria das cores é hardcoded — apenas 5 usam CSS variables.

**CSS Variables Definidas (estado atual)**

```css
:root {
  --primary-black: #000000;
  --secondary-gray: #7E7E7E;
  --bg-light: #F5F5F5;
  --white: #FFFFFF;
  --accent-blue: #0085FF;
  --surface: #FFFFFF;
  --surface-secondary: #F5F5F5;
  --border: #E5E5E5;
  --text-primary: #000000;
  --text-secondary: #7E7E7E;
}
```

> ⚠️ As variables existem mas **quase nenhum componente as consome**. 99% dos valores de cor são hex literais no CSS.

---

### 1.3 Espaçamentos

**Grid Base**: O projeto segue **implicitamente** um grid de 4px, mas com desvios.

**Gap (espaço entre elementos)**

| Valor | Ocorrências | Alinhamento 4px? |
|-------|-------------|:---:|
| 2px | 1 | ½ |
| 4px | 5 | ✅ |
| 6px | 7 | ⚠️ |
| 8px | 14 | ✅ |
| 10px | 3 | ⚠️ |
| 12px | **19** | ✅ |
| 13px | 1 | ❌ |
| 16px | 9 | ✅ |
| 20px | 2 | ✅ |
| 24px | 2 | ✅ |
| 32px | 3 | ✅ |

> ⚠️ Valores predominantes no grid de 4px (4, 8, 12, 16, 24, 32), mas com outliers em 6px, 10px e 13px.

**Padding Recorrente**: 12px, 16px, 24px, 32px (padrão dominante).

**Margin Bottom Recorrente**: 8px, 12px, 16px, 24px, 32px, 40px.

---

### 1.4 Border Radius

| Token Sugerido | Valor | Ocorrências | Uso Real |
|----------------|-------|-------------|----------|
| `radius-sm` | 6px | 2 | Thumbnails pequenos |
| `radius-md` | 8px | 3 | Admin buttons, tags |
| `radius-lg` | 12px | 12 | Inputs, cards, containers |
| `radius-xl` | 15-16px | 16 | Seções, pills de subcategoria |
| `radius-2xl` | 20-24px | 5 | Modais, containers grandes |
| `radius-full` | 100px | **35** | Botões pill, toasts, badges |
| `radius-circle` | 50% | 20 | Avatares, ícones circulares |

> ⚠️ **Estado atual**: 17 valores únicos. Cluster significativo entre 10-20px (10, 12, 15, 16, 18, 20, 24, 25) que deveria ser consolidado em 3-4 tokens.

---

### 1.5 Sombras e Elevações

| Token Sugerido | Valor | Uso Real |
|----------------|-------|----------|
| `shadow-xs` | `0 2px 4px rgba(0,0,0,0.1)` | Camera icon overlay, card light |
| `shadow-sm` | `0 4px 12px rgba(0,0,0,0.1)` | Toast, floating elements |
| `shadow-md` | `0 4px 20px rgba(0,0,0,0.1)` | Studio form container |
| `shadow-lg` | `0 20px 50px rgba(0,0,0,0.3)` | Admin modal overlay |
| `shadow-tab` | `0 2px 8px rgba(0,0,0,0.1)` | Tab ativa no admin |

> ⚠️ **Estado atual**: 14 sombras únicas. Quase todas são variações sutis umas das outras. Os `blur` variam (4px, 8px, 10px, 12px, 20px, 50px) e os `alpha` variam (0.03, 0.05, 0.1, 0.15, 0.2, 0.3) sem padrão.

---

### 1.6 Z-Index

| Token Sugerido | Valor | Uso Real |
|----------------|-------|----------|
| `z-base` | 1-2 | Elementos posicionados inline |
| `z-above` | 5-10 | Headers, navigations |
| `z-sticky` | 100 | Category nav fixa |
| `z-floating` | 500 | Floating tabbar, cart button |
| `z-modal` | 1000-2000 | Modais (product detail, profile, maestro) |
| `z-overlay` | 3000-9999 | Toast, overlays blocking |
| `z-admin` | 10000 | Studio/Admin (precisa estar acima de tudo) |

> ⚠️ **Estado atual**: 11 valores sem escala lógica. Gaps enormes (2 → 5 → 10 → 100 → 500 → 1000 → 2000 → 3000 → 9999 → 10000). Requer sistema de camadas.

---

### 1.7 Transições

**Duração**: Todas as transições usam **0.2s** — este é o único valor de duração no projeto.

**Easing**:
- `ease` — 4 ocorrências
- sem easing (linear implícito) — 6 ocorrências
- `cubic-bezier(0.4, 0, 0.2, 1)` — 1 (Material Design standard)
- `cubic-bezier(0.2, 0, 0, 1)` — 1

**Animações (Framer Motion)**:
- Modal slide-up: `y: "100%" → "0%"` com `ease: "easeOut", duration: 0.3`
- Modal slide-right: `x: "100%" → "0%"` com spring physics
- Fade: `opacity: 0 → 1` com `duration: 0.3`
- Scale: `scale: 0.8 → 1` com `type: "spring"`
- Tap feedback: `whileTap={{ scale: 0.96 }}`

> ✅ **Consistente**: Duração uniforme em 0.2s. Framer Motion com padrões previsíveis.

---

### 1.8 Estados Visuais

**Botão Primário (`btn-primary`)**

| Estado | Propriedade | Valor |
|--------|-------------|-------|
| Default | background | `#000000` (black) |
| Default | color | `#FFFFFF` (white) |
| Tap | transform | `scale(0.96)` via Framer Motion |
| Disabled | background | `#C4C4C4` |
| Disabled | color | `#7A7A7A` |
| Disabled | cursor | `not-allowed` |

**Input (`phone-input`, `profile-input`)**

| Estado | Propriedade | Valor |
|--------|-------------|-------|
| Default | background | `#F5F5F5` |
| Default | border | `none` |
| Readonly | opacity | `0.6` |
| Readonly | cursor | `not-allowed` |
| Focus | — | Nenhum estilo de focus definido |

> ⚠️ **Anti-padrão**: Nenhum input tem estilo de `:focus` definido. Problema de acessibilidade.

**Category Tab (`category-tab`)**

| Estado | Propriedade | Valor |
|--------|-------------|-------|
| Default | color | `#8A8A8A` |
| Default | font-weight | 500 |
| Active | color | `#000000` |
| Active | font-weight | 600 |
| Active | border-bottom | `3px solid #000` |

**Filter Pill (`filter-pill`)**

| Estado | Propriedade | Valor |
|--------|-------------|-------|
| Default | background | `transparent` |
| Default | border | `1px solid #E5E5E5` |
| Default | color | `#8A8A8A` |
| Active | background | `#000000` |
| Active | border | `1px solid #000000` |
| Active | color | `#FFFFFF` |

**Status Badge (`status-badge`)**

| Variante | Background | Color | Borda |
|----------|------------|-------|-------|
| `waiting` | `#FFF8E1` | `#F57F17` | — |
| `annotated` | `#E8F5E9` | `#2E7D32` | — |
| `completed` | `#000000` | `#FFFFFF` | — |

---

## 2. Tokens

### 2.1 Tokens Fundacionais

Valores primitivos que não carregam semântica.

```
/* Cores Primitivas */
--color-black: #000000
--color-white: #FFFFFF
--color-gray-50: #FAFAFA
--color-gray-100: #F5F5F5
--color-gray-200: #E5E5E5
--color-gray-300: #D9D9D9
--color-gray-500: #A3A3A3
--color-gray-600: #8A8A8A
--color-gray-700: #7E7E7E
--color-gray-800: #666666
--color-blue-500: #0085FF
--color-purple-500: #7A55FD
--color-green-500: #1DB954
--color-red-500: #E53935
--color-red-400: #FF4444
--color-orange-500: #FB8C00

/* Tipografia */
--font-display: 'Bricolage Grotesque', sans-serif
--font-body: 'Geist', sans-serif
--font-size-xs: 11px
--font-size-sm: 12px
--font-size-md: 14px
--font-size-lg: 16px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 32px
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

/* Espaçamento */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-10: 40px

/* Radius */
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 100px
--radius-circle: 50%

/* Sombras */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.1)
--shadow-md: 0 4px 12px rgba(0,0,0,0.1)
--shadow-lg: 0 20px 50px rgba(0,0,0,0.3)

/* Duração */
--duration-fast: 0.2s
--duration-normal: 0.3s
--ease-default: ease
```

### 2.2 Tokens Semânticos

Valores que expressam intenção de uso.

```
/* Texto */
--text-primary: var(--color-black)
--text-secondary: var(--color-gray-700)
--text-tertiary: var(--color-gray-600)
--text-placeholder: var(--color-gray-500)
--text-disabled: var(--color-gray-500)
--text-danger: var(--color-red-400)
--text-inverse: var(--color-white)

/* Superfícies */
--surface-primary: var(--color-white)
--surface-secondary: var(--color-gray-100)
--surface-tertiary: var(--color-gray-50)
--surface-inverse: var(--color-black)
--surface-danger-light: #FFECEC
--surface-warning-light: #FFF8E1

/* Bordas */
--border-default: var(--color-gray-200)
--border-light: var(--color-gray-100)
--border-focus: var(--color-blue-500)
--border-danger: var(--color-red-400)

/* Interação */
--button-primary-bg: var(--color-black)
--button-primary-text: var(--color-white)
--button-disabled-bg: #C4C4C4
--button-disabled-text: #7A7A7A
--button-danger-bg: var(--color-red-400)
--button-danger-text: var(--color-white)

/* Feedback */
--toast-success: var(--color-green-500)
--toast-error: var(--color-red-500)
--toast-warning: var(--color-orange-500)
--toast-info: var(--color-blue-500)

/* Overlay */
--overlay-light: rgba(0,0,0,0.4)
--overlay-dark: rgba(0,0,0,0.8)
```

> ⚠️ Estes tokens **não existem no projeto atual**. São derivados dos valores encontrados e propostos para implementação.

---

## 3. Componentes

### 3.1 Componentes Base (Atômicos)

#### Button

| Variante | Classe CSS | Background | Texto | Altura | Radius | Uso |
|----------|-----------|------------|-------|--------|--------|-----|
| Primary | `.btn-primary` | black | white | 59px | 100px | CTAs principais ("Abrir cardápio", "Continuar") |
| Secondary | `.btn-secondary` | white | black | 59px | 100px | Ações alternativas ("Criar conta") |
| Outline | `.btn-outline` | transparent | black | — | 100px | Ações terciárias |
| Small Pill | `.btn-profile-short` | black | white | 29px | 100px | Header actions ("Entrar", "Meu perfil") |
| Order CTA | `.btn-order-now` | black | white | 29px | 100px | "Adicionar" em featured cards |
| Active Orders | `.btn-my-orders-active` | #F5F5F5 | black | 29px | 100px | "Pedidos" no header |
| Add to Order | `.btn-add-order` | black | white | 59px | 100px | "Adicionar ao pedido" |
| Finish Order | `.btn-finish-order` | black | white | 59px | 100px | "Finalizar pedido" |
| Save | `.btn-save-profile` | #C4C4C4 / black | gray / white | 59px | 100px | Estado ativo quando há mudanças |
| Logout | `.btn-logout-profile` | #FFECEC | #FF4444 | 59px | 100px | Ação destrutiva leve |
| Delete | `.btn-delete-confirm` | #FF4444 | white | — | 12px | Ação destrutiva final |
| Cancel | `.btn-delete-cancel` | #F5F5F5 | black | — | 12px | Cancelar ação destrutiva |
| Reorder | `.btn-reorder` | transparent | black | — | — | "Pedir novamente" |

**Props relevantes**: Nenhuma — todos são classes CSS puras. Interatividade via `whileTap={{ scale: 0.96 }}` no Framer Motion.

**Dependência de tokens**: `--button-primary-bg`, `--button-primary-text`, `--radius-full`, `--font-size-lg`, `--font-weight-medium`.

> ⚠️ **Anti-padrão**: Existem **12+ variantes** de botão sem um componente `<Button>` reutilizável. Cada uso é um `<button className="...">` ad hoc.

---

#### Input

| Variante | Classe CSS | Background | Altura | Radius | Uso |
|----------|-----------|------------|--------|--------|-----|
| Phone | `.phone-input` | #F5F5F5 | 59px | 15px | Login (telefone) |
| OTP | `.otp-input` | #F5F5F5 | 64px | 15px | 4 dígitos de verificação |
| Profile | `.profile-input` | #F5F5F5 | 56px | 12px | Nome/telefone no perfil |
| DDI | `.profile-input-ddi` | #F5F5F5 | 56px | 12px | "+55" readonly |
| Admin | `.admin-field input` | white | — | 12px | Formulários do Studio |
| Textarea | `.pd-obs-input` | #F5F5F5 | — | 12px | Observações do pedido |
| Chat | `.maestro-input-field` | transparent | — | — | Input do Maestro chat |

**Estados suportados**: Default, Readonly (opacity 0.6), Placeholder.

> ⚠️ **Anti-padrão**: Nenhum input tem estilo `:focus`. Alturas inconsistentes (56px, 59px, 64px).

---

#### Toast

| Variante | Cor | Ícone | Implementação |
|----------|-----|-------|---------------|
| Success | `#1DB954` | Checkmark (SVG) | `showToast("msg")` ou `showToast("msg", 'success')` |
| Error | `#E53935` | X (SVG) | `showToast("msg", 'error')` |
| Warning | `#FB8C00` | ! (SVG) | `showToast("msg", 'warning')` |
| Info | `#0085FF` | i (SVG) | `showToast("msg", 'info')` |

**Props**: `showToast(message: string, variant?: string, duration?: number)`.

**Componente**: `ToastContext.jsx` — via `useToast()` hook.

---

#### Quantity Selector

| Variante | Classe CSS | Contexto |
|----------|-----------|----------|
| Product Detail | `.pd-quantity-selector` | Modal de detalhe do produto |
| Order Item | `.order-item-qty-control` | Modal de pedido |
| Recommendation | `.rec-qty-controls` | Recomendações no pedido |
| Pizza | (inline) | Modal de pizza |
| Wine | `.wine-qty-selector` | Modal de vinho |

> ⚠️ **Anti-padrão**: 5 implementações do mesmo padrão visual, com classes e estilos ligeiramente diferentes. Deveria ser 1 componente `<QuantitySelector>`.

---

#### Avatar

| Variante | Classe CSS | Tamanho | Uso |
|----------|-----------|---------|-----|
| Header | `.profile-trigger` | ~32px | Miniatura no header |
| Profile | `.profile-avatar` | 100px | Tela de perfil |
| Restaurant | `.restaurant-avatar` | 60px | Avatar do restaurante |
| Onboarding | `.avatar-circle` | ~24px | Badge de "Entrar como" |

> ⚠️ **Anti-padrão**: 4 implementações sem componente `<Avatar>` compartilhado.

---

### 3.2 Componentes Compostos (Módulos)

#### Modal Overlay

Padrão recorrente em 8 componentes:

| Componente | Classe CSS | Animação | Z-Index |
|------------|-----------|----------|---------|
| ProductDetail | `.product-modal-overlay` | slide-up (y) | 2000 |
| ProductPizza | `.product-modal-overlay` | slide-up (y) | 2000 |
| ProductWine | `.wine-modal-overlay` | slide-up (y) | 2000 |
| OrderModal | `.product-modal-overlay` | slide-up (y) | 2000 |
| ProfileModal | `.profile-modal-overlay` | slide-up (y) | 2000 |
| MaestroModal | `.maestro-modal-overlay` | fade | 2000 |
| MyOrdersModal | `.my-orders-modal` | slide-right (x) | — |
| DeleteModal | `.delete-modal-overlay` | fade + scale | 3000 |

**Padrão**: `position: fixed; inset: 0; z-index: 2000+`. Animação via Framer Motion.

> ⚠️ **Anti-padrão**: Nenhum componente `<Modal>` base. O padrão overlay+container+animation é duplicado em cada arquivo.

---

#### Card

| Variante | Classe CSS | Conteúdo |
|----------|-----------|----------|
| Menu Item | `.menu-item` | Imagem + nome + desc + preço |
| Featured Banner | `.featured-card` | Background image + tag + título + preço + botão |
| Order Card | `.order-card-container` | Header + divider + items list + botão reorder |
| Order Item | `.order-item-card` | Imagem + detalhes + qty control |
| Recommendation | `.rec-card` | Imagem + preço + nome + botão add |
| Chat Product | `.chat-product-card` | Imagem + tags + título + desc + preço + botão |
| Wizard Result | `.wizard-result-item` | Info + preço + botão add + imagem |
| Admin List Item | `.admin-list-item` | Label + remove button |
| Product List Item | `.product-list-item` | Thumbnail + nome + preço + botão remove |

> ⚠️ **Anti-padrão**: 9 variantes de "card" sem nenhum componente base compartilhado.

---

#### Header / Navigation Bar

| Variante | Classe CSS | Conteúdo |
|----------|-----------|----------|
| Menu Hub | `.menu-header` | Logo + avatar + botões |
| Modal Header | `.my-orders-header` | Back button + título |
| Profile Header | `.profile-header` | Logo + "Voltar ao Cardápio" |
| Maestro Header | `.modal-header-nav-wrapper` | Back + avatar + nome + status |
| Studio Header | `.studio-header` | Back + título + subtítulo |
| Order Header | `.order-modal-header` | Back + título |

---

#### Category Navigation

| Componente | Classe CSS | Tipo |
|------------|-----------|------|
| Category Tabs | `.category-tabs` | Scroll horizontal, tab ativa com underline |
| Filter Pills | `.filter-pills` | Scroll horizontal, pill ativa com fill preto |
| Studio Tabs | `.studio-tabs` | Tab fixa, ativa com underline preto |
| Admin Tabs | `.admin-tabs` | Tab com fundo, ativa com box-shadow |

> ⚠️ **Anti-padrão**: 4 implementações de tabs com estilos diferentes.

---

#### Floating Action

| Componente | Classe CSS | Posição | Conteúdo |
|------------|-----------|---------|----------|
| Maestro CTA | `.floating-tabbar-container` | Bottom fixed | Ícone + texto "Olá, eu sou o Menux!" |
| Cart Button | `.cart-floating-button` | Bottom right fixed | Ícone + badge de contagem |

---

### 3.3 Componentes de Feature (não reutilizáveis)

| Componente | Arquivo | Responsabilidade |
|------------|---------|------------------|
| ProcessingModal | `ProcessingModal.jsx` | Tela de loading com progress bar (3 steps) |
| OrderCodeModal | `OrderCodeModal.jsx` | Exibição do código do pedido em boxes |
| DeleteAccountModal | Dentro de `ProfileModal.jsx` | Confirmação de exclusão de conta |
| MaestroWizard | Dentro de `MaestroModal.jsx` | Wizard 5 steps (pessoas, estilo, dieta, loading, resultados) |
| MaestroChat | Dentro de `MaestroModal.jsx` | Chat com IA + sugestões de produtos |
| DesignSystemView | `DesignSystemView.jsx` | Visualizador de componentes (Storybook-like) |

---

## 4. Padrões de Uso

### Padrões Recorrentes de Composição

**Fullscreen Modal**
```
<motion.div className="*-modal-overlay" initial/animate/exit>
  <header> Back button + Title </header>
  <div className="*-content"> Scrollable content </div>
  <footer> Action buttons </footer>
</motion.div>
```
Usado em: ProductDetail, Profile, Orders, Maestro, OrderCode.

**Form Group**
```
<div className="*-form-group">
  <label className="*-label">Label</label>
  <input className="*-input" />
</div>
```
Usado em: Profile (2x), Studio/Admin (8x), Login (1x).

**List Item com Ação**
```
<div className="*-item">
  <div className="*-info"> Nome + Descrição </div>
  <button className="*-remove-btn">×</button>
</div>
```
Usado em: Admin categories, Admin products, Cart items.

**Quantity Control**
```
<div className="*-qty-control">
  <button className="*-qty-btn">−</button>
  <span className="*-qty-value">N</span>
  <button className="*-qty-btn">+</button>
</div>
```
Usado em: 5 contextos diferentes com classes e estilos diferentes.

### Regras Implícitas de Uso

1. **Botão primário = preto** — Toda ação principal usa fundo preto com texto branco
2. **Background de input = #F5F5F5** — Todos os inputs usam cinza claro sem borda
3. **Modais sobem de baixo** — Slide-up é o padrão (exceto MyOrders que é slide-right e Delete que é fade)
4. **Feedback via Framer Motion** — `whileTap={{ scale: 0.96 }}` em botões primários
5. **Texto secundário = #7E7E7E** — Consistente em descriptions, captions, subtítulos
6. **Sem hover states** — Mobile-first, quase nenhum `:hover` definido (exceto no Studio)

### Anti-padrões Detectados

| Anti-padrão | Impacto | Onde |
|-------------|---------|-----|
| **Nenhum componente `<Button>` reutilizável** | 12+ variantes de botão duplicadas no CSS | Todo o projeto |
| **Nenhum componente `<Modal>` base** | Overlay/animação/estrutura repetida 8 vezes | Todos os modais |
| **Nenhum componente `<Input>` base** | 7 variantes com alturas e radius inconsistentes | Login, Profile, Admin |
| **5 implementações de QuantitySelector** | Mesma UI, 5 classes diferentes | Product, Order, Rec, Pizza, Wine |
| **CSS fora de `src/styles/`** | 3 arquivos CSS colocados ao lado dos componentes | MyOrders, Pizza, Wine |
| **Cores hardcoded** | 40+ hex values, <5% usam CSS variables | 100% dos arquivos CSS |
| **Sem estilo de `:focus`** | Acessibilidade comprometida | Todos os inputs |
| **Inline styles no JSX** | Mistura de classes CSS com `style={{}}` | ProfileModal, MenuHub, DesignSystemView |
| **SVGs inline duplicados** | ChevronLeft renderizado em 5+ componentes | Modais com back button |

---

## 5. Arquitetura do Design System

### O que hoje é...

| Camada | Elementos |
|--------|-----------|
| **Fundamento** | CSS Variables em `:root` (5 cores + 5 semânticas dark mode), font-family (2), escala de font-size implícita |
| **Token** | Apenas as CSS variables. Nenhum token formal de spacing, radius, shadow ou z-index |
| **Componente base** | Toast (único componente base verdadeiro via Context). ErrorBoundary |
| **Componente composto** | CategoryNav, MenuHeader, ProductGrid (extraídos em `/hub/`). DesignSystemView (showcase) |
| **Feature** | Todos os demais: MenuHub, modais de produto, Maestro, StudioView, ProfileModal, etc. |

### Hierarquia de Abstração

```
Nível 0 — CSS Variables (:root)
    ↓ (quase não consumidas)
Nível 1 — Classes CSS globais (btn-primary, phone-input, etc.)
    ↓ (sem componente React)
Nível 2 — Componentes JSX que usam classes
    ↓ (tudo acoplado)
Nível 3 — Telas completas (MenuHub, Profile, Maestro)
```

> O gap principal está entre Nível 0 → 1 (tokens não consumidos) e Nível 1 → 2 (ausência de componentes base React).

---

## 6. Avaliação de Aderência

### ✅ O que está consistente

| Aspecto | Detalhe |
|---------|---------|
| Font families | 2 famílias com papéis claros (display vs body) |
| Font weights | 500/600 como dupla padrão — uso disciplinado |
| Botão primário | Preto com radius pill, 59px de altura — nunca varia |
| Animações de modal | Framer Motion com padrões previsíveis |
| Duração de transição | 0.2s universal |
| Feedback tátil | `whileTap scale(0.96)` consistente |
| Idioma | Português BR em toda UI |
| Grid de gap | Maioria em múltiplos de 4px |
| Toast system | 4 variantes, API limpa, retrocompatível |

### ⚠️ O que está fragmentado

| Aspecto | Detalhe |
|---------|---------|
| **Cores** | 40+ hex values com 8+ tons de cinza quase idênticos |
| **Border radius** | 17 valores onde 4-5 seriam suficientes |
| **Box shadow** | 14 variações sem padrão claro |
| **Z-index** | 11 valores sem escala lógica |
| **Altura de inputs** | 3 valores diferentes (56, 59, 64px) |
| **Tabs/Navigation** | 4 implementações com estilos diferentes |
| **Quantity Selector** | 5 implementações do mesmo padrão |
| **SVG icons** | Duplicados inline em 5+ componentes |

### ❌ O que impede reuso direto

| Bloqueio | Detalhe |
|----------|---------|
| **Zero componentes base React** | Não existe `<Button>`, `<Input>`, `<Modal>`, `<Avatar>`, `<Card>` |
| **CSS não tokenizado** | 99% dos valores são hex/px literais, não consomem variables |
| **CSS split inconsistente** | 13 arquivos em `/styles/` + 3 ao lado de componentes |
| **Inline styles misturados** | Propriedades como `style={{ opacity: 0.6, cursor: 'not-allowed' }}` que deveriam ser classes |
| **Acoplamento feature-componente** | Nomes como `.pd-qty-btn`, `.wine-qty-btn` ao invés de `.qty-btn` genérico |
| **Sem storybook funcional** | DesignSystemView existe mas é estático e incompleto |

---

## 7. Recomendações para Evolução

### ✅ O que pode ser reaproveitado imediatamente

| Item | Como reaproveitar |
|------|-------------------|
| **Escala tipográfica** (12/14/16/20/24) | Criar tokens `--text-sm` a `--text-2xl`, aplicar globalmente |
| **Sistema de pesos** (500/600) | Já é consistente — formalizar como `--font-medium` / `--font-semibold` |
| **Botão primário** (preto, pill, 59px) | Extrair para componente `<Button variant="primary">` |
| **Toast com variantes** | Já é componente via Context — copiar direto |
| **Paleta base** (preto, branco, gray-100, gray-200, gray-700) | Formalizar os 5 cinzas mais usados como tokens |
| **Padrão de transição** (0.2s ease) | Token `--duration-fast: 0.2s` |
| **Framer Motion patterns** | `whileTap`, slide-up modal, fade overlay — documentar como mixins |
| **ThemeContext** | Infraestrutura dark mode já preparada |
| **Breakpoint base** | `max-width: 768px` (único breakpoint existente) |

### 🔧 O que precisa ser normalizado

| Item | Ação necessária |
|------|----------------|
| **Cores → tokens** | Reduzir 40+ hex para ~15 tokens. Migrar todos os CSS literais para `var()` |
| **Border radius → 5 tokens** | Consolidar 17 valores em `sm(8), md(12), lg(16), xl(24), full(100)` |
| **Box shadow → 3 tokens** | `shadow-sm`, `shadow-md`, `shadow-lg` |
| **Z-index → escala** | Definir camadas: base(1), sticky(100), floating(500), modal(1000), overlay(2000), admin(3000) |
| **Input heights → 1 token** | Padronizar tudo em 56px (mobile-friendly) |
| **5 qty selectors → 1 `<QtySelector>`** | Componente React com tamanho como prop |
| **8 modais → 1 `<Modal>` base** | Extrair overlay + animation + close pattern |
| **12 botões → `<Button variant>`** | Componente com variants: primary, secondary, outline, danger, small |
| **7 inputs → `<Input variant>`** | Componente com variants: default, phone, otp, textarea |
| **SVGs → icon set** | Extrair ChevronLeft, Close, Plus, Minus, Trash, Send, Camera para `/icons/` |
| **CSS ao lado de componentes** | Mover MyOrders, Pizza, Wine CSS para `/styles/` |
| **`:focus` styles** | Adicionar `outline` ou `box-shadow` para acessibilidade |

### 🚫 O que deveria ser proibido em novos projetos

| Regra | Razão |
|-------|-------|
| **Hex literals no CSS** | Usar apenas `var(--token)` |
| **Inline `style={{}}` para estado** | Usar classes condicionais (`.active`, `.disabled`) |
| **SVG inline repetido** | Importar de um icon set centralizado |
| **Novo modal sem usar `<Modal>` base** | Evitar duplicação de overlay/animation |
| **Novo botão sem usar `<Button>`** | Evitar proliferação de variantes CSS |
| **z-index ad hoc** | Usar apenas tokens de camada definidos |
| **Novo tom de cinza** | Usar apenas os tokens definidos na paleta |
| **`!important`** | Existem 6 ocorrências — nenhuma deveria existir |
| **CSS em `src/components/`** | Todo CSS em `src/styles/` |
| **`font-family` declarado por classe** | Herdar do `:root` — declarar apenas quando muda |

---

> **Nota final**: Este documento é uma fotografia do estado atual. A distância entre o que existe e um Design System reutilizável é **média** — os fundamentos visuais são consistentes (tipografia, cor primária, animações), mas a camada de abstração (tokens + componentes React) está completamente ausente. O trabalho principal é de **extração e formalização**, não de redesign.
