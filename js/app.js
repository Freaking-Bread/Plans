// Точка входа: связывает данные, книгу и диалоги.
import * as store from "./store.js";
import { createBook } from "./book.js";
import { ICONS, ICON_KEYS, DEFAULT_ICON, iconSvg } from "./icons.js";

const $ = (s) => document.querySelector(s);
let editing = false;

const book = createBook($("#stage"), {
  onRow(id) {
    if (editing) openEditor(id);
    else store.toggle(id);
  },
  onFlip(label, canPrev, canNext) {
    $("#pageLabel").textContent = label;
    $("#prev").disabled = !canPrev;
    $("#next").disabled = !canNext;
  },
});

store.onChange((kind, extra) => {
  if (kind === "toggle") book.updateRow(extra, true);
  else if (kind === "reload") book.render(store.plans(), extra || {});
  else if (kind === "sync") paintSync();
});

$("#prev").onclick = () => book.prev();
$("#next").onclick = () => book.next();
$("#btnAdd").onclick = () => openEditor(null);
$("#btnEdit").onclick = () => {
  editing = !editing;
  $("#btnEdit").classList.toggle("on", editing);
  book.setEditing(editing);
};
$("#btnSync").onclick = openSync;

// ---------- редактор плана ----------
const dlg = $("#dlgPlan");
const form = dlg.querySelector("form");
let editId = null;
let chosenIcon = DEFAULT_ICON;
let delArmed = false;

function paintIcons() {
  const used = new Set(store.plans().map((p) => p.icon));
  const keys = [...ICON_KEYS.filter((k) => !used.has(k)), ...ICON_KEYS.filter((k) => used.has(k))];
  $("#iconGrid").innerHTML = keys.map(
    (k) =>
      `<button type="button" class="ig${k === chosenIcon ? " sel" : ""}${used.has(k) && k !== chosenIcon ? " used" : ""}" data-icon="${k}" title="${ICONS[k].name}">${iconSvg(k)}</button>`
  ).join("");
}
$("#iconGrid").addEventListener("click", (e) => {
  const b = e.target.closest(".ig");
  if (!b) return;
  chosenIcon = b.dataset.icon;
  $("#iconGrid .sel")?.classList.remove("sel");
  b.classList.add("sel");
});

function firstFreeIcon() {
  const used = new Set(store.plans().map((p) => p.icon));
  return ICON_KEYS.find((k) => !used.has(k)) || DEFAULT_ICON;
}

function openEditor(id) {
  editId = id;
  const p = id ? store.plans().find((x) => x.id === id) : null;
  $("#dlgTitle").textContent = p ? "Изменить план" : "Новый план";
  form.text.value = p ? p.text : "";
  form.note.value = p ? p.note || "" : "";
  chosenIcon = p ? p.icon : firstFreeIcon();
  dlg.classList.toggle("is-edit", !!p);
  disarmDelete();
  paintIcons();
  dlg.showModal();
  if (!p) form.text.focus();
  $("#iconGrid .sel")?.scrollIntoView({ block: "nearest" });
}

function disarmDelete() {
  delArmed = false;
  dlg.querySelector('[data-act="del"]').textContent = "Удалить";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = form.text.value.trim();
  if (!text) return form.text.focus();
  const note = form.note.value.trim();
  if (editId) store.update(editId, { text, note, icon: chosenIcon });
  else store.add({ text, note, icon: chosenIcon });
  dlg.close();
});

dlg.addEventListener("click", (e) => {
  if (e.target === dlg) return dlg.close(); // клик по фону
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "cancel") dlg.close();
  if (act === "up" || act === "down") store.move(editId, act === "up" ? -1 : 1);
  if (act === "del") {
    if (!delArmed) {
      delArmed = true;
      e.target.textContent = "Точно удалить?";
      return;
    }
    store.remove(editId);
    dlg.close();
  }
});

// ---------- синхронизация ----------
const sdlg = $("#dlgSync");
const sform = sdlg.querySelector("form");

function paintSync() {
  const { state, error, hasToken } = store.getSync();
  const btn = $("#btnSync");
  btn.dataset.state = hasToken ? state : "none";
  const text = {
    ok: "Всё сохранено в GitHub",
    saving: "Сохраняю…",
    error: "Ошибка: " + error,
    local: "Изменения сохранены только на этом устройстве",
    idle: hasToken ? "Подключено" : "Не подключено",
  }[state];
  $("#syncStatus").textContent = text || "";
}

function openSync() {
  sform.token.value = localStorage.getItem("pb_gh_token") || "";
  paintSync();
  sdlg.showModal();
}
sform.addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#syncStatus").textContent = "Проверяю…";
  await store.connect(sform.token.value.trim());
  paintSync();
});
sdlg.addEventListener("click", (e) => {
  if (e.target === sdlg || e.target.closest('[data-act="cancel"]')) sdlg.close();
});

// ---------- старт ----------
(async function start() {
  try {
    await Promise.race([document.fonts.load('16px "Fibre"'), new Promise((r) => setTimeout(r, 2500))]);
  } catch {}
  await store.load();
  book.render(store.plans());
  document.body.classList.add("ready");
  paintSync();
  store.refresh();
})();
