/**
 * Theme engine — maps content/theme.json onto CSS custom properties.
 *
 * Every color in the stylesheets reads from these variables (directly or via
 * color-mix), so switching the active preset or editing a token restyles the
 * whole site. Token → variable mapping lives in THEME_TOKENS; the admin GUI's
 * theme editor renders its color pickers from the same list.
 */
export const THEME_TOKENS = [
  { key: 'primary',    cssVar: '--color-primary',         label: 'Primary',        hint: 'Headings, highlights, main buttons' },
  { key: 'secondary',  cssVar: '--color-secondary',       label: 'Secondary',      hint: 'Gradients, secondary accents' },
  { key: 'accent',     cssVar: '--color-accent',          label: 'Accent',         hint: 'Call-outs, hover states' },
  { key: 'highlight',  cssVar: '--color-highlight',       label: 'Highlight',      hint: 'Borders and glows on special elements' },
  { key: 'success',    cssVar: '--color-success',         label: 'Success',        hint: 'Online status, progress' },
  { key: 'background', cssVar: '--color-background',      label: 'Background',     hint: 'Page background' },
  { key: 'surface',    cssVar: '--color-card-background', label: 'Surface',        hint: 'Cards and panels' },
  { key: 'surfaceAlt', cssVar: '--color-background-alt',  label: 'Surface (alt)',  hint: 'Alternate panels, gradients' },
  { key: 'text',       cssVar: '--color-text-primary',    label: 'Text',           hint: 'Body text' },
  { key: 'textMuted',  cssVar: '--color-text-secondary',  label: 'Muted text',     hint: 'Captions, secondary text' },
  { key: 'border',     cssVar: '--color-border',          label: 'Border',         hint: 'Dividers and outlines' },
];

/** Google Fonts offered in the theme editor (any Google Fonts family name also works). */
export const FONT_CHOICES = {
  heading: ['Orbitron', 'Audiowide', 'Press Start 2P', 'Cinzel', 'Space Grotesk', 'Montserrat', 'Bebas Neue', 'Russo One', 'Oxanium', 'Poppins'],
  body: ['Rajdhani', 'Exo 2', 'Inter', 'Nunito', 'Roboto', 'Open Sans', 'Lato', 'Source Sans 3', 'Chakra Petch', 'Work Sans'],
};

export const activePreset = (theme) => theme.presets[theme.active] || Object.values(theme.presets)[0];

const fontStack = (family, fallback) => `'${family}', ${fallback}`;

const loadGoogleFonts = (families) => {
  const id = 'theme-fonts';
  const href = `https://fonts.googleapis.com/css2?${families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`)
    .join('&')}&display=swap`;
  let link = document.getElementById(id);
  if (link?.href === href) return;
  if (!link) {
    link = Object.assign(document.createElement('link'), { id, rel: 'stylesheet' });
    document.head.appendChild(link);
  }
  link.href = href;
};

export function applyTheme(theme, root = document.documentElement) {
  const preset = activePreset(theme);
  if (!preset) return;
  for (const { key, cssVar } of THEME_TOKENS) {
    if (preset.colors?.[key]) root.style.setProperty(cssVar, preset.colors[key]);
  }
  const heading = preset.fonts?.heading || 'Orbitron';
  const body = preset.fonts?.body || 'Rajdhani';
  root.style.setProperty('--font-heading', fontStack(heading, 'system-ui, sans-serif'));
  root.style.setProperty('--font-body', fontStack(body, 'system-ui, -apple-system, "Segoe UI", sans-serif'));
  root.style.setProperty('--border-radius', `${preset.radius ?? 16}px`);
  // Lets the browser pick matching scrollbars / form controls for light presets
  root.style.colorScheme = isLight(preset.colors?.background) ? 'light' : 'dark';
  loadGoogleFonts([...new Set([heading, body])]);
}

/** Relative luminance check, good enough to classify a background as light or dark. */
export const isLight = (hex = '#000') => {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
};
