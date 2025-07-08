# Portfolio Components

This directory contains all the React components for the portfolio application, organized with a focus on reusability, maintainability, and the user's preferred gamer aesthetic. All components have been refactored to use the centralized animation system located in `../utils/animations.js`.

## 🏗️ Architecture Overview

### Base Components (`base/`)
Reusable foundational components that provide consistent styling and behavior:
- `Card` - Flexible container with hover effects and gamer styling
- `Section` - Page section wrapper with title and icon support
- `Button` - Interactive button with multiple variants
- `Badge` - Small label component for tags and status
- `Icon` - Emoji-based icon component
- `ProgressBar` - Animated progress indicator

### Layout Components
Components that handle page structure and layout:
- `Navbar` - Navigation bar with gamer-themed styling
- `FeaturedProject` - Hero section for featured projects
- `ProjectCard` - Individual project display card
- `ProjectModal` - Detailed project view modal

### Interactive Components
Components with user interaction and animations:
- `SearchAndFilter` - Project filtering and search functionality
- `FlipCards` - Interactive card flipping animations
- `InteractiveGrid` - Clickable grid with expandable content
- `AnimatedSkillBars` - Animated skill progress indicators

### Data-Driven Components
Components that display dynamic content:
- `CharacterProfile` - Personal profile information
- `SkillTree` - Visual skill tree representation
- `Achievements` - Achievement showcase
- `QuestLog` - Project timeline display
- `Timeline` - Journey timeline component
- `FunFacts` - Rotating fun facts display
- `ShowAndTell` - Image gallery with captions
- `StatsWidget` - Project statistics visualization

## 📊 Data Structure

### Consolidated Data Files

The data has been consolidated into a simplified structure:

#### `profile.json` - Complete Profile Data
```json
{
  "personal": {
    "name": "Vi Tiet",
    "tagline": "From stethoscopes to game engines",
    "profilePic": "/portfolio-profile-pic.png",
    "bio": "..."
  },
  "socialLinks": [...],
  "journey": [...],
  "flipCards": [...],
  "skills": {
    "categories": {
      "Programming Languages": [...],
      "Video & Audio Editing": [...],
      "Personal Skills": [...]
    }
  },
  "funFacts": [...],
  "showAndTell": [...],
  "homeSections": [...]
}
```

#### `projects.json` - Complete Projects Data
```json
{
  "config": {
    "pageTitle": "Projects",
    "searchPlaceholder": "...",
    "gridSettings": {...},
    "animations": {...},
    "layout": {...},
    "stats": {...}
  },
  "ui": {
    "featuredProject": {...},
    "searchAndFilter": {...},
    "projectCard": {...},
    "projectModal": {...},
    "statsWidget": {...},
    "noResults": {...}
  },
  "items": [...],
  "resume": [...]
}
```

#### `uiContent.json` - UI Content and Configuration
```json
{
  "pages": {
    "about": {
      "title": "About Me",
      "bio": "..."
    }
  },
  "sections": {
    "achievements": {...},
    "questLog": {...},
    "skillTree": {...},
    "timeline": {...},
    "funFacts": {...},
    "showAndTell": {...},
    "interactiveGrid": {...},
    "flipCards": {...},
    "skills": {...}
  },
  "animations": {...},
  "config": {...}
}
```

### Component-Specific Data Files
- `achievements.json` - Achievement data
- `characterProfile.json` - Character profile configuration
- `skillTree.json` - Skill tree structure
- `navigation.json` - Navigation menu items
- `questLog.json` - Quest log entries
- `gridItems.json` - Grid item definitions

## 🎨 Design System

### Color Palette
- `--primary`: #EEB64B (Golden yellow for gamer aesthetic)
- `--text`: #FFFFFF (White text)
- `--text-secondary`: #B8B8B8 (Secondary text)
- `--bg`: #1A1A1A (Dark background)
- `--card-bg`: #2A2A2A (Card background)
- `--border`: #404040 (Border color)

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

All components now use the centralized animation system instead of hardcoded animations. This provides:

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

- **Card.jsx** - Animated card container with hover effects
- **Button.jsx** - Interactive button with press animations
- **ProgressBar.jsx** - Animated progress indicator
- **Badge.jsx** - Small animated badges
- **Icon.jsx** - Icon component
- **Section.jsx** - Section container

### Main Components
Feature-specific components with specialized animations:

- **AnimatedCard.jsx** - Enhanced card with configurable animations
- **ProjectCard.jsx** - Project display cards with hover effects
- **FlipCard.jsx** - 3D flip card with entry and flip animations
- **StatsWidget.jsx** - Statistics display with staggered animations
- **Timeline.jsx** - Timeline with staggered item animations
- **SkillBar.jsx** - Skill progress bars with entry animations
- **ShowAndTell.jsx** - Image carousel with transition animations
- **FunFacts.jsx** - Text rotation with slide animations
- **SearchAndFilter.jsx** - Search interface with expand/collapse animations

### Layout Components (`/layout/`)
Layout-specific components:

- **Grid.jsx** - Responsive grid with optional animations

### Animation Components (`/animations/`)
Specialized animation components:

- **SkillAnimations.jsx** - Skill-specific animation utilities

## 🚀 Usage Examples

### Basic Component with Animations

```jsx
import { AnimatedCard } from './components/AnimatedCard';
import { getAnimation, AnimationCategories } from '../utils/animations';

const MyComponent = () => {
  return (
    <AnimatedCard 
      entryStrategy="bouncePop"
      hoverStrategy="glow"
    >
      <h3>Animated Content</h3>
      <p>This card uses centralized animations</p>
    </AnimatedCard>
  );
};
```

### Custom Animation Strategy

```jsx
import { ProjectCard } from './components/ProjectCard';

const CustomProjectCard = ({ project }) => {
  return (
    <ProjectCard
      project={project}
      entryStrategy="flipRotate"
      hoverStrategy="bounce"
      size="large"
    />
  );
};
```

### Staggered List Animation

```jsx
import { Timeline } from './components/Timeline';

const MyTimeline = () => {
  // Timeline automatically uses staggered animations
  return <Timeline />;
};
```

## 🎨 Animation Strategies

### Entry/Exit Strategies
- `scaleFade` - Scale and fade (default for cards)
- `slideFade` - Slide from left with fade
- `slideUp` - Slide up from bottom
- `bouncePop` - Bouncy spring animation
- `flipRotate` - 3D flip rotation
- `zoomIn` - Zoom in/out effect

### Hover Strategies
- `lift` - Lift up with slight scale
- `scale` - Scale up/down
- `glow` - Scale with glow effect
- `rotate` - Slight rotation

### Card Strategies
- `hover` - Lift with shadow (default)
- `flip` - 3D flip effect
- `bounce` - Bouncy hover

### Button Strategies
- `press` - Scale press effect (default)
- `lift` - Lift with scale
- `glow` - Scale with glow

## 🔧 Configuration

### Animation Presets
Common animation combinations are available as presets:

```jsx
import { AnimationPresets } from '../utils/animations';

// Use preset combinations
const cardPreset = AnimationPresets.card;
const buttonPreset = AnimationPresets.button;
const statsPreset = AnimationPresets.stats;
```

### Custom Animation Overrides

```jsx
const CustomComponent = () => {
  const baseAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideUp');
  
  return (
    <motion.div
      {...baseAnimation}
      transition={{
        ...baseAnimation.transition,
        duration: 0.8, // Override duration
        delay: 0.2     // Add custom delay
      }}
    >
      Content
    </motion.div>
  );
};
```

## 🎮 Gamer-Style Animations

For a more dynamic, gaming-inspired feel, use these combinations:

### Energetic Entry
```jsx
entryStrategy="bouncePop"  // Bouncy spring entry
```

### Interactive Hover
```jsx
hoverStrategy="glow"       // Glow effect on hover
```

### Dynamic Cards
```jsx
hoverStrategy="bounce"     // Bouncy card hover
```

### Responsive Buttons
```jsx
hoverStrategy="press"      // Quick press feedback
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
│   ├── Card.jsx            # Card component
│   ├── Section.jsx         # Section wrapper
│   ├── Button.jsx          # Button component
│   ├── Badge.jsx           # Badge component
│   ├── Icon.jsx            # Icon component
│   └── ProgressBar.jsx     # Progress bar component
├── animations/              # Animation utilities
│   └── SkillAnimations.jsx # Skill-specific animations
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