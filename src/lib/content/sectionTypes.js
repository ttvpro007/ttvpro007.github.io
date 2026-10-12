/**
 * Section type registry — the building blocks a page in content/site/layout.json is made of.
 *
 * Shared by the site (components in src/pages/sections.jsx), the content store / CLI
 * (validation) and the admin's Site map (add-section menu, option forms, "reads" list).
 * Adding a section type = one entry here + one component in SECTION_COMPONENTS.
 *
 * Fields:
 *   label        human name shown in the admin
 *   icon         emoji used in the admin
 *   description  one line for the admin's add-section menu
 *   frame        how consecutive sections of this type are wrapped on a page:
 *                  'stack'  → the centred column the home page uses
 *                  'resume' → the resume card column
 *                  'page'   → none; the section lays out the whole page itself
 *   reads        content the section shows: { file, keys? } with file relative to content/
 *                (keys are top-level fields of that JSON file; 'projects/' means every project)
 *   options      per-section settings, stored in the section's "options" object:
 *                  { kind: 'boolean' | 'select' | 'text' | 'number', label, default, values? (select), hint? }
 *   children     whether a section of this type may hold child blocks (nodes of the same
 *                { type, id, enabled, options, children? } shape) — false for every type today;
 *                reserved so nested rows/columns/blocks can be added without changing the format
 *   exitDelay    ms to wait before leaving a page that shows this section (lets its own exit animation run)
 *   deepLink     the section opens ?project=<slug> links; the first enabled page that has it receives them
 */
export const SECTION_TYPES = {
  hero: {
    label: 'Hero',
    icon: '👋',
    description: 'Profile picture, name, tagline and social links',
    frame: 'stack',
    children: false,
    reads: [{ file: 'site/profile.json', keys: ['personal', 'socialLinks'] }],
    options: {
      profilePicSize: { kind: 'select', label: 'Picture size', values: ['small', 'medium', 'large'], default: 'medium' },
      showSocialLinks: { kind: 'boolean', label: 'Show social links', default: true },
    },
  },
  timeline: {
    label: 'Journey timeline',
    icon: '⏰',
    description: 'Milestones from profile.journey',
    frame: 'stack',
    children: false,
    reads: [
      { file: 'site/profile.json', keys: ['journey'] },
      { file: 'site/uiContent.json', keys: ['sections', 'animations'] },
    ],
    options: {},
  },
  flipCards: {
    label: 'Flip cards',
    icon: '🃏',
    description: 'Cards that flip to reveal a back side',
    frame: 'stack',
    children: false,
    reads: [{ file: 'site/profile.json', keys: ['flipCards'] }],
    options: {},
  },
  funFacts: {
    label: 'Fun facts',
    icon: '🤔',
    description: '“Did you know…?” facts carousel',
    frame: 'stack',
    children: false,
    reads: [
      { file: 'site/profile.json', keys: ['funFacts'] },
      { file: 'site/uiContent.json', keys: ['sections', 'config'] },
    ],
    options: {},
  },
  showAndTell: {
    label: 'Show & tell',
    icon: '📸',
    description: 'Photo strip with captions',
    frame: 'stack',
    children: false,
    reads: [
      { file: 'site/profile.json', keys: ['showAndTell'] },
      { file: 'site/uiContent.json', keys: ['sections', 'config'] },
    ],
    options: {},
  },
  projectsBrowser: {
    label: 'Projects browser',
    icon: '🗂️',
    description: 'Featured project, stats, search and the project grid with its modal',
    frame: 'page',
    children: false,
    reads: [
      { file: 'projects/' },
      { file: 'site/uiContent.json', keys: ['ui'] },
    ],
    options: {
      showFeatured: { kind: 'boolean', label: 'Featured project', default: true },
      showStats: { kind: 'boolean', label: 'Stats cards', default: true },
      showSearch: { kind: 'boolean', label: 'Search and filter', default: true },
    },
    exitDelay: 150,
    deepLink: true,
  },
  resumeProfile: {
    label: 'Resume: profile',
    icon: '🪪',
    description: 'Picture, name and tagline card',
    frame: 'resume',
    children: false,
    reads: [{ file: 'site/profile.json', keys: ['personal'] }],
    options: {},
  },
  resumeSkills: {
    label: 'Resume: skills',
    icon: '⚡',
    description: 'Skill bars by category',
    frame: 'resume',
    children: false,
    reads: [{ file: 'site/profile.json', keys: ['skills'] }],
    options: {
      title: { kind: 'text', label: 'Heading', default: 'Skills' },
    },
  },
  resumeEducation: {
    label: 'Resume: education',
    icon: '🎓',
    description: 'Degrees and relevant courses',
    frame: 'resume',
    children: false,
    reads: [{ file: 'site/profile.json', keys: ['education'] }],
    options: {
      title: { kind: 'text', label: 'Heading', default: 'Education' },
    },
  },
  resumeProjects: {
    label: 'Resume: projects',
    icon: '🧾',
    description: 'Projects marked “show on resume”, by resume order',
    frame: 'resume',
    children: false,
    reads: [{ file: 'projects/', keys: ['showOnResume', 'resumeOrder'] }],
    options: {
      title: { kind: 'text', label: 'Heading', default: 'Projects' },
    },
  },
  contactQuest: {
    label: 'Contact quest',
    icon: '🗺️',
    description: 'Contact banner, social links, HQ card and the quest form',
    frame: 'page',
    children: false,
    reads: [
      { file: 'site/contact.json' },
      { file: 'site/profile.json', keys: ['socialLinks', 'hq'] },
    ],
    options: {},
  },
};

export const OPTION_KINDS = ['boolean', 'select', 'text', 'number'];

export const sectionTypeOf = (section) => SECTION_TYPES[section?.type] || null;

/** A section's options with registry defaults filled in (what its component receives). */
export const sectionOptions = (section) => {
  const schema = sectionTypeOf(section)?.options || {};
  const defaults = Object.fromEntries(Object.entries(schema).map(([k, o]) => [k, o.default]));
  return { ...defaults, ...(section?.options || {}) };
};

/** Only the options that differ from the type's defaults (undefined when none) — what layout.json stores. */
export const compactOptions = (type, options) => {
  const schema = SECTION_TYPES[type]?.options || {};
  const kept = Object.entries(options || {}).filter(([k, v]) => !schema[k] || JSON.stringify(v) !== JSON.stringify(schema[k].default));
  return kept.length ? Object.fromEntries(kept) : undefined;
};

/** Problem with one option value, or null. */
export const optionError = (schema, value) => {
  switch (schema.kind) {
    case 'boolean': return typeof value === 'boolean' ? null : 'must be true or false';
    case 'number': return typeof value === 'number' && Number.isFinite(value) ? null : 'must be a number';
    case 'text': return typeof value === 'string' ? null : 'must be text';
    case 'select': return schema.values.includes(value) ? null : `must be one of ${schema.values.join(', ')}`;
    default: return `has unknown kind "${schema.kind}"`;
  }
};

/** Parse a CLI string into an option value of the right kind (throws on a bad value). */
export const parseOptionValue = (schema, raw) => {
  switch (schema.kind) {
    case 'boolean':
      if (/^(true|yes|1|on)$/i.test(raw)) return true;
      if (/^(false|no|0|off)$/i.test(raw)) return false;
      throw new Error(`must be true or false, got "${raw}"`);
    case 'number': {
      const n = Number(raw);
      if (raw.trim() === '' || Number.isNaN(n)) throw new Error(`must be a number, got "${raw}"`);
      return n;
    }
    case 'select':
      if (!schema.values.includes(raw)) throw new Error(`must be one of ${schema.values.join(', ')}, got "${raw}"`);
      return raw;
    default:
      return raw;
  }
};
