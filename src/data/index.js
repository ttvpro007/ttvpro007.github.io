// All site content lives in /content — edit it with `npm run admin` or by hand.
import storedProjects from 'virtual:projects';
import { toViewModel } from '@/lib/content/projectSchema';
import profileData from '@content/site/profile.json';

const BASE = import.meta.env.BASE_URL;

/** Root-relative asset paths in content ("/resume.pdf") must follow the base path on staging builds. */
const withBase = (value) => {
  if (BASE === '/') return value;
  if (typeof value === 'string') return value.startsWith('/') && !value.startsWith('//') ? BASE + value.slice(1) : value;
  if (Array.isArray(value)) return value.map(withBase);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBase(v)]));
  return value;
};

export const profile = withBase(profileData);
export { default as navigation } from '@content/site/navigation.json';
export { default as uiContent } from '@content/site/uiContent.json';
export { default as contact } from '@content/site/contact.json';
export { default as theme } from '@content/theme.json';

// Saving a project in the admin (or by hand) reloads the site with the new content
import.meta.hot?.on('portfolio:content-changed', () => window.location.reload());

// One entry per content/projects/<slug>/ folder, already in display order (drafts only in dev)
export const projects = {
  items: storedProjects.map((p) => toViewModel(p, BASE)),
};
