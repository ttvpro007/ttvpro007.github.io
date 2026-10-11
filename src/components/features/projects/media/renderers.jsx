/* eslint-disable react-refresh/only-export-components -- this module is a registry, not a component file */
import React from "react";
import { youTubeId } from "@/lib/content/mediaTypes";

/**
 * Renderers for each media type in src/lib/content/mediaTypes.js.
 *   View  — full-size, inside the modal's hero viewer (gallery types) or its own tab (playable types)
 *   Thumb — small preview in the thumbnail strip
 * `item.url` is already resolved to something the browser can load.
 */

const IFRAME_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";

const PlayBadge = () => (
  <div className="thumbnail-video-indicator">
    <div className="play-button">▶</div>
  </div>
);

const IconThumb = ({ icon, label }) => (
  <div className="thumbnail-icon" aria-label={label}>
    <span>{icon}</span>
  </div>
);

const youTubeEmbed = (src) => `https://www.youtube.com/embed/${youTubeId(src)}`;

/** Unity WebGL page: ask the build to shut down cleanly before the iframe goes away. */
const UnityFrame = ({ item, title }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const frame = ref.current;
    return () => {
      try {
        const w = frame?.contentWindow;
        if (w?.cleanupUnity) w.cleanupUnity();
        else w?.unityInstance?.Quit();
      } catch {
        // cross-origin builds can't be reached; the iframe is removed anyway
      }
    };
  }, []);
  return (
    <div className="web-build-content">
      <div className="unity-webgl-container">
        <iframe
          ref={ref}
          src={item.url}
          title={`${title} - ${item.title || 'WebGL build'}`}
          className="unity-webgl-frame"
          allow={IFRAME_ALLOW}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation allow-pointer-lock"
        />
      </div>
      <button className="unity-fullscreen-button" onClick={() => window.open(item.url, "_blank")}>
        <span className="fullscreen-icon">⛶</span>
        Play Fullscreen
      </button>
      {item.caption && (
        <div className="web-build-info">
          <p className="web-build-description">{item.caption}</p>
        </div>
      )}
    </div>
  );
};

export const MEDIA_RENDERERS = {
  image: {
    View: ({ item, title }) => <img src={item.url} alt={item.caption || title} className="hero-media" />,
    Thumb: ({ item, index }) => <img src={item.url} alt={`Image ${index + 1}`} className="thumbnail-image" loading="lazy" />,
  },
  video: {
    View: ({ item, title }) => (
      <video src={item.url} title={item.caption || title} className="hero-media hero-media-video" controls playsInline preload="metadata" />
    ),
    Thumb: ({ item }) => (
      <>
        <video src={`${item.url}#t=0.5`} className="thumbnail-image" muted preload="metadata" />
        <PlayBadge />
      </>
    ),
  },
  youtube: {
    View: ({ item, title }) => <iframe src={youTubeEmbed(item.src)} title={item.caption || title} allow={IFRAME_ALLOW} allowFullScreen />,
    Thumb: ({ item, index }) => (
      <>
        <img src={`https://img.youtube.com/vi/${youTubeId(item.src)}/mqdefault.jpg`} alt={`Video ${index + 1}`} className="thumbnail-image" loading="lazy" />
        <PlayBadge />
      </>
    ),
  },
  embed: {
    View: ({ item, title }) => <iframe src={item.url} title={item.caption || title} allow={IFRAME_ALLOW} allowFullScreen />,
    Thumb: () => <IconThumb icon="🧩" label="Embedded content" />,
  },
  unity: {
    View: UnityFrame,
    Thumb: () => <IconThumb icon="🎮" label="WebGL build" />,
  },
};

export const MediaView = ({ item, title }) => {
  const R = MEDIA_RENDERERS[item?.type];
  return R ? <R.View item={item} title={title} /> : null;
};

export const MediaThumb = ({ item, index }) => {
  const R = MEDIA_RENDERERS[item?.type];
  return R ? <R.Thumb item={item} index={index} /> : null;
};
