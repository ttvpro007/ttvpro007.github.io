# Portfolio Components

This directory contains all the React components for the portfolio application, organized with a focus on reusability, maintainability, and the user's preferred gamer aesthetic.

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

## 🔧 Development Guidelines

### Component Structure
1. **Imports**: Base components, data, and utilities
2. **State**: Local state management
3. **Effects**: Side effects and lifecycle
4. **Render**: JSX with proper styling
5. **Export**: Named export for consistency

### Styling Approach
- Use CSS custom properties for theming
- Inline styles for component-specific styling
- Responsive design with CSS Grid and Flexbox
- Hover effects and transitions for interactivity

### Data Access
- Import from centralized data index: `import { profile, projects } from '../data'`
- Use structured data paths: `profile.skills.categories["Programming Languages"]`
- Access UI content: `projects.ui.featuredProject.badge`

### Animation Guidelines
- Use Framer Motion for complex animations
- Keep animations subtle and purposeful
- Ensure accessibility with reduced motion support
- Use staggered animations for lists and grids

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