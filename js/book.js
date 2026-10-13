// Книга: раскладка страниц, 3D-перелистывание, свайпы.
// Каждый «лист» (leaf) — две стороны; лист вращается вокруг пружины.
// Разворот (широкий экран): лицо листа — правая страница, оборот — левая.
// Одна страница (телефон): лицо — страница, оборот — чистая изнанка.
import { PER_PAGE } from "./config.js?v=13";
import { iconSvg } from "./icons.js?v=13";

const DIM = {
  spread: { pw: 470, ph: 700 },
  single: { pw: 400, ph: 720 },
};
const FLIP_MS = 760;
const RING_STEP = 26;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y.slice(2)}`;
};

const FLOURISH = `<svg class="orn" viewBox="0 0 160 14" aria-hidden="true"><path d="M2 7h50q6 0 9-3.5q3-3.5 7-1.5q3 1.7 0 4.3q-2 1.6.5 3.2q4 2.3 8.5-2.5h6q4.5 4.8 8.5 2.5q2.5-1.6.5-3.2q-3-2.6 0-4.3q4-2 7 1.5q3 3.5 9 3.5h50"/><path d="M80 3.5l3.5 3.5-3.5 3.5-3.5-3.5z" class="f"/></svg>`;

function rowHTML(p) {
  const subs = (p.subs || []).length
    ? `<span class="subs">${p.subs.map(subHTML).join("")}</span>`
    : "";
  const again = p.again ? `<span class="stamp2">нужно<br>повторить!</span>` : "";
  return `<li class="plan${p.done ? " done" : ""}${p.again ? " again" : ""}" data-id="${esc(p.id)}">
    <span class="box"><svg viewBox="0 0 24 24"><path class="sq" d="M4.6 5.3Q12 4.3 19.5 4.8q.7 7.3-.1 14.6q-7.4.9-14.7.2Q4 12.3 4.6 5.3z"/><path class="tick" d="M6.8 12.2l3.8 5.1L21.5 2.8"/></svg></span>
    <span class="pic">${iconSvg(p.icon)}</span>
    <span class="txt">${esc(p.text)}${subs}</span>
    <span class="stamp"><b>исполнено</b><i>${fmtDate(p.doneAt)}</i></span>${again}
  </li>`;
}

const MINI_BOX = `<svg class="mbox" viewBox="0 0 24 24"><path class="sq" d="M4.6 5.3Q12 4.3 19.5 4.8q.7 7.3-.1 14.6q-7.4.9-14.7.2Q4 12.3 4.6 5.3z"/><path class="tick" d="M6.8 12.2l3.8 5.1L21.5 2.8"/></svg>`;
function subHTML(s, i) {
  return `<span class="sub${s.done ? " done" : ""}" data-i="${i}">${MINI_BOX}<span class="st">${esc(s.text)}</span><span class="mstamp">${fmtDate(s.doneAt)}</span></span>`;
}

function pageHTML(list, idx, side) {
  const head = idx === 0 ? `<h1>Наши планы</h1>` : FLOURISH;
  return `<div class="page side-${side} v${idx % 4}">
    <div class="holes"></div>
    <header class="ph">${head}</header>
    <div class="sheet"><ol class="list">${list.map(rowHTML).join("")}</ol></div>
    <footer class="pn">${idx + 1}</footer>
    <button class="corner-hit" data-go="${side === "r" ? 1 : -1}" tabindex="-1" aria-label="${side === "r" ? "Дальше" : "Назад"}"></button>
  </div>`;
}

const blankHTML = (side) =>
  `<div class="page side-${side} blank"><div class="holes"></div><div class="sheet"></div></div>`;

function coverHTML(done, total) {
  return `<div class="cover">
    <div class="stitch"></div>
    <div class="cv-mid">
      ${FLOURISH}
      <h1 class="cv-title">Наши<br>планы</h1>
      ${FLOURISH}
      <div class="cv-names">Geba &amp; Tomusya</div>
      <svg class="cv-heart" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28Q3.5 19.8 3.5 11.3q0-5.6 5.6-6Q13.4 5 16 9.2q2.6-4.2 6.9-3.9q5.6.4 5.6 6Q28.5 19.8 16 28z"/><path class="hl" d="M8 11q.3-2.6 2.8-3"/></svg>
    </div>
    <div class="cv-count">исполнено <b>${done}</b> из <b>${total}</b></div>
    <div class="band"></div>
    <i class="cap tr"></i><i class="cap br"></i>
  </div>`;
}
const coverInsideHTML = () => `<div class="cover-inside"><div class="holes"></div></div>`;

function ringsSVG(ph) {
  const n = Math.floor((ph - 20) / RING_STEP);
  const top = (ph - (n - 1) * RING_STEP) / 2;
  let rings = "";
  for (let i = 0; i < n; i++) {
    const y = top + i * RING_STEP;
    rings += `<path class="rs" d="M-17 ${y + 2.5}C-17 ${y - 9},17 ${y - 9},17 ${y + 2.5}"/><path class="rg" d="M-17 ${y}C-17 ${y - 11},17 ${y - 11},17 ${y}"/><path class="rh" d="M-9 ${y - 7.2}C-4 ${y - 9.4},4 ${y - 9.4},9 ${y - 7.2}"/>`;
  }
  return `<svg class="rings" viewBox="-24 0 48 ${ph}" width="48" height="${ph}" aria-hidden="true">
    <defs><linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5b4224"/><stop offset=".35" stop-color="#c9a66b"/><stop offset=".55" stop-color="#f0d9a4"/><stop offset=".8" stop-color="#a07a42"/><stop offset="1" stop-color="#4e381d"/>
    </linearGradient></defs>${rings}</svg>`;
}

export function createBook(stage, { onRow, onSub, onFlip }) {
  const book = document.createElement("div");
  book.className = "book";
  book.innerHTML = `<div class="board board-l"></div><div class="board board-r"></div><div class="leaves"></div><div class="rings-wrap"></div>`;
  stage.appendChild(book);
  const leavesEl = book.querySelector(".leaves");
  const ringsWrap = book.querySelector(".rings-wrap");

  let mode = null;
  let plans = [];
  let pages = []; // массивы планов по страницам
  let leaves = [];
  let f = 0; // сколько листов перевёрнуто
  let zTop = 1000;
  let windowTimer = null;

  // ---------- раскладка ----------
  function paginate() {
    // у плана есть номер страницы (page); у старых без номера — по PER_PAGE подряд
    const filled = [];
    plans.forEach((p, i) => {
      const pg = (p.page || Math.floor(i / PER_PAGE) + 1) - 1;
      (filled[pg] ||= []).push(p);
    });
    const n = Math.max(1, filled.length);
    const total = n + (n % 2) + 2; // всегда остаётся пустой разворот
    pages = Array.from({ length: total }, (_, i) => filled[i] || []);
  }

  function buildLeaves() {
    const done = plans.filter((p) => p.done).length;
    const sides = [];
    if (mode === "spread") {
      sides.push([coverHTML(done, plans.length), pageHTML(pages[0], 0, "l")]);
      for (let j = 1; j <= pages.length / 2; j++) {
        const fi = 2 * j - 1, bi = 2 * j;
        sides.push([pageHTML(pages[fi], fi, "r"), bi < pages.length ? pageHTML(pages[bi], bi, "l") : blankHTML("l")]);
      }
    } else {
      sides.push([coverHTML(done, plans.length), coverInsideHTML()]);
      pages.forEach((pg, i) => sides.push([pageHTML(pg, i, "r"), blankHTML("l")]));
    }
    leavesEl.innerHTML = sides
      .map(([a, b], j) => `<div class="leaf" data-j="${j}"><div class="face front">${a}</div><div class="face back">${b}</div></div>`)
      .join("");
    leaves = [...leavesEl.children];
    f = Math.min(f, leaves.length - 1);
    leaves.forEach((el, j) => {
      el.classList.toggle("flipped", j < f);
      el.style.zIndex = restZ(j, j < f);
    });
    setWindow(f, f);
    fitPages();
  }

  // если на странице много длинных планов — делаем строки плотнее, а не переносим планы
  function fitPages() {
    book.querySelectorAll(".page .sheet").forEach((sheet) => {
      const page = sheet.parentElement;
      page.classList.remove("dense", "denser");
      if (sheet.scrollHeight > sheet.clientHeight + 1) page.classList.add("dense");
      if (sheet.scrollHeight > sheet.clientHeight + 1) page.classList.add("denser");
    });
  }

  const restZ = (j, flipped) => (flipped ? j + 1 : 500 - j);

  function setWindow(a, b) {
    const lo = Math.min(a, b) - 2, hi = Math.max(a, b) + 1;
    leaves.forEach((el, j) => el.classList.toggle("off", j < lo || j > hi));
  }

  function layout() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const topH = 64, botH = 58;
    const availH = vh - topH - botH;
    const sSpread = Math.min((vw - 24) / (DIM.spread.pw * 2), availH / DIM.spread.ph);
    const sSingle = Math.min((vw - 44) / (DIM.single.pw + 24), availH / DIM.single.ph);
    const next = sSpread < sSingle * 0.8 ? "single" : "spread";
    const { pw, ph } = DIM[next];
    const s = next === "spread" ? sSpread : sSingle;
    book.style.setProperty("--pw", pw + "px");
    book.style.setProperty("--ph", ph + "px");
    book.style.setProperty("--s", s.toFixed(4));
    book.style.top = topH + availH / 2 + "px";
    if (next !== mode) {
      const page = currentPage();
      mode = next;
      book.dataset.mode = mode;
      ringsWrap.innerHTML = ringsSVG(ph);
      f = pageToF(page);
      if (pages.length) buildLeaves();
    }
    updateShift();
  }

  // текущая страница (-1 = обложка) <-> число перевёрнутых листов
  function currentPage() {
    if (f === 0 || !mode) return -1;
    return mode === "spread" ? 2 * f - 2 : f - 1;
  }
  function pageToF(p) {
    if (p < 0) return 0;
    return mode === "spread" ? Math.floor(p / 2) + 1 : p + 1;
  }

  function updateShift() {
    const pw = DIM[mode].pw;
    const shift = mode === "single" || f === 0 ? -pw / 2 : 0;
    book.style.setProperty("--shift", shift + "px");
    book.classList.toggle("closed", f === 0);
    onFlip && onFlip(label(), f > 0, f < leaves.length - 1);
  }

  function label() {
    if (f === 0) return "обложка";
    if (mode === "spread") return `${2 * f - 1} – ${2 * f}`;
    return String(f);
  }

  // ---------- перелистывание ----------
  function go(target, animate = true) {
    target = Math.max(0, Math.min(leaves.length - 1, target));
    if (target === f) return;
    const from = f;
    f = target;
    setWindow(from, target);
    const dir = target > from ? 1 : -1;
    const range = dir > 0 ? [from, target - 1] : [target, from - 1];
    const order = [];
    for (let j = range[0]; j <= range[1]; j++) order.push(j);
    if (dir < 0) order.reverse();
    order.forEach((j, k) => {
      const el = leaves[j];
      const flipped = j < target;
      const delay = animate ? k * 90 : 0;
      el._t && clearTimeout(el._t);
      if (!animate) {
        el.classList.toggle("flipped", flipped);
        el.style.zIndex = restZ(j, flipped);
        return;
      }
      el.style.zIndex = ++zTop;
      el.style.transitionDelay = delay + "ms";
      el.classList.add("turning", dir > 0 ? "fwd" : "bwd");
      el.classList.remove(dir > 0 ? "bwd" : "fwd");
      el.classList.toggle("flipped", flipped);
      el._t = setTimeout(() => {
        el.classList.remove("turning", "fwd", "bwd");
        el.style.transitionDelay = "";
        el.style.zIndex = restZ(j, el.classList.contains("flipped"));
      }, FLIP_MS + delay + 40);
    });
    clearTimeout(windowTimer);
    windowTimer = setTimeout(() => setWindow(f, f), FLIP_MS + order.length * 90 + 80);
    updateShift();
  }

  const next = () => go(f + 1);
  const prev = () => go(f - 1);

  // ---------- ввод ----------
  let down = null, swiped = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    down = { x: e.clientX, y: e.clientY, t: Date.now() };
    swiped = false;
  });
  stage.addEventListener("pointerup", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    down = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped = true;
      dx < 0 ? next() : prev();
    }
  });
  stage.addEventListener("pointercancel", () => (down = null));
  stage.addEventListener("click", (e) => {
    if (swiped) { swiped = false; return; }
    const hit = e.target.closest(".corner-hit");
    if (hit) return hit.dataset.go === "1" ? next() : prev();
    if (e.target.closest(".cover")) return next();
    const row = e.target.closest(".plan");
    const sub = e.target.closest(".sub");
    if (row && sub) return onSub(row.dataset.id, +sub.dataset.i);
    if (row) onRow(row.dataset.id, row);
  });
  window.addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]")) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") next();
    if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
  });
  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  });

  // ---------- внешнее API ----------
  return {
    render(list, { focus } = {}) {
      plans = list;
      paginate();
      if (!mode) layout();
      else buildLeaves();
      updateShift();
      if (focus) {
        const i = pages.findIndex((pg) => pg.some((p) => p.id === focus));
        if (i >= 0) {
          go(pageToF(i));
          const row = book.querySelector(`.plan[data-id="${CSS.escape(focus)}"]`);
          row && setTimeout(() => row.classList.add("flash"), 120);
        }
      }
    },
    // точечное обновление строки без перестройки книги
    updateRow(p, animate) {
      book.querySelectorAll(`.plan[data-id="${CSS.escape(p.id)}"]`).forEach((row) => {
        row.classList.toggle("done", p.done);
        row.querySelector(".stamp i").textContent = fmtDate(p.doneAt);
        row.classList.remove("just-done");
        if (animate && p.done) {
          void row.offsetWidth;
          row.classList.add("just-done");
        }
      });
      fitPages();
      const done = plans.filter((x) => x.done).length;
      book.querySelectorAll(".cv-count b")[0].textContent = done;
    },
    updateSub(p, i) {
      const s = p.subs[i];
      book.querySelectorAll(`.plan[data-id="${CSS.escape(p.id)}"] .sub[data-i="${i}"]`).forEach((el) => {
        el.classList.toggle("done", s.done);
        el.querySelector(".mstamp").textContent = fmtDate(s.doneAt);
        el.classList.remove("just-done");
        if (s.done) {
          void el.offsetWidth;
          el.classList.add("just-done");
        }
      });
    },
    next,
    prev,
    goCover: () => go(0),
    setMode(m) {
      stage.classList.toggle("editing", m === "edit");
      stage.classList.toggle("stamping", m === "stamp");
    },
    // поставить/снять печать «нужно повторить!» без перестройки книги
    updateAgain(p) {
      book.querySelectorAll(`.plan[data-id="${CSS.escape(p.id)}"]`).forEach((row) => {
        row.classList.toggle("again", !!p.again);
        row.querySelector(".stamp2")?.remove();
        if (p.again) {
          row.insertAdjacentHTML("beforeend", `<span class="stamp2 slam">нужно<br>повторить!</span>`);
        }
      });
      fitPages();
    },
    layout,
  };
}
