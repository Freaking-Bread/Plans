// Данные: список планов + локальный кэш + фоновая синхронизация с GitHub.
import { KEYS, DATA_URL } from "./config.js";
import * as gh from "./github.js";

let data = { version: 1, plans: [] };
const listeners = new Set();
let syncState = "idle"; // idle | saving | ok | error | local
let syncError = "";
let pushTimer = null;

export const plans = () => data.plans;
export const onChange = (fn) => listeners.add(fn);
export const getSync = () => ({ state: syncState, error: syncError, hasToken: !!gh.getToken() });

function emit(kind, extra) {
  listeners.forEach((fn) => fn(kind, extra));
}
function setSync(state, error = "") {
  syncState = state;
  syncError = error;
  emit("sync");
}

function persist() {
  localStorage.setItem(KEYS.data, JSON.stringify(data));
}
const isDirty = () => localStorage.getItem(KEYS.dirty) === "1";

function valid(d) {
  return d && Array.isArray(d.plans);
}

// Сначала мгновенно показываем кэш, потом подтягиваем свежую версию.
export async function load() {
  try {
    const cached = JSON.parse(localStorage.getItem(KEYS.data));
    if (valid(cached)) data = cached;
  } catch {}
  if (!data.plans.length) {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      const d = await res.json();
      if (valid(d)) data = d;
    } catch {}
    persist();
  }
  return data;
}

export async function refresh() {
  if (isDirty()) {
    if (gh.getToken()) schedulePush(0);
    else setSync("local");
    return;
  }
  try {
    const remote = await gh.pull();
    if (valid(remote) && JSON.stringify(remote) !== JSON.stringify(data)) {
      data = remote;
      persist();
      emit("reload");
    }
    setSync(gh.getToken() ? "ok" : "idle");
  } catch (e) {
    if (gh.getToken()) setSync("error", e.message);
  }
}

function commit(message, kind = "reload", extra) {
  persist();
  localStorage.setItem(KEYS.dirty, "1");
  emit(kind, extra);
  lastMessage = message;
  if (gh.getToken()) schedulePush();
  else setSync("local");
}
let lastMessage = "Обновление планов";

function schedulePush(delay = 1500) {
  clearTimeout(pushTimer);
  setSync("saving");
  pushTimer = setTimeout(async () => {
    try {
      await gh.push(data, lastMessage);
      localStorage.removeItem(KEYS.dirty);
      setSync("ok");
    } catch (e) {
      setSync("error", e.message);
    }
  }, delay);
}

export async function connect(token) {
  gh.setToken(token);
  if (!token) return setSync("local");
  if (isDirty()) return schedulePush(0);
  await refresh();
}

const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

export function toggle(id) {
  const p = data.plans.find((x) => x.id === id);
  if (!p) return;
  p.done = !p.done;
  p.doneAt = p.done ? new Date().toISOString().slice(0, 10) : null;
  commit(`${p.done ? "✓" : "↺"} ${p.text}`, "toggle", p);
}

export function toggleSub(id, i) {
  const p = data.plans.find((x) => x.id === id);
  const s = p && p.subs && p.subs[i];
  if (!s) return;
  s.done = !s.done;
  s.doneAt = s.done ? new Date().toISOString().slice(0, 10) : null;
  commit(`${s.done ? "✓" : "↺"} ${p.text} — ${s.text}`, "toggleSub", { p, i });
}

// подпункты из текста (по строке на пункт); отметки сохраняются у совпавших строк
export function subsFromText(text, old = []) {
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => old.find((s) => s.text === t) || { text: t, done: false, doneAt: null });
}

export function add({ text, subs, icon, again }) {
  const p = { id: uid(), text, subs, icon, again, done: false, doneAt: null };
  data.plans.push(p);
  commit(`+ ${text}`, "reload", { focus: p.id });
  return p;
}

export function update(id, patch) {
  const p = data.plans.find((x) => x.id === id);
  if (!p) return;
  Object.assign(p, patch);
  commit(`✎ ${p.text}`, "reload", { focus: id });
}

export function remove(id) {
  const p = data.plans.find((x) => x.id === id);
  data.plans = data.plans.filter((x) => x.id !== id);
  commit(`− ${p ? p.text : id}`);
}

export function move(id, dir) {
  const i = data.plans.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= data.plans.length) return;
  const arr = data.plans;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  commit(`⇅ ${arr[j].text}`, "reload", { focus: id });
}
