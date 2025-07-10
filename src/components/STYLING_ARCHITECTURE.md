# 🎨 Project Card Styling Architecture

## Overview
The project card system has been refactored to use a clean, modular styling architecture where each component variant has its own stylesheet, inheriting from a base component.

## 🏗️ Architecture Structure

### Base Component
- **`ProjectCardBase.jsx`** - Clean base component with minimal inline styles
- **`project-card-base.css`** - Base styles shared across all variants

### Variant-Specific Components
- **`ProjectCard.jsx`** - Default variant component
- **`project-card.css`** - Default variant styles
- **`FeaturedProject.jsx`** - Featured variant component  
- **`featured-project.css`** - Featured variant styles

## 📁 File Organization

```
src/
├── components/
│   ├── base/
│   │   └── ProjectCardBase.jsx          # Clean base component
│   ├── ProjectCard.jsx                   # Default variant wrapper
│   └── FeaturedProject.jsx              # Featured variant wrapper
└── styling/
    └── components/
        ├── project-card-base.css        # Base styles
        ├── project-card.css             # Default variant styles
        └── featured-project.css         # Featured variant styles
```

## 🎯 Component Responsibilities

### ProjectCardBase.jsx
- **Purpose**: Clean, reusable base component
- **Styling**: Uses CSS classes, minimal inline styles
- **Imports**: `project-card-base.css` only
- **Features**: 
  - CSS class-based styling
  - Variant and size class generation
  - Conditional rendering logic
  - Event handling

### ProjectCard.jsx
- **Purpose**: Default variant wrapper
- **Styling**: Imports `project-card.css`
- **Features**: 
  - Configures default variant
  - Passes through props to base component

### FeaturedProject.jsx
- **Purpose**: Featured variant wrapper
- **Styling**: Imports `featured-project.css`
- **Features**: 
  - Configures featured variant
  - Handles modal integration
  - Custom container styling

## 🎨 CSS Architecture

### project-card-base.css
Base styles shared across all variants:
```css
.project-card-base { /* Base container */ }
.project-card-content-overlay { /* Content wrapper */ }
.project-card-content { /* Main content area */ }
.project-card-title-section { /* Title container */ }
.project-card-title-dot { /* Title indicator */ }
.project-card-title { /* Project title */ }
.project-card-description { /* Description text */ }
.project-card-actions { /* Action buttons */ }
.project-card-year-badge { /* Year badge */ }
.project-card-bg-image { /* Background image */ }
.project-card-badge-container { /* Badge wrapper */ }
```

### project-card.css
Default variant specific styles:
```css
.project-card-default { /* Default container styling */ }
.project-card-default .project-card-title { /* Default title */ }
.project-card-default .project-card-description { /* Default description */ }
.project-card-default .project-card-title-dot { /* Default dot */ }
/* Size-specific variations */
.project-card-default.project-card-small { /* Small variant */ }
.project-card-default.project-card-large { /* Large variant */ }
```

### featured-project.css
Featured variant specific styles:
```css
.project-card-featured { /* Featured container styling */ }
.featured-project-bg { /* Background image */ }
.project-card-featured .project-card-content-overlay { /* Featured overlay */ }
.project-card-featured .project-card-title { /* Featured title */ }
.project-card-featured .project-card-description { /* Featured description */ }
.featured-project-button { /* Featured button styles */ }
.featured-project-demo { /* Demo button styles */ }
```

## 🔧 CSS Class Generation

The ProjectCardBase component generates CSS classes dynamically:

```jsx
const containerClasses = [
  'project-card-base',           // Base class
  `project-card-${variant}`,     // Variant class (default/featured/compact)
  `project-card-${size}`         // Size class (small/medium/large)
].join(' ');
```

This creates classes like:
- `project-card-base project-card-default project-card-medium`
- `project-card-base project-card-featured project-card-large`

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**
- Base component focuses on structure and logic
- Variant components handle specific styling
- Each stylesheet has a single responsibility

### 2. **Maintainability**
- Easy to modify specific variants without affecting others
- Clear file organization
- Reduced code duplication

### 3. **Extensibility**
- Easy to add new variants (e.g., `compact`, `minimal`)
- Simple to create new size variations
- Clean inheritance pattern

### 4. **Performance**
- CSS classes are more efficient than inline styles
- Better browser optimization
- Reduced JavaScript bundle size

### 5. **Consistency**
- Shared base styles ensure consistency
- Variant-specific styles maintain uniqueness
- Predictable class naming convention

## 🚀 Usage Examples

### Default Project Card
```jsx
<ProjectCard 
  project={project}
  size="medium"
  variant="default"
/>
```

### Featured Project Card
```jsx
<FeaturedProject project={featuredProject} />
```

### Direct Base Component Usage
```jsx
<ProjectCardBase
  project={project}
  variant="compact"
  size="small"
  showImage={false}
  showYear={true}
/>
```

## 🔮 Future Enhancements

### New Variants
```css
/* project-card-compact.css */
.project-card-compact {
  /* Compact styling */
}

/* project-card-minimal.css */
.project-card-minimal {
  /* Minimal styling */
}
```

### New Sizes
```css
/* project-card.css */
.project-card-default.project-card-extra-large {
  /* Extra large styling */
}
```

### Theme Variations
```css
/* project-card-dark.css */
.project-card-default[data-theme="dark"] {
  /* Dark theme styling */
}
```

This architecture provides a solid foundation for scalable, maintainable project card components while preserving the existing functionality and visual design. 