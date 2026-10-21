// Синхронизация с GitHub: читаем и коммитим data/plans.json через REST API.
// Токен хранится только в localStorage этого браузера.
import { GITHUB, KEYS } from "./config.js?v=16";

const API = "https://api.github.com";
const url = () =>
  `${API}/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${GITHUB.path}`;

function b64encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function b64decode(b64) {
  const bin = atob(b64.replace(/\n/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export const getToken = () => localStorage.getItem(KEYS.token) || "";
export function setToken(t) {
  if (t) localStorage.setItem(KEYS.token, t.trim());
  else localStorage.removeItem(KEYS.token);
}

function headers(auth = true) {
  const h = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (auth && getToken()) h.Authorization = `Bearer ${getToken()}`;
  return h;
}

// Свежая версия файла (репозиторий публичный, так что читать можно и без токена).
export async function pull() {
  const res = await fetch(`${url()}?ref=${GITHUB.branch}&t=${Date.now()}`, { headers: headers(), cache: "no-store" });
  if (res.status === 401) throw new Error("Токен не подходит (401)");
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const file = await res.json();
  localStorage.setItem(KEYS.sha, file.sha);
  return JSON.parse(b64decode(file.content));
}

export async function push(data, message, merge) {
  const body = {
    message,
    content: b64encode(JSON.stringify(data, null, 1) + "\n"),
    branch: GITHUB.branch,
    sha: localStorage.getItem(KEYS.sha) || undefined,
  };
  const res = await fetch(url(), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 409 || res.status === 422) {
    // в репозитории появилась более новая версия — сливаем с ней и повторяем
    const remote = await pull();
    body.sha = localStorage.getItem(KEYS.sha);
    if (merge) body.content = b64encode(JSON.stringify(merge(remote), null, 1) + "\n");
    const again = await fetch(url(), {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!again.ok) throw new Error(`GitHub ${again.status}`);
    localStorage.setItem(KEYS.sha, (await again.json()).content.sha);
    return;
  }
  if (res.status === 401) throw new Error("Токен не подходит (401)");
  if (res.status === 403 || res.status === 404) throw new Error("Токену не хватает прав на запись");
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  localStorage.setItem(KEYS.sha, (await res.json()).content.sha);
}
