# Portfolio Styling System

A comprehensive, modular CSS architecture for the Portfolio project with a gamer-themed design system.

## 📁 Structure

```
src/styling/
├── index.css              # Main entry point
├── README.md              # This file
├── themes/
│   └── variables.css      # CSS custom properties & themes
├── base/
│   └── reset.css          # Global reset & base styles
├── animations/
│   └── keyframes.css      # Keyframes & animation utilities
├── components/
│   ├── quest-form.css     # QuestForm component styles
│   ├── hq.css            # HQ component styles
│   └── social-links.css   # SocialLinks component styles
└── utils/
    └── utilities.css      # Utility classes
```

## 🎨 Design System

### Color Palette
- **Primary**: `#EEB64B` (Gold)
- **Secondary**: `#FC9460` (Orange)
- **Accent**: `#E54264` (Red-Pink)
- **Background**: `#181622` (Dark)
- **Card Background**: `#221B36` (Dark Purple)
- **Text**: `#F3F3F3` (Light)
- **Text Secondary**: `#B8B8B8` (Muted)

### Typography
- **Primary Font**: Rajdhani (Gamer-style)
- **Display Font**: Orbitron (Futuristic)
- **Font Sizes**: Hero (3.5rem) → XSmall (0.75rem)

### Spacing Scale
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)

### Transitions
- **Fast**: 0.2s ease
- **Normal**: 0.3s ease
- **Slow**: 0.5s cubic-bezier(.4,2,.6,1)

## 🚀 Usage

### Import the Styling System
```javascript
// In your main.jsx or App.jsx
import './styling/index.css';
```

### Using CSS Variables
```css
.my-component {
  color: var(--primary);
  background: var(--card-bg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  transition: var(--transition-normal);
}
```

### Using Utility Classes
```html
<div class="d-flex flex-column gap-lg p-xl bg-card border-radius">
  <h2 class="text-primary text-xl mb-md">Title</h2>
  <p class="text-muted">Content</p>
</div>
```

### Component-Specific Classes
```html
<!-- QuestForm -->
<form class="quest-form">
  <div class="xp-progress-container">
    <div class="xp-label">Quest Progress</div>
    <div class="xp-bar">
      <div class="xp-fill"></div>
    </div>
  </div>
</form>

<!-- HQ Component -->
<div class="hq-container">
  <div class="hq-header">
    <div class="hq-icon">🏰</div>
    <h3 class="hq-title">Headquarters</h3>
    <div class="hq-status online">
      <div class="hq-status-dot"></div>
      <span class="hq-status-text">Online</span>
    </div>
  </div>
</div>

<!-- Social Links -->
<div class="social-links-container">
  <h3 class="social-links-title">Contact Campfires</h3>
  <div class="social-links-list">
    <a href="#" class="social-link-item">
      <div class="social-link-icon">💼</div>
      <span class="social-link-name">LinkedIn</span>
    </a>
  </div>
</div>
```

## 🎭 Themes

### Dark Theme (Default)
The portfolio uses a dark theme by default with gamer aesthetics.

### Light Theme
Available via `.theme-light` class with adjusted colors for better contrast.

## 📱 Responsive Design

The styling system includes responsive utilities and breakpoints:

- **Mobile**: < 480px
- **Tablet**: < 768px
- **Desktop**: ≥ 768px

### Responsive Utilities
```html
<div class="d-flex md:flex-column">
  <div class="w-full md:w-auto">Content</div>
</div>
```

## 🎬 Animations

### Keyframe Animations
- `fadeInUp`: Slide up with fade
- `scaleIn`: Scale from 0.9 to 1
- `slideInRight`: Slide from right
- `shimmer`: Loading effect
- `pulse`: Breathing effect
- `bounce`: Bounce animation
- `spin`: Rotation
- `float`: Floating motion
- `glow`: Glowing effect

### Animation Classes
```html
<div class="fade-in-up">Animated content</div>
<div class="hover-lift">Hover effect</div>
<div class="pulse">Pulsing element</div>
```

## 🛠️ Customization

### Adding New Components
1. Create a new CSS file in `components/`
2. Add the import to `index.css`
3. Use BEM methodology for class naming
4. Include responsive design considerations

### Adding New Utilities
1. Add utility classes to `utils/utilities.css`
2. Follow the existing naming convention
3. Use CSS variables for consistency

### Theme Modifications
1. Update `themes/variables.css`
2. Test both light and dark themes
3. Ensure accessibility compliance

## ♿ Accessibility

- High contrast mode support
- Reduced motion preferences
- Focus indicators
- Semantic color usage
- Screen reader friendly

## 🔧 Development

### Best Practices
- Use CSS variables for consistency
- Follow BEM methodology for component classes
- Include responsive design
- Test across different browsers
- Maintain accessibility standards

### Performance
- CSS imports are optimized for tree-shaking
- Utility classes are designed for reuse
- Animations use GPU acceleration where possible

## 📚 Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [BEM Methodology](http://getbem.com/)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) 