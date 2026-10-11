/**
 * Link type registry — the kinds of external links a project can list.
 * Order here is the order buttons appear in the project modal.
 * Adding a link type = one entry here; the admin and the modal pick it up.
 */
export const LINK_TYPES = {
  demo:     { label: 'Live Demo',       icon: '🚀', variant: 'outline' },
  github:   { label: 'View on GitHub',  icon: '📁', variant: 'primary' },
  itchio:   { label: 'Play on itch.io', icon: '🎮', variant: 'primary' },
  steam:    { label: 'Steam',           icon: '🕹️', variant: 'primary' },
  appstore: { label: 'App Store',       icon: '📱', variant: 'outline' },
  website:  { label: 'Website',         icon: '🌐', variant: 'outline' },
  docs:     { label: 'Documentation',   icon: '📚', variant: 'outline' },
};

/** Guess a link type from a pasted URL. */
export const detectLinkType = (url = '') => {
  if (/github\.com/i.test(url)) return 'github';
  if (/itch\.io/i.test(url)) return 'itchio';
  if (/steampowered\.com|store\.steam/i.test(url)) return 'steam';
  if (/apps\.apple\.com|play\.google\.com/i.test(url)) return 'appstore';
  return 'website';
};
