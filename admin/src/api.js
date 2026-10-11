// Thin client for the admin API (admin/server/api.js)
const BASE = '/__admin/api';

async function request(method, path, body, { raw = false } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: raw || body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${method} ${path} failed (${res.status})`);
  return data;
}

const enc = encodeURIComponent;

export const api = {
  state: () => request('GET', '/state'),
  createProject: (title) => request('POST', '/projects', { title }),
  saveProject: (slug, project) => request('PUT', `/projects/${enc(slug)}`, project),
  renameProject: (slug, to) => request('POST', `/projects/${enc(slug)}/rename`, { slug: to }),
  deleteProject: (slug) => request('DELETE', `/projects/${enc(slug)}`),
  saveOverview: (slug, text) => request('PUT', `/projects/${enc(slug)}/overview`, text, { raw: true }),
  uploadMedia: (slug, relPath, file, optimize) =>
    request('POST', `/projects/${enc(slug)}/media?path=${enc(relPath)}${optimize ? '&optimize=1' : ''}`, file, { raw: true }),
  deleteMedia: (slug, relPath) => request('DELETE', `/projects/${enc(slug)}/media?path=${enc(relPath)}`),
  saveOrder: (slugs) => request('PUT', '/order', slugs),
  saveTheme: (theme) => request('PUT', '/theme', theme),
  saveSite: (name, data) => request('PUT', `/site/${enc(name)}`, data),
  test: () => request('POST', '/test'),
  stopTest: () => request('POST', '/test/stop'),
  stage: (message) => request('POST', '/stage', { message }),
  publish: (message) => request('POST', '/publish', { message }),
  job: (id) => request('GET', `/jobs/${enc(id)}`),
};

/** Poll a job until it finishes, reporting its log as it grows. */
export async function followJob(id, onUpdate) {
  for (;;) {
    const job = await api.job(id);
    onUpdate(job);
    if (job.status !== 'running') return job;
    await new Promise((r) => setTimeout(r, 700));
  }
}

/** URL of a project's media file on the dev server (mirrors resolveMediaUrl). */
export const mediaUrl = (slug, src) => (/^(https?:)?\/\//.test(src) ? src : `/projects/${slug}/${src}`);
