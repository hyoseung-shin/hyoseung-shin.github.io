/* ============================================================
   Hyo-seung Shin — Portfolio
   Shared helpers: data loading, formatting, nav, theme, portrait
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
  const noEmoji = s => String(s ?? "").replace(/\p{Extended_Pictographic}️?\s*/gu, "").trim();

  /* research.json keeps journal split into international / domestic */
  const journals = r => [
    ...(r.journal?.international || []).map(p => ({ ...p, _scope: "Int." })),
    ...(r.journal?.domestic || []).map(p => ({ ...p, _scope: "국내" }))
  ];
  /* Int. / 국내 marker — journals carry it from research.json's split,
     conferences are read from their location line */
  const scopeOf = p => p._scope || (/korea|한국/i.test(`${p.info || ""} ${p.venue || ""}`) ? "국내" : "Int.");

  /* Newest first: start of `period` ("2025.11 - 2026.01") when present, else `year`. */
  const startKey = x => {
    const m = /(\d{4})\.(\d{1,2})/.exec(x.period || "");
    return m ? +m[1] * 100 + +m[2] : (+x.year || 0) * 100;
  };
  const byYear = a => a.slice().sort((x, y) => startKey(y) - startKey(x));

  /* Main page shows only entries marked `"selected": true` (max 3, newest
     first). A category with nothing marked falls back to its newest 3. */
  const featured = (a, n = 3) => {
    const picked = a.filter(x => x.selected === true);
    return byYear(picked.length ? picked : a).slice(0, n);
  };

  /* ---------- markup fragments ---------- */
  /* Links whose file is not ready yet are left out. */
  const fileLinks = ls => {
    const live = (ls || []).filter(l => !dead(l.url));
    return live.length
      ? `<div class="files">${live.map(l =>
          `<a class="pill sm" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>`
        ).join("")}</div>`
      : "";
  };

  const authorList = as => (as || [])
    .map(a => a === ME ? `<b class="nm">${esc(a)}</b>` : `<span class="nm">${esc(a)}</span>`)
    .join(", ");

  const meta = (...parts) => {
    const [first, ...rest] = parts.filter(Boolean);
    return first
      ? `<div class="meta num"><span class="y">${esc(first)}</span>${rest.map(p => `<span>${esc(p)}</span>`).join("")}</div>`
      : "";
  };

  /* Image slot for a paper with no figure yet: a coarse block mosaic
     (the same "decoding" language as the portrait) with the venue's
     short name. Deterministic per paper, so it never reshuffles. */
  function mosaic(p) {
    const key = String(p.id || p.title || "");
    let h = 2166136261;
    for (const ch of key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296);
    const cols = 8, rows = 6, hot = Math.floor(rnd() * cols * rows);
    let cells = "";
    for (let i = 0; i < cols * rows; i++) {
      const cls = i === hot ? "ma" : "m" + Math.min(3, Math.floor(rnd() * 4.4));
      cells += `<rect class="${cls}" x="${i % cols}" y="${Math.floor(i / cols)}" width="1" height="1"/>`;
    }
    const short = (/\(([A-Za-z]{2,10})\)/.exec(p.venue || "") || [])[1] || "";
    return `<figure class="pthumb ph" aria-hidden="true">
      <svg viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="none" shape-rendering="crispEdges">${cells}</svg>
      ${short ? `<span class="ph-tag num">${esc(short)}${p.year ? " " + esc(p.year) : ""}</span>` : ""}
    </figure>`;
  }

  /* withThumb: the figure sits left of the text on tablet/desktop
     and is dropped on phones (CSS). */
  function paperRow(p, kind, withThumb = false) {
    const info = noEmoji(p.info);
    const fig = !withThumb ? ""
      : p.image ? `<figure class="pthumb"><img src="${esc(p.image)}" alt="" loading="lazy" onerror="this.parentNode.outerHTML=''"></figure>`
      : mosaic(p);
    return `<article class="item${withThumb ? " has-thumb" : ""}">
      ${fig}
      <div class="body">
        ${meta(p.year, kind).replace("</div>", `<span class="badge">${scopeOf(p)}</span></div>`)}
        <h4 class="t">${esc(p.title)}</h4>
        <div class="a">${authorList(p.authors)}</div>
        <div class="v">${esc(p.venue)}${info ? " · " + esc(info) : ""}</div>
        ${fileLinks(p.links)}
      </div>
    </article>`;
  }

  function projectRow(p) {
    return `<article class="item">
      ${meta(p.period || p.year)}
      <h4 class="t">${esc(p.title)}</h4>
      <div class="v">${esc(p.org)}</div>
      ${fileLinks(p.links)}
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
    const local = location.protocol === "file:";
    el.innerHTML = `<div class="err">데이터를 불러오지 못했습니다.
      ${local
        ? `브라우저가 <code>file://</code>에서는 JSON 요청을 차단합니다.
           배포된 주소에서는 정상 동작하므로, 이 화면은 로컬에서 파일을
           직접 열었을 때만 나타납니다.`
        : `<code>profile.json</code>과 <code>research.json</code>이
           HTML 파일과 같은 위치에 있는지, 파일명 대소문자가 맞는지 확인하세요.`}
    </div>`;
  }

  /* ---------- theme ---------- */
  const THEME_KEY = "hs-theme";
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const mode = saved || "light";
    document.documentElement.setAttribute("data-theme", mode);
    /* every theme button on the page (rail, mobile bar, graduate_plan's #themeBtn) */
    const btns = $$("#themeBtn, [data-theme-btn]");
    const paint = m => btns.forEach(b => { b.textContent = m === "dark" ? "Light" : "Dark"; });
    paint(mode);
    btns.forEach(btn => btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      paint(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
    }));
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const btn = $("#menuBtn"), sheet = $("#sheet");
    if (btn && sheet) {
      const set = open => {
        sheet.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      };
      btn.addEventListener("click", e => { e.stopPropagation(); set(!sheet.classList.contains("open")); });
      sheet.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
      document.addEventListener("click", e => { if (!sheet.contains(e.target)) set(false); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    }
    /* Research dropdown in the top bar */
    const dd = $("#ddResearch");
    if (dd) {
      const trigger = $("button", dd);
      const close = () => { dd.classList.remove("open"); trigger.setAttribute("aria-expanded", "false"); };
      trigger.addEventListener("click", e => {
        e.stopPropagation();
        trigger.setAttribute("aria-expanded", String(dd.classList.toggle("open")));
      });
      $$("a", dd).forEach(a => a.addEventListener("click", close));
      document.addEventListener("click", close);
      document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }

    const top = $("#toTop");
    if (top) top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- scroll spy ----------
     map: section id → rail link selector, in document order.
     parents: child id → parent id (the parent link gets .in). */
  function initSpy(map, parents = {}) {
    const ids = Object.keys(map).filter(id => document.getElementById(id));
    if (!ids.length) return;
    let queued = false;
    const update = () => {
      queued = false;
      let cur = null;
      const line = innerHeight * 0.3;
      ids.forEach(id => { if (document.getElementById(id).getBoundingClientRect().top <= line) cur = id; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = ids[ids.length - 1];
      $$("[data-spy]").forEach(a => a.classList.remove("on", "in"));
      if (!cur) return;
      const a = $(map[cur]);
      if (a) a.classList.add("on");
      const p = parents[cur] && $(map[parents[cur]]);
      if (p) p.classList.add("in");
    };
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------- collapsible group (kept for older pages) ---------- */
  function initToggle(btn, host, shortHTML, fullHTML, total) {
    if (!btn) return;
    let open = false;
    btn.addEventListener("click", () => {
      open = !open;
      host.innerHTML = open ? fullHTML : shortHTML;
      btn.textContent = open ? "접기" : `전체 ${pad(total)}건 보기`;
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- the design point: a portrait that decodes ----------
     Coarse blocks first, luma only (BT.601 Y), then chroma arrives and
     the block size halves until the real <img> takes over. */
  function decodePortrait(box) {
    const img = box && $("img", box), cv = box && $("canvas", box);
    if (!img || !cv) return;
    const done = () => { box.classList.remove("decoding"); box.classList.add("decoded"); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !cv.getContext) { done(); return; }
    box.classList.add("decoding");

    const run = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d");
      /* same crop as the img's object-fit:cover / object-position:50% 30% */
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(W / iw, H / ih), sw = W / s, sh = H / s;
      const sx = (iw - sw) * 0.5, sy = (ih - sh) * 0.3;
      const tmp = document.createElement("canvas");
      const t = tmp.getContext("2d", { willReadFrequently: true });
      const steps = [[30, true], [19, true], [12, false], [7, false], [4, false], [2, false]];
      let i = 0;
      const frame = () => {
        if (i >= steps.length) { done(); return; }
        const [block, lumaOnly] = steps[i++];
        const bw = Math.max(1, Math.round(r.width / block)), bh = Math.max(1, Math.round(r.height / block));
        tmp.width = bw; tmp.height = bh;
        t.drawImage(img, sx, sy, sw, sh, 0, 0, bw, bh);
        if (lumaOnly) {
          try {
            const d = t.getImageData(0, 0, bw, bh), p = d.data;
            for (let k = 0; k < p.length; k += 4) {
              const y = 0.299 * p[k] + 0.587 * p[k + 1] + 0.114 * p[k + 2];
              p[k] = p[k + 1] = p[k + 2] = y;
            }
            t.putImageData(d, 0, 0);
          } catch (e) { /* tainted canvas: skip the luma pass */ }
        }
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(tmp, 0, 0, bw, bh, 0, 0, W, H);
        setTimeout(frame, i <= 2 ? 180 : 140);
      };
      frame();
    };

    if (img.complete && img.naturalWidth) run();
    else {
      img.addEventListener("load", run, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  }

  return { ME, $, $$, esc, pad, dead, byYear, featured, journals, fileLinks, authorList,
           paperRow, projectRow, emptyRow, load, loadError,
           initTheme, initNav, initSpy, initToggle, decodePortrait };
})();
