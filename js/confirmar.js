(function () {
  var LANG_KEY = "dfi_lang";
  var root = document.querySelector(".enr-confirmar");
  if (!root || !window.DFI_I18N) return;

  var lang = localStorage.getItem(LANG_KEY) || "es";
  if (!DFI_I18N[lang]) lang = "es";

  function t(key) {
    var pack = DFI_I18N[lang] || DFI_I18N.es;
    return pack[key] != null ? pack[key] : (DFI_I18N.es[key] || "");
  }

  function applyI18n() {
    document.documentElement.lang = lang === "pt" ? "pt" : lang;
    var titleKey = "confirmarPageTitle";
    var descKey = "confirmarMetaDescription";
    if (t(titleKey)) document.title = t(titleKey);
    var meta = document.querySelector('meta[name="description"]');
    if (meta && t(descKey)) meta.setAttribute("content", t(descKey));

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (val) el.textContent = val;
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key);
      if (val) el.innerHTML = val;
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var val = t(key);
      if (val) el.setAttribute("aria-label", val);
    });

    root.querySelectorAll(".siteLangOption").forEach(function (btn) {
      btn.setAttribute("aria-selected", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  function buildGrid() {
    var grid = document.getElementById("confirmGrid");
    if (!grid) return;
    var vols = (DFI_I18N[lang] || DFI_I18N.es).vols || [];
    grid.innerHTML = vols.map(function (v) {
      return (
        '<article class="confirmCard">' +
          '<p class="confirmCardModule">' + v.module + "</p>" +
          '<h3 class="confirmCardTitle">' + v.title + "</h3>" +
          '<p class="confirmCardSummary">' + v.summary + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function setLanguage(next) {
    if (!DFI_I18N[next]) return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    applyI18n();
    buildGrid();
    closeLangMenu();
  }

  var langTrigger = root.querySelector("#siteLangTrigger");
  var langMenu = root.querySelector("#siteLangMenu");
  function closeLangMenu() {
    if (langMenu) langMenu.classList.remove("open");
    if (langTrigger) langTrigger.setAttribute("aria-expanded", "false");
  }
  function toggleLangMenu() {
    if (!langMenu) return;
    var open = langMenu.classList.toggle("open");
    if (langTrigger) langTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (langTrigger) {
    langTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleLangMenu();
    });
  }
  root.querySelectorAll(".siteLangOption").forEach(function (btn) {
    btn.addEventListener("click", function () { setLanguage(btn.getAttribute("data-lang")); });
  });
  document.addEventListener("click", function (e) {
    if (langMenu && !langMenu.contains(e.target)) closeLangMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLangMenu();
  });

  applyI18n();
  buildGrid();

  root.querySelectorAll("[data-rise]").forEach(function (el) { el.classList.add("in"); });
})();
