# Animation System Documentation

This animation system provides a comprehensive set of reusable animations organized by categories for consistent and maintainable animations across your React components. The system has been refactored to centralize all animations and provide a consistent API across all components.

## 🎯 Animation Categories

### 1. **ENTRY_EXIT** - Component Appearance/Disappearance
Use for components that appear/disappear from the DOM.

**Available Strategies:**
- `scaleFade` - Scale and fade in/out
- `slideFade` - Slide from left with fade
- `slideUp` - Slide up from bottom with fade
- `bouncePop` - Bouncy spring animation
- `flipRotate` - 3D flip rotation
- `zoomIn` - Zoom in/out effect

### 2. **SHOW_HIDE** - Visibility Toggles
Use for components that toggle visibility without DOM changes.

**Available Strategies:**
- `fade` - Simple fade in/out
- `slideIn` - Slide in from left/right
- `slideUp` - Slide up/down
- `scale` - Scale in/out

### 3. **EXPAND_COLLAPSE** - Size Changes
Use for components that change size (like accordions, dropdowns).

**Available Strategies:**
- `smooth` - Smooth height transitions
- `bounce` - Bouncy spring transitions

### 4. **HOVER** - Interactive Elements
Use for hover effects on interactive elements.

**Available Strategies:**
- `lift` - Lift up with slight scale
- `scale` - Scale up/down
- `glow` - Scale with glow effect
- `rotate` - Slight rotation

### 5. **LOADING** - Loading States
Use for loading spinners and indicators.

**Available Strategies:**
- `spin` - Continuous rotation
- `pulse` - Scale pulsing
- `bounce` - Vertical bouncing
- `shimmer` - Shimmer effect

### 6. **PAGE_TRANSITION** - Page Changes
Use for page transitions and route changes.

**Available Strategies:**
- `fade` - Fade between pages
- `slide` - Slide between pages
- `scale` - Scale transition

### 7. **MODAL** - Modal/Dialog Windows
Use for modal and dialog animations.

**Available Strategies:**
- `fade` - Fade in/out
- `scale` - Scale in/out
- `slideUp` - Slide up from bottom

### 8. **LIST_ITEM** - List Animations
Use for list items with staggered animations.

**Available Strategies:**
- `stagger` - Staggered fade up
- `slide` - Slide in from side
- `scale` - Scale in/out

### 9. **BUTTON** - Button Interactions
Use for button hover/press effects.

**Available Strategies:**
- `press` - Scale press effect
- `lift` - Lift with scale
- `glow` - Scale with glow

### 10. **CARD** - Card Interactions
Use for card hover effects.

**Available Strategies:**
- `hover` - Lift with shadow
- `flip` - 3D flip effect
- `bounce` - Bouncy hover

### 11. **FLIP_CARD** - Flip Card Animations
Use for 3D flip card effects.

**Available Strategies:**
- `entry` - Initial entry animation
- `flip` - Flip to back
- `unflip` - Flip to front

### 12. **STAGGERED** - Staggered List Animations
Use for lists with staggered entry effects.

**Available Strategies:**
- `fadeUp` - Fade up with stagger
- `slideIn` - Slide in with stagger
- `scaleIn` - Scale in with stagger

### 13. **PROGRESS** - Progress Bar Animations
Use for progress bars and loading indicators.

**Available Strategies:**
- `fill` - Fill animation
- `pulse` - Pulsing effect

### 14. **STATS** - Stats Widget Animations
Use for statistics and data visualization components.

**Available Strategies:**
- `header` - Header animation
- `leftCard` - Left card entry
- `rightCard` - Right card entry
- `item` - Individual item animation

## 🚀 How to Use

### Basic Usage

```jsx
import { AnimationCategories, getAnimation } from '../utils/animations';

const MyComponent = () => {
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'bouncePop');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');

  return (
    <motion.div
      {...entryAnimation}
      {...hoverAnimation}
    >
      Content
    </motion.div>
  );
};
```

### Using Presets

```jsx
import { AnimationPresets } from '../utils/animations';

const MyCard = () => {
  return (
    <motion.div
      {...AnimationPresets.card.entry}
      {...AnimationPresets.card.hover}
    >
      Card Content
    </motion.div>
  );
};
```

### Dynamic Animation Selection

```jsx
import { getAvailableStrategies } from '../utils/animations';

const MyComponent = ({ animationType = 'scaleFade' }) => {
  const availableAnimations = getAvailableStrategies(AnimationCategories.ENTRY_EXIT);
  const animation = getAnimation(AnimationCategories.ENTRY_EXIT, animationType);

  return (
    <motion.div {...animation}>
      Content
    </motion.div>
  );
};
```

## 📝 Component Examples

### ProjectCard Component
```jsx
const ProjectCard = ({ 
  project, 
  onClick, 
  size = 'medium',
  entryStrategy = "scaleFade",
  hoverStrategy = "hover"
}) => {
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, entryStrategy);
  const hoverAnimation = getAnimation(AnimationCategories.CARD, hoverStrategy);

  return (
    <motion.div
      {...entryAnimation}
      {...hoverAnimation}
      onClick={onClick}
    >
      {/* Card content */}
    </motion.div>
  );
};
```

### FlipCard Component
```jsx
const FlipCard = ({ card, index, entryStrategy = "entry" }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const entryAnimation = getAnimation(AnimationCategories.FLIP_CARD, entryStrategy);
  const flipAnimation = getAnimation(AnimationCategories.FLIP_CARD, isFlipped ? 'flip' : 'unflip');

  return (
    <motion.div
      {...entryAnimation}
      transition={{ ...entryAnimation.transition, delay: index * 0.1 }}
    >
      <motion.div {...flipAnimation}>
        {/* Card content */}
      </motion.div>
    </motion.div>
  );
};
```

### StatsWidget Component
```jsx
const StatsWidget = ({ projects }) => {
  const headerAnimation = getAnimation(AnimationCategories.STATS, 'header');
  const leftCardAnimation = getAnimation(AnimationCategories.STATS, 'leftCard');
  const rightCardAnimation = getAnimation(AnimationCategories.STATS, 'rightCard');
  const itemAnimation = getAnimation(AnimationCategories.STATS, 'item');

  return (
    <div>
      <motion.div {...headerAnimation}>
        {/* Header content */}
      </motion.div>
      <motion.div {...leftCardAnimation}>
        {/* Left card content */}
      </motion.div>
      <motion.div {...rightCardAnimation}>
        {/* Right card content */}
      </motion.div>
    </div>
  );
};
```

### Timeline Component
```jsx
const Timeline = () => {
  const containerAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideUp');
  const itemAnimation = getAnimation(AnimationCategories.STAGGERED, 'scaleIn');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'scale');

  return (
    <motion.div {...containerAnimation}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          {...itemAnimation}
          {...hoverAnimation}
          transition={{ ...itemAnimation.transition, delay: index * 0.2 }}
        >
          {/* Timeline item */}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### Base Components

#### Card Component
```jsx
const Card = ({ 
  children, 
  hover = true, 
  hoverStrategy = "hover",
  ...props 
}) => {
  const MotionComponent = hover ? motion.div : 'div';
  const motionProps = hover ? getAnimation(AnimationCategories.CARD, hoverStrategy) : {};

  return (
    <MotionComponent {...motionProps} {...props}>
      {children}
    </MotionComponent>
  );
};
```

#### Button Component
```jsx
const Button = ({ 
  children, 
  disabled = false,
  hoverStrategy = "press",
  ...props 
}) => {
  const motionProps = disabled ? {} : getAnimation(AnimationCategories.BUTTON, hoverStrategy);

  return (
    <motion.button {...motionProps} {...props}>
      {children}
    </motion.button>
  );
};
```

#### ProgressBar Component
```jsx
const ProgressBar = ({ 
  progress, 
  max = 100,
  animated = true,
  animationStrategy = "fill",
  ...props 
}) => {
  const ProgressComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    ...getAnimation(AnimationCategories.PROGRESS, animationStrategy),
    animate: { 
      ...getAnimation(AnimationCategories.PROGRESS, animationStrategy).animate,
      width: `${(progress / max) * 100}%` 
    }
  } : { style: { width: `${(progress / max) * 100}%` } };

  return (
    <ProgressComponent {...motionProps} {...props} />
  );
};
```

## 🎨 Customization

### Adding Custom Animations

```jsx
// In your component
const customAnimation = {
  initial: { opacity: 0, rotate: -180 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 180 },
  transition: { duration: 0.5, ease: "easeInOut" }
};

return (
  <motion.div {...customAnimation}>
    Custom animated content
  </motion.div>
);
```

### Combining Multiple Animations

```jsx
const MyComponent = () => {
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'bouncePop');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'glow');

  return (
    <motion.div
      {...entryAnimation}
      {...hoverAnimation}
      // You can override specific properties
      transition={{ 
        ...entryAnimation.transition,
        duration: 0.8 // Override duration
      }}
    >
      Content
    </motion.div>
  );
};
```

### Staggered Animations

```jsx
const StaggeredList = ({ items }) => {
  const itemAnimation = getAnimation(AnimationCategories.STAGGERED, 'fadeUp');

  return (
    <div>
      {items.map((item, index) => (
        <motion.div
          key={index}
          {...itemAnimation}
          transition={{ 
            ...itemAnimation.transition,
            delay: index * 0.1 
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
};
```

## 🔧 Utility Functions

- `getAnimation(category, strategy)` - Get animation object
- `getAvailableStrategies(category)` - Get all strategies for a category
- `getAllCategories()` - Get all available categories
- `AnimationPresets` - Pre-configured animation combinations

## 🎯 Best Practices

1. **Choose the right category** for your use case
2. **Use presets** for common patterns
3. **Keep animations consistent** across similar components
4. **Test performance** with complex animations
5. **Consider accessibility** - respect `prefers-reduced-motion`
6. **Use staggered animations** for lists and grids
7. **Combine animations** for richer interactions
8. **Override transitions** when needed for specific timing

## 🎮 Gamer-Style Recommendations

For a gamer aesthetic, consider these combinations:
- **Entry**: `bouncePop` or `flipRotate`
- **Hover**: `glow` or `lift`
- **Cards**: `bounce` hover effect
- **Buttons**: `press` with `glow`
- **Loading**: `spin` or `pulse`
- **Progress**: `fill` with `pulse`
- **Timeline**: `scaleIn` with `scale` hover
- **Stats**: `leftCard`/`rightCard` with `item` stagger

This creates a dynamic, energetic feel that matches gaming interfaces!

## 🔄 Migration Guide

### From Hardcoded Animations

**Before:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.05 }}
>
```

**After:**
```jsx
const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideUp');
const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'scale');

<motion.div
  {...entryAnimation}
  {...hoverAnimation}
>
```

### Benefits of Migration

1. **Consistency** - All animations follow the same patterns
2. **Maintainability** - Changes in one place affect all components
3. **Reusability** - Animations can be easily shared between components
4. **Performance** - Optimized animation configurations
5. **Flexibility** - Easy to swap animation strategies
6. **Documentation** - Clear API for all available animations 