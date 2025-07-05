# Animation System Documentation

This animation system provides a comprehensive set of reusable animations organized by categories for consistent and maintainable animations across your React components.

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

## 📝 Examples

### Search/Filter Component
```jsx
const SearchComponent = () => {
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideFade');
  const expandAnimation = getAnimation(AnimationCategories.EXPAND_COLLAPSE, 'smooth');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');

  return (
    <motion.div {...entryAnimation}>
      <motion.div {...expandAnimation} {...hoverAnimation}>
        Search content
      </motion.div>
    </motion.div>
  );
};
```

### Animated Card
```jsx
const AnimatedCard = ({ entryStrategy = 'scaleFade' }) => {
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, entryStrategy);
  const hoverAnimation = getAnimation(AnimationCategories.CARD, 'hover');

  return (
    <motion.div {...entryAnimation} {...hoverAnimation}>
      Card content
    </motion.div>
  );
};
```

### Loading Spinner
```jsx
const LoadingSpinner = () => {
  const spinAnimation = getAnimation(AnimationCategories.LOADING, 'spin');

  return (
    <motion.div {...spinAnimation}>
      ⏳
    </motion.div>
  );
};
```

### Modal
```jsx
const Modal = ({ isOpen }) => {
  const modalAnimation = getAnimation(AnimationCategories.MODAL, 'scale');
  const overlayAnimation = getAnimation(AnimationCategories.MODAL, 'fade');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div {...overlayAnimation} className="overlay" />
          <motion.div {...modalAnimation} className="modal">
            Modal content
          </motion.div>
        </>
      )}
    </AnimatePresence>
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

## 🎮 Gamer-Style Recommendations

For a gamer aesthetic, consider these combinations:
- **Entry**: `bouncePop` or `flipRotate`
- **Hover**: `glow` or `lift`
- **Cards**: `bounce` hover effect
- **Buttons**: `press` with `glow`
- **Loading**: `spin` or `pulse`

This creates a dynamic, energetic feel that matches gaming interfaces! 