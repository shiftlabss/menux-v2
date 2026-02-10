# Menux Design System

> Sistema de design extraído do projeto **Menux** — cardápio digital mobile-first para restaurantes.
> Versão: 1.0 · Plataforma: React + Vite · Tema: Light-only

---

## 1. Visão Geral

### Filosofia

O Menux segue uma estética **minimalista, preto-e-branco**, com tipografia expressiva e espaçamento generoso. Toda a interface é orientada a mobile (max-width ~430 px), privilegiando legibilidade, hierarquia clara e micro-interações sutis.

### Princípios

| Princípio | Descrição |
|---|---|
| **Mobile-first** | Todas as telas são projetadas para viewport ≤ 430 px. Layouts desktop são secundários. |
| **Monocromático** | Preto (#000) como cor primária de ação; cinzas para hierarquia; cor só em feedback e status. |
| **Tipografia dupla** | Display (Bricolage Grotesque) para títulos e CTAs; Body (Geist) para texto corrido. |
| **Espaçamento base-4** | Escala consistente de 4 px, garantindo ritmo vertical uniforme. |
| **Interação tátil** | Alvos mínimos de 29 px (header pills) a 59 px (botões primários), com feedback via `scale` e `opacity`. |

### Stack técnica

- **Framework:** React 18 + Vite
- **Animações:** Framer Motion
- **Estilos:** CSS Modules (arquivos `.css` separados por componente)
- **Tokens:** CSS Custom Properties em `:root`
- **Persistência:** localStorage (`storageService.ts`)
- **AI:** Maestro chat assistant (webhook)

---

## 2. Fundamentos Visuais

### 2.1 Tipografia

#### Famílias

| Token | Família | Uso |
|---|---|---|
| `--font-display` | `'Bricolage Grotesque', sans-serif` | Títulos, labels, botões, preços, nomes de produto |
| `--font-body` | `'Geist', sans-serif` | Texto corrido, descrições, placeholders, helpers |

> Fontes carregadas via `<link>` no `index.html` para compatibilidade cross-browser.

#### Escala de tamanhos

| Token | Valor | Uso típico |
|---|---|---|
| `--text-xs` | 12 px | Tags, hints, badges, copy-hints |
| `--text-sm` | 14 px | Descrições, subtítulos, botões secundários |
| `--text-base` | 16 px | Corpo, labels de formulário, preços, CTAs |
| `--text-lg` | 20 px | Títulos de seção, nomes de produto em detalhe |
| `--text-xl` | 24 px | Títulos de tela (login, perfil), section labels |
| `--text-2xl` | 32 px | Títulos grandes (Studio, dígitos do código) |
| `--text-jumbo` | 48 px | Display hero (reservado) |

#### Pesos

| Token | Valor | Uso |
|---|---|---|
| `--font-regular` | 400 | Texto corrido, descrições |
| `--font-medium` | 500 | Labels, botões, preços |
| `--font-semibold` | 600 | Nomes de produto, títulos de seção, badges |
| `--font-bold` | 700 | Destaques (restaurant name, Studio h1) |

#### Line-height

| Contexto | Valor |
|---|---|
| Títulos curtos | `1.1` – `1.25` |
| Corpo de texto | `1.4` – `1.5` |
| Labels single-line | `normal` (padrão do browser) |

---

### 2.2 Cores

#### Cores primárias

| Token | Hex | Uso |
|---|---|---|
| `--primary-black` | `#000000` | Cor principal de ação (botões, links, texto primário) |
| `--white` | `#FFFFFF` | Superfícies, texto sobre preto |
| `--accent-blue` | `#0085FF` | Links informativos, toast info |
| `--brand-accent` | `#7A55FD` | Badge do carrinho, link Maestro |

#### Cinzas

| Token | Hex | Uso |
|---|---|---|
| `--surface` | `#FFFFFF` | Superfície principal |
| `--surface-secondary` | `#F5F5F5` | Backgrounds secundários, inputs, cards |
| `--bg-light` | `#F5F5F5` | Alias de `surface-secondary` |
| `--border` | `#E5E5E5` | Bordas de separação (header, dividers) |
| `--border-light` | `#F0F0F0` | Bordas sutis (between items, sections) |
| `--gray-300` | `#D9D9D9` | Placeholders de imagem, avatar vazio |
| `--gray-400` | `#C4C4C4` | Botão disabled background |
| `--secondary-gray` | `#7E7E7E` | Texto secundário alternativo |

#### Texto

| Token | Hex | Uso |
|---|---|---|
| `--text-primary` | `#000000` | Texto principal |
| `--text-secondary` | `#7E7E7E` | Descrições, subtítulos |
| `--text-tertiary` | `#666666` | Labels terciários, hints |
| `--text-placeholder` | `#A3A3A3` | Placeholders de input |
| `--text-disabled` | `#7A7A7A` | Texto em estado disabled |

#### Feedback / Semânticas

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#1DB954` | Toast sucesso |
| `--color-error` | `#E53935` | Toast erro, estados de erro |
| `--color-warning` | `#FB8C00` | Toast aviso |
| `--color-danger` | `#FF4444` | Ações destrutivas (excluir conta, reset) |
| `--surface-danger` | `#FFECEC` | Background de zona de perigo |
| `--surface-warning` | `#FFF8E1` | Background de avisos |

#### Status (badges de pedido)

| Token | Hex | Uso |
|---|---|---|
| `--status-waiting-bg` | `#FFF8E1` | Pedido em espera (bg) |
| `--status-waiting-text` | `#F57F17` | Pedido em espera (texto) |
| `--status-annotated-bg` | `#E8F5E9` | Pedido anotado (bg) |
| `--status-annotated-border` | `#C8E6C9` | Pedido anotado (borda) |
| `--status-annotated-text` | `#2E7D32` | Pedido anotado (texto) |
| `--status-completed-bg` | `#008149` | Pedido concluído (bg, texto branco) |

#### Overlays

| Token | Valor | Uso |
|---|---|---|
| `--overlay-light` | `rgba(0,0,0, 0.4)` | Overlays leves |
| `--overlay-medium` | `rgba(0,0,0, 0.5)` | Modais de confirmação |
| `--overlay-heavy` | `rgba(0,0,0, 0.8)` | Studio admin (com `backdrop-filter: blur(8px)`) |

---

### 2.3 Espaçamento

Escala base-4. Todos os valores são múltiplos de 4 px.

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | 4 px | Micro gaps, margin-bottom entre label e sublabel |
| `--space-2` | 8 px | Gap entre ícones e texto, padding interno de tags |
| `--space-3` | 12 px | Gap entre cards, entre inputs |
| `--space-4` | 16 px | Padding interno de cards, seções |
| `--space-5` | 20 px | Padding de headers, seções médias |
| `--space-6` | 24 px | Padding lateral padrão de tela, seções grandes |
| `--space-8` | 32 px | Margem entre grupos de conteúdo |
| `--space-10` | 40 px | Espaço para empty states |
| `--space-12` | 48 px | Separação entre seções maiores (recommendations) |
| `--space-15` | 60 px | Padding-top máximo (welcome screen) |

**Padrão de padding lateral:** `var(--space-6)` (24 px) é o padding horizontal padrão de todas as telas.

---

### 2.4 Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8 px | Tabs, campos de admin, botões pequenos |
| `--radius-md` | 12 px | Inputs, cards de item, thumbnails |
| `--radius-lg` | 15 px | Cards maiores, modais, inputs grandes |
| `--radius-xl` | 20 px | Featured cards, containers Studio |
| `--radius-2xl` | 25 px | Hero images (bottom corners), admin container |
| `--radius-full` | 50% | Avatares, ícones circulares |
| `--radius-pill` | 100 px | Botões, pills, filtros, toasts, badges |

**Padrão dominante:** `--radius-pill` para todos os botões de ação e controles interativos.

---

### 2.5 Elevação / Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-xs` | `0 2px 4px rgba(0,0,0, 0.1)` | Ícones de câmera, pequenos overlays |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0, 0.1)` | Botões back-circle, tabs ativas de admin |
| `--shadow-md` | `0 4px 12px rgba(0,0,0, 0.1)` | Toasts, cart button, rec-add-btn |
| `--shadow-lg` | `0 4px 20px rgba(0,0,0, 0.15)` | Modais de confirmação (delete-modal) |
| `--shadow-xl` | `0 20px 50px rgba(0,0,0, 0.3)` | Admin container, Studio panel |

**Padrão de floating elements:** Elementos fixos no bottom (tabbar, footer) usam `0 4px 12px rgba(0,0,0, 0.2-0.3)` customizado.

---

### 2.6 Z-Index

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | 1 | Elementos normais, imagens de upload |
| `--z-raised` | 2 | File inputs de upload |
| `--z-dropdown` | 5 | Dropdowns, quantity overlays, restaurant info |
| `--z-sticky` | 10 | Category nav sticky, headers de navegação |
| `--z-header` | 100 | Header fixo, footer actions |
| `--z-overlay` | 500 | Floating tabbar, cart button |
| `--z-modal` | 1000 | Product detail modal, wine modal |
| `--z-drawer` | 2000 | Drawers full-screen (processing, order code, profile, orders) |
| `--z-toast` | 9999 | Toasts, delete modal |
| `--z-studio` | 10000 | Admin Studio panel (sobrepõe tudo) |

---

## 3. Componentes Base

### 3.1 Button

#### Variantes

| Variante | Classe | Height | BG | Text | Radius | Uso |
|---|---|---|---|---|---|---|
| **Primary** | `.btn-primary` | 59 px | `--primary-black` | `--white` | `pill` | CTA principal (Entrar, Enviar, Adicionar) |
| **Secondary** | `.btn-secondary` | 59 px | `--bg-light` | `--secondary-gray` | `lg` | Ações secundárias (Menu do restaurante) |
| **Outline** | `.btn-outline` | 59 px | `transparent` | `--primary-black` | `lg` | Ações alternativas |
| **Disabled** | `.btn-disabled` | 59 px | `--gray-400` | `--text-disabled` | `pill` | Estado desabilitado de reenviar |
| **Danger** | `.btn-delete-confirm` | auto | `--color-danger` | `--white` | `pill` | Confirmar exclusão |
| **Ghost/Cancel** | `.btn-delete-cancel` | auto | `--surface-secondary` | `--text-primary` | `pill` | Cancelar ações |
| **Pill Small** | `.btn-profile-short` | 29 px | `--primary-black` | `--white` | `pill` | Header (Meu perfil, Entrar) |
| **Pill Light** | `.btn-my-orders-active` | 29 px | `--border-light` | `--text-primary` | `pill` | Header (Pedidos) |
| **Pill Filter** | `.filter-pill` | 29 px | `--surface-secondary` | `--text-secondary` | `pill` | Filtros de subcategoria |

#### Propriedades comuns

```
font-family: var(--font-display)
font-weight: var(--font-medium)
font-size: var(--text-base) /* Primary/Secondary/Outline */
font-size: var(--text-sm)  /* Pills 29px */
cursor: pointer
border: none
```

#### Estados

| Estado | Comportamento |
|---|---|
| `:disabled` | `background: var(--gray-400)`, `color: var(--text-disabled)`, `cursor: not-allowed` |
| `:active` | `opacity: 0.8` ou `transform: scale(0.95)` |
| `.active` (filter) | `background: var(--primary-black)`, `color: var(--white)` |

---

### 3.2 Input

#### Variantes

| Variante | Classe | Height | Uso |
|---|---|---|---|
| **Phone** | `.phone-input` | 59 px | Login — campo de telefone |
| **OTP** | `.otp-input` | 59 px | Verificação — dígitos individuais (width: 74 px) |
| **Profile** | `.profile-input` | 56 px | Perfil — nome, telefone |
| **DDI** | `.profile-input-ddi` | 56 px | Perfil — código do país (width: 80 px) |
| **Country Code** | `.country-code` | 59 px | Login — prefixo (width: 74 px, não editável) |
| **Admin** | `.admin-field input` | auto | Studio — campos genéricos |

#### Propriedades comuns

```
background: var(--bg-light) ou var(--surface-secondary)
border: none
border-radius: var(--radius-lg) ou var(--radius-md)
padding: 0 var(--space-5)
font-family: inherit ou var(--font-display)
font-size: var(--text-base)
color: var(--text-primary)
```

#### Placeholder

```css
::placeholder {
  color: var(--text-placeholder); /* #A3A3A3 */
}
```

#### Estado disabled

```css
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--text-secondary);
}
```

---

### 3.3 Textarea

| Variante | Classe | Height | Uso |
|---|---|---|---|
| **Product obs** | `.pd-obs-input` | 100 px | Observações no produto padrão |
| **Pizza obs** | `.pizza-obs-input` | 65 px | Observações na pizza |

#### Propriedades

```
background: var(--surface-secondary)
border: none
border-radius: var(--radius-lg) ou var(--radius-md)
padding: var(--space-4)
font-family: var(--font-body) ou var(--font-display)
font-size: var(--text-sm)
color: var(--text-primary)
resize: none
```

---

### 3.4 Card

#### Variantes

| Variante | Dimensões | Uso |
|---|---|---|
| **Menu Item** | Flex row, image 88×88 | Item de menu na listagem |
| **Featured** | 313×213 px min | Cards destaque no carrossel horizontal |
| **Order Item** | Flex row, image 80×80 | Item no carrinho/pedido |
| **Recommendation** | 128 px width | Card de recomendação (scroll horizontal) |
| **Chat Product** | 226 px width | Card de produto no chat Maestro |
| **Order History** | 100% width | Card de pedido em "Meus pedidos" |

#### Menu Item anatomy

```
┌─────────────────────────────────────────┐
│ [item-info]                  [item-image │
│  .item-name (16px, semibold)   88×88]   │
│  .item-desc (14px, body, 2 lines max)   │
│  .item-price (16px, medium)             │
└─────────────────────────────────────────┘
border-bottom: 1px solid var(--border-light)
padding: var(--space-4) 0
:active → transform: scale(0.98)
```

#### Featured Card anatomy

```
┌──────────────────────────────────┐
│  (background-image, cover)       │
│                                  │
│  .featured-tag (12px, uppercase) │
│  .featured-title (20px, semi)    │
│  .featured-footer:               │
│    price | [btn-order-now 29px]  │
└──────────────────────────────────┘
border-radius: var(--radius-xl)
scroll-snap-align: start
```

---

### 3.5 Modal / Dialog

#### Full-screen Modal (padrão principal)

```
position: fixed
top: 0; left: 0
width: 100%; height: 100dvh
background: var(--surface)
z-index: var(--z-modal) ou var(--z-drawer)
display: flex; flex-direction: column
```

Usado em: Product Detail, Wine, Pizza, Profile, My Orders, Processing, Order Code.

#### Centered Dialog (confirmação)

```
.delete-modal-overlay:
  position: fixed; inset: 0
  background: var(--overlay-medium)
  z-index: var(--z-toast)

.delete-modal-card:
  background: var(--surface)
  border-radius: var(--radius-lg)
  width: 90%; max-width: 360px
  padding: var(--space-6)
  box-shadow: var(--shadow-lg)
```

Usado em: Delete Account, confirmações.

#### Bottom Sheet (Maestro)

```
position: fixed
top: calc(100% - 78px)  /* Apenas aba visível */
→ transição para top: 0 quando aberto
height: 100dvh
border-radius: var(--radius-2xl) var(--radius-2xl) 0 0 (fechado)
→ border-radius: 0 (aberto)
```

---

### 3.6 Toast

```
position: fixed; top: 40px
border-radius: var(--radius-pill)
padding: var(--space-3) var(--space-4)
box-shadow: var(--shadow-md)
z-index: var(--z-toast)
```

| Variante | Background | Classe |
|---|---|---|
| Success | `#1DB954` | `.toast-success` |
| Error | `#E53935` | `.toast-error` |
| Warning | `#FB8C00` | `.toast-warning` |
| Info | `#0085FF` | `.toast-info` |

**Duração:** Success/Info = 3s, Error/Warning = 5s.

**Anatomy:** `[icon 18px circle] + [text 14px, white, font-body, medium]`

---

### 3.7 Badge / Tag

#### Chip (produto)

```css
.pd-chip {
  background: var(--surface-secondary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

#### Status Badge (pedidos)

```css
.status-badge {
  height: 29px; padding: 10px;
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}
/* Variantes: .waiting, .annotated, .completed */
```

#### Wine Tag

```css
.wine-tag {
  border: 1px solid var(--border-light);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
}
```

#### Chat Card Tag

```css
.chat-card-tag {
  background: var(--surface-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
}
```

---

### 3.8 Quantity Selector

#### Grande (Product Detail / Wine)

```
display: grid; grid-template-columns: 1fr 1fr 1fr
height: 59px; width: 130px
border: 1px solid var(--border-light)
border-radius: var(--radius-pill)
```

#### Pequeno (Order Item)

```
width: 82px; height: 38px
border: 1px solid var(--border)
border-radius: var(--radius-xl)
box-shadow: 0 4px 4px rgba(0,0,0, 0.03)
```

---

### 3.9 Selection Box (Pizza)

```css
.pizza-selection-box {
  width: 20px; height: 20px;
  border-radius: 5px;
  background: var(--border-light); /* unchecked */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.pizza-option-row.active .pizza-selection-box {
  background: var(--primary-black); /* checked */
}
```

---

## 4. Padrões de Layout

### 4.1 Estrutura de tela

```
┌─────────────────────────────────┐
│ .menu-header (60px, fixed top)  │
├─────────────────────────────────┤
│ .menu-scroll-area (flex: 1)     │
│   ├─ banner (140px)             │
│   ├─ restaurant-info            │
│   ├─ featured-reel (scroll-x)  │
│   ├─ category-nav (sticky)      │
│   ├─ filter-pills (scroll-x)   │
│   └─ menu-list                  │
├─────────────────────────────────┤
│ .floating-tabbar (fixed bottom) │
│ .cart-button (fixed bottom-right│
└─────────────────────────────────┘
```

### 4.2 Scroll horizontal

Padrão para carrosséis (featured, recommendations, chat cards, filter pills):

```css
display: flex;
overflow-x: auto;
scroll-snap-type: x mandatory;
-ms-overflow-style: none;
scrollbar-width: none;
&::-webkit-scrollbar { display: none; }
```

#### Edge-to-edge (chat cards)

Para carrosséis que ignoram o padding do pai:

```css
margin-left: -24px;
margin-right: -24px;
width: calc(100% + 48px);
/* Pseudo-elements ::before/::after como spacers de 24px */
```

### 4.3 Full-screen modal

Estrutura padrão de modais que cobrem a tela inteira:

```
┌─────────────────────────────────┐
│ [header area]                   │
│   ← back button (absolute)     │
│   hero image (300px, rounded    │
│   bottom corners radius-2xl)    │
├─────────────────────────────────┤
│ [content area] (scroll)         │
│   title, description, price     │
│   chips/tags                    │
│   sections/options              │
│   observations textarea         │
├─────────────────────────────────┤
│ [footer action] (fixed bottom)  │
│   24px from edges               │
│   qty selector + CTA button     │
└─────────────────────────────────┘
padding-bottom: 120px (scroll content)
```

### 4.4 Category navigation (sticky)

```css
.category-nav {
  position: sticky; top: 0;
  z-index: var(--z-sticky);
  background: var(--surface);
  border-bottom: 1px solid var(--border-light);
}
.category-tab.active {
  color: var(--primary-black);
  border-bottom: 2px solid var(--primary-black);
}
```

### 4.5 Floating footer action

```css
position: fixed;
bottom: 24px;
left: 24px;
right: 24px;
z-index: 100;
```

Usado em: Product Detail, Wine, Pizza. Sempre com `border-radius: pill` e `height: 59px`.

### 4.6 Section pattern (Pizza)

Padrão "Gray Header / White Body":

```
┌─ .pizza-section-header-block ──────┐
│ background: var(--surface-secondary) │
│ title + subtitle                      │
│ border-top/bottom: var(--border-light)│
└────────────────────────────────────┘
┌─ .pizza-options-container ─────────┐
│ background: var(--surface)           │
│ option rows with dividers            │
└────────────────────────────────────┘
```

---

## 5. Padrões de Interação

### 5.1 Transições

| Padrão | Valor | Uso |
|---|---|---|
| **Ease padrão** | `0.2s ease` | Filter pills, botões admin |
| **Cubic-bezier suave** | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` | Botão primary, selection boxes |
| **Cubic-bezier menu** | `0.2s cubic-bezier(0.2, 0, 0, 1)` | Menu items (scale) |

### 5.2 Feedback tátil

| Componente | Efeito |
|---|---|
| Menu Item | `:active → transform: scale(0.98)` |
| Chat Card Add Button | `:active → transform: scale(0.95)` |
| Primary Button | `:active → opacity: 0.8` |
| Delete Cancel | `:active → background: var(--border)` |

### 5.3 Scroll Snap

```css
scroll-snap-type: x mandatory;
scroll-snap-align: start;
scroll-padding-left: var(--space-6);
```

Usado em: Featured reel, Recommendation scroll, Chat suggestions, Category tabs.

### 5.4 Maestro bottom sheet

```
Estado fechado: top: calc(100% - 78px), mostra apenas aba com borda arredondada
Estado aberto: top: 0, full-screen, sem borda arredondada

Transição controlada via Framer Motion:
  type: "spring", damping: 30, stiffness: 300

Drag-to-dismiss: dragElastic: 0.2, dragConstraints
```

### 5.5 Typing indicator

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}
/* 3 dots, animation-delay: 0s, 0.15s, 0.3s */
```

### 5.6 Clipboard copy

```
.order-code-digits → onClick → navigator.clipboard.writeText()
Feedback: "Toque para copiar" → "Copiado!" (2s timeout)
```

### 5.7 Processing storytelling

Tela de processamento com progress bar e texto animado por etapas:

```
.processing-progress-track: height: 2px, var(--border-light)
.processing-progress-fill: var(--primary-black), largura animada
Texto muda em intervalos (storytelling de envio do pedido)
```

---

## 6. UX Writing

### Tom de voz

| Aspecto | Diretriz |
|---|---|
| **Idioma** | Português brasileiro (pt-BR) |
| **Tom** | Amigável, conciso, direto |
| **Verbos** | Imperativo para ações ("Adicionar", "Enviar", "Voltar") |
| **Erros** | Humanizados, sem códigos técnicos |

### Exemplos de mensagens

| Contexto | Mensagem |
|---|---|
| Envio de OTP | "Não conseguimos enviar o código. Verifique sua conexão e tente novamente." |
| Código incorreto | "Código incorreto ou expirado." |
| Erro genérico | "Algo deu errado ao verificar o código. Tente novamente." |
| Carrinho vazio | "Seu carrinho está vazio" |
| Pedidos vazios | "Nenhum pedido ainda" |
| Copy hint | "Toque para copiar" → "Copiado!" |
| Pizza hint | "Falta escolher: [item]" |

### Padrão de labels de botão

| Tipo | Exemplo |
|---|---|
| CTA primário | "Adicionar R$ X,XX" / "Finalizar pedido R$ X,XX" |
| Navegação | "Voltar ao menu" / "Ver pedidos" |
| Autenticação | "Entrar" / "Meu perfil" / "Pedidos" |
| Destrutivo | "Excluir conta" / "Confirmar" / "Cancelar" |

---

## 7. Acessibilidade

### Focus ring

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #000000;
}
:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}
```

O focus ring só aparece na navegação por teclado, nunca em cliques.

### ARIA attributes

| Componente | Atributo |
|---|---|
| Avatar | `role="img" aria-label="Avatar de {nome}"` |
| Floating tabbar | `role="button" aria-label="Abrir assistente Menux"` |
| Back buttons | Ícone SVG com `aria-hidden` + texto visual ou label |

### Alvos de toque

| Componente | Tamanho mínimo |
|---|---|
| Header pills | 29×29 px |
| Botões primários | 100% × 59 px |
| Back circle | 40×40 px |
| Quantity buttons | 20 px largura, 100% altura do container |
| Admin close | 36×36 px |
| Add buttons (admin) | 44×44 px |

### Cores e contraste

- Texto primário (#000) sobre branco (#FFF) → ratio 21:1
- Texto secundário (#7E7E7E) sobre branco (#FFF) → ratio ~4.6:1
- Texto terciário (#666) sobre branco → ratio ~5.7:1
- Texto sobre botão primary (branco sobre preto) → ratio 21:1

### Smooth scrolling

```css
-webkit-overflow-scrolling: touch;
scroll-margin-top: 130px; /* Compensa header sticky */
```

---

## 8. Tokens de Design

### Tabela consolidada

```css
:root {
  /* === Cores === */
  --primary-black: #000000;
  --secondary-gray: #7E7E7E;
  --bg-light: #F5F5F5;
  --white: #FFFFFF;
  --accent-blue: #0085FF;
  --surface: #FFFFFF;
  --surface-secondary: #F5F5F5;
  --border: #E5E5E5;
  --border-light: #F0F0F0;
  --gray-300: #D9D9D9;
  --gray-400: #C4C4C4;
  --text-primary: #000000;
  --text-secondary: #7E7E7E;
  --text-tertiary: #666666;
  --text-placeholder: #A3A3A3;
  --text-disabled: #7A7A7A;
  --surface-elevated: #FFFFFF;
  --color-success: #1DB954;
  --color-error: #E53935;
  --color-warning: #FB8C00;
  --color-danger: #FF4444;
  --surface-danger: #FFECEC;
  --color-warning-text: #F57F17;
  --surface-warning: #FFF8E1;
  --brand-accent: #7A55FD;
  --overlay-light: rgba(0,0,0, 0.4);
  --overlay-medium: rgba(0,0,0, 0.5);
  --overlay-heavy: rgba(0,0,0, 0.8);

  /* === Status === */
  --status-waiting-bg: #FFF8E1;
  --status-waiting-text: #F57F17;
  --status-annotated-bg: #E8F5E9;
  --status-annotated-border: #C8E6C9;
  --status-annotated-text: #2E7D32;
  --status-completed-bg: #008149;

  /* === Tipografia === */
  --font-display: 'Bricolage Grotesque', sans-serif;
  --font-body: 'Geist', sans-serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-jumbo: 48px;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* === Espaçamento (base-4) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-15: 60px;

  /* === Border Radius === */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 15px;
  --radius-xl: 20px;
  --radius-2xl: 25px;
  --radius-full: 50%;
  --radius-pill: 100px;

  /* === Sombras === */
  --shadow-xs: 0 2px 4px rgba(0,0,0, 0.1);
  --shadow-sm: 0 2px 8px rgba(0,0,0, 0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0, 0.1);
  --shadow-lg: 0 4px 20px rgba(0,0,0, 0.15);
  --shadow-xl: 0 20px 50px rgba(0,0,0, 0.3);

  /* === Z-Index === */
  --z-base: 1;
  --z-raised: 2;
  --z-dropdown: 5;
  --z-sticky: 10;
  --z-header: 100;
  --z-overlay: 500;
  --z-modal: 1000;
  --z-drawer: 2000;
  --z-toast: 9999;
  --z-studio: 10000;

  /* === Focus === */
  --focus-ring: 0 0 0 2px #000000;
}
```

---

## 9. Diretrizes de Evolução

### Dark mode

Os tokens estão preparados para dark mode. Para implementar:

1. Criar bloco `[data-theme="dark"]` em `global.css`
2. Inverter `--surface`, `--text-primary`, `--primary-black` etc.
3. Ajustar sombras (mais sutis em dark)
4. Overlays podem ficar mais leves

### Novas cores de marca

Para trocar a cor primária de ação de preto para uma cor de marca:

1. Alterar `--primary-black` para a nova cor
2. Verificar contraste com `--white` (mínimo 4.5:1 para texto)
3. Ajustar `--focus-ring` para combinar
4. Testar todos os botões, filtros e estados `.active`

### Novos componentes

Ao criar novos componentes, seguir:

1. **Usar tokens** — nunca valores hardcoded (exceto 0, 1px, 100%)
2. **Font-display para UI, font-body para texto** — manter a separação
3. **Height 59px para CTAs, 29px para pills** — respeitar a escala
4. **Pill radius para interativos** — botões, inputs de ação, filtros
5. **Md/Lg radius para containers** — cards, modais, inputs de formulário
6. **Padding lateral 24px** — padrão de tela
7. **Transição 0.2s** — para todos os estados interativos
8. **SVGs com currentColor** — para herdar a cor do contexto

### Checklist de novo componente

- [ ] Usa apenas tokens de `global.css`?
- [ ] Font-display para labels/CTAs, font-body para texto?
- [ ] Alvos de toque ≥ 29 px?
- [ ] `:focus-visible` com `var(--focus-ring)`?
- [ ] Transição suave nos estados interativos?
- [ ] Funciona com teclado virtual (mobile)?
- [ ] Texto em pt-BR, tom amigável?
- [ ] Z-index segue a hierarquia definida?

### Convenções de nomenclatura CSS

| Padrão | Exemplo |
|---|---|
| Container da tela | `.{feature}-modal-overlay`, `.{feature}-container` |
| Header | `.{feature}-header` |
| Conteúdo | `.{feature}-content` |
| Footer / Actions | `.{feature}-footer-action`, `.{feature}-actions-row` |
| Botão específico | `.btn-{ação}` (ex: `.btn-add-order`, `.btn-finish-order`) |
| Item de lista | `.{feature}-item`, `.{feature}-card` |
| Estado ativo | `.active` (classe toggled) |
| Texto | `.{feature}-title`, `.{feature}-desc`, `.{feature}-price` |

---

> Gerado a partir da análise completa do código-fonte do Menux v2.
> Para manter atualizado, revisar este documento ao adicionar novos componentes ou alterar tokens.
