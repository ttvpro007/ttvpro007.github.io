/**
 * Upload-time image optimization: large PNG/JPEG uploads are resized to at most
 * MAX_WIDTH and re-encoded as WebP. GIF, SVG and already-small images pass through.
 * Uses `sharp` when installed; without it, files are stored as uploaded.
 */
const MAX_WIDTH = 2400;
const SMALL_ENOUGH = 300 * 1024;
const OPTIMIZABLE = /\.(png|jpe?g)$/i;

let sharpPromise;
const loadSharp = () => (sharpPromise ??= import('sharp').then((m) => m.default).catch(() => null));

export async function optimizeImage(data, rel) {
  if (!OPTIMIZABLE.test(rel)) return { data, rel };
  const sharp = await loadSharp();
  if (!sharp) return { data, rel };
  const img = sharp(data);
  const { width = 0 } = await img.metadata();
  if (data.length <= SMALL_ENOUGH && width <= MAX_WIDTH) return { data, rel };
  const out = await img.resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  // Keep the original if WebP didn't actually help
  if (out.length >= data.length) return { data, rel };
  return { data: out, rel: rel.replace(OPTIMIZABLE, '.webp') };
}
