# 🎮 Portfolio Components

This directory contains all the React components for the portfolio application, organized with a focus on reusability, maintainability, and the user's preferred gamer aesthetic. All components use the centralized animation system located in `../utils/animations.js`.

## 🏗️ Architecture Overview

### Base Components (`base/`)
Reusable foundational components that provide consistent styling and behavior:
- `AnimatedContainer` - Wrapper for consistent animations across components
- `Badge` - Small label component for tags and status
- `Button` - Interactive button with multiple variants and animations
- `Card` - Flexible container with hover effects and gamer styling
- `Icon` - Emoji-based icon component with SVG support
- `ImageContainer` - Image display with consistent styling and animations
- `IndicatorDots` - Navigation dots for carousels and galleries
- `ProgressBar` - Animated progress indicator with multiple themes
- `ProjectCardBase` - Base component for all project-related cards
- `Section` - Page section wrapper with title and icon support
- `TechStack` - Technology stack display component
- `YearBadge` - Year indicator badge for projects

### Main Components
Components that handle specific features and page sections:
- `Navbar` - Navigation bar with gamer-themed styling and theme toggle
- `FeaturedProject` - Hero section for featured projects
- `ProjectCard` - Individual project display card
- `ProjectModal` - Detailed project view modal with image gallery
- `SearchAndFilter` - Project filtering and search functionality
- `FlipCards` - Interactive card flipping animations
- `Timeline` - Journey timeline component with animations
- `FunFacts` - Rotating fun facts display
- `ShowAndTell` - Image gallery with captions and navigation
- `QuestForm` - Contact form with RPG-themed styling
- `ConfirmationModal` - Modal for form submission confirmation
- `SocialLinks` - Social media links display
- `HQ` - Contact page header component

## 📊 Data Structure

### Consolidated Data Files

The data has been consolidated into a simplified structure:

#### `profile.json` - Complete Profile Data
```json
{
  "personal": {
    "name": "Your Name",
    "tagline": "Your tagline",
    "profilePic": "/profile-pic.png",
    "bio": "Your bio",
    "email": "your@email.com"
  },
  "socialLinks": [...],
  "journey": [...],
  "flipCards": [...],
  "skills": {
    "categories": {
      "Category Name": {
        "highlights": [...],
        "skills": [...]
      }
    }
  },
  "funFacts": [...],
  "hq": {...}
}
```

#### Projects
Projects are no longer a single JSON file: each one is a folder under `content/projects/<slug>/` (`project.json`, optional `overview.md`, `media/`). Components receive them via `projects.items` from `@/data`, already shaped by `toViewModel` (`image` = card cover URL, `demo` = Live Demo target, `media` = resolved list). See [docs/content.md](../../docs/content.md).

#### `uiContent.json` - UI Configuration
```json
{
  "pages": {...},
  "sections": {...},
  "animations": {...},
  "config": {...},
  "ui": {...}
}
```

## 🎨 Design System

### Color Palette
- **Primary**: #EEB64B (Gold)
- **Secondary**: #FC9460 (Orange)
- **Accent**: #E54264 (Red-Pink)
- **Background**: #181622 (Dark)
- **Card Background**: #221B36 (Dark Purple)
- **Text**: #F3F3F3 (Light)
- **Text Secondary**: #B8B8B8 (Muted)
- **Border**: #404040 (Border color)

### Typography
- Primary font: System fonts with gamer aesthetic
- Headings: Bold, larger sizes for hierarchy
- Body text: Readable with good contrast

### Animations
- Smooth transitions (0.3s ease)
- Hover effects with transform and shadow changes
- Staggered animations for lists and grids
- Framer Motion for complex animations

## 🚀 Usage Examples

### Basic Component Usage
```jsx
import { Card, Section, Button } from './base';
import { profile } from '../data';

const MyComponent = () => (
  <Section title="My Section" icon="🎮" centered={true}>
    <Card hover={true}>
      <h3>{profile.personal.name}</h3>
      <Button variant="primary">Click Me</Button>
    </Card>
  </Section>
);
```

### Data-Driven Component
```jsx
import { projects } from '../data';

const ProjectList = () => (
  <div>
    {projects.items.map(project => (
      <ProjectCard key={project.title} project={project} />
    ))}
  </div>
);
```

### Interactive Component
```jsx
const [searchTerm, setSearchTerm] = useState('');

<SearchAndFilter
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  sortBy={sortBy}
  setSortBy={setSortBy}
  projects={projects.items}
/>
```

## 🎬 Animation Integration

All components use the centralized animation system instead of hardcoded animations. This provides:

- **Consistency** across all components
- **Maintainability** - changes in one place affect all components
- **Reusability** - animations can be easily shared
- **Performance** - optimized animation configurations
- **Flexibility** - easy to swap animation strategies

### Animation Categories Used

- **ENTRY_EXIT** - Component appearance/disappearance
- **HOVER** - Interactive element hover effects
- **CARD** - Card-specific animations
- **BUTTON** - Button interactions
- **PROGRESS** - Progress bar animations
- **STATS** - Statistics widget animations
- **FLIP_CARD** - 3D flip card effects
- **STAGGERED** - List item staggered animations
- **SHOW_HIDE** - Visibility toggles

## 📁 Component Structure

### Base Components (`/base/`)
Core reusable components with built-in animation support:

- **AnimatedContainer.jsx** - Animation wrapper with strategy support
- **Button.jsx** - Interactive button with press animations
- **Card.jsx** - Animated card container with hover effects
- **ProgressBar.jsx** - Animated progress indicator
- **Badge.jsx** - Small animated badges
- **Icon.jsx** - Icon component with emoji and SVG support
- **Section.jsx** - Section container with title and icon
- **ImageContainer.jsx** - Image display with animations
- **IndicatorDots.jsx** - Navigation dots for galleries
- **ProjectCardBase.jsx** - Base component for project cards
- **TechStack.jsx** - Technology stack display
- **YearBadge.jsx** - Year indicator badge

### Main Components
Feature-specific components with specialized animations:

- **ProjectCard.jsx** - Project display cards with hover effects
- **FeaturedProject.jsx** - Hero section for featured projects
- **FlipCards.jsx** - Interactive card flipping container
- **Timeline.jsx** - Timeline with staggered item animations
- **ShowAndTell.jsx** - Image carousel with transition animations
- **FunFacts.jsx** - Text rotation with slide animations
- **SearchAndFilter.jsx** - Search interface with expand/collapse animations
- **ProjectModal.jsx** - Detailed project modal with image gallery
- **QuestForm.jsx** - RPG-themed contact form
- **ConfirmationModal.jsx** - Form submission confirmation
- **SocialLinks.jsx** - Social media links display
- **HQ.jsx** - Contact page header component
- **Navbar.jsx** - Navigation with theme toggle

## 🚀 Usage Examples

### Basic Component with Animations

```jsx
import { ProjectCard } from './components/ProjectCard';
import { getAnimation, AnimationCategories } from '../utils/animations';

const MyComponent = () => {
  return (
    <ProjectCard 
      project={project}
      entryStrategy="bouncePop"
      hoverStrategy="glow"
    />
  );
};
```

### Custom Animation Strategy

```jsx
import { AnimatedContainer } from './base';

<AnimatedContainer
  entryStrategy="slideUp"
  hoverStrategy="scale"
  className="my-component"
>
  <div>Content with animations</div>
</AnimatedContainer>
```

### Animation Strategy Examples

### Smooth Entry
```jsx
entryStrategy="slideUp"     // Slide up from bottom
```

### Energetic Entry
```jsx
entryStrategy="bouncePop"   // Bouncy spring entry
```

### Interactive Hover
```jsx
hoverStrategy="glow"        // Glow effect on hover
```

### Dynamic Cards
```jsx
hoverStrategy="bounce"      // Bouncy card hover
```

### Responsive Buttons
```jsx
hoverStrategy="press"       // Quick press feedback
```

## 📊 Performance Considerations

### Animation Optimization
- Use `transform` properties for better performance
- Avoid animating `width`/`height` when possible
- Use `will-change` CSS property for complex animations
- Consider `prefers-reduced-motion` for accessibility

### Staggered Animations
- Limit stagger delays to reasonable values (0.1-0.2s)
- Use `AnimatePresence` for list changes
- Consider virtual scrolling for large lists

## 🔄 Migration Notes

### From Hardcoded Animations
All components have been migrated from hardcoded animations to the centralized system:

**Before:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
>
```

**After:**
```jsx
const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideUp');
const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'scale');

<motion.div {...entryAnimation} {...hoverAnimation}>
```

### Benefits Achieved
1. **Consistency** - All animations follow the same patterns
2. **Maintainability** - Single source of truth for animations
3. **Reusability** - Animations can be shared between components
4. **Performance** - Optimized configurations
5. **Flexibility** - Easy to swap strategies
6. **Documentation** - Clear API for all animations

## 📚 Additional Resources

- [Animation System Documentation](../utils/animations-README.md)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Best Practices](../utils/animations-README.md#best-practices)

## 📁 File Organization

```
src/components/
├── base/                    # Base components
│   ├── index.js            # Base component exports
│   ├── AnimatedContainer.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── ProgressBar.jsx
│   ├── Badge.jsx
│   ├── Icon.jsx
│   ├── Section.jsx
│   ├── ImageContainer.jsx
│   ├── IndicatorDots.jsx
│   ├── ProjectCardBase.jsx
│   ├── TechStack.jsx
│   └── YearBadge.jsx
├── README.md               # This documentation
└── [Component].jsx         # Individual components
```

## 🎯 Key Features

### Gamer Aesthetic
- Dark theme with golden accents
- Interactive hover effects
- Animated elements and transitions
- Gaming-inspired terminology and icons

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

### Performance
- Lazy loading for images
- Optimized animations
- Efficient re-renders
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## 🔄 Migration Notes

### Data Consolidation Changes
- **Removed Files**: `profileResume.json`, `skillData.json`, `projectsResume.json`, `projectsContent.json`, `projectsConfig.json`, `aboutContent.json`, `homeSections.json`
- **Consolidated Into**: `profile.json`, `projects.json`, `uiContent.json`
- **Updated Imports**: All components now use centralized data imports
- **Structure Changes**: Skills now organized by categories, projects include config and UI content

### Benefits of Consolidation
- **Reduced Fragmentation**: Related data now in single files
- **Easier Maintenance**: Fewer files to manage and update
- **Better Organization**: Logical grouping of related data
- **Improved Performance**: Fewer import statements and file reads
- **Enhanced Developer Experience**: Clearer data structure and relationships

### Migration Checklist
- [x] Consolidated profile-related data into `profile.json`
- [x] Consolidated projects-related data into `projects.json`
- [x] Consolidated UI content into `uiContent.json`
- [x] Updated all component imports
- [x] Removed redundant data files
- [x] Updated data index exports
- [x] Verified all functionality works correctly
- [x] Updated documentation

## 🤝 Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns and structure
2. Use base components for consistency
3. Import data from the centralized data files
4. Add proper TypeScript types if applicable
5. Include hover effects and animations
6. Test on different screen sizes
7. Update this documentation

## 📝 Notes

- All components are designed to work with the consolidated data structure
- The gamer aesthetic is maintained throughout all components
- Components are optimized for performance and accessibility
- Data separation ensures easy content updates without code changes
- All components use the centralized animation system for consistency 