import { uiContent } from "../data";
import { LINK_TYPES } from "@/lib/content/linkTypes";
import { MEDIA_TYPES } from "@/lib/content/mediaTypes";

/**
 * Action buttons for a project, one per entry in its `links`, ordered as in LINK_TYPES.
 * A playable build (e.g. Unity) adds a Live Demo button when no demo link is listed.
 * @param {Object} project - A project view model (see toViewModel)
 * @returns {Array<{label, url, variant, icon}>}
 */
export const generateProjectButtons = (project) => {
  if (!project) return [];
  const order = Object.keys(LINK_TYPES);
  const links = [...(project.links || [])];
  if (project.demo && !links.some((l) => l.type === 'demo')) links.push({ type: 'demo', url: project.demo });
  return links
    .filter((l) => l.url)
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
    .map((l) => {
      const t = LINK_TYPES[l.type] || LINK_TYPES.website;
      return { label: l.label || t.label, url: l.url, variant: t.variant, icon: t.icon };
    });
};

/** Media shown in the modal carousel (images, videos, embeds), in project order. */
export const getGalleryMedia = (project) =>
  (project?.media || []).filter((m) => MEDIA_TYPES[m.type]?.placement === 'gallery');

/** Media that gets its own tab in the modal (playable builds). */
export const getPlayableMedia = (project) =>
  (project?.media || []).filter((m) => MEDIA_TYPES[m.type]?.placement === 'playable');

/**
 * Format image counter text using the configured format
 * @param {number} current - Current image index (1-based)
 * @param {number} total - Total number of images
 * @returns {string} Formatted counter text
 */
export const formatImageCounter = (current, total) => {
  return uiContent.ui.projectModal.imageGallery.counterFormat
    .replace('{current}', current)
    .replace('{total}', total);
};

/**
 * Get project description, preferring long description if available
 * @param {Object} project - The project object
 * @returns {string} The description to display
 */
export const getProjectDescription = (project) => {
  if (!project) return '';
  return project.longDescription || project.description || '';
};
