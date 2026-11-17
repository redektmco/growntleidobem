# LP Lei do Bem · Grownt

Landing page de geração de leads para empresas com PD&I no Lucro Real.
Site estático: não precisa instalar nada nem rodar build.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página inteira (textos, seções, formulário) |
| `assets/styles.css` | Visual (cores, fontes, espaçamentos) |
| `assets/main.js` | Comportamento (seletor PD&I/Fiscal, validação e envio do formulário) |
| `assets/form-config.js` | **Onde conectar o formulário** (HubSpot ou webhook) |
| `assets/*.webp, *.png` | Imagens e selos, todos vindos de grownt.tech |

## Conectar o formulário (obrigatório antes de rodar mídia)

Abra `assets/form-config.js` e troque `provider: "none"` por:

- **HubSpot:** `provider: "hubspot"` e preencha `portalId` e `formId`. No HubSpot, o formulário precisa ter os campos com os nomes internos listados em `fields` (ajuste os nomes se forem outros, por exemplo `regime_tributario`).
- **Webhook (Zapier, Make, RD via integração, n8n):** `provider: "webhook"` e cole a URL em `webhookUrl`. Chega um JSON com nome, email, empresa, cargo, regime, telefone, UTMs, gclid e página.

Com `"none"` o formulário mostra a mensagem de sucesso mas **não envia nada**.

Depois de cada envio com sucesso, o evento `generate_lead` vai para o `dataLayer` (GTM/GA4).
Para uma página de obrigado, preencha `redirectUrl`.

## Editar textos

Os textos estão em `index.html`, em português, na ordem em que aparecem na página.
Salve o arquivo e suba de novo. Não é preciso mexer no CSS para trocar texto.

## Publicação

Publicado na Vercel como site estático (sem build). Qualquer hospedagem que sirva arquivos HTML funciona.
