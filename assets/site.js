// 公開ページの動きだけを残したスクリプト。文言や構成は index.html を直接編集する。
(function () {
  var EVENT_START = new Date("2026-11-08T10:00:00+09:00").getTime();
  var STAMP_KEY = "ibaraki-marche-stamps";
  var TOWN_COUNT = 8;

  function calendarDays() {
    var now = new Date();
    var target = Date.UTC(2026, 10, 8);
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }

  function remaining() {
    var ms = EVENT_START - Date.now();
    if (ms <= 0) return null;
    var seconds = Math.floor(ms / 1000);
    return {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    };
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderCountdown() {
    var days = calendarDays();
    document.querySelectorAll("[data-countdown-days]").forEach(function (el) {
      el.textContent = days > 0 ? String(days) : days === 0 ? "0" : "0";
    });
    var badge = document.querySelector("[data-countdown-days]");
    if (badge && badge.parentElement && days <= 0) {
      badge.parentElement.textContent = days === 0 ? "本日開催！" : "開催しました";
    }
    var clock = remaining();
    document.querySelectorAll("[data-cd]").forEach(function (el) {
      if (!clock) {
        el.textContent = "00";
        return;
      }
      el.textContent = pad(clock[el.getAttribute("data-cd")]);
    });
  }

  function loadVisited() {
    try {
      var raw = JSON.parse(localStorage.getItem(STAMP_KEY) || "null");
      var visited = raw && raw.state && raw.state.visited;
      return Array.isArray(visited) ? visited.filter(function (name) { return typeof name === "string"; }) : [];
    } catch (error) {
      return [];
    }
  }

  function saveVisited(visited) {
    localStorage.setItem(STAMP_KEY, JSON.stringify({ state: { visited: visited }, version: 0 }));
  }

  function renderStamps(visited) {
    var owned = {};
    visited.forEach(function (name) { owned[name] = true; });
    document.querySelectorAll("[data-town]").forEach(function (button) {
      var on = !!owned[button.getAttribute("data-town")];
      button.textContent = on ? "スタンプ獲得済み" : "このまちをチェック";
      button.classList.toggle("primary", !on);
      button.classList.toggle("ghost", on);
    });
    var label = visited.length + "/" + TOWN_COUNT;
    document.querySelectorAll("[data-stamp-count]").forEach(function (el) {
      el.textContent = label;
    });
    document.querySelectorAll("[data-stamp-bar]").forEach(function (el) {
      el.style.width = (visited.length / TOWN_COUNT) * 100 + "%";
    });
  }

  function watchReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (el) { observer.observe(el); });
  }

  function watchHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;
    var onClass = ["bg-paper/90", "shadow-[0_8px_24px_-18px_rgb(74_46_20_/_0.4)]", "backdrop-blur-md"];
    function paint() {
      var on = window.scrollY > 12;
      onClass.forEach(function (name) { header.classList.toggle(name, on); });
      header.classList.toggle("bg-transparent", !on);
    }
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  document.addEventListener("click", function (event) {
    var town = event.target.closest("[data-town]");
    if (town) {
      var name = town.getAttribute("data-town");
      var visited = loadVisited();
      if (visited.indexOf(name) === -1) {
        visited.push(name);
        saveVisited(visited);
        renderStamps(visited);
      }
      return;
    }
    var taste = event.target.closest("[data-taste]");
    if (!taste) return;
    var card = taste.closest("article");
    var note = card && card.querySelector("[data-taste-note]");
    if (!note) return;
    note.hidden = false;
    note.textContent = "「" + taste.getAttribute("data-taste") + "」おいしそう！会場で味わってみて。";
    window.clearTimeout(note._timer);
    note._timer = window.setTimeout(function () { note.hidden = true; }, 1400);
  });

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
  renderStamps(loadVisited());
  watchReveal();
  watchHeader();
})();
