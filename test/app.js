/* ============================================================
   Hyo-seung Shin — Portfolio
   Shared helpers: data loading, formatting, nav, theme
   Data source of truth: ./profile.json, ./research.json
   ============================================================ */

const APP = (() => {

  const ME = "Hyo-seung Shin";

  /* ---------- tiny utils ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const dead = u => !u || /404NotFound|to\.be\.continue|^#?$/i.test(u);
  const byYear = a => a.slice().sort((x, y) => (y.year || 0) - (x.year || 0));

  /* research.json keeps journal split into international / domestic */
  const journals = r => [
    ...(r.journal?.international || []),
    ...(r.journal?.domestic || [])
  ];

  /* ---------- markup fragments ---------- */
  const fileLinks = ls => (ls && ls.length)
    ? `<div class="files">${ls.map(l => dead(l.url)
        ? `<span>${esc(l.name)}</span>`
        : `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>`
      ).join("")}</div>`
    : "";

  const authorList = as => (as || [])
    .map(a => a === ME ? `<b>${esc(a)}</b>` : esc(a))
    .join(", ");

  function paperRow(p, kind, withThumb = false) {
    return `<article class="item">
      <div>
        <h4 class="t">${esc(p.title)}</h4>
        <div class="a">${authorList(p.authors)}</div>
        <div class="v">${esc(p.venue)}${p.info ? " · " + esc(p.info) : ""}</div>
        ${withThumb && p.image ? `<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        ${fileLinks(p.links)}
      </div>
      <div class="side"><span class="y num">${esc(p.year || "")}</span>${kind}</div>
    </article>`;
  }

  function projectRow(p) {
    return `<article class="item">
      <div>
        <h4 class="t">${esc(p.title)}</h4>
        <div class="v">${esc(p.org)}</div>
        ${fileLinks(p.links)}
      </div>
      <div class="side"><span class="y num">${esc(p.period || p.year || "")}</span></div>
    </article>`;
  }

  const emptyRow = label => `<p class="empty">${esc(label)} 항목은 아직 등록되지 않았습니다.</p>`;

  /* ---------- data ---------- */
  async function load() {
    const [profile, research] = await Promise.all([
      fetch("./profile.json",  { cache: "no-store" }).then(r => r.json()),
      fetch("./research.json", { cache: "no-store" }).then(r => r.json())
    ]);
    return { profile, research };
  }

  function loadError(el) {
    el.innerHTML = `<div class="err">데이터를 불러오지 못했습니다.
      로컬에서 확인할 때는 <code>file://</code>이 아니라 서버로 열어야 합니다 —
      <code>python3 -m http.server 8000</code> 실행 후
      <code>http://localhost:8000</code> 으로 접속하세요.
      GitHub Pages 배포 환경에서는 정상 동작합니다.</div>`;
  }

  /* ---------- theme ---------- */
  const THEME_KEY = "hs-theme";
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const mode = saved || "light";
    document.documentElement.setAttribute("data-theme", mode);
    const btn = $("#themeBtn");
    if (!btn) return;
    const paint = m => { btn.textContent = m === "dark" ? "Light" : "Dark"; };
    paint(mode);
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      paint(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
    });
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const dd = $("#ddResearch");
    if (dd) {
      const trigger = dd.querySelector("button");
      const close = () => { dd.classList.remove("open"); trigger.setAttribute("aria-expanded", "false"); };
      trigger.addEventListener("click", e => {
        e.stopPropagation();
        const open = dd.classList.toggle("open");
        trigger.setAttribute("aria-expanded", String(open));
      });
      $$("a", dd).forEach(a => a.addEventListener("click", close));
      document.addEventListener("click", close);
      document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }

    const burger = $("#burger"), menu = $("#mobileMenu");
    if (burger && menu) {
      burger.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
      });
      $$("a", menu).forEach(a => a.addEventListener("click", () => {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }));
    }

    const top = $("#toTop");
    if (top) top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- scroll spy ---------- */
  function initSpy(map) {
    const targets = Object.keys(map).map(id => document.getElementById(id)).filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const clear = () => $$(".nav-links a, .nav-links .dd").forEach(n => n.classList.remove("on"));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        clear();
        const sel = map[e.target.id];
        const el = sel && $(sel);
        if (el) el.classList.add("on");
      });
    }, { rootMargin: "-62px 0px -68% 0px" });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- collapsible group ---------- */
  function initToggle(btn, host, shortHTML, fullHTML, total) {
    if (!btn) return;
    let open = false;
    btn.addEventListener("click", () => {
      open = !open;
      host.innerHTML = open ? fullHTML : shortHTML;
      btn.textContent = open ? "접기" : `전체 ${pad(total)}건 보기`;
      btn.setAttribute("aria-expanded", String(open));
      if (!open) host.closest(".group").scrollIntoView({ block: "nearest" });
    });
  }

  return { ME, $, $$, esc, pad, dead, byYear, journals, fileLinks, authorList,
           paperRow, projectRow, emptyRow, load, loadError,
           initTheme, initNav, initSpy, initToggle };
})();
