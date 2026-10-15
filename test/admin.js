/* ============================================================
   Hyo-seung Shin — Portfolio · Admin (shared)
   Password gate for admin.html and the session check used by
   admin-edit.html.

   About the password: this is a static GitHub Pages site, so the
   check runs in the browser. It keeps the editor out of casual
   view, but anyone can read the site's files. What actually
   protects the content is that saving needs a GitHub token with
   write access to the repository, which only the owner has.
   ============================================================ */

const ADMIN = (() => {
  const SESSION_KEY = "hs-admin";
  const SALT = "hs-portfolio:";

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  const hashPassword = pw => sha256(SALT + pw);

  async function loadConfig() {
    const r = await fetch("./admin-config.json", { cache: "no-store" });
    if (!r.ok) throw new Error("admin-config.json을 불러오지 못했습니다.");
    return r.json();
  }

  function unlocked(config) {
    let v = null;
    try { v = sessionStorage.getItem(SESSION_KEY); } catch (e) {}
    return !!v && v === config.passwordSha256;
  }
  function unlock(hash) { try { sessionStorage.setItem(SESSION_KEY, hash); } catch (e) {} }
  function lock() { try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {} }

  /* admin.html */
  function initGate() {
    const form = document.getElementById("gateForm");
    const input = document.getElementById("gatePw");
    const msg = document.getElementById("gateMsg");
    const btn = form.querySelector("button[type=submit]");
    let config = null;

    loadConfig().then(c => {
      config = c;
      if (unlocked(c)) location.replace("./admin-edit.html");
    }).catch(e => { msg.textContent = e.message; msg.className = "gate-msg bad"; });

    if (!window.crypto || !crypto.subtle) {
      msg.textContent = "이 브라우저는 보안 연결(https)에서만 관리자 페이지를 열 수 있습니다.";
      msg.className = "gate-msg bad";
      btn.disabled = true;
      return;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!config) return;
      btn.disabled = true;
      const h = await hashPassword(input.value);
      if (h === config.passwordSha256) {
        unlock(h);
        msg.textContent = "확인되었습니다. 편집 페이지로 이동합니다.";
        msg.className = "gate-msg ok";
        location.href = "./admin-edit.html";
      } else {
        msg.textContent = "비밀번호가 맞지 않습니다.";
        msg.className = "gate-msg bad";
        input.select();
        btn.disabled = false;
      }
    });
  }

  return { SESSION_KEY, hashPassword, loadConfig, unlocked, unlock, lock, initGate };
})();
