# 🛠️ Utils Directory

This directory contains utility functions and systems that provide reusable functionality across the portfolio application. The utilities are organized by purpose and follow a modular approach for better maintainability and reusability.

## 📁 File Structure

```
src/utils/
├── animations.js           # Comprehensive animation system with Framer Motion
├── projectUtils.js         # Project-specific utility functions
├── animations-README.md    # Detailed animation system documentation
└── README.md              # This documentation
```

## 🎯 Utility Overview

### 1. Animation System (`animations.js`)
A comprehensive animation management system built on Framer Motion that provides consistent, reusable animations across all components.

#### Features
- **14 Animation Categories**: Entry/exit, hover, loading, modal, etc.
- **Multiple Strategies**: Each category offers various animation approaches
- **Animation Presets**: Pre-configured combinations for common use cases
- **Accessibility Support**: Respects user's motion preferences
- **Type Safety**: Clear category and strategy definitions

#### Animation Categories
```javascript
export const AnimationCategories = {
  ENTRY_EXIT: 'ENTRY_EXIT',           // Component appearance/disappearance
  SHOW_HIDE: 'SHOW_HIDE',             // Visibility toggles
  EXPAND_COLLAPSE: 'EXPAND_COLLAPSE', // Size changes
  HOVER: 'HOVER',                     // Interactive elements
  LOADING: 'LOADING',                 // Loading states
  PAGE_TRANSITION: 'PAGE_TRANSITION', // Page changes
  MODAL: 'MODAL',                     // Modal/dialog windows
  LIST_ITEM: 'LIST_ITEM',             // List animations
  BUTTON: 'BUTTON',                   // Button interactions
  CARD: 'CARD',                       // Card interactions
  FLIP_CARD: 'FLIP_CARD',             // 3D flip effects
  STAGGERED: 'STAGGERED',             // Staggered list animations
  PROGRESS: 'PROGRESS',               // Progress bar animations
  STATS: 'STATS'                      // Statistics widgets
};
```

#### Usage Examples
```javascript
import { AnimationCategories, getAnimation, AnimationPresets } from '../utils/animations';

// Basic usage
const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'bouncePop');
const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');

// Using presets
const cardPreset = AnimationPresets.card;

// Accessibility-aware animations
const accessibleAnimation = getAccessibleAnimation(AnimationCategories.ENTRY_EXIT, 'fade');
```

#### Available Functions
- `getAnimation(category, strategy)` - Get specific animation configuration
- `getAvailableStrategies(category)` - Get all strategies for a category
- `getAllCategories()` - Get all available categories
- `combineAnimations(...animations)` - Combine multiple animations
- `prefersReducedMotion()` - Check user's motion preferences
- `getAccessibleAnimation(category, strategy)` - Get accessibility-friendly animation

### 2. Project Utilities (`projectUtils.js`)
Utility functions specifically designed for handling project data and UI interactions.

#### Features
- **Button Generation**: Dynamic button creation based on project data
- **Image Handling**: Flexible image array management
- **Text Formatting**: Consistent text formatting across components
- **Data Validation**: Safe data access with fallbacks

#### Available Functions

##### `generateProjectButtons(project)`
Generates action buttons for a project based on its data.

```javascript
import { generateProjectButtons } from '../utils/projectUtils';

const buttons = generateProjectButtons(project);
// Returns array of button configs: [{ label, url, variant, icon }, ...]
```

**Supported Button Types:**
- GitHub Repository (`linkSource: "github"`)
- itch.io Game (`linkSource: "itchio"`)
- Live Demo (`demo` property)
- App Store (`appStore` property)

##### `getProjectImages(project)`
Gets project images array with fallback to single image.

```javascript
import { getProjectImages } from '../utils/projectUtils';

const images = getProjectImages(project);
// Returns array of image URLs, falls back to [project.image] if no images array
```

##### `formatImageCounter(current, total)`
Formats image counter text using configured format.

```javascript
import { formatImageCounter } from '../utils/projectUtils';

const counterText = formatImageCounter(2, 5);
// Returns formatted string like "2 of 5" based on uiContent configuration
```

##### `getProjectDescription(project)`
Gets project description, preferring long description if available.

```javascript
import { getProjectDescription } from '../utils/projectUtils';

const description = getProjectDescription(project);
// Returns longDescription || description
```

## 🚀 Usage Patterns

### Component Integration
```javascript
// In a component file
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from '../utils/animations';
import { 
  generateProjectButtons, 
  getProjectImages 
} from '../utils/projectUtils';

const MyComponent = ({ project }) => {
  // Animation setup
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'bouncePop');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');
  
  // Project data processing
  const images = getProjectImages(project);
  const buttons = generateProjectButtons(project);
  
  return (
    <motion.div {...entryAnimation} {...hoverAnimation}>
      {/* Component content */}
    </motion.div>
  );
};
```

### Animation Presets
```javascript
// Using pre-configured animation combinations
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
```javascript
// Dynamic animation based on props or state
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

## 🎨 Animation Strategies

### Entry/Exit Animations
- `scaleFade` - Scale and fade in/out
- `slideFade` - Slide from left with fade
- `slideUp` - Slide up from bottom with fade
- `bouncePop` - Bouncy spring animation
- `flipRotate` - 3D flip rotation
- `zoomIn` - Zoom in/out effect

### Hover Animations
- `lift` - Lift up with slight scale
- `scale` - Scale up/down
- `glow` - Scale with glow effect
- `rotate` - Slight rotation

### Loading Animations
- `spin` - Continuous rotation
- `pulse` - Scale pulsing
- `bounce` - Vertical bouncing
- `shimmer` - Shimmer effect

### Card Animations
- `hover` - Lift with shadow
- `flip` - 3D flip effect
- `bounce` - Bouncy hover

## 🔧 Technical Features

### Performance Optimization
- **Lazy Loading**: Animations only loaded when needed
- **Efficient Transitions**: Optimized easing functions
- **GPU Acceleration**: Hardware-accelerated animations where possible
- **Reduced Motion**: Respects user accessibility preferences

### Accessibility Support
- **Motion Preferences**: Automatically detects `prefers-reduced-motion`
- **Fallback Animations**: Simplified animations for accessibility
- **Keyboard Navigation**: Compatible with keyboard-only navigation
- **Screen Reader Friendly**: Non-intrusive animations

### Error Handling
- **Graceful Degradation**: Falls back to simple animations on errors
- **Console Warnings**: Helpful warnings for missing categories/strategies
- **Safe Data Access**: Null-safe project data handling
- **Validation**: Input validation for animation parameters

## 📋 Best Practices

### Animation Usage
1. **Choose Appropriate Categories**: Use the right category for your use case
2. **Consider Performance**: Avoid complex animations on mobile devices
3. **Respect Preferences**: Always check for reduced motion preferences
4. **Test Interactions**: Ensure animations don't interfere with functionality
5. **Consistent Timing**: Use similar durations for related animations

### Project Data Handling
1. **Safe Access**: Always use utility functions for data access
2. **Fallback Values**: Provide sensible defaults for missing data
3. **Validation**: Validate data before processing
4. **Consistent Formatting**: Use utility functions for text formatting
5. **Error Boundaries**: Handle errors gracefully

### Code Organization
1. **Import Only What You Need**: Import specific functions, not entire modules
2. **Use Presets**: Leverage AnimationPresets for common patterns
3. **Document Custom Animations**: Document any custom animation logic
4. **Test Edge Cases**: Test with various data scenarios
5. **Performance Monitoring**: Monitor animation performance

## 🔮 Future Enhancements

### Potential Improvements
- **Animation Performance Metrics**: Track animation performance
- **Custom Easing Functions**: Add more sophisticated easing options
- **Animation Sequencing**: Chain multiple animations together
- **Gesture Support**: Add gesture-based animations
- **Theme Integration**: Animate based on theme changes

### Technical Improvements
- **TypeScript Migration**: Add type safety to utility functions
- **Testing Framework**: Add unit tests for utility functions
- **Performance Profiling**: Add performance monitoring
- **Bundle Optimization**: Optimize utility imports for tree-shaking
- **Documentation Generation**: Auto-generate API documentation

## 🎯 Maintenance Guidelines

### Code Standards
- Use descriptive function and variable names
- Include JSDoc comments for all exported functions
- Follow consistent error handling patterns
- Maintain backward compatibility when possible
- Test with various data scenarios

### Performance Guidelines
- Optimize animation performance for mobile devices
- Use efficient data structures and algorithms
- Minimize bundle size impact
- Cache frequently used calculations
- Monitor memory usage

### Accessibility Guidelines
- Always respect user motion preferences
- Provide alternative interactions for animations
- Ensure keyboard navigation compatibility
- Test with screen readers
- Maintain WCAG compliance

---

**Need help?** Check the `animations-README.md` for detailed animation system documentation!

The utils directory provides essential functionality for animations and data processing. The modular approach ensures maintainability and reusability across the entire application! 🚀 