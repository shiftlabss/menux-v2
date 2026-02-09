# Menux v3 — Decisões de Arquitetura

## Estado Atual: Frontend-Only (SPA)

**Persistência:** localStorage via `storageService.ts`
**Autenticação:** OTP via n8n webhooks (sem backend próprio)
**AI Chat:** Maestro via n8n webhook

### Por que não tem backend agora?

O Menux v3 é um **MVP single-tenant** para demonstração. Um restaurante, um cardápio, dados locais. Neste cenário:
- localStorage é suficiente para persistência
- n8n cobre a lógica de OTP e AI sem código server-side
- Deploy é estático (Vercel/Netlify sem custo de infra)

### Quando migrar para backend?

Migrar quando **qualquer** dessas condições for verdadeira:
1. **Multi-restaurante** — vários restaurantes com dados isolados
2. **Pedidos reais** — integração com POS, cozinha, pagamento
3. **Dados sensíveis** — informações que não podem ficar no client
4. **Múltiplos dispositivos** — mesmo usuário em devices diferentes

### Stack recomendada para backend

| Camada | Opção recomendada | Alternativa |
|--------|-------------------|-------------|
| API | Supabase (BaaS) | Node.js + Express |
| Banco | PostgreSQL (via Supabase) | SQLite (single-tenant) |
| Auth | Supabase Auth | Firebase Auth |
| Realtime | Supabase Realtime | Socket.io |
| Storage | Supabase Storage | Cloudflare R2 |

**Supabase é recomendado** porque elimina a necessidade de manter server próprio, tem free tier generoso, e integra auth + db + realtime + storage numa SDK.

### Plano de migração

1. Criar projeto Supabase com tabelas: `restaurants`, `categories`, `products`, `orders`, `users`
2. Substituir `storageService` por Supabase client (mesma interface: get/set/remove)
3. Migrar OTP de n8n para Supabase Auth (phone OTP nativo)
4. Manter localStorage como cache local + fallback offline
5. Adicionar sync bidirecional (local ↔ Supabase)

### O que NÃO fazer

- Não criar backend Node.js custom — overhead desnecessário para o escopo
- Não usar Firebase — vendor lock-in maior que Supabase
- Não migrar antes de ter 2+ restaurantes confirmados como clientes
