// Animation System - Centralized animation management
// Based on comprehensive documentation in animations-README.md

// Animation Categories
export const AnimationCategories = {
  ENTRY_EXIT: 'ENTRY_EXIT',
  SHOW_HIDE: 'SHOW_HIDE',
  EXPAND_COLLAPSE: 'EXPAND_COLLAPSE',
  HOVER: 'HOVER',
  LOADING: 'LOADING',
  PAGE_TRANSITION: 'PAGE_TRANSITION',
  MODAL: 'MODAL',
  LIST_ITEM: 'LIST_ITEM',
  BUTTON: 'BUTTON',
  CARD: 'CARD',
  FLIP_CARD: 'FLIP_CARD',
  STAGGERED: 'STAGGERED',
  PROGRESS: 'PROGRESS',
  STATS: 'STATS'
};

// Animation configurations
const animations = {
  [AnimationCategories.ENTRY_EXIT]: {
    scaleFade: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideFade: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    bouncePop: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.3 },
      transition: { 
        duration: 0.6, 
        ease: [0.68, -0.55, 0.265, 1.55],
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    flipRotate: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: 90 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.SHOW_HIDE]: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.EXPAND_COLLAPSE]: {
    smooth: {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    bounce: {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { 
        duration: 0.4, 
        ease: [0.68, -0.55, 0.265, 1.55],
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },
  [AnimationCategories.HOVER]: {
    none: {
      // No hover animation
    },
    lift: {
      whileHover: { y: -8, scale: 1.02 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      whileHover: { scale: 1.05 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    glow: {
      whileHover: { 
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
      },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    rotate: {
      whileHover: { rotate: 5 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.LOADING]: {
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: "linear" }
    },
    pulse: {
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
    },
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    },
    shimmer: {
      animate: { 
        backgroundPosition: ["200% 0", "-200% 0"],
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
      },
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
    }
  },
  [AnimationCategories.PAGE_TRANSITION]: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slide: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.MODAL]: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.LIST_ITEM]: {
    stagger: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.BUTTON]: {
    press: {
      whileTap: { scale: 0.95 },
      transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    lift: {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    glow: {
      whileHover: { 
        scale: 1.05,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)"
      },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.CARD]: {
    none: {
      // No hover animation
    },
    hover: {
      whileHover: { 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
      },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    flip: {
      whileHover: { rotateY: 180 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    bounce: {
      whileHover: { 
        y: -8, 
        scale: 1.05,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }
    }
  },
  [AnimationCategories.FLIP_CARD]: {
    entry: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    flip: {
      animate: { rotateY: 180 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    unflip: {
      animate: { rotateY: 0 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.STAGGERED]: {
    fadeUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideIn: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  [AnimationCategories.PROGRESS]: {
    fill: {
      initial: { width: 0 },
      animate: { width: "100%" },
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    pulse: {
      animate: { opacity: [0.7, 1, 0.7] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  },
  [AnimationCategories.STATS]: {
    header: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    leftCard: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    rightCard: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    item: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }
};

// Pre-configured animation combinations
export const AnimationPresets = {
  card: {
    entry: animations[AnimationCategories.ENTRY_EXIT].bouncePop,
    hover: animations[AnimationCategories.CARD].hover
  },
  button: {
    entry: animations[AnimationCategories.ENTRY_EXIT].scaleFade,
    hover: animations[AnimationCategories.BUTTON].glow
  },
  modal: {
    entry: animations[AnimationCategories.MODAL].scale,
    exit: animations[AnimationCategories.MODAL].fade
  },
  list: {
    entry: animations[AnimationCategories.STAGGERED].fadeUp,
    hover: animations[AnimationCategories.HOVER].lift
  },
  stats: {
    header: animations[AnimationCategories.STATS].header,
    leftCard: animations[AnimationCategories.STATS].leftCard,
    rightCard: animations[AnimationCategories.STATS].rightCard,
    item: animations[AnimationCategories.STATS].item
  }
};

// Main function to get animation by category and strategy
export const getAnimation = (category, strategy) => {
  if (!animations[category]) {
    console.warn(`Animation category "${category}" not found`);
    return {};
  }
  
  if (!animations[category][strategy]) {
    console.warn(`Animation strategy "${strategy}" not found in category "${category}"`);
    return {};
  }
  
  return animations[category][strategy];
};

// Get all available strategies for a category
export const getAvailableStrategies = (category) => {
  if (!animations[category]) {
    return [];
  }
  return Object.keys(animations[category]);
};

// Get all available categories
export const getAllCategories = () => {
  return Object.keys(animations);
};

// Utility function to combine multiple animations
export const combineAnimations = (...animationObjects) => {
  return animationObjects.reduce((combined, animation) => {
    return {
      ...combined,
      ...animation,
      transition: {
        ...combined.transition,
        ...animation.transition
      }
    };
  }, {});
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Get animation with reduced motion consideration
export const getAccessibleAnimation = (category, strategy) => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 }
    };
  }
  return getAnimation(category, strategy);
}; 