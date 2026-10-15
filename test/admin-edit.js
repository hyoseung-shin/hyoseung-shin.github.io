/* ============================================================
   Hyo-seung Shin — Portfolio · Admin editor (admin-edit.html)

   Edits profile.json and research.json in the browser, then either
   commits them (plus any uploaded images / PDFs) to the GitHub
   repository through the GitHub REST API, or downloads them.

   Saving to GitHub needs a fine-grained personal access token with
   "Contents: Read and write" on this repository only. The token is
   kept in this browser (session, or local storage if "remember" is
   ticked) and is sent to api.github.com only.
   ============================================================ */

(() => {
  const { $, $$, esc } = APP;
  const MAIN_MAX = 3;
  const TOKEN_KEY = "hs-admin-token";
  const THIS_YEAR = new Date().getFullYear();

  let config = null;          // admin-config.json (repo, branch, password hash)
  let state = null;           // { profile, research, journals }
  let snap = { profile: "", research: "", config: "" };
  const uploads = new Map();  // repo path -> { b64, size, name }
  const previews = new Map(); // "./path" -> object URL for pending images
  const open = new WeakSet(); // items whose form is expanded
  let tab = "profile";
  let newPassHash = null;
  let busy = false;

  /* ---------------- small helpers ---------------- */
  const clone = o => JSON.parse(JSON.stringify(o));
  const strip = html => String(html ?? "").replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const uid = p => `${p}-${THIS_YEAR}-${Math.random().toString(36).slice(2, 6)}`;
  const getAt = (o, k) => k.split(".").reduce((x, p) => (x == null ? x : x[p]), o);
  const setAt = (o, k, v) => {
    const ps = k.split("."); let x = o;
    ps.slice(0, -1).forEach(p => { if (x[p] == null || typeof x[p] !== "object") x[p] = {}; x = x[p]; });
    x[ps[ps.length - 1]] = v;
  };
  const b64utf8 = s => {
    const bytes = new TextEncoder().encode(s); let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const utf8b64 = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, "")), c => c.charCodeAt(0)));
  const fileB64 = file => new Promise((ok, no) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1]);
    r.onerror = () => no(r.error);
    r.readAsDataURL(file);
  });
  const safeName = n => n.normalize("NFC").replace(/[\\/:*?"<>|#%]+/g, "").replace(/\s+/g, "_");

  let toastT;
  function toast(text, kind = "") {
    const t = $("#toast");
    t.textContent = text; t.className = `toast show ${kind}`;
    clearTimeout(toastT); toastT = setTimeout(() => { t.className = "toast"; }, 4200);
  }

  /* ---------------- token ---------------- */
  const getToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } };
  const remembered = () => { try { return !!localStorage.getItem(TOKEN_KEY); } catch (e) { return false; } };
  function setToken(t, remember) {
    try {
      sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY);
      if (t) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, t);
    } catch (e) {}
  }

  /* ---------------- schema ---------------- */
  const F = (key, label, type = "text", o = {}) => ({ key, label, type, ...o });
  const paperFields = (dir, extra = []) => [
    F("title", "제목", "text", { wide: true }),
    F("authors", "저자", "comma", { wide: true, help: "쉼표로 구분합니다. 본인은 Hyo-seung Shin 으로 적으면 굵게 표시됩니다." }),
    F("venue", "학술지 · 학회명", "text", { wide: true }),
    ...extra,
    F("year", "연도", "number"),
    F("id", "ID", "text", { help: "관계 그래프용 고유값. 다른 항목과 겹치지 않게 둡니다." }),
    F("image", "대표 이미지", "image", { dir, wide: true, help: "비워 두면 학회 약칭이 들어간 블록 모자이크가 표시됩니다." }),
    F("links", "링크 · 파일", "links", { dir, wide: true })
  ];
  const workFields = dir => [
    F("title", "제목", "text", { wide: true }),
    F("org", "기관 · 설명", "text", { wide: true }),
    F("period", "기간", "text", { help: "예: 2025.11 - 2026.01" }),
    F("year", "연도", "number"),
    F("id", "ID", "text"),
    F("links", "링크 · 파일", "links", { dir, wide: true })
  ];

  const TABS = [
    { id: "profile", label: "소개", kind: "profile" },
    { id: "journal", label: "Journal", kind: "list", main: true,
      list: () => state.journals,
      fields: [F("_scope", "구분", "select", { options: [["domestic", "국내"], ["international", "Int."]] }), ...paperFields("journal/img")],
      make: () => ({ id: uid("j"), _scope: "domestic", title: "새 논문", authors: ["Hyo-seung Shin"], venue: "", year: THIS_YEAR, image: "", links: [{ name: "paper", url: "" }], selected: false }),
      sum: it => [it.title, `${it.year || ""} · ${it._scope === "international" ? "Int." : "국내"}`] },
    { id: "conference", label: "Conference", kind: "list", main: true,
      list: () => state.research.conference,
      fields: paperFields("conference/img", [F("info", "장소 · 시기", "text", { wide: true, help: "예: Jeju (Korea) | July" })]),
      make: () => ({ id: uid("c"), title: "새 학회 논문", authors: ["Hyo-seung Shin"], venue: "", info: "", year: THIS_YEAR, image: "", links: [{ name: "paper", url: "" }], selected: false }),
      sum: it => [it.title, `${it.year || ""}`] },
    { id: "patent", label: "Patent", kind: "list", main: true,
      list: () => state.research.patent, fields: workFields("projects"),
      make: () => ({ id: uid("pt"), title: "새 특허", org: "", period: "", year: THIS_YEAR, links: [{ name: "document", url: "" }], selected: false }),
      sum: it => [it.title, it.period || it.year || ""] },
    { id: "standard", label: "Standard", kind: "list", main: true,
      list: () => state.research.standard, fields: workFields("projects"),
      make: () => ({ id: uid("s"), title: "새 표준 기고", org: "", period: "", year: THIS_YEAR, links: [{ name: "document", url: "" }], selected: false }),
      sum: it => [it.title, it.period || it.year || ""] },
    { id: "project", label: "Project", kind: "list", main: true,
      list: () => state.research.project, fields: workFields("projects"),
      make: () => ({ id: uid("p"), title: "새 프로젝트", org: "", period: "", year: THIS_YEAR, links: [{ name: "document", url: "" }], selected: false }),
      sum: it => [it.title, it.period || it.year || ""] },
    { id: "education", label: "Education", kind: "list",
      list: () => state.profile.education,
      fields: [F("degree", "학위", "text", { wide: true }), F("univ", "학교", "text", { wide: true }), F("period", "기간", "text")],
      make: () => ({ degree: "새 학위", univ: "", period: "" }),
      sum: it => [it.degree, it.period] },
    { id: "activities", label: "Activities", kind: "list",
      list: () => state.profile.activities,
      fields: [F("title", "제목", "text", { wide: true }), F("org", "기관", "text", { wide: true }), F("period", "기간", "text"),
               F("link", "증명서", "file", { dir: "pro_act", wide: true })],
      make: () => ({ title: "새 활동", period: "", org: "", link: "" }),
      sum: it => [it.title, it.period] },
    { id: "awards", label: "Awards", kind: "list",
      list: () => state.profile.awards,
      fields: [F("title", "수상명", "text", { wide: true }), F("desc", "설명", "text", { wide: true, help: "| 로 나누면 ' · '로 표시됩니다. 예: Silver Award | 2025" }),
               F("link", "상장", "file", { dir: "awards", wide: true })],
      make: () => ({ title: "새 수상", desc: "", link: "" }),
      sum: it => [it.title, ((/(\d{4})/.exec(`${it.desc} ${it.title}`) || [])[1]) || ""] },
    { id: "others", label: "Beyond", kind: "list",
      list: () => state.profile.others,
      fields: [F("title", "직책 · 활동", "text", { wide: true, help: "HTML로 저장됩니다. < > 는 &lt; &gt; 로 적습니다." }),
               F("org", "기관 · 시간", "text", { wide: true }), F("period", "기간", "text"),
               F("details", "함께 맡은 역할", "lines", { wide: true, help: "한 줄에 하나씩 적습니다. 메인에는 4개까지 보이고 나머지는 '외 N개 보기'로 접힙니다." })],
      make: () => ({ title: "새 활동", period: "", org: "", details: [] }),
      sum: it => [strip(it.title), it.period] },
    { id: "settings", label: "설정", kind: "settings" }
  ];
  const tabDef = id => TABS.find(t => t.id === id);

  const PROFILE_FIELDS = [
    F("name", "이름 (영문)", "text"), F("nameKo", "이름 (한글)", "text"),
    F("avatar", "프로필 사진", "image", { dir: "avatar", wide: true }),
    F("bio", "소개 문단", "paras", { wide: true, rows: 7,
      help: "문단 사이는 빈 줄로 구분합니다. 첫 문단이 큰 글씨로 보입니다. {affiliation} 은 아래 소속 링크로 바뀌고, <strong> 같은 HTML을 쓸 수 있습니다." }),
    F("affiliation.name", "소속 이름", "text", { wide: true }), F("affiliation.url", "소속 링크", "text", { wide: true }),
    F("links.email", "Email", "text"), F("links.scholar", "Google Scholar", "text"),
    F("links.github", "GitHub", "text"), F("links.orcid", "ORCID", "text"),
    F("links.linkedin", "LinkedIn", "text"),
    F("links.cv", "Curriculum Vitae (PDF)", "file", { dir: "avatar", wide: true })
  ];

  /* ---------------- data in / out ---------------- */
  function fromFiles(profile, research) {
    research.patent ||= []; research.standard ||= []; research.project ||= []; research.conference ||= [];
    research.journal ||= {};
    const journals = [
      ...(research.journal.international || []).map(p => ({ ...p, _scope: "international" })),
      ...(research.journal.domestic || []).map(p => ({ ...p, _scope: "domestic" }))
    ];
    ["education", "activities", "awards", "others"].forEach(k => { profile[k] ||= []; });
    profile.links ||= {}; profile.affiliation ||= {}; profile.bio ||= [];
    return { profile, research, journals };
  }

  const cleanItem = o => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")));
  function serialize() {
    const research = clone(state.research);
    research.journal = {
      international: state.journals.filter(j => j._scope === "international").map(cleanItem),
      domestic: state.journals.filter(j => j._scope !== "international").map(cleanItem)
    };
    /* keep the original key order */
    const ordered = {};
    ["journal", "conference", "patent", "standard", "project"].forEach(k => { ordered[k] = research[k] || []; });
    Object.keys(research).forEach(k => { if (!(k in ordered)) ordered[k] = research[k]; });
    return {
      profile: JSON.stringify(state.profile, null, 2) + "\n",
      research: JSON.stringify(ordered, null, 2) + "\n",
      config: JSON.stringify({ ...config, ...(newPassHash ? { passwordSha256: newPassHash } : {}) }, null, 2) + "\n"
    };
  }
  function changes() {
    const s = serialize();
    return {
      profile: s.profile !== snap.profile, research: s.research !== snap.research,
      config: s.config !== snap.config, uploads: uploads.size, files: s
    };
  }
  function status() {
    const c = changes();
    const parts = [];
    if (c.profile) parts.push("소개·이력");
    if (c.research) parts.push("연구 실적");
    if (c.uploads) parts.push(`파일 ${c.uploads}개`);
    if (c.config) parts.push("설정");
    const el = $("#edStatus");
    el.textContent = parts.length ? `저장하지 않은 변경: ${parts.join(", ")}` : "저장된 상태입니다";
    el.classList.toggle("dirty", parts.length > 0);
    return parts.length > 0;
  }

  /* ---------------- GitHub ---------------- */
  async function gh(method, path, body) {
    const repo = config.repo, token = getToken();
    const url = path === null
      ? `https://api.github.com/repos/${repo}`
      : `https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`
        + (method === "GET" ? `?ref=${encodeURIComponent(config.branch || "main")}` : "");
    return fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
                 ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
  }
  function ghError(r, path) {
    if (r.status === 401) return "토큰이 올바르지 않거나 만료되었습니다. 설정에서 다시 입력하세요.";
    if (r.status === 403 || r.status === 404) return `토큰에 이 저장소의 쓰기 권한(Contents: Read and write)이 없습니다. (${path})`;
    if (r.status === 409) return `다른 곳에서 먼저 바뀌었습니다. 새로고침 후 다시 저장하세요. (${path})`;
    if (r.status === 422) return `GitHub가 파일을 받지 않았습니다. 파일 크기나 이름을 확인하세요. (${path})`;
    return `GitHub 오류 ${r.status} (${path})`;
  }
  async function putFile(path, b64, message) {
    let sha;
    const g = await gh("GET", path);
    if (g.ok) sha = (await g.json()).sha;
    else if (g.status !== 404) throw new Error(ghError(g, path));
    const p = await gh("PUT", path, { message, content: b64, branch: config.branch || "main", ...(sha ? { sha } : {}) });
    if (!p.ok) throw new Error(ghError(p, path));
  }
  async function getFile(path) {
    const r = await gh("GET", path);
    if (!r.ok) throw new Error(ghError(r, path));
    return JSON.parse(utf8b64((await r.json()).content));
  }

  async function saveGitHub() {
    if (busy) return;
    if (!getToken()) { tab = "settings"; render(); toast("GitHub에 저장하려면 먼저 토큰을 입력하세요.", "bad"); $("#tokIn")?.focus(); return; }
    const c = changes();
    if (!c.profile && !c.research && !c.config && !c.uploads) { toast("저장할 변경 사항이 없습니다."); return; }
    if (!checkIds()) return;
    busy = true; $("#saveBtn").disabled = true;
    const jobs = [...uploads].map(([path, u]) => [path, u.b64, `Admin: upload ${path}`]);
    if (c.research) jobs.push(["research.json", b64utf8(c.files.research), "Admin: update research.json"]);
    if (c.profile) jobs.push(["profile.json", b64utf8(c.files.profile), "Admin: update profile.json"]);
    if (c.config) jobs.push(["admin-config.json", b64utf8(c.files.config), "Admin: update admin settings"]);
    try {
      for (let i = 0; i < jobs.length; i++) {
        $("#edStatus").textContent = `GitHub에 저장하는 중… (${i + 1}/${jobs.length}) ${jobs[i][0]}`;
        await putFile(...jobs[i]);
        if (uploads.has(jobs[i][0])) uploads.delete(jobs[i][0]);
      }
      if (newPassHash) { config.passwordSha256 = newPassHash; ADMIN.unlock(newPassHash); newPassHash = null; }
      const s = serialize();
      snap = { profile: s.profile, research: s.research, config: s.config };
      status();
      toast("저장했습니다. 사이트에는 1–2분 뒤에 반영됩니다.", "ok");
    } catch (e) {
      status();
      toast(e.message, "bad");
    } finally {
      busy = false; $("#saveBtn").disabled = false;
    }
  }

  function download(name, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function downloadAll() {
    if (!checkIds()) return;
    const c = changes();
    download("research.json", new Blob([c.files.research], { type: "application/json" }));
    download("profile.json", new Blob([c.files.profile], { type: "application/json" }));
    if (c.config) download("admin-config.json", new Blob([c.files.config], { type: "application/json" }));
    uploads.forEach((u, path) => {
      const bin = atob(u.b64), arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      download(path.split("/").pop(), new Blob([arr]));
    });
    toast(uploads.size
      ? `JSON과 파일 ${uploads.size}개를 내려받았습니다. 파일은 ${[...uploads.keys()].join(", ")} 위치에 올리세요.`
      : "research.json과 profile.json을 내려받았습니다. 저장소 루트의 같은 파일을 바꾸면 됩니다.", "ok");
  }

  function checkIds() {
    const all = [...state.journals, ...state.research.conference, ...state.research.patent, ...state.research.standard, ...state.research.project];
    const seen = new Set();
    for (const it of all) {
      if (!it.id) { toast(`ID가 비어 있는 항목이 있습니다: ${it.title || "(제목 없음)"}`, "bad"); return false; }
      if (seen.has(it.id)) { toast(`ID가 겹칩니다: ${it.id}`, "bad"); return false; }
      seen.add(it.id);
    }
    return true;
  }

  /* ---------------- rendering ---------------- */
  const srcOf = v => previews.get(v) || v;

  function fieldHTML(f, obj, scope) {
    const v = getAt(obj, f.key);
    const id = `f-${scope}-${f.key.replace(/\W/g, "_")}`;
    const help = f.help ? `<span class="fld-h">${esc(f.help)}</span>` : "";
    const wrap = (inner, extra = "") => `<div class="fld${f.wide ? " wide" : ""}${extra}"><label class="fld-l" for="${id}">${esc(f.label)}</label>${inner}${help}</div>`;
    const attrs = `id="${id}" data-k="${f.key}" data-t="${f.type}"`;
    switch (f.type) {
      case "number": return wrap(`<input ${attrs} type="number" inputmode="numeric" value="${esc(v ?? "")}">`);
      case "select": return wrap(`<select ${attrs}>${f.options.map(([val, lab]) => `<option value="${val}"${v === val ? " selected" : ""}>${esc(lab)}</option>`).join("")}</select>`);
      case "comma": return wrap(`<input ${attrs} type="text" value="${esc((v || []).join(", "))}">`);
      case "lines": return wrap(`<textarea ${attrs} rows="${Math.max(3, (v || []).length + 1)}">${esc((v || []).join("\n"))}</textarea>`);
      case "paras": return wrap(`<textarea ${attrs} rows="${f.rows || 5}">${esc((v || []).join("\n\n"))}</textarea>`);
      case "image": {
        const prev = v ? `<img src="${esc(srcOf(v))}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'미리보기 없음'}))">` : `<span>이미지 없음</span>`;
        return wrap(`<div class="ed-file">
            <div class="ed-prev">${prev}</div>
            <div class="ed-file-ctl">
              <input ${attrs} type="text" value="${esc(v || "")}" placeholder="./${esc(f.dir)}/파일이름.png">
              <div class="ed-file-btns">
                <label class="pill sm">이미지 선택<input type="file" accept="image/*" data-up="${f.key}" data-dir="${f.dir}" hidden></label>
                ${v ? `<button type="button" class="pill sm ghost" data-act="clear" data-k="${f.key}">비우기</button>` : ""}
                ${uploads.has(String(v).replace(/^\.\//, "")) ? `<span class="ed-pending">저장 대기</span>` : ""}
              </div>
            </div>
          </div>`, " has-file");
      }
      case "file": return wrap(`<div class="ed-file-ctl">
            <input ${attrs} type="text" value="${esc(v || "")}" placeholder="./${esc(f.dir)}/파일이름.pdf 또는 https://…">
            <div class="ed-file-btns">
              <label class="pill sm">파일 선택<input type="file" accept=".pdf,application/pdf,image/*" data-up="${f.key}" data-dir="${f.dir}" hidden></label>
              ${uploads.has(String(v).replace(/^\.\//, "")) ? `<span class="ed-pending">저장 대기</span>` : ""}
            </div>
          </div>`);
      case "links": {
        const rows = (v || []).map((l, i) => `<div class="ed-link">
            <input type="text" data-link="${i}" data-lk="name" value="${esc(l.name)}" placeholder="이름 (paper, code…)" aria-label="링크 이름">
            <input type="text" data-link="${i}" data-lk="url" value="${esc(l.url)}" placeholder="./${esc(f.dir)}/파일.pdf 또는 https://…" aria-label="링크 주소">
            <label class="pill sm">파일<input type="file" accept=".pdf,application/pdf,image/*" data-up="links" data-link="${i}" data-dir="${f.dir}" hidden></label>
            <button type="button" class="pill sm ghost" data-act="link-del" data-link="${i}" aria-label="링크 삭제">삭제</button>
            ${uploads.has(String(l.url).replace(/^\.\//, "")) ? `<span class="ed-pending">저장 대기</span>` : ""}
          </div>`).join("");
        return `<div class="fld wide"><span class="fld-l">${esc(f.label)}</span>
          <div class="ed-links">${rows || `<p class="fld-h">링크가 없습니다.</p>`}</div>
          <button type="button" class="pill sm ed-add-link" data-act="link-add">+ 링크 추가</button>
          <span class="fld-h">주소가 비었거나 404NotFound · to.be.continue 이면 사이트에는 표시되지 않습니다.</span></div>`;
      }
      default: return wrap(`<input ${attrs} type="text" value="${esc(v ?? "")}">`);
    }
  }

  function renderTabs() {
    $("#edTabs").innerHTML = TABS.map(t => {
      let n = "";
      if (t.kind === "list") n = `<span class="c">${t.list().length}</span>`;
      return `<button class="pill sm${t.id === tab ? " on" : ""}" data-tab="${t.id}" aria-pressed="${t.id === tab}">${esc(t.label)}${n}</button>`;
    }).join("");
  }

  function renderProfile() {
    return `<section class="ed-sec">
      <div class="sec-h"><span class="eyebrow">메인 상단 · 소개</span><h2>소개</h2></div>
      <div class="ed-form" data-scope="profile">${PROFILE_FIELDS.map(f => fieldHTML(f, state.profile, "profile")).join("")}</div>
    </section>`;
  }

  function mainCount(t) { return t.list().filter(x => x.selected === true).length; }

  function renderList(t) {
    const items = t.list();
    const eyebrow = t.main ? `메인 노출 ${mainCount(t)} / ${MAIN_MAX}` : "메인 페이지 순서대로 표시";
    const rows = items.map((it, i) => {
      const [title, meta] = t.sum(it);
      const isOpen = open.has(it);
      return `<article class="ed-item${isOpen ? " open" : ""}" data-i="${i}">
        <div class="ed-row">
          ${t.main ? `<label class="ed-main" title="메인 페이지에 표시"><input type="checkbox" data-act="main"${it.selected === true ? " checked" : ""}><span>메인</span></label>` : ""}
          <button type="button" class="ed-sum" data-act="toggle" aria-expanded="${isOpen}">
            <span class="ed-t">${esc(strip(title) || "(제목 없음)")}</span>
            <span class="ed-m">${esc(meta || "")}</span>
          </button>
          <div class="ed-acts">
            <button type="button" class="pill sm ghost" data-act="up" aria-label="위로" ${i === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="pill sm ghost" data-act="down" aria-label="아래로" ${i === items.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="pill sm ghost danger" data-act="del">삭제</button>
          </div>
        </div>
        ${isOpen ? `<div class="ed-form" data-scope="${t.id}-${i}">${t.fields.map(f => fieldHTML(f, it, `${t.id}-${i}`)).join("")}</div>` : ""}
      </article>`;
    }).join("");
    return `<section class="ed-sec">
      <div class="sec-h"><span class="eyebrow" id="mainCount">${eyebrow}</span><h2>${esc(t.label)}</h2></div>
      <div class="ed-tools">
        <button type="button" class="pill sm ink" data-act="add">+ 새 항목 추가</button>
        ${t.main ? `<span class="fld-h">'메인'에 체크한 항목만 첫 페이지에 보입니다 (카테고리별 최대 ${MAIN_MAX}건, 최신순). 체크가 하나도 없으면 최신 ${MAIN_MAX}건이 보입니다.</span>` : ""}
      </div>
      <div class="ed-list">${rows || `<p class="empty">아직 항목이 없습니다. '새 항목 추가'로 시작하세요.</p>`}</div>
    </section>`;
  }

  function renderSettings() {
    const tok = getToken();
    return `<section class="ed-sec">
      <div class="sec-h"><span class="eyebrow">저장 방법</span><h2>GitHub 연결</h2></div>
      <div class="ed-form">
        <div class="fld"><label class="fld-l" for="repoIn">저장소</label><input id="repoIn" type="text" value="${esc(config.repo || "")}" placeholder="owner/repo"></div>
        <div class="fld"><label class="fld-l" for="branchIn">브랜치</label><input id="branchIn" type="text" value="${esc(config.branch || "main")}"></div>
        <div class="fld wide"><label class="fld-l" for="tokIn">GitHub 토큰</label>
          <input id="tokIn" type="password" autocomplete="off" value="${esc(tok)}" placeholder="github_pat_…">
          <span class="fld-h">GitHub → Settings → Developer settings → Fine-grained tokens 에서 만듭니다. Repository access는 이 저장소만, Permissions는 Contents: Read and write 만 주세요. 토큰은 이 브라우저에만 보관되고 api.github.com 으로만 전송됩니다.</span>
        </div>
        <div class="fld wide ed-inline">
          <label class="ed-check"><input id="tokRemember" type="checkbox"${remembered() ? " checked" : ""}> 이 브라우저에 기억 (공용 PC에서는 끄세요)</label>
          <button type="button" class="pill sm ink" id="tokSave">토큰 적용</button>
          <button type="button" class="pill sm" id="tokTest">연결 확인</button>
          <button type="button" class="pill sm ghost" id="tokClear">토큰 지우기</button>
        </div>
        <p class="fld-h wide" id="tokMsg"></p>
      </div>
    </section>
    <section class="ed-sec">
      <div class="sec-h"><span class="eyebrow">admin.html</span><h2>비밀번호 변경</h2></div>
      <div class="ed-form">
        <div class="fld"><label class="fld-l" for="pw1">새 비밀번호</label><input id="pw1" type="password" autocomplete="new-password"></div>
        <div class="fld"><label class="fld-l" for="pw2">새 비밀번호 확인</label><input id="pw2" type="password" autocomplete="new-password"></div>
        <div class="fld wide ed-inline"><button type="button" class="pill sm ink" id="pwSet">변경 예약</button>
          <span class="fld-h">${newPassHash ? "새 비밀번호가 예약되었습니다. 'GitHub에 저장'을 누르면 적용됩니다." : "다음 'GitHub에 저장' 때 함께 적용됩니다."} 정적 사이트라 비밀번호는 편집 화면을 가리는 용도이며, 실제 저장 권한은 GitHub 토큰이 지킵니다.</span></div>
      </div>
    </section>`;
  }

  function render() {
    renderTabs();
    const t = tabDef(tab);
    $("#edPanel").innerHTML = t.kind === "profile" ? renderProfile() : t.kind === "settings" ? renderSettings() : renderList(t);
    status();
  }

  /* ---------------- interaction ---------------- */
  function itemOf(el) {
    const t = tabDef(tab);
    const art = el.closest(".ed-item");
    if (t.kind === "profile") return { t, obj: state.profile };
    if (!art) return { t };
    const i = +art.dataset.i;
    return { t, i, obj: t.list()[i], art };
  }

  function convert(type, raw) {
    switch (type) {
      case "number": return raw === "" ? "" : Number(raw);
      case "comma": return raw.split(",").map(s => s.trim()).filter(Boolean);
      case "lines": return raw.split("\n").map(s => s.trim()).filter(Boolean);
      case "paras": return raw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
      default: return raw;
    }
  }

  function onInput(e) {
    const el = e.target;
    if (el.dataset.k && el.dataset.t) {
      const { obj, t, art } = itemOf(el);
      if (!obj) return;
      setAt(obj, el.dataset.k, convert(el.dataset.t, el.value));
      if (art && t.sum) {
        const [title, meta] = t.sum(obj);
        $(".ed-t", art).textContent = strip(title) || "(제목 없음)";
        $(".ed-m", art).textContent = meta || "";
      }
      if (el.dataset.t === "image" && e.type === "change") render();
    } else if (el.dataset.link !== undefined && el.dataset.lk) {
      const { obj } = itemOf(el);
      obj.links[+el.dataset.link][el.dataset.lk] = el.value;
    }
    status();
  }

  async function onFile(el) {
    const file = el.files && el.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { toast("25MB보다 큰 파일은 올릴 수 없습니다.", "bad"); return; }
    const { obj } = itemOf(el);
    const path = `${el.dataset.dir}/${safeName(file.name)}`;
    const b64 = await fileB64(file);
    uploads.set(path, { b64, size: file.size, name: file.name });
    if (file.type.startsWith("image/")) previews.set("./" + path, URL.createObjectURL(file));
    if (el.dataset.up === "links") obj.links[+el.dataset.link].url = "./" + path;
    else setAt(obj, el.dataset.up, "./" + path);
    render();
    toast(`${file.name} → ./${path} (저장할 때 함께 올라갑니다)`);
  }

  let armed = null, armT;
  function onClick(e) {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) { tab = tabBtn.dataset.tab; render(); return; }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    const { t, i, obj } = itemOf(b);
    const list = t.list ? t.list() : null;

    if (act === "toggle") { open.has(obj) ? open.delete(obj) : open.add(obj); render(); return; }
    if (act === "add") {
      const it = t.make(); list.unshift(it); open.add(it); render();
      toast("새 항목을 맨 위에 추가했습니다."); return;
    }
    if (act === "up" && i > 0) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; render(); return; }
    if (act === "down" && i < list.length - 1) { [list[i + 1], list[i]] = [list[i], list[i + 1]]; render(); return; }
    if (act === "del") {
      if (armed !== b) {
        armed = b; b.textContent = "삭제 확인"; b.classList.add("armed");
        clearTimeout(armT); armT = setTimeout(() => { if (armed === b) { b.textContent = "삭제"; b.classList.remove("armed"); armed = null; } }, 3000);
        return;
      }
      armed = null; list.splice(i, 1); render(); toast("삭제했습니다. 저장하기 전이라면 새로고침해서 되돌릴 수 있습니다."); return;
    }
    if (act === "clear") { setAt(obj, b.dataset.k, ""); render(); return; }
    if (act === "link-add") { (obj.links ||= []).push({ name: "paper", url: "" }); render(); return; }
    if (act === "link-del") { obj.links.splice(+b.dataset.link, 1); render(); return; }
  }

  function onChange(e) {
    const el = e.target;
    if (el.type === "file" && el.dataset.up) { onFile(el); return; }
    if (el.dataset.act === "main") {
      const { t, obj } = itemOf(el);
      if (el.checked && mainCount(t) >= MAIN_MAX) {
        el.checked = false;
        toast(`메인에는 카테고리별 ${MAIN_MAX}건까지 보입니다. 다른 항목의 체크를 먼저 해제하세요.`, "bad");
        return;
      }
      obj.selected = el.checked;
      $("#mainCount").textContent = `메인 노출 ${mainCount(t)} / ${MAIN_MAX}`;
      status();
      return;
    }
    if (el.dataset.k === "_scope") { onInput(e); return; }
    if (el.dataset.t === "image") onInput(e);
  }

  function bindSettings(e) {
    const id = e.target.id;
    if (id === "tokSave") {
      setToken($("#tokIn").value.trim(), $("#tokRemember").checked);
      $("#tokMsg").textContent = getToken() ? "토큰을 적용했습니다." : "토큰을 지웠습니다.";
    }
    if (id === "tokClear") { setToken(""); $("#tokIn").value = ""; $("#tokMsg").textContent = "토큰을 지웠습니다."; }
    if (id === "tokTest") {
      setToken($("#tokIn").value.trim(), $("#tokRemember").checked);
      $("#tokMsg").textContent = "확인하는 중…";
      gh("GET", null).then(async r => {
        if (!r.ok) { $("#tokMsg").textContent = ghError(r, config.repo); return; }
        const j = await r.json();
        $("#tokMsg").textContent = j.permissions && j.permissions.push
          ? `연결되었습니다. ${j.full_name} 에 저장할 수 있습니다.`
          : `${j.full_name} 을 읽을 수는 있지만 쓰기 권한이 없습니다.`;
      }).catch(() => { $("#tokMsg").textContent = "GitHub에 연결하지 못했습니다. 네트워크를 확인하세요."; });
    }
    if (id === "pwSet") {
      const a = $("#pw1").value, b = $("#pw2").value;
      if (a.length < 8) { toast("비밀번호는 8자 이상으로 정하세요.", "bad"); return; }
      if (a !== b) { toast("두 비밀번호가 다릅니다.", "bad"); return; }
      ADMIN.hashPassword(a).then(h => { newPassHash = h; render(); toast("새 비밀번호를 예약했습니다. 'GitHub에 저장'을 누르면 적용됩니다.", "ok"); });
    }
  }
  function bindSettingsInput(e) {
    if (e.target.id === "repoIn") { config.repo = e.target.value.trim(); status(); }
    if (e.target.id === "branchIn") { config.branch = e.target.value.trim() || "main"; status(); }
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    APP.initTheme();
    try { config = await ADMIN.loadConfig(); }
    catch (e) { $("#edStatus").textContent = e.message; return; }
    if (!ADMIN.unlocked(config)) { location.replace("./admin.html"); return; }

    let profile, research, from = "사이트";
    try {
      if (getToken()) {
        [profile, research] = await Promise.all([getFile("profile.json"), getFile("research.json")]);
        from = "GitHub 최신본";
      } else throw 0;
    } catch (e) {
      const d = await APP.load(); profile = d.profile; research = d.research;
    }
    state = fromFiles(profile, research);
    const s = serialize();
    snap = { profile: s.profile, research: s.research, config: s.config };

    const panel = $("#edPanel");
    panel.addEventListener("input", e => { if (e.target.closest(".ed-form[data-scope]")) onInput(e); else bindSettingsInput(e); });
    panel.addEventListener("change", onChange);
    panel.addEventListener("click", e => { onClick(e); bindSettings(e); });
    $("#edTabs").addEventListener("click", onClick);
    $("#saveBtn").addEventListener("click", saveGitHub);
    $("#dlBtn").addEventListener("click", downloadAll);
    $("#lockBtn").addEventListener("click", () => { ADMIN.lock(); location.href = "./admin.html"; });
    window.addEventListener("beforeunload", e => { if (status()) { e.preventDefault(); e.returnValue = ""; } });

    render();
    toast(`${from}에서 내용을 불러왔습니다.`);
  }

  boot();
})();
