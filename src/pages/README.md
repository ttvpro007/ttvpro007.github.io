# 📄 Pages Directory

This directory contains the main page components for the portfolio application, organized following the same pattern as the components directory. Each page is a top-level component that represents a distinct section of the portfolio and is responsible for composing other components to create the complete page experience.

## 📁 File Structure

```
src/pages/
├── base/                  # Basic page components and layouts
│   ├── PageContainer/     # Reusable page container with common layout
│   ├── PageHeader/        # Common page header component
│   └── PageFooter/        # Common page footer component
├── features/              # Feature-specific pages organized by domain
│   ├── home/              # Home page and related components
│   │   ├── Home.jsx       # Main home page component
│   │   ├── Home.css       # Home page styles
│   │   └── index.js       # Export file
│   ├── projects/          # Projects page and related components
│   │   ├── Projects.jsx   # Main projects page component
│   │   ├── Projects.css   # Projects page styles
│   │   └── index.js       # Export file
│   ├── resume/            # Resume page and related components
│   │   ├── Resume.jsx     # Main resume page component
│   │   ├── Resume.css     # Resume page styles
│   │   └── index.js       # Export file
│   └── contact/           # Contact page and related components
│       ├── Contact.jsx    # Main contact page component
│       ├── Contact.css    # Contact page styles
│       └── index.js       # Export file
├── layout/                # Layout-specific pages
│   └── ErrorPage/         # Error page components
├── README.md              # This documentation
└── index.js               # Main export file for all pages
```

## 🎯 Page Architecture

### Component Structure
Each page follows a consistent structure:
- **Main Container**: `<main>` element with page-specific styling
- **Body Panel**: `<div className="body-panel">` for consistent layout
- **Page Content**: Page-specific sections and components
- **Animations**: Framer Motion animations for smooth transitions

### Data Integration
All pages use the centralized data system:
```javascript
import { profile, projects, navigation, uiContent, contact } from '../data';
```

### Styling Integration
Each page imports its specific CSS file:
```javascript
import './[page-name].css';
```

## 📋 Page Components Overview

### 1. Home Page (`features/home/Home.jsx`)
The landing page that introduces the portfolio owner and showcases key information.

#### Features
- **Hero Section**: Profile picture, name, tagline, and social links
- **Interactive Profile**: Clickable profile picture with confetti animation
- **Timeline**: Career journey with animated milestones
- **Flip Cards**: Interactive cards with front/back content
- **Fun Facts**: Rotating fun facts display
- **Show & Tell**: Image gallery with captions

#### Components Used
- `Timeline` - Career journey display
- `FlipCards` - Interactive card flipping
- `FunFacts` - Rotating facts display
- `ShowAndTell` - Image gallery

#### Data Sources
- `profile.json` - Personal info, journey, flip cards, fun facts, show & tell

#### Key Features
```jsx
// Interactive profile picture with confetti
<motion.img
  onClick={() => {
    setBounce(true);
    setConfetti(true);
    // ... animation logic
  }}
/>

// Social links with conditional rendering
{profile.socialLinks?.map(link => (
  <a key={link.type} href={link.url} target="_blank">
    {/* Icon rendering logic */}
  </a>
))}
```

### 2. Projects Page (`features/projects/Projects.jsx`)
A comprehensive project showcase with advanced filtering and search capabilities.

#### Features
- **Featured Project**: Hero section for highlighted projects
- **Search & Filter**: Advanced filtering by technology and category
- **Project Grid**: Responsive grid layout with different card sizes
- **Project Modal**: Detailed project view with image gallery
- **Statistics**: Technology usage and yearly breakdown
- **Floating Background**: Animated background elements

#### Components Used
- `FeaturedProject` - Hero project display
- `ProjectCard` - Individual project cards
- `SearchAndFilter` - Search and filtering interface
- `ProjectModal` - Detailed project modal
- `ProgressBar` - Statistics visualization

#### Data Sources
- `projects.json` - Project portfolio data
- `uiContent.json` - UI configuration and text

#### Key Features
```jsx
// Dynamic project filtering
useEffect(() => {
  let filtered = projects.items;
  
  // Search filtering
  if (searchTerm) {
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  // Category filtering
  if (selectedCategory !== "all") {
    filtered = filtered.filter(project => project.category === selectedCategory);
  }
  
  setFilteredProjects(filtered);
}, [searchTerm, selectedCategory, sortBy]);

// Technology usage statistics
const techUsage = {};
projects.items.forEach(project => {
  project.tech.forEach(tech => {
    techUsage[tech] = (techUsage[tech] || 0) + 1;
  });
});
```

### 3. Resume Page (`features/resume/Resume.jsx`)
A professional resume view optimized for printing and sharing.

#### Features
- **Profile Section**: Name, photo, and tagline
- **Skills Display**: All skills organized by category with progress bars
- **Projects Section**: Selected projects for resume display
- **Print-Friendly**: Optimized layout for PDF generation

#### Components Used
- `Card` - Container components
- `ProgressBar` - Skill level visualization

#### Data Sources
- `profile.json` - Personal info and skills
- `projects.json` - Resume projects (filtered by `showOnResume`)

#### Key Features
```jsx
// Filter projects for resume display
const resumeProjects = projects.items
  .filter(p => p.showOnResume)
  .sort((a, b) => (a.resumeOrder || 0) - (b.resumeOrder || 0));

// Skill progress bars with theme support
<ProgressBar
  progress={percent}
  max={100}
  height="7px"
  color={skill.color || getThemeColor(skill.theme)}
  bgColor="#222"
  glow={true}
  animatedGradient={hasAnimatedTheme(skill.theme)}
  animated={true}
/>
```

### 4. Contact Page (`features/contact/Contact.jsx`)
A contact form with social links and headquarters information.

#### Features
- **Contact Form**: RPG-themed form with progress tracking
- **Social Links**: Social media and contact links
- **HQ Component**: Headquarters information display
- **Confirmation Modal**: Success message after form submission

#### Components Used
- `QuestForm` - RPG-themed contact form
- `SocialLinks` - Social media links
- `HQ` - Headquarters information
- `ConfirmationModal` - Success confirmation

#### Data Sources
- `profile.json` - Social links and HQ info
- `contact.json` - Form configuration and text

#### Key Features
```jsx
// Form data management
const [formData, setFormData] = useState({});

const handleInputChange = (id, value) => {
  setFormData(prev => ({ ...prev, [id]: value }));
};

// Form submission with RPG formatting
const handleSubmit = (e) => {
  if (questFormRefs.current.hiddenMessage) {
    const formatted = formatQuestEmailContent(formData);
    questFormRefs.current.hiddenMessage.value = formatted;
  }
  setShowConfirmation(true);
};
```

## 🎨 Design Patterns

### Consistent Layout Structure
All pages follow the same basic structure:
```jsx
export default function PageName() {
  return (
    <main>
      <div className="body-panel">
        {/* Page-specific content */}
      </div>
    </main>
  );
}
```

### Animation Integration
Pages use Framer Motion for smooth transitions:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  {/* Page content */}
</motion.div>
```

### Data-Driven Content
All content is loaded from JSON files:
```jsx
// Data imports
import { profile, projects, navigation, uiContent, contact } from '../data';

// Usage in components
<h1>{profile.personal.name}</h1>
<p>{profile.personal.tagline}</p>
```

## 🔧 Technical Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Consistent breakpoints across all pages

### Performance Optimization
- Lazy loading for page components
- Optimized animations and transitions
- Efficient data loading and caching

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## 🚀 Usage

### Importing Pages
```javascript
// Import specific pages
import Home from './features/home/Home';
import Projects from './features/projects/Projects';
import Resume from './features/resume/Resume';
import Contact from './features/contact/Contact';

// Or import from main index
import { Home, Projects, Resume, Contact } from './pages';
```

### Page Routing
```javascript
// In your router configuration
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/resume" element={<Resume />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

## 📚 Best Practices

### Component Organization
- Keep page components focused on composition
- Delegate complex logic to feature components
- Use consistent naming conventions
- Maintain clear separation of concerns

### Styling
- Import page-specific styles directly in page components
- Use CSS variables for consistency
- Follow responsive design principles
- Maintain accessibility standards

### Performance
- Optimize bundle size with code splitting
- Use lazy loading for heavy components
- Minimize re-renders with proper state management
- Optimize animations for smooth performance

### Testing
- Test page components in isolation
- Verify responsive behavior across devices
- Test accessibility features
- Validate data integration 