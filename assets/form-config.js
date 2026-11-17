/*
 * CONFIGURAÇÃO DO FORMULÁRIO — único lugar para conectar o envio de leads.
 *
 * Escolha UM provedor em `provider` e preencha os dados dele:
 *
 *   "hubspot"  → preencha hubspot.portalId e hubspot.formId
 *                (HubSpot > Marketing > Formulários > abrir o formulário > Compartilhar/Incorporar:
 *                 o código mostra portalId e formId). Os campos do formulário no HubSpot precisam
 *                 ter os nomes internos listados em `hubspot.fields` abaixo (ajuste se forem outros).
 *
 *   "webhook"  → preencha webhookUrl (Zapier, Make, RD Station via integração, n8n etc.).
 *                O formulário envia um POST JSON com todos os campos.
 *
 *   "none"     → nada é enviado. Use só para prévia. NÃO publique anúncios com "none".
 *
 * Depois de enviar com sucesso, o evento `generate_lead` vai para o dataLayer (GTM/GA4).
 */
window.GROWNT_FORM = {
  provider: "none",

  hubspot: {
    portalId: "",
    formId: "",
    // nome do campo na página → nome interno do campo no HubSpot
    fields: {
      nome: "firstname",
      email: "email",
      empresa: "company",
      cargo: "jobtitle",
      regime: "regime_tributario",
      telefone: "phone",
      utm_source: "utm_source",
      utm_medium: "utm_medium",
      utm_campaign: "utm_campaign",
      utm_term: "utm_term",
      utm_content: "utm_content",
      gclid: "gclid"
    }
  },

  webhookUrl: "",

  // opcional: página de obrigado (ex.: "/obrigado.html"). Vazio = mensagem no próprio cartão.
  redirectUrl: ""
};
