/**
 * Site structure — content/site/layout.json: the pages (nav label, slug, on/off, order) and
 * each page's ordered sections.
 *
 *   { "pages": [ { "id": "home", "label": "Home", "slug": "home", "enabled": true, "order": 0,
 *                  "sections": [ { "type": "hero", "id": "hero", "enabled": true } ] } ] }
 *
 * Every section is a node { type, id, enabled, options?, children? }. `options` holds only
 * values that differ from the type's defaults; `children` (nodes of the same shape) is reserved
 * for types whose registry entry sets `children: true` — none do yet, but the format and the
 * validation already allow it, so nested blocks need no migration.
 *
 * Pure helpers shared by the site (App.jsx renders from them), the store/CLI (validation and
 * edits) and the admin's Site map. Edits return a new layout and throw on a bad reference.
 */
import { SECTION_TYPES, optionError, compactOptions } from './sectionTypes.js';

export const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
/** Section ids default to their type name, so camelCase is allowed. */
export const SECTION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;

/** Stored key order; keys starting with "_" (notes) are kept, anything else is reported as a typo. */
export const PAGE_KEYS = ['id', 'label', 'slug', 'enabled', 'order', 'sections'];
export const NODE_KEYS = ['type', 'id', 'enabled', 'options', 'children'];

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const toId = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const typeList = () => Object.keys(SECTION_TYPES).join(', ');

/** Pages sorted by `order` (array position breaks ties). */
export const sortedPages = (layout) =>
  (layout?.pages || []).map((p, i) => [p, i]).sort(([a, i], [b, j]) => (a.order ?? i) - (b.order ?? j) || i - j).map(([p]) => p);

const ordered = (obj, keys) => {
  const out = {};
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k];
  for (const k of Object.keys(obj)) if (!(k in out) && obj[k] !== undefined) out[k] = obj[k];
  return out;
};

/** One node as stored: canonical key order, default-valued options dropped, children normalized. */
export const normalizeNode = (node) => ordered({
  ...node,
  options: SECTION_TYPES[node.type] ? compactOptions(node.type, node.options) : node.options,
  children: Array.isArray(node.children) ? node.children.map((c) => (isObj(c) ? normalizeNode(c) : c)) : node.children,
}, NODE_KEYS);

/** The shape every write stores: pages in order with `order` = 0…n-1, nodes normalized. */
export const normalizeLayout = (layout) => ({
  ...layout,
  pages: sortedPages(layout).map((p, order) => ordered({
    ...p,
    order,
    sections: Array.isArray(p.sections) ? p.sections.map((s) => (isObj(s) ? normalizeNode(s) : s)) : p.sections,
  }, PAGE_KEYS)),
});

/** What the site shows: enabled pages in order, each with only its enabled, known sections. */
export const visiblePages = (layout) =>
  sortedPages(layout)
    .filter((p) => p.enabled !== false)
    .map((p) => ({ ...p, sections: (p.sections || []).filter((s) => s.enabled !== false && SECTION_TYPES[s.type]) }));

const unknownKeys = (obj, known) => Object.keys(obj).filter((k) => !known.includes(k) && !k.startsWith('_'));

/** Problems with a list of sibling nodes (a page's sections, or a node's children). */
const validateNodes = (nodes, at, errors) => {
  if (!Array.isArray(nodes)) return errors.push(`${at}: must be an array of sections — use [] for none`);
  const ids = new Set();
  nodes.forEach((node, j) => {
    const nat = `${at}[${j}]${isObj(node) && node.id ? ` "${node.id}"` : ''}`;
    if (!isObj(node)) return errors.push(`${nat}: must be an object like { "type": "hero", "id": "hero", "enabled": true }`);
    for (const k of unknownKeys(node, NODE_KEYS)) errors.push(`${nat}: unknown key "${k}" — a section has ${NODE_KEYS.join(', ')} (prefix notes with "_")`);
    const type = SECTION_TYPES[node.type];
    if (!type) errors.push(`${nat}: unknown section type "${node.type}" — use one of: ${typeList()} (npm run content -- layout types)`);
    if (!SECTION_ID_PATTERN.test(node.id || '')) {
      errors.push(`${nat}: id ${node.id === undefined ? 'is missing' : `"${node.id}" is not valid`} — use letters, digits and dashes${type ? `, e.g. "${node.type}"` : ''}`);
    } else if (ids.has(node.id)) errors.push(`${nat}: duplicate section id "${node.id}" here — rename one (e.g. "${node.id}-2")`);
    ids.add(node.id);
    if (node.enabled !== undefined && typeof node.enabled !== 'boolean') errors.push(`${nat}: enabled must be true or false, not ${JSON.stringify(node.enabled)}`);
    if (!type) return;
    if (node.options !== undefined) {
      if (!isObj(node.options)) errors.push(`${nat}: options must be an object (or left out to use the defaults)`);
      else {
        const known = Object.keys(type.options);
        for (const [key, value] of Object.entries(node.options)) {
          const schema = type.options[key];
          if (!schema) errors.push(`${nat}: unknown option "${key}" for ${node.type} — ${known.length ? `its options are: ${known.join(', ')}` : 'it has no options; remove "options"'}`);
          else {
            const problem = optionError(schema, value);
            if (problem) errors.push(`${nat}: option ${key} ${problem}, not ${JSON.stringify(value)} (default: ${JSON.stringify(schema.default)})`);
          }
        }
      }
    }
    if (node.children !== undefined) {
      if (!type.children) errors.push(`${nat}: ${node.type} does not hold child blocks — remove "children"`);
      else validateNodes(node.children, `${nat}.children`, errors);
    }
  });
};

/**
 * Every problem with a layout, one line each: a JSON path into layout.json, what is wrong and
 * how to fix it. Empty = valid.
 */
export const validateLayout = (layout) => {
  const errors = [];
  if (!isObj(layout)) return ['the file must be a JSON object: { "pages": [ … ] }'];
  if (!Array.isArray(layout.pages)) return ['pages: must be an array, e.g. { "pages": [ { "id": "home", … } ] }'];
  for (const k of unknownKeys(layout, ['pages'])) errors.push(`${k}: unknown top-level key — layout.json only has "pages" (prefix notes with "_")`);

  const ids = new Set();
  const slugs = new Set();
  layout.pages.forEach((page, i) => {
    const at = `pages[${i}]${isObj(page) && page.id ? ` "${page.id}"` : ''}`;
    if (!isObj(page)) return errors.push(`${at}: must be an object like { "id": "home", "label": "Home", "slug": "home", "enabled": true, "sections": [] }`);
    for (const k of unknownKeys(page, PAGE_KEYS)) errors.push(`${at}: unknown key "${k}" — a page has ${PAGE_KEYS.join(', ')} (prefix notes with "_")`);
    const idHint = toId(page.id || page.label);
    if (!ID_PATTERN.test(page.id || '')) {
      errors.push(`${at}: id ${page.id === undefined ? 'is missing' : `"${page.id}" is not valid`} — use lowercase letters, digits and dashes${idHint ? `, e.g. "${idHint}"` : ''}`);
    } else if (ids.has(page.id)) errors.push(`${at}: duplicate page id "${page.id}" — page ids must be unique`);
    ids.add(page.id);
    if (typeof page.label !== 'string' || !page.label.trim()) {
      errors.push(`${at}: label (the nav text) is required, e.g. "label": "${page.id ? page.id.replace(/^./, (c) => c.toUpperCase()) : 'Home'}"`);
    }
    const slugHint = toId(page.slug || page.id);
    if (!ID_PATTERN.test(page.slug || '')) {
      errors.push(`${at}: slug ${page.slug === undefined ? 'is missing' : `"${page.slug}" is not valid`} — use lowercase letters, digits and dashes${slugHint ? `, e.g. "${slugHint}"` : ''}`);
    } else if (slugs.has(page.slug)) errors.push(`${at}: duplicate slug "${page.slug}" — another page already uses /?page=${page.slug}`);
    slugs.add(page.slug);
    if (page.enabled !== undefined && typeof page.enabled !== 'boolean') errors.push(`${at}: enabled must be true or false, not ${JSON.stringify(page.enabled)}`);
    if (page.order !== undefined && !Number.isInteger(page.order)) errors.push(`${at}: order must be a whole number (0 = first in the nav)`);
    validateNodes(page.sections, `${at}.sections`, errors);
  });
  if (!layout.pages.some((p) => isObj(p) && p.enabled !== false)) {
    errors.push('pages: at least one page must be enabled — the site needs a landing page (set "enabled": true on one)');
  }
  return errors;
};

/* ── Edits (CLI and admin) ─────────────────────────────────────────────── */

const fail = (message) => { throw new Error(message); };

export const findPage = (layout, id) =>
  layout.pages.find((p) => p.id === id) || fail(`No page "${id}" in layout.json — pages are: ${layout.pages.map((p) => p.id).join(', ')}`);

/** A section by id, or by 0-based index. */
export const findSectionIndex = (page, ref) => {
  const i = /^\d+$/.test(String(ref)) ? Number(ref) : page.sections.findIndex((s) => s.id === ref);
  if (!page.sections[i]) fail(`Page "${page.id}" has no section ${JSON.stringify(ref)} — its sections are: ${page.sections.map((s) => s.id).join(', ') || 'none'} (or use a 0-based index)`);
  return i;
};

const mapPage = (layout, id, fn) => {
  findPage(layout, id);
  return { ...layout, pages: layout.pages.map((p) => (p.id === id ? fn(p) : p)) };
};

const clampPosition = (pos, length) => Math.max(0, Math.min(pos ?? length, length));

/** `base`, or base-2, base-3… — the first not in `taken`. */
export const uniqueId = (base, taken) => {
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
};

export const addPage = (layout, { id, label, slug, enabled = true, position }) => {
  if (layout.pages.some((p) => p.id === id)) fail(`Page "${id}" already exists — pick another id`);
  const pages = sortedPages(layout);
  pages.splice(clampPosition(position, pages.length), 0, { id, label, slug: slug || id, enabled, sections: [] });
  return normalizeLayout({ ...layout, pages: pages.map((p, order) => ({ ...p, order })) });
};

export const removePage = (layout, id) => {
  findPage(layout, id);
  return normalizeLayout({ ...layout, pages: layout.pages.filter((p) => p.id !== id) });
};

export const updatePage = (layout, id, changes) => mapPage(layout, id, (p) => ({ ...p, ...changes }));

export const movePage = (layout, id, position) => {
  const pages = sortedPages(layout);
  const from = pages.indexOf(findPage(layout, id));
  const [page] = pages.splice(from, 1);
  pages.splice(clampPosition(position, pages.length), 0, page);
  return { ...layout, pages: pages.map((p, order) => ({ ...p, order })) };
};

/** A new section of `type` (id defaults to the type, made unique within the page). */
export const addSection = (layout, pageId, { type, id, enabled = true, options, position }) => {
  if (!SECTION_TYPES[type]) fail(`Unknown section type "${type}" — use one of: ${typeList()}`);
  return mapPage(layout, pageId, (p) => {
    const taken = p.sections.map((s) => s.id);
    if (id && taken.includes(id)) fail(`Page "${pageId}" already has a section "${id}" — pick another id or leave it out (default: ${uniqueId(type, taken)})`);
    const section = normalizeNode({ type, id: id || uniqueId(type, taken), enabled, options });
    const sections = [...p.sections];
    sections.splice(clampPosition(position, sections.length), 0, section);
    return { ...p, sections };
  });
};

export const removeSection = (layout, pageId, ref) =>
  mapPage(layout, pageId, (p) => {
    const i = findSectionIndex(p, ref);
    return { ...p, sections: p.sections.filter((_, j) => j !== i) };
  });

export const moveSection = (layout, pageId, ref, position) =>
  mapPage(layout, pageId, (p) => {
    const sections = [...p.sections];
    const [section] = sections.splice(findSectionIndex(p, ref), 1);
    sections.splice(clampPosition(position, sections.length), 0, section);
    return { ...p, sections };
  });

export const updateSection = (layout, pageId, ref, fn) =>
  mapPage(layout, pageId, (p) => {
    const i = findSectionIndex(p, ref);
    return { ...p, sections: p.sections.map((s, j) => (j === i ? fn(s) : s)) };
  });

/** Move a section to another page (at `position`, default the end); its id is made unique there. */
export const transferSection = (layout, fromPageId, ref, toPageId, position) => {
  if (fromPageId === toPageId) return moveSection(layout, fromPageId, ref, position);
  const from = findPage(layout, fromPageId);
  const to = findPage(layout, toPageId);
  const section = from.sections[findSectionIndex(from, ref)];
  const moved = { ...section, id: uniqueId(section.id, to.sections.map((s) => s.id)) };
  const sections = [...to.sections];
  sections.splice(clampPosition(position, sections.length), 0, moved);
  return updatePage(removeSection(layout, fromPageId, ref), toPageId, { sections });
};
