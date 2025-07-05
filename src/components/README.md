# Portfolio Components

A comprehensive collection of React components for a game developer portfolio, featuring a gamer aesthetic with interactive elements and animations.

## 🎮 Component Architecture

### Base Components (`/base`)
Foundation components that provide consistent styling and behavior across the application.

- **Card** - Versatile container with hover effects and customizable styling
- **Badge** - Small, colored tags for categorizing content
- **Button** - Interactive buttons with multiple variants and states
- **ProgressBar** - Animated progress indicators with customizable appearance
- **Icon** - Flexible icon component supporting emojis, images, and custom content
- **Section** - Page section wrapper with title, icon, and layout options

### Layout Components (`/layout`)
Components that handle page structure and arrangement.

- **Grid** - Responsive grid layout system with customizable columns and spacing

### Animation Components (`/animations`)
Specialized components for complex animations and interactions.

- **SkillAnimations** - Predefined animation configurations for skill-related components

## 📊 Data Management

All component data has been separated into dedicated JSON files in the `/src/data` directory for better maintainability and reusability.

### Core Data Files
- `profile.json` - Main profile information and content
- `projects.json` - Project portfolio data
- `skillData.json` - Skills and expertise information
- `gridItems.json` - Interactive grid content

### Component-Specific Data Files
- `achievements.json` - Achievement badges and stories
- `characterProfile.json` - Character profile configuration and animations
- `skillTree.json` - Skill tree unlock system configuration
- `navigation.json` - Navigation menu and theme configuration
- `questLog.json` - Quest log system configuration
- `uiContent.json` - UI text, icons, and configuration values

### Resume Data Files
- `profileResume.json` - Resume-specific profile data
- `projectsResume.json` - Resume project information
- `projectsContent.json` - Detailed project content
- `projectsConfig.json` - Project display configuration

### Content Data Files
- `aboutContent.json` - About page content
- `homeSections.json` - Home page section configuration

### Centralized Imports
Use the centralized data import system for cleaner component code:

```javascript
import { profile, projects, uiContent, achievements } from "../data";
```

## 🎯 Component Categories

### Profile & Character Components
- **CharacterProfile** - Main character display with level system and XP tracking
- **Achievements** - Interactive achievement badges with hover stories
- **StatsWidget** - Statistics display with animated counters

### Skill & Progress Components
- **SkillTree** - Interactive skill tree with unlock system
- **Skills** - Skill bars with animated progress
- **SkillBar** - Individual skill progress indicator
- **AnimatedSkillBars** - Animated skill visualization

### Project & Portfolio Components
- **ProjectCard** - Individual project display cards
- **FeaturedProject** - Highlighted project showcase
- **ProjectModal** - Detailed project information modal
- **QuestLog** - Project portfolio as quest log

### Interactive & UI Components
- **InteractiveGrid** - Interactive service/role showcase
- **FlipCards** - Flippable information cards
- **FlipCard** - Individual flip card component
- **ShowAndTell** - Image gallery with captions
- **FunFacts** - Rotating fun facts display

### Navigation & Layout Components
- **Navbar** - Main navigation with theme toggle
- **Timeline** - Journey timeline with animated icons
- **SearchAndFilter** - Content filtering and search functionality

## 🎨 Design System

### Color Scheme
- **Primary** - Main accent color for highlights and interactions
- **Text** - Primary text color
- **Text Secondary** - Secondary text for descriptions
- **Card Background** - Background for card components
- **Background** - Main page background

### Typography
- Consistent font sizing and weights
- Responsive text scaling
- Proper contrast ratios for accessibility

### Spacing
- Consistent padding and margins
- Responsive spacing that adapts to screen size
- Grid-based layout system

## 🚀 Usage Examples

### Basic Component Usage
```javascript
import { Card, Badge, Button } from './base';
import { achievements } from '../data';

function MyComponent() {
  return (
    <Card hover={true}>
      <h3>My Achievement</h3>
      <Badge size="small">Completed</Badge>
      <Button variant="primary">View Details</Button>
    </Card>
  );
}
```

### Using Data Files
```javascript
import { uiContent, achievements } from '../data';

function AchievementsSection() {
  return (
    <Section 
      title={uiContent.sections.achievements.title}
      icon={uiContent.sections.achievements.icon}
    >
      {achievements.achievements.map(achievement => (
        <AchievementBadge key={achievement.icon} achievement={achievement} />
      ))}
    </Section>
  );
}
```

## 🔧 Configuration

### Theme Configuration
Themes are managed through CSS custom properties and can be toggled via the navbar component.

### Animation Configuration
Animation settings are stored in data files and can be customized without modifying component code.

### Responsive Design
All components are built with responsive design principles and adapt to different screen sizes.

## 📱 Responsive Behavior

- **Mobile First** - Components designed for mobile devices first
- **Flexible Grids** - Grid layouts that adapt to screen size
- **Touch Friendly** - Interactive elements optimized for touch devices
- **Performance Optimized** - Efficient animations and rendering

## 🎯 Benefits of Data Separation

### Maintainability
- Content changes don't require code modifications
- Centralized data management
- Easier content updates and localization

### Reusability
- Components can be reused with different data
- Consistent data structure across components
- Easy to swap content for different use cases

### Scalability
- New data can be added without component changes
- Structured data format for easy expansion
- Clear separation of concerns

### Developer Experience
- Cleaner component code
- Easier to understand data flow
- Simplified testing and debugging

## 🔄 Migration Notes

### From Hardcoded Data
If migrating from hardcoded data in components:

1. **Extract Data**: Move hardcoded arrays and objects to appropriate JSON files
2. **Update Imports**: Replace direct imports with centralized data imports
3. **Test Components**: Ensure all data references are updated correctly
4. **Validate Structure**: Verify JSON structure matches component expectations

### Data File Structure
Each data file should follow a consistent structure:
```json
{
  "config": {
    "setting1": "value1",
    "setting2": "value2"
  },
  "content": [
    {
      "id": "unique-id",
      "title": "Content Title",
      "description": "Content description"
    }
  ]
}
```

## 🎮 Gamer Aesthetic Features

- **RPG Elements** - Level system, XP tracking, skill trees
- **Interactive Animations** - Hover effects, transitions, and micro-interactions
- **Gaming Icons** - Emoji-based icons and gaming-themed visual elements
- **Quest System** - Projects presented as quests with rewards
- **Character Progression** - Visual representation of skills and achievements

This component library provides a solid foundation for building interactive, engaging portfolio websites with a distinct gamer aesthetic while maintaining clean, maintainable code through proper data separation. 