// Настройки «Книги планов».
// Планы лежат в data/plans.json этого же репозитория; с токеном сайт сам коммитит изменения.
export const GITHUB = {
  owner: "Freaking-Bread",
  repo: "Plans",
  branch: "main",
  path: "data/plans.json",
};

export const KEYS = {
  data: "pb_data_v1",
  dirty: "pb_dirty",
  token: "pb_gh_token",
  sha: "pb_gh_sha",
  page: "pb_page",
};

export const DATA_URL = "data/plans.json";

// сколько планов на одной странице
export const PER_PAGE = 14;
