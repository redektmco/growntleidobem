(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- seletor PD&I / Fiscal ---------- */
  var seg = document.querySelector(".seg");
  if (seg) {
    var tabs = Array.prototype.slice.call(seg.querySelectorAll('[role="tab"]'));
    var current = 0;
    var select = function (i, focus) {
      if (focus) tabs[i].focus();
      if (i === current) return;
      current = i;
      tabs.forEach(function (t, j) {
        var on = i === j;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on) {
          panel.hidden = false;
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        } else {
          panel.hidden = true;
        }
      });
      seg.setAttribute("data-active", String(i));
    };
    tabs.forEach(function (t, i) {
      // resposta no pointerdown: a troca acontece no toque, não no soltar
      t.addEventListener("pointerdown", function (e) { if (e.button === 0) select(i); });
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, k = e.key;
        if (k === "ArrowRight" || k === "ArrowLeft") {
          e.preventDefault();
          select((i + (k === "ArrowRight" ? 1 : n - 1)) % n, true);
        } else if (k === "Home" || k === "End") {
          e.preventDefault();
          select(k === "Home" ? 0 : n - 1, true);
        }
      });
    });
  }

  /* ---------- CTAs levam ao formulário ---------- */
  var formCard = document.getElementById("diagnostico");
  var firstField = document.getElementById("f-nome");
  document.querySelectorAll("[data-focus-form]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      formCard.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      formCard.classList.remove("is-flash");
      void formCard.offsetWidth;
      formCard.classList.add("is-flash");
      window.setTimeout(function () {
        if (firstField && !document.querySelector("[data-form-done]:not([hidden])")) firstField.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 550);
    });
  });

  /* ---------- barra fixa no celular ---------- */
  var dock = document.querySelector("[data-dock]");
  var closeSec = document.querySelector(".close");
  if (dock && "IntersectionObserver" in window) {
    var formVisible = true, closeVisible = false;
    var sync = function () {
      var show = !formVisible && !closeVisible && window.scrollY > window.innerHeight * 0.6;
      dock.classList.toggle("is-shown", show);
      dock.setAttribute("aria-hidden", show ? "false" : "true");
      dock.querySelector("a").tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (es) { formVisible = es[0].isIntersecting; sync(); }, { rootMargin: "0px 0px -10% 0px" }).observe(formCard);
    window.addEventListener("scroll", sync, { passive: true });
    if (closeSec) new IntersectionObserver(function (es) { closeVisible = es[0].isIntersecting; sync(); }).observe(closeSec);
  }

  /* ---------- anel da marca na seção de prova ---------- */
  var proof = document.querySelector(".proof");
  if (proof) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { proof.classList.add("is-in"); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(proof);
    } else {
      proof.classList.add("is-in");
    }
  }

  /* ---------- formulário ---------- */
  var form = document.getElementById("lead-form");
  if (!form) return;

  // origem do lead (UTM, gclid, página)
  var params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) {
    var v = params.get(k);
    try {
      if (v) sessionStorage.setItem("gr_" + k, v); else v = sessionStorage.getItem("gr_" + k);
    } catch (err) { /* armazenamento indisponível */ }
    if (v && form.elements[k]) form.elements[k].value = v;
  });
  form.elements.pagina.value = window.location.href.split("#")[0];

  var msgs = {
    nome: "Informe seu nome.",
    email: "Informe um e-mail válido, como voce@empresa.com.br.",
    empresa: "Informe o nome da empresa.",
    cargo: "Informe seu cargo.",
    regime: "Selecione o regime tributário. Se não souber, escolha “Não sei informar”."
  };
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var setErr = function (name, text) {
    var input = form.elements[name];
    var field = input.closest(".field");
    var err = document.getElementById("e-" + name);
    field.classList.toggle("is-invalid", !!text);
    input.setAttribute("aria-invalid", text ? "true" : "false");
    if (text) {
      err.textContent = text; err.hidden = false;
      input.setAttribute("aria-describedby", err.id);
    } else {
      err.hidden = true; input.removeAttribute("aria-describedby");
    }
  };
  var check = function (name) {
    var v = (form.elements[name].value || "").trim();
    var bad = !v || (name === "email" && !emailRe.test(v));
    setErr(name, bad ? msgs[name] : "");
    return !bad;
  };

  Object.keys(msgs).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener("blur", function () { if (el.value) check(name); });
    el.addEventListener("input", function () { if (el.closest(".field").classList.contains("is-invalid")) check(name); });
    el.addEventListener("change", function () { check(name); });
  });

  var note = document.getElementById("regime-note");
  form.elements.regime.addEventListener("change", function () {
    var v = form.elements.regime.value;
    note.hidden = !(v === "Lucro Presumido" || v === "Simples Nacional");
  });

  // máscara leve de telefone BR
  form.elements.telefone.addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    e.target.value = out;
  });

  var status = form.querySelector(".form__status");
  var btn = form.querySelector('button[type="submit"]');

  var collect = function () {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.name !== "website") data[el.name] = (el.value || "").trim();
    });
    return data;
  };

  var getCookie = function (name) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : undefined;
  };

  var send = function (data) {
    var cfg = window.GROWNT_FORM || { provider: "none" };
    if (cfg.provider === "hubspot" && cfg.hubspot && cfg.hubspot.portalId && cfg.hubspot.formId) {
      var map = cfg.hubspot.fields || {};
      var fields = Object.keys(map).filter(function (k) { return data[k]; }).map(function (k) {
        return { objectTypeId: "0-1", name: map[k], value: data[k] };
      });
      var body = { fields: fields, context: { pageUri: data.pagina, pageName: document.title } };
      var hutk = getCookie("hubspotutk");
      if (hutk) body.context.hutk = hutk;
      return fetch("https://api.hsforms.com/submissions/v3/integration/submit/" + encodeURIComponent(cfg.hubspot.portalId) + "/" + encodeURIComponent(cfg.hubspot.formId), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      }).then(function (r) { if (!r.ok) throw new Error("hubspot " + r.status); });
    }
    if (cfg.provider === "webhook" && cfg.webhookUrl) {
      return fetch(cfg.webhookUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ origem: "LP Lei do Bem", enviado_em: new Date().toISOString() }, data))
      }).then(function (r) { if (!r.ok) throw new Error("webhook " + r.status); });
    }
    if (window.console) console.warn("[Grownt] Formulário sem destino configurado (assets/form-config.js). Dados:", data);
    return new Promise(function (res) { setTimeout(res, 600); });
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;
    if (form.elements.website.value) return; // robô

    var firstBad = null;
    Object.keys(msgs).forEach(function (name) {
      if (!check(name) && !firstBad) firstBad = form.elements[name];
    });
    if (firstBad) { firstBad.focus(); return; }

    var data = collect();
    btn.disabled = true; btn.classList.add("is-loading");
    btn.querySelector(".btn__label").textContent = "Enviando";

    send(data).then(function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", form: "lei_do_bem_diagnostico", regime: data.regime });
      var cfg = window.GROWNT_FORM || {};
      if (cfg.redirectUrl) { window.location.href = cfg.redirectUrl; return; }
      document.querySelector("[data-form-view]").hidden = true;
      var done = document.querySelector("[data-form-done]");
      done.hidden = false;
      done.querySelector(".formcard__title").focus();
      var d = document.querySelector("[data-dock]");
      if (d) d.remove();
    }).catch(function () {
      btn.disabled = false; btn.classList.remove("is-loading");
      btn.querySelector(".btn__label").textContent = "Avaliar potencial de incentivo";
      status.textContent = "Não conseguimos enviar agora. Tente de novo em instantes ou escreva para a Grownt em grownt.tech/contato.";
      status.hidden = false;
    });
  });
})();
