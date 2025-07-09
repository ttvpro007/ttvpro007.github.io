import { projects, uiContent } from "../data";

/**
 * Generate action buttons for a project based on its data
 * @param {Object} project - The project object
 * @returns {Array} Array of button configuration objects
 */
export const generateProjectButtons = (project) => {
  const buttons = [];
  const linkConfig = uiContent.ui.projectModal.content.links;

  // GitHub Repository
  if (project?.link && project?.linkSource === "github") {
    buttons.push({
      label: linkConfig.github.label,
      url: project.link,
      variant: linkConfig.github.variant,
      icon: linkConfig.github.icon
    });
  }

  // itch.io Game
  if (project?.link && project?.linkSource === "itchio") {
    buttons.push({
      label: linkConfig.itchio.label,
      url: project.link,
      variant: linkConfig.itchio.variant,
      icon: linkConfig.itchio.icon
    });
  }

  // Live Demo
  if (project?.demo) {
    buttons.push({
      label: linkConfig.liveDemo.label,
      url: project.demo,
      variant: linkConfig.liveDemo.variant,
      icon: linkConfig.liveDemo.icon
    });
  }

  // App Store
  if (project?.appStore) {
    buttons.push({
      label: linkConfig.appStore.label,
      url: project.appStore,
      variant: linkConfig.appStore.variant,
      icon: linkConfig.appStore.icon
    });
  }

  return buttons;
};

/**
 * Get project images array, falling back to single image if no images array
 * @param {Object} project - The project object
 * @returns {Array} Array of image URLs
 */
export const getProjectImages = (project) => {
  return project?.images || [project?.image];
};

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
  return project.longDescription || project.description;
}; 