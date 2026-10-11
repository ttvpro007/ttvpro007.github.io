/**
 * Site structure — content/site/layout.json: the pages (nav label, slug, on/off, order) and
 * each page's ordered sections (a type from SECTION_TYPES, on/off, options).
 *
 *   { "pages": [ { "id": "home", "label": "Home", "slug": "home", "enabled": true, "order": 0,
 *                  "sections": [ { "id": "hero", "type": "hero", "enabled": true, "options": {} } ] } ] }
 *
 * Pure helpers shared by the site (App.jsx renders from them), the store/CLI (validation and
 * edits) and the admin's Site map. Edits return a new layout and throw on a bad reference.
 */
import { SECTION_TYPES, optionError } from './sectionTypes.js';

export const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
/** Section ids default to their type name, so camelCase is allowed. */
export const SECTION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Pages sorted by `order` (array position breaks ties). */
export const sortedPages = (layout) =>
  (layout?.pages || []).map((p, i) => [p, i]).sort(([a, i], [b, j]) => (a.order ?? i) - (b.order ?? j) || i - j).map(([p]) => p);

/** Pages sorted, with `order` rewritten to 0…n-1 — the shape every write stores. */
export const normalizeLayout = (layout) => ({
  ...layout,
  pages: sortedPages(layout).map((p, order) => ({ ...p, order })),
});

/** What the site shows: enabled pages in order, each with only its enabled, known sections. */
export const visiblePages = (layout) =>
  sortedPages(layout)
    .filter((p) => p.enabled !== false)
    .map((p) => ({ ...p, sections: (p.sections || []).filter((s) => s.enabled !== false && SECTION_TYPES[s.type]) }));

/** Every problem with a layout, as readable strings (empty = valid). */
export const validateLayout = (layout) => {
  const errors = [];
  if (!isObj(layout)) return ['layout must be a JSON object'];
  if (!Array.isArray(layout.pages)) return ['layout.pages must be an array'];

  const ids = new Set();
  const slugs = new Set();
  layout.pages.forEach((page, i) => {
    const at = `page ${isObj(page) && page.id ? `"${page.id}"` : `#${i + 1}`}`;
    if (!isObj(page)) return errors.push(`${at} must be an object`);
    if (!ID_PATTERN.test(page.id || '')) errors.push(`${at}: id must be lowercase letters, digits and dashes`);
    else if (ids.has(page.id)) errors.push(`duplicate page id "${page.id}"`);
    ids.add(page.id);
    if (typeof page.label !== 'string' || !page.label.trim()) errors.push(`${at}: label is required`);
    if (!ID_PATTERN.test(page.slug || '')) errors.push(`${at}: slug must be lowercase letters, digits and dashes`);
    else if (slugs.has(page.slug)) errors.push(`duplicate page slug "${page.slug}"`);
    slugs.add(page.slug);
    if (page.enabled !== undefined && typeof page.enabled !== 'boolean') errors.push(`${at}: enabled must be true or false`);
    if (page.order !== undefined && !Number.isInteger(page.order)) errors.push(`${at}: order must be a whole number`);
    if (!Array.isArray(page.sections)) return errors.push(`${at}: sections must be an array`);

    const sectionIds = new Set();
    page.sections.forEach((section, j) => {
      const sat = `${at} section ${isObj(section) && section.id ? `"${section.id}"` : `#${j + 1}`}`;
      if (!isObj(section)) return errors.push(`${sat} must be an object`);
      if (!SECTION_ID_PATTERN.test(section.id || '')) errors.push(`${sat}: id must be letters, digits and dashes`);
      else if (sectionIds.has(section.id)) errors.push(`${at}: duplicate section id "${section.id}"`);
      sectionIds.add(section.id);
      const type = SECTION_TYPES[section.type];
      if (!type) return errors.push(`${sat}: unknown section type "${section.type}" (known: ${Object.keys(SECTION_TYPES).join(', ')})`);
      if (section.enabled !== undefined && typeof section.enabled !== 'boolean') errors.push(`${sat}: enabled must be true or false`);
      if (section.options === undefined) return;
      if (!isObj(section.options)) return errors.push(`${sat}: options must be an object`);
      for (const [key, value] of Object.entries(section.options)) {
        const schema = type.options[key];
        if (!schema) errors.push(`${sat}: unknown option "${key}" for ${section.type}${Object.keys(type.options).length ? ` (known: ${Object.keys(type.options).join(', ')})` : ' (it has none)'}`);
        else {
          const problem = optionError(schema, value);
          if (problem) errors.push(`${sat}: option ${key} ${problem}`);
        }
      }
    });
  });
  if (!layout.pages.some((p) => isObj(p) && p.enabled !== false)) errors.push('at least one page must be enabled');
  return errors;
};

/* ── Edits (CLI and admin) ─────────────────────────────────────────────── */

const fail = (message) => { throw new Error(message); };

export const findPage = (layout, id) =>
  layout.pages.find((p) => p.id === id) || fail(`No page "${id}" (have: ${layout.pages.map((p) => p.id).join(', ')})`);

/** A section by id, or by 0-based index. */
export const findSectionIndex = (page, ref) => {
  const i = /^\d+$/.test(String(ref)) ? Number(ref) : page.sections.findIndex((s) => s.id === ref);
  if (!page.sections[i]) fail(`Page "${page.id}" has no section ${JSON.stringify(ref)} (have: ${page.sections.map((s) => s.id).join(', ') || 'none'})`);
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
  if (layout.pages.some((p) => p.id === id)) fail(`Page "${id}" already exists`);
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
  if (!SECTION_TYPES[type]) fail(`Unknown section type "${type}" (known: ${Object.keys(SECTION_TYPES).join(', ')})`);
  return mapPage(layout, pageId, (p) => {
    const taken = p.sections.map((s) => s.id);
    if (id && taken.includes(id)) fail(`Page "${pageId}" already has a section "${id}"`);
    const section = { id: id || uniqueId(type, taken), type, enabled, ...(options && Object.keys(options).length ? { options } : {}) };
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
