/* ===== DS Roadmap — логика прогресса и анимаций ===== */
(() => {
  "use strict";

  const STORAGE_KEY = "ds-roadmap-progress-v1";

  /* ---------- Состояние ---------- */
  // done = { "topicId": true, "subId": true }
  let done = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      toast("⚠️ Не удалось сохранить прогресс в браузере");
    }
  }

  /* ---------- Подсчёт прогресса ---------- */
  const topicIds = [];
  const subIds = [];
  const topicSubs = {}; // topicId -> [subId...]
  const stageTopics = {}; // stageId -> [topicId...]

  ROADMAP.forEach((stage) => {
    stageTopics[stage.id] = [];
    stage.topics.forEach((topic) => {
      topicIds.push(topic.id);
      stageTopics[stage.id].push(topic.id);
      topicSubs[topic.id] = topic.subs.map((_, i) => `${topic.id}-s${i}`);
      topicSubs[topic.id].forEach((id) => subIds.push(id));
    });
  });

  const TOTAL_UNITS = topicIds.length + subIds.length;

  function topicProgress(topicId) {
    const subs = topicSubs[topicId];
    const doneSubs = subs.filter((id) => done[id]).length;
    return { doneSubs, total: subs.length, complete: doneSubs === subs.length && subs.length > 0 };
  }

  function stageProgress(stageId) {
    let totalUnits = 0, doneUnits = 0;
    stageTopics[stageId].forEach((tid) => {
      totalUnits += 1 + topicSubs[tid].length;
      if (done[tid]) doneUnits += 1;
      doneUnits += topicSubs[tid].filter((id) => done[id]).length;
    });
    return totalUnits ? doneUnits / totalUnits : 0;
  }

  function overallProgress() {
    let doneUnits = 0;
    topicIds.forEach((id) => { if (done[id]) doneUnits += 1; });
    subIds.forEach((id) => { if (done[id]) doneUnits += 1; });
    return TOTAL_UNITS ? doneUnits / TOTAL_UNITS : 0;
  }

  /* ---------- Рендер этапов ---------- */
  const stagesRoot = document.getElementById("stages");
  const mobileNavLinks = document.getElementById("mobileNavLinks");

  ROADMAP.forEach((stage, idx) => {
    const el = document.createElement("article");
    el.className = "stage";
    el.id = `stage-${stage.id}`;
    el.style.setProperty("--stage-color", stage.color);
    el.dataset.aos = idx % 2 === 0 ? "fade-right" : "fade-left";
    el.dataset.aosOffset = "60";

    const topicsHtml = stage.topics
      .map((topic) => {
        const subsHtml = topic.subs
          .map(
            (s, i) => `
          <div class="sub" data-sub="${topic.id}-s${i}" data-topic="${topic.id}">
            <button class="check check--sm" aria-label="Отметить: ${escapeHtml(s)}"></button>
            <span>${escapeHtml(s)}</span>
          </div>`
          )
          .join("");
        return `
        <div class="topic" data-topic-box="${topic.id}">
          <div class="topic__head" data-topic-head="${topic.id}">
            <button class="check" aria-label="Отметить тему: ${escapeHtml(topic.title)}"></button>
            <h4>${escapeHtml(topic.title)}</h4>
            <span class="topic__count" data-topic-count="${topic.id}">0/${topic.subs.length}</span>
          </div>
          <div class="topic__subs">${subsHtml}</div>
        </div>`;
      })
      .join("");

    const resourcesHtml = (stage.resources || [])
      .map((r) => `<a href="${r.url}" target="_blank" rel="noopener noreferrer">↗ ${escapeHtml(r.name)}</a>`)
      .join("");

    el.innerHTML = `
      <div class="stage__node" aria-hidden="true">${stage.icon}</div>
      <div class="stage__card" data-stage-card="${stage.id}">
        <div class="stage__head">
          <span class="stage__num">ЭТАП ${stage.num}</span>
          <h3 class="stage__title">${escapeHtml(stage.title)}</h3>
        </div>
        <div class="stage__meta">
          <span class="chip">⏱ ${escapeHtml(stage.duration)}</span>
          <span class="chip chip--level">${escapeHtml(stage.level)}</span>
        </div>
        <p class="stage__desc">${escapeHtml(stage.desc)}</p>
        <div class="stage__bar"><div class="stage__bar-fill" data-stage-bar="${stage.id}"></div></div>
        <div class="stage__bar-label">
          <span data-stage-pct="${stage.id}">0%</span>
          <span class="done-mark" data-stage-done="${stage.id}" hidden>✓ этап пройден</span>
        </div>
        <span class="stage__toggle">Темы и навыки <span class="chev">▾</span></span>
        <div class="stage__body">
          ${topicsHtml}
          ${resourcesHtml ? `<div class="stage__resources"><h5>Ресурсы</h5>${resourcesHtml}</div>` : ""}
        </div>
      </div>`;

    stagesRoot.appendChild(el);

    const navLink = document.createElement("a");
    navLink.href = `#stage-${stage.id}`;
    navLink.textContent = `${stage.num} · ${stage.title}`;
    navLink.addEventListener("click", closeMobileNav);
    mobileNavLinks.appendChild(navLink);
  });

  /* ---------- Раскрытие этапов ---------- */
  document.querySelectorAll("[data-stage-card]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".check") || e.target.closest(".sub") || e.target.closest("a")) return;
      card.closest(".stage").classList.toggle("is-open");
    });
  });

  // Первый этап открыт по умолчанию
  const firstStage = document.querySelector(".stage");
  if (firstStage) firstStage.classList.add("is-open");

  /* ---------- Обработчики чекбоксов ---------- */
  function setTopic(topicId, value, { silent } = {}) {
    done[topicId] = value;
    topicSubs[topicId].forEach((sid) => (done[sid] = value));
    save();
    syncTopic(topicId);
    refreshAll();
    if (value && !silent) {
      const topic = findTopic(topicId);
      toast(`✅ Тема «${topic.title}» пройдена!`);
    }
  }

  function toggleSub(subId, topicId) {
    done[subId] = !done[subId];
    // Авто-отметка темы, когда все подпункты закрыты
    const allDone = topicSubs[topicId].every((id) => done[id]);
    done[topicId] = allDone;
    save();
    syncTopic(topicId);
    refreshAll();
    if (allDone) {
      const topic = findTopic(topicId);
      toast(`✅ Тема «${topic.title}» пройдена!`);
    }
  }

  function findTopic(topicId) {
    for (const s of ROADMAP) for (const t of s.topics) if (t.id === topicId) return t;
    return { title: topicId };
  }

  document.querySelectorAll("[data-topic-head]").forEach((head) => {
    const topicId = head.dataset.topicHead;
    head.querySelector(".check").addEventListener("click", (e) => {
      e.stopPropagation();
      setTopic(topicId, !done[topicId]);
    });
    head.addEventListener("click", (e) => {
      if (e.target.closest(".check")) return;
      setTopic(topicId, !done[topicId]);
    });
  });

  document.querySelectorAll(".sub").forEach((subEl) => {
    subEl.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSub(subEl.dataset.sub, subEl.dataset.topic);
    });
  });

  /* ---------- Синхронизация UI с состоянием ---------- */
  function syncTopic(topicId) {
    const box = document.querySelector(`[data-topic-box="${topicId}"]`);
    if (!box) return;
    const { doneSubs, total, complete } = topicProgress(topicId);
    box.classList.toggle("is-done", complete);
    box.querySelector(".check").classList.toggle("is-checked", !!done[topicId]);
    box.querySelector(`[data-topic-count="${topicId}"]`).textContent = `${doneSubs}/${total}`;
    topicSubs[topicId].forEach((sid) => {
      const subEl = box.querySelector(`[data-sub="${sid}"]`);
      subEl.classList.toggle("is-done", !!done[sid]);
      subEl.querySelector(".check").classList.toggle("is-checked", !!done[sid]);
    });
  }

  function syncStages(prevOverall) {
    ROADMAP.forEach((stage) => {
      const p = stageProgress(stage.id);
      const pct = Math.round(p * 100);
      document.querySelector(`[data-stage-bar="${stage.id}"]`).style.width = `${pct}%`;
      document.querySelector(`[data-stage-pct="${stage.id}"]`).textContent = `${pct}%`;
      document.querySelector(`[data-stage-done="${stage.id}"]`).hidden = p < 1;
    });

    const overall = overallProgress();
    const pct = Math.round(overall * 100);
    document.getElementById("overallPct").textContent = `${pct}%`;
    const ring = document.getElementById("ringFill");
    const C = 2 * Math.PI * 19; // 119.38
    ring.style.strokeDashoffset = String(C * (1 - overall));
    document.getElementById("lineFill").style.height = `${pct}%`;
    document.getElementById("statDone").textContent =
      topicIds.filter((id) => done[id]).length + subIds.filter((id) => done[id]).length;

    // Конфетти при 100%
    if (prevOverall !== undefined && prevOverall < 1 && overall >= 1) {
      celebrate();
      toast("🏆 Весь роадмап пройден! Вы невероятны!");
    }
  }

  function refreshAll() {
    const prev = refreshAll._prev;
    syncStages(prev);
    refreshAll._prev = overallProgress();
  }

  /* ---------- Тост ---------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  /* ---------- Конфетти ---------- */
  function celebrate() {
    if (typeof confetti !== "function") return;
    const colors = ["#7c5cff", "#2dd4bf", "#ec4899", "#eab308", "#38bdf8"];
    confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1 }, colors }), 450);
  }

  /* ---------- Экспорт / импорт / сброс ---------- */
  function exportProgress() {
    const payload = {
      app: "ds-roadmap",
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: done,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ds-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("⬇ Прогресс сохранён в файл");
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = data && typeof data === "object" ? (data.progress || data) : null;
        if (!incoming || typeof incoming !== "object") throw new Error("bad format");
        // Применяем только известные ключи
        const valid = new Set([...topicIds, ...subIds]);
        done = {};
        Object.keys(incoming).forEach((k) => {
          if (valid.has(k)) done[k] = !!incoming[k];
        });
        // Восстанавливаем согласованность тема/подпункты
        topicIds.forEach((tid) => {
          done[tid] = topicSubs[tid].every((sid) => done[sid]);
        });
        save();
        topicIds.forEach(syncTopic);
        refreshAll();
        toast("⬆ Прогресс загружен из файла");
      } catch {
        toast("⚠️ Не удалось прочитать файл прогресса");
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!confirm("Сбросить весь прогресс? Действие необратимо.")) return;
    done = {};
    save();
    topicIds.forEach(syncTopic);
    refreshAll();
    toast("🗑 Прогресс сброшен");
  }

  const importFile = document.getElementById("importFile");
  importFile.addEventListener("change", () => {
    if (importFile.files[0]) importProgress(importFile.files[0]);
    importFile.value = "";
  });

  document.getElementById("btnExport").addEventListener("click", exportProgress);
  document.getElementById("btnImport").addEventListener("click", () => importFile.click());
  document.getElementById("btnReset").addEventListener("click", resetProgress);
  document.getElementById("btnExportM").addEventListener("click", () => { closeMobileNav(); exportProgress(); });
  document.getElementById("btnImportM").addEventListener("click", () => { closeMobileNav(); importFile.click(); });
  document.getElementById("btnResetM").addEventListener("click", () => { closeMobileNav(); resetProgress(); });

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    burger.classList.remove("is-open");
    mobileNav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  /* ---------- Шапка при скролле ---------- */
  const topbar = document.getElementById("topbar");
  window.addEventListener("scroll", () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ---------- Утилиты ---------- */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- Стартовая инициализация ---------- */
  document.getElementById("statTopics").textContent = topicIds.length;
  document.getElementById("statSkills").textContent = subIds.length;

  topicIds.forEach(syncTopic);
  refreshAll();

  // AOS — анимации при скролле
  if (window.AOS) AOS.init({ duration: 700, easing: "ease-out-cubic", once: true });

  // GSAP — параллакс свечения и плавное появление hero
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.to(".bg-glow--1", {
      y: 120, ease: "none",
      scrollTrigger: window.ScrollTrigger ? { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } : undefined,
    });
    gsap.to(".bg-glow--2", {
      y: -140, ease: "none",
      scrollTrigger: window.ScrollTrigger ? { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } : undefined,
    });
  }
})();
