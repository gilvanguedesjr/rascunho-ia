(function () {
  "use strict";
  var CFG = window.CG_CONFIG || {};
  var CHAVE = "cg_rascunho_v1";
  var qs = new URLSearchParams(location.search);

  /* ---------- Meta Pixel ---------- */
  if (CFG.PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,"script","https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", CFG.PIXEL_ID);
    fbq("track", "PageView");
  }
  function pixel(evento, dados) { try { if (window.fbq) fbq("track", evento, dados || {}); } catch (e) {} }

  /* ---------- Estado ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }
  var estado = { id: uuid(), liberado: false, r: {} };
  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && salvo.id) estado = salvo;
  } catch (e) {}
  function guardar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }

  function limpaNome(v) {
    v = (v || "").replace(/[^A-Za-zÀ-ÿ' ]/g, "").trim().slice(0, 40);
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : "";
  }
  var nomeUrl = limpaNome(qs.get("n"));
  if (nomeUrl && !estado.r.nome) estado.r.nome = nomeUrl;
  function primeiroNome() { return (estado.r.nome || "").split(" ")[0]; }
  if (primeiroNome()) document.getElementById("saudacao").textContent = primeiroNome() + ", seu material";

  /* ---------- Perguntas ---------- */
  var PASSOS = [
    { id: "nome", tipo: "texto", titulo: "Pra começar: como posso te chamar?", placeholder: "Seu nome", auto: "given-name",
      valida: function (v) { return v.trim().length >= 2; }, erro: "Me diz o seu nome." },
    { id: "whatsapp", tipo: "tel", titulo: function () { return "Qual o seu WhatsApp" + (primeiroNome() ? ", " + primeiroNome() : "") + "?"; },
      dica: "Com DDD. É por lá que eu tiro dúvida se você travar.", placeholder: "(83) 99999-9999", auto: "tel-national",
      valida: function (v) { var d = v.replace(/\D/g, ""); return d.length === 10 || d.length === 11; }, erro: "Confere o número com DDD." },
    { id: "email", tipo: "email", titulo: "E o seu melhor e-mail?", placeholder: "voce@email.com", auto: "email",
      valida: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, erro: "Esse e-mail não parece certo." },
    { id: "perfil", tipo: "opcoes", titulo: "Qual é a sua situação hoje?",
      opcoes: ["Tenho um negócio próprio", "Sou gestor de tráfego ou social media", "Trabalho no marketing de uma empresa", "Estou começando agora"] },
    { id: "faturamento", tipo: "opcoes", titulo: "Quanto o negócio fatura por mês?", dica: "Uma média já serve.",
      opcoes: ["Ainda não fatura", "Até R$ 10 mil", "De R$ 10 mil a R$ 50 mil", "De R$ 50 mil a R$ 200 mil", "Acima de R$ 200 mil"] },
    { id: "investimento", tipo: "opcoes", titulo: "E quanto vai em anúncio por mês?",
      opcoes: ["Ainda não invisto", "Até R$ 1 mil", "De R$ 1 mil a R$ 5 mil", "De R$ 5 mil a R$ 20 mil", "Acima de R$ 20 mil"] },
    { id: "objetivo", tipo: "opcoes", titulo: "O que você quer que a IA faça primeiro?",
      opcoes: ["Subir campanhas", "Analisar resultados", "Escrever textos e escolher criativos", "Atender clientes no WhatsApp", "Tudo isso"] }
  ];
  var atual = 0;
  var area = document.getElementById("pergunta");

  function tela(nome) { document.body.setAttribute("data-tela", nome); window.scrollTo(0, 0); }

  function mascaraTel(el) {
    var d = el.value.replace(/\D/g, "").slice(0, 11), o = "";
    if (d.length > 0) o = "(" + d.slice(0, 2);
    if (d.length >= 3) o += ") " + d.slice(2, d.length > 10 ? 7 : 6);
    if (d.length >= 7) o += "-" + d.slice(d.length > 10 ? 7 : 6);
    el.value = o;
  }

  function desenha() {
    var p = PASSOS[atual];
    document.getElementById("progresso").style.width = Math.round((atual / PASSOS.length) * 100) + "%";
    document.getElementById("contador").textContent = (atual + 1) + " de " + PASSOS.length;
    document.getElementById("voltar").hidden = atual === 0;

    var box = document.createElement("div"); box.className = "pergunta";
    var h = document.createElement("h2"); h.textContent = typeof p.titulo === "function" ? p.titulo() : p.titulo; box.appendChild(h);
    var dica = document.createElement("p"); dica.className = "dica"; dica.textContent = p.dica || ""; box.appendChild(dica);

    if (p.tipo === "opcoes") {
      var lista = document.createElement("div"); lista.className = "opcoes";
      p.opcoes.forEach(function (txt) {
        var b = document.createElement("button"); b.type = "button"; b.className = "opcao"; b.textContent = txt;
        if (estado.r[p.id] === txt) b.classList.add("sel");
        b.addEventListener("click", function () {
          lista.querySelectorAll(".opcao").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel"); estado.r[p.id] = txt; guardar();
          setTimeout(avanca, 180);
        });
        lista.appendChild(b);
      });
      box.appendChild(lista);
    } else {
      var form = document.createElement("form"); form.noValidate = true;
      var inp = document.createElement("input"); inp.className = "campo"; inp.placeholder = p.placeholder; inp.autocomplete = p.auto;
      inp.type = p.tipo === "texto" ? "text" : p.tipo; inp.value = estado.r[p.id] || "";
      if (p.tipo === "tel") { inp.inputMode = "numeric"; inp.addEventListener("input", function () { mascaraTel(inp); }); }
      if (p.tipo === "email") inp.inputMode = "email";
      var erro = document.createElement("p"); erro.className = "erro"; erro.setAttribute("role", "alert");
      var ok = document.createElement("button"); ok.type = "submit"; ok.className = "btn"; ok.textContent = "Continuar";
      form.appendChild(inp); form.appendChild(erro); form.appendChild(ok);
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!p.valida(inp.value)) { inp.classList.add("ruim"); erro.textContent = p.erro; inp.focus(); return; }
        estado.r[p.id] = p.id === "nome" ? limpaNome(inp.value) : inp.value.trim(); guardar();
        avanca();
      });
      box.appendChild(form);
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
    }
    area.innerHTML = ""; area.appendChild(box);
  }

  function avanca() {
    var p = PASSOS[atual];
    // Contato completo (nome, WhatsApp e e-mail): já salva o lead, mesmo que a pessoa pare no meio.
    if (p.id === "email") { salvar(false); pixel("Lead", { content_name: CFG.CAMPANHA }); }
    if (atual < PASSOS.length - 1) { atual++; desenha(); return; }
    estado.liberado = true; guardar();
    salvar(true);
    pixel("CompleteRegistration", { content_name: CFG.CAMPANHA });
    tela("conteudo");
  }

  /* ---------- Gravação no Supabase ---------- */
  function salvar(completo) {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) { console.warn("[rascunho-ia] Supabase não configurado: lead não salvo."); return; }
    var r = estado.r;
    var corpo = {
      p_id: estado.id,
      p_nome: r.nome || "",
      p_whatsapp: (r.whatsapp || "").replace(/\D/g, ""),
      p_email: (r.email || "").toLowerCase(),
      p_perfil: r.perfil || null,
      p_faturamento: r.faturamento || null,
      p_investimento: r.investimento || null,
      p_objetivo: r.objetivo || null,
      p_completo: !!completo,
      p_campanha: CFG.CAMPANHA,
      p_origem: qs.get("utm_source") ? [qs.get("utm_source"), qs.get("utm_medium"), qs.get("utm_campaign")].filter(Boolean).join(" / ") : CFG.ORIGEM_PADRAO
    };
    try {
      fetch(CFG.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/salvar_lead_rascunho", {
        method: "POST", keepalive: true,
        headers: { "Content-Type": "application/json", "apikey": CFG.SUPABASE_ANON_KEY, "Authorization": "Bearer " + CFG.SUPABASE_ANON_KEY },
        body: JSON.stringify(corpo)
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- Navegação ---------- */
  document.getElementById("comecar").addEventListener("click", function () { tela("quiz"); desenha(); });
  document.getElementById("voltar").addEventListener("click", function () { if (atual > 0) { atual--; desenha(); } });
  if (estado.liberado) tela("conteudo");

  /* ---------- Botões de copiar ---------- */
  document.querySelectorAll(".copiar").forEach(function (b) {
    b.addEventListener("click", function () {
      var texto = document.getElementById(b.getAttribute("data-alvo")).textContent;
      function feito() { b.textContent = "Copiado"; b.classList.add("feito"); setTimeout(function () { b.textContent = "Copiar"; b.classList.remove("feito"); }, 1800); }
      function antigo() {
        var t = document.createElement("textarea"); t.value = texto; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); feito(); } catch (e) {}
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(feito, antigo); else antigo();
    });
  });
})();
