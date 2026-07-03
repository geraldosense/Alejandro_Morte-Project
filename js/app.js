(function () {
var root = document.querySelector(".enr-biblioteca");

  var BRAND = { mark: "DFI", publisher: "Capital Humano Industrial" };
  var currentLang = localStorage.getItem("dfi-lang") || "es";
  if (!window.DFI_I18N[currentLang]) currentLang = "es";

  function t(key) { return window.DFI_I18N[currentLang][key]; }

  function applyStaticI18n() {
    var dict = window.DFI_I18N[currentLang];
    document.documentElement.lang = currentLang;
    document.title = dict.pageTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", dict.metaDescription);
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });
    var langPanel = root.querySelector("#siteLangPanel");
    if (langPanel && dict.langLabel) langPanel.setAttribute("aria-label", dict.langLabel);
    root.querySelectorAll(".siteLangOption").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function closeLangMenu() {
    var langMenu = root.querySelector("#siteLangMenu");
    var langTrigger = root.querySelector("#siteLangTrigger");
    var langPanel = root.querySelector("#siteLangPanel");
    if (!langMenu || !langTrigger || !langPanel) return;
    langMenu.classList.remove("is-open");
    langTrigger.setAttribute("aria-expanded", "false");
    langPanel.hidden = true;
  }

  function toggleLangMenu() {
    var langMenu = root.querySelector("#siteLangMenu");
    var langTrigger = root.querySelector("#siteLangTrigger");
    var langPanel = root.querySelector("#siteLangPanel");
    if (!langMenu || !langTrigger || !langPanel) return;
    var open = !langMenu.classList.contains("is-open");
    langMenu.classList.toggle("is-open", open);
    langTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    langPanel.hidden = !open;
  }

  function mergeVols() {
    var texts = t("vols");
    return VOL_BASE.map(function (base, i) {
      var loc = texts[i] || {};
      return {
        n: base.n, h: base.h, accent: base.accent,
        thumb: base.thumb, youtubeId: base.youtubeId,
        videoUrl: base.videoUrl, resourceUrl: base.resourceUrl, resourceLabel: base.resourceLabel,
        short: loc.short || "", module: loc.module || "", title: loc.title || "", summary: loc.summary || ""
      };
    });
  }

  var VOL_BASE = [
    { n:"01", thumb:"https://img.youtube.com/vi/FrVlDjusLXw/maxresdefault.jpg", h:248, accent:true, youtubeId:"FrVlDjusLXw", videoUrl:"https://www.youtube.com/watch?v=FrVlDjusLXw", resourceUrl:"", resourceLabel:"" },
    { n:"02", thumb:"https://img.youtube.com/vi/W4ntQNEdYaA/maxresdefault.jpg", h:212, youtubeId:"W4ntQNEdYaA", videoUrl:"https://www.youtube.com/watch?v=W4ntQNEdYaA", resourceUrl:"", resourceLabel:"" },
    { n:"03", thumb:"https://img.youtube.com/vi/XnRkrTyPNWg/maxresdefault.jpg", h:268, youtubeId:"XnRkrTyPNWg", videoUrl:"https://www.youtube.com/watch?v=XnRkrTyPNWg", resourceUrl:"", resourceLabel:"" },
    { n:"04", thumb:"https://img.youtube.com/vi/J81m52BdSh8/maxresdefault.jpg", h:226, youtubeId:"J81m52BdSh8", videoUrl:"https://www.youtube.com/watch?v=J81m52BdSh8", resourceUrl:"", resourceLabel:"" },
    { n:"05", thumb:"", h:256, youtubeId:"", videoUrl:"", resourceUrl:"", resourceLabel:"" },
    { n:"06", thumb:"https://img.youtube.com/vi/7MqaiZakijI/maxresdefault.jpg", h:234, youtubeId:"7MqaiZakijI", videoUrl:"https://www.youtube.com/watch?v=7MqaiZakijI", resourceUrl:"", resourceLabel:"" }
  ];

  var VOLS = mergeVols();
  function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function updateCatalogCount() {
    var countEl = root.querySelector("#catalogCount");
    if (countEl) countEl.textContent = String(VOLS.length).padStart(2, "0") + " " + t("catalogCount");
  }

  var shelf = root.querySelector("#enrShelf");
  var endR = shelf.querySelector('[data-end="r"]');
  var cat = root.querySelector("#enrCatalog");

  function buildShelf() {
    shelf.querySelectorAll(".spine").forEach(function (el) { el.remove(); });
    VOLS.forEach(function (v) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spine" + (v.accent ? " accent" : "");
      btn.style.height = v.h + "px";
      btn.title = v.title;
      btn.setAttribute("data-theater", v.n);
      btn.setAttribute("aria-label", v.title);
      btn.innerHTML = '<span class="spineCap"></span><span class="spineTitle">' + esc(v.short) + '</span><span class="spineFoot"><span class="spineMark" title="' + esc(t("brandName")) + '"><span class="spineBrand">' + BRAND.mark + '</span></span><span class="spineNum">' + v.n + '</span></span>';
      shelf.insertBefore(btn, endR);
    });
  }

  function buildCatalog() {
    cat.innerHTML = "";
    VOLS.forEach(function (v) {
    var card = document.createElement("article");
    var isFeatured = !!v.accent;
    card.className = "ficha" + (isFeatured ? " ficha--featured" : " ficha--pro");
    card.id = "vol-" + v.n;
    var resLink = hasResource(v)
      ? '<a href="' + v.resourceUrl + '" target="_blank" rel="noopener noreferrer" class="fichaLink">' + esc(v.resourceLabel) + ' <span aria-hidden="true">↗</span></a>'
      : '';
    var moduleParts = v.module.split(" · ");
    var moduleCat = moduleParts.length > 2 ? moduleParts[2] : moduleParts[moduleParts.length - 1];
    var thumbInner = v.thumb
      ? '<img class="fichaImg" loading="lazy" src="' + v.thumb + '" alt="' + esc(v.title) + '">'
      : (isFeatured
        ? '<span class="fichaPlaceholder"><span class="fichaPlaceholderIcon">▶</span></span>'
        : '<div class="fichaThumbPro">' +
            '<span class="fichaThumbGrid" aria-hidden="true"></span>' +
            '<span class="fichaThumbIcon" aria-hidden="true">' +
              '<svg viewBox="0 0 48 48" width="32" height="32" fill="none">' +
                '<rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" stroke-width="2"/>' +
                '<path d="M21 18l10 6-10 6V18Z" fill="currentColor"/>' +
              '</svg>' +
            '</span>' +
            '<span class="fichaThumbStatus">' + esc(t("videoPreparing")) + '</span>' +
          '</div>');
    var thumbTag = hasVideo(v)
      ? '<button type="button" class="fichaThumb" data-open="' + v.n + '" aria-label="Ver el vídeo: ' + esc(v.title) + '">'
      : '<div class="fichaThumb fichaThumb--pending" aria-hidden="true">';
    var thumbClose = hasVideo(v) ? '</button>' : '</div>';
    var videoBtn = hasVideo(v)
      ? '<button type="button" class="fichaLink fichaLinkPrimary" data-open="' + v.n + '"><span class="fichaLinkPlay"></span> ' + esc(t("watchVideo")) + '</button>'
      : (isFeatured
        ? '<span class="fichaLink fichaLinkPending">' + esc(t("videoSoon")) + '</span>'
        : '<span class="fichaStatusBadge"><span class="fichaStatusDot"></span>' + esc(t("videoSoonPro")) + '</span>');
    card.innerHTML =
      thumbTag +
        thumbInner +
        '<span class="fichaThumbShade"></span>' +
        (hasVideo(v) ? '<span class="fichaPlay"><span class="fichaPlayTri"></span></span>' : '') +
        '<span class="fichaRef">' + BRAND.mark + ' · ' + v.n + '</span>' +
        (!isFeatured ? '<span class="fichaCat">' + esc(moduleCat) + '</span>' : '') +
      thumbClose +
      '<div class="fichaBody">' +
        '<div class="fichaHead">' +
          '<span class="fichaModule">' + esc(v.module) + '</span>' +
          (!isFeatured ? '<span class="fichaIndex">' + v.n + '</span>' : '') +
        '</div>' +
        '<h3 class="fichaTitle">' + esc(v.title) + '</h3>' +
        '<p class="fichaSummary">' + esc(v.summary) + '</p>' +
        '<div class="fichaDivider" aria-hidden="true"></div>' +
        '<div class="fichaLinks">' + videoBtn + resLink + '</div>' +
      '</div>';
    cat.appendChild(card);
    });
  }

  function hasResource(v) { return v.resourceUrl && v.resourceUrl !== "#"; }
  function hasVideo(v) { return v.youtubeId && v.youtubeId !== ""; }

  buildShelf();
  buildCatalog();
  updateCatalogCount();
  applyStaticI18n();
  var theater = root.querySelector("#shelfTheater");
  var theaterClose = root.querySelector("#shelfTheaterClose");
  var theaterRef = root.querySelector("#shelfTheaterRef");
  var theaterTitle = root.querySelector("#shelfTheaterTitle");
  var theaterSummary = root.querySelector("#shelfTheaterSummary");
  var theaterMeta = root.querySelector(".shelfTheaterMeta");
  var theaterCarousel = root.querySelector("#shelfTheaterCarousel");
  var theaterStage = root.querySelector(".shelfTheaterStage");
  var theaterInner = root.querySelector(".shelfTheaterInner");
  var theaterDragLayer = null;
  var theaterPlayerShell = root.querySelector("#theaterPlayerShell");
  var theaterNoVideo = root.querySelector("#shelfTheaterNoVideo");
  var theaterEnd = root.querySelector("#shelfTheaterEnd");
  var theaterNextBtn = root.querySelector("#shelfTheaterNextBtn");
  var theaterYtHost = document.getElementById("theaterYtHost");
  var currentTheaterN = null;
  var ytPlayer = null;
  var ytReady = false;
  var ytPending = null;

  function volByN(n) {
    return VOLS.filter(function (x) { return x.n === n; })[0];
  }

  function volIndex(n) {
    return VOLS.findIndex(function (x) { return x.n === n; });
  }

  function nextVolWithVideo(fromN) {
    var idx = volIndex(fromN);
    for (var i = idx + 1; i < VOLS.length; i++) {
      if (hasVideo(VOLS[i])) return VOLS[i];
    }
    return null;
  }

  function thumbUrl(v) {
    if (v.thumb) return v.thumb;
    if (hasVideo(v)) return "https://img.youtube.com/vi/" + v.youtubeId + "/hqdefault.jpg";
    return "";
  }

  function buildTheaterCards() {
    reparentPlayerToStage();
    theaterCarousel.innerHTML = "";
    theaterDragLayer = document.createElement("div");
    theaterDragLayer.className = "shelfTheaterDragLayer";
    theaterDragLayer.id = "shelfTheaterDragLayer";
    VOLS.forEach(function (v) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "theaterCard" + (hasVideo(v) ? "" : " theaterCard--pending");
      card.setAttribute("data-theater", v.n);
      card.setAttribute("data-offset", "0");
      card.setAttribute("aria-label", v.title);
      var thumb = v.thumb || thumbUrl(v);
      card.innerHTML =
        '<span class="theaterCardLabel">' + esc(v.title) + '</span>' +
        '<div class="theaterCardFrame">' +
          '<div class="theaterCardMedia">' +
            (thumb
              ? '<img class="theaterCardImg" src="' + thumb + '" alt="" loading="lazy">'
              : '<span class="theaterCardPlaceholder">' + esc(v.short || v.n) + '</span>') +
            '<span class="theaterCardShade" aria-hidden="true"></span>' +
            (hasVideo(v) ? '<span class="theaterCardPlay" aria-hidden="true"></span>' : '') +
            '<span class="theaterCardBrand">' + esc(BRAND.mark) + '</span>' +
          '</div>' +
        '</div>';
      theaterDragLayer.appendChild(card);
    });
    theaterCarousel.appendChild(theaterDragLayer);
  }

  function reparentPlayerToStage() {
    if (theaterStage && theaterPlayerShell && theaterPlayerShell.parentNode !== theaterStage) {
      theaterStage.appendChild(theaterPlayerShell);
    }
  }

  function mountPlayerShell() {
    var active = theaterCarousel.querySelector('.theaterCard[data-offset="0"] .theaterCardMedia');
    if (active && theaterPlayerShell.parentNode !== active) {
      active.appendChild(theaterPlayerShell);
    }
  }

  function setActiveTheaterCard(n) {
    var activeIdx = volIndex(n);
    theaterCarousel.querySelectorAll(".theaterCard").forEach(function (el) {
      var idx = volIndex(el.getAttribute("data-theater"));
      var offset = idx - activeIdx;
      el.setAttribute("data-offset", String(offset));
      el.classList.toggle("is-active", offset === 0);
      el.setAttribute("aria-hidden", Math.abs(offset) > 1 ? "true" : "false");
    });
    mountPlayerShell();
  }

  function hideTheaterEnd() {
    theaterEnd.hidden = true;
  }

  function showTheaterEnd(next) {
    if (!next) { hideTheaterEnd(); return; }
    theaterEnd.hidden = false;
    theaterNextBtn.textContent = t("theaterNext") + " · " + next.short;
    theaterNextBtn.setAttribute("data-theater", next.n);
  }

  function updateTheaterMeta(v, animate) {
    function apply() {
      theaterRef.textContent = v.module;
      theaterTitle.textContent = v.title;
      theaterSummary.textContent = v.summary;
    }
    if (!theaterMeta || animate === false) {
      apply();
      return;
    }
    theaterMeta.classList.add("is-changing");
    window.setTimeout(function () {
      apply();
      window.requestAnimationFrame(function () {
        theaterMeta.classList.remove("is-changing");
      });
    }, 190);
  }

  function showTheaterPlayer(hasVid) {
    theaterYtHost.style.display = hasVid ? "" : "none";
    theaterNoVideo.hidden = hasVid;
    if (!hasVid) hideTheaterEnd();
  }

  function createYtPlayer(v) {
    if (ytPlayer || !window.YT || !window.YT.Player) return;
    ytPlayer = new window.YT.Player("theaterYtHost", {
      height: "100%",
      width: "100%",
      videoId: v.youtubeId,
      playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1, enablejsapi: 1, fs: 1 },
      events: { onStateChange: onYtStateChange }
    });
  }

  function loadTheaterVideo(v) {
    if (!hasVideo(v)) {
      if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
      showTheaterPlayer(false);
      return;
    }
    showTheaterPlayer(true);
    hideTheaterEnd();
    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(v.youtubeId);
      ytPlayer.playVideo();
    } else if (window.YT && window.YT.Player) {
      createYtPlayer(v);
    } else {
      ytPending = v;
    }
  }

  function selectTheater(n, autoplay) {
    var v = volByN(n);
    if (!v) return;
    var isSwitch = currentTheaterN && currentTheaterN !== n;
    resetDragLayer(false);
    currentTheaterN = n;
    updateTheaterMeta(v, isSwitch);
    setActiveTheaterCard(n);
    loadTheaterVideo(v);
    if (autoplay !== false && hasVideo(v)) hideTheaterEnd();
  }

  function goToAdjacentTheater(direction) {
    if (!currentTheaterN) return;
    var idx = volIndex(currentTheaterN) + direction;
    if (idx < 0 || idx >= VOLS.length) {
      if (theaterDragLayer) {
        theaterDragLayer.classList.add("is-snapping", "is-edge");
        theaterDragLayer.style.transform = "translateX(" + (direction > 0 ? -28 : 28) + "px)";
        window.setTimeout(function () { resetDragLayer(true); }, 220);
      }
      wheelAccum = 0;
      return;
    }
    hideTheaterEnd();
    wheelAccum = 0;
    selectTheater(VOLS[idx].n);
  }

  function resetDragLayer(animate) {
    if (!theaterDragLayer) return;
    theaterDragLayer.classList.remove("is-snapping", "is-edge");
    theaterDragLayer.style.transform = "";
    if (animate) {
      theaterDragLayer.classList.add("is-snapping");
      window.setTimeout(function () {
        if (theaterDragLayer) theaterDragLayer.classList.remove("is-snapping");
      }, 400);
    }
  }

  /* —— Arrastar com o rato / toque / roda —— */
  var drag = { active: false, startX: 0, currentX: 0, pointerId: null, didDrag: false };
  var suppressCardClick = false;
  var DRAG_THRESHOLD = 56;
  var wheelLock = false;
  var wheelAccum = 0;
  var wheelResetTimer = null;
  var WHEEL_COOLDOWN = 380;
  var WHEEL_TRIGGER = 28;
  var WHEEL_TARGETS = [];

  function bindTheaterWheel(el) {
    if (!el || WHEEL_TARGETS.indexOf(el) !== -1) return;
    el.addEventListener("wheel", onTheaterWheel, { passive: false });
    WHEEL_TARGETS.push(el);
  }

  function unbindTheaterWheel() {
    WHEEL_TARGETS.forEach(function (el) {
      el.removeEventListener("wheel", onTheaterWheel, { passive: false });
    });
    WHEEL_TARGETS = [];
  }

  function attachTheaterWheelListeners() {
    unbindTheaterWheel();
    bindTheaterWheel(theater);
    bindTheaterWheel(theaterInner);
    bindTheaterWheel(theaterStage);
    bindTheaterWheel(theaterCarousel);
  }

  function isVideoInteractionTarget(el) {
    return el && el.closest('.theaterCard[data-offset="0"] .theaterCardMedia, #theaterYtHost, .theaterPlayerShell, .theaterCard[data-offset="0"] .theaterPlayerShell');
  }

  function isDragBlockedTarget(el) {
    if (!el) return false;
    if (el.closest(".shelfTheaterNextBtn, .shelfTheaterClose, .shelfTheaterEnd, .shelfTheaterNoVideo")) return true;
    if (isVideoInteractionTarget(el)) return true;
    return false;
  }

  function onTheaterPointerDown(e) {
    if (!theater || !theater.classList.contains("open")) return;
    if (isDragBlockedTarget(e.target)) return;
    if (e.button !== undefined && e.button !== 0) return;

    drag.active = true;
    drag.startX = e.clientX;
    drag.currentX = e.clientX;
    drag.pointerId = e.pointerId;
    drag.didDrag = false;

    theaterStage.classList.add("is-dragging");
    theaterCarousel.classList.add("is-dragging");
    theaterStage.setPointerCapture(e.pointerId);
  }

  function onTheaterPointerMove(e) {
    if (!drag.active || e.pointerId !== drag.pointerId || !theaterDragLayer) return;

    drag.currentX = e.clientX;
    var delta = drag.currentX - drag.startX;
    if (Math.abs(delta) > 6) drag.didDrag = true;
    theaterDragLayer.style.transform = "translateX(" + delta + "px)";
  }

  function onTheaterPointerUp(e) {
    if (!drag.active || e.pointerId !== drag.pointerId) return;

    var delta = drag.currentX - drag.startX;
    drag.active = false;
    theaterStage.classList.remove("is-dragging");
    theaterCarousel.classList.remove("is-dragging");

    try { theaterStage.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }

    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      suppressCardClick = true;
      hideTheaterEnd();
      goToAdjacentTheater(delta < 0 ? 1 : -1);
    } else {
      resetDragLayer(true);
    }

    if (drag.didDrag) suppressCardClick = true;
    drag.didDrag = false;
  }

  function onTheaterWheel(e) {
    if (!theater || !theater.classList.contains("open")) return;
    if (wheelLock || drag.active) return;
    if (e.target && e.target.closest(".shelfTheaterClose, .shelfTheaterNextBtn")) return;
    if (isVideoInteractionTarget(e.target)) return;

    var raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) raw *= 16;
    else if (e.deltaMode === 2) raw *= window.innerHeight;
    if (!raw) return;

    e.preventDefault();
    e.stopPropagation();

    wheelAccum += raw;
    if (wheelResetTimer) window.clearTimeout(wheelResetTimer);
    wheelResetTimer = window.setTimeout(function () { wheelAccum = 0; }, 120);

    if (Math.abs(wheelAccum) < WHEEL_TRIGGER) return;

    var direction = wheelAccum > 0 ? 1 : -1;
    wheelAccum = 0;
    wheelLock = true;
    hideTheaterEnd();
    goToAdjacentTheater(direction);
    window.setTimeout(function () { wheelLock = false; }, WHEEL_COOLDOWN);
  }

  function openTheater(n) {
    if (!theater) return;
    var alreadyOpen = theater.classList.contains("open");
    if (!alreadyOpen) {
      buildTheaterCards();
      theater.classList.add("open");
      theater.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      root.classList.add("theater-open");
    }
    selectTheater(n);
    if (!alreadyOpen) attachTheaterWheelListeners();
  }

  function destroyTheaterPlayer() {
    if (ytPlayer) {
      try {
        if (ytPlayer.stopVideo) ytPlayer.stopVideo();
        if (ytPlayer.destroy) ytPlayer.destroy();
      } catch (err) { /* noop */ }
      ytPlayer = null;
    }
    if (theaterYtHost) {
      theaterYtHost.innerHTML = "";
      theaterYtHost.style.display = "none";
    }
    ytPending = null;
  }

  function closeTheater() {
    if (!theater) return;
    theater.classList.remove("open");
    theater.setAttribute("aria-hidden", "true");
    root.classList.remove("theater-open");
    reparentPlayerToStage();
    unbindTheaterWheel();
    wheelAccum = 0;
    wheelLock = false;
    if (wheelResetTimer) window.clearTimeout(wheelResetTimer);
    wheelResetTimer = null;
    hideTheaterEnd();
    destroyTheaterPlayer();
    if (theaterNoVideo) theaterNoVideo.hidden = true;
    currentTheaterN = null;
    if (!root.querySelector("#enrModal.open") && !root.querySelector("#enrForm.open")) {
      document.body.style.overflow = "";
    }
  }

  function onYtStateChange(e) {
    if (e.data === window.YT.PlayerState.ENDED && currentTheaterN) {
      var next = nextVolWithVideo(currentTheaterN);
      showTheaterEnd(next);
    }
  }

  function initYtPlayer() {
    ytReady = true;
    if (ytPending && theater.classList.contains("open")) {
      var pending = ytPending;
      ytPending = null;
      createYtPlayer(pending);
    }
  }

  window.onYouTubeIframeAPIReady = initYtPlayer;
  if (window.YT && window.YT.Player) initYtPlayer();

  theaterClose.addEventListener("click", closeTheater);
  theater.addEventListener("click", function (e) {
    if (e.target === theater || e.target.classList.contains("shelfTheaterBackdrop")) closeTheater();
  });
  theaterNextBtn.addEventListener("click", function () {
    var n = theaterNextBtn.getAttribute("data-theater");
    if (n) { hideTheaterEnd(); selectTheater(n); }
  });

  if (theaterStage) {
    theaterStage.addEventListener("pointerdown", onTheaterPointerDown);
    theaterStage.addEventListener("pointermove", onTheaterPointerMove);
    theaterStage.addEventListener("pointerup", onTheaterPointerUp);
    theaterStage.addEventListener("pointercancel", onTheaterPointerUp);
  }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theater]");
    if (!t) return;
    if (suppressCardClick) {
      suppressCardClick = false;
      e.preventDefault();
      return;
    }
    e.preventDefault();
    var n = t.getAttribute("data-theater");
    if (theater.classList.contains("open") && n === currentTheaterN) return;
    openTheater(n);
  });

  document.addEventListener("keydown", function (e) {
    if (!theater || !theater.classList.contains("open")) return;
    if (e.key === "Escape") { closeTheater(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); hideTheaterEnd(); goToAdjacentTheater(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); hideTheaterEnd(); goToAdjacentTheater(1); }
  });

  // Modal (catálogo — fallback rápido)
  var overlay = root.querySelector("#enrModal");
  var vbox = root.querySelector("#enrModalVideo");
  var ref = root.querySelector("#enrModalRef");
  var ttl = root.querySelector("#enrModalTitle");
  var yt = root.querySelector("#enrModalYt");
  var res = root.querySelector("#enrModalRes");
  var resLbl = root.querySelector("#enrModalResLbl");

  function openModal(v) {
    if (!hasVideo(v)) return;
    openTheater(v.n);
  }
  function close() { closeTheater(); }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (t) { var v = volByN(t.getAttribute("data-open")); if (v && hasVideo(v)) openModal(v); }
  });
  root.querySelector("#enrModalClose").addEventListener("click", function () {
    root.querySelector("#enrModal").classList.remove("open");
  });
  overlay.addEventListener("click", function (e) { if (e.target === overlay) overlay.classList.remove("open"); });

  // Popup del formulario (acceso a Google Drive)
  var formOverlay = root.querySelector("#enrForm");
  function openForm() { formOverlay.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeForm() { formOverlay.classList.remove("open"); document.body.style.overflow = ""; }
  root.addEventListener("click", function (e) { if (e.target.closest("[data-openform]")) { e.preventDefault(); openForm(); } });
  root.querySelector("#enrFormClose").addEventListener("click", closeForm);
  formOverlay.addEventListener("click", function (e) { if (e.target === formOverlay) closeForm(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeForm(); });

  // Reveal
  var items = root.querySelectorAll("[data-rise]");
  if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("in"); }); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add("in"); }); }, 1800);
  }

  // Overlay verde do vídeo intro (YouTube) — capa visível até clicar
  var unmuteBtn = document.getElementById("vslUnmute");
  var introVideo = document.getElementById("introVideo");
  var vslPoster = document.getElementById("vslPoster");

  if (vslPoster) {
    vslPoster.addEventListener("error", function () {
      vslPoster.src = "https://img.youtube.com/vi/6r5Q8hMBE8w/hqdefault.jpg";
    });
  }

  if (unmuteBtn && introVideo) {
    unmuteBtn.addEventListener("click", function () {
      unmuteBtn.classList.add("hidden");
      if (vslPoster) vslPoster.classList.add("hidden");
      if (!introVideo.src) introVideo.src = introVideo.getAttribute("data-src");
      introVideo.classList.add("is-playing");
    });
  }

  function setLanguage(lang) {
    if (!window.DFI_I18N[lang] || lang === currentLang) {
      closeLangMenu();
      return;
    }
    currentLang = lang;
    localStorage.setItem("dfi-lang", lang);
    VOLS = mergeVols();
    var theaterOpen = theater && theater.classList.contains("open");
    var activeN = currentTheaterN;
    buildShelf();
    buildCatalog();
    updateCatalogCount();
    applyStaticI18n();
    closeLangMenu();
    if (theaterOpen && activeN) {
      buildTheaterCards();
      selectTheater(activeN);
      attachTheaterWheelListeners();
    }
  }

  var langTrigger = root.querySelector("#siteLangTrigger");
  var langMenu = root.querySelector("#siteLangMenu");
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
})();
