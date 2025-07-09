# 📄 Pages Directory

This directory contains the main page components for the portfolio application. Each page is a top-level component that represents a distinct section of the portfolio and is responsible for composing other components to create the complete page experience.

## 📁 File Structure

```
src/pages/
├── Home.jsx        # Landing page with hero, timeline, and interactive sections
├── Projects.jsx    # Project showcase with search, filter, and modal views
├── Resume.jsx      # Professional resume with skills and projects
├── Contact.jsx     # Contact form with social links and HQ info
└── README.md       # This documentation
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
import '../styling/pages/[page-name].css';
```

## 📋 Page Components Overview

### 1. Home Page (`Home.jsx`)
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

### 2. Projects Page (`Projects.jsx`)
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

### 3. Resume Page (`Resume.jsx`)
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

### 4. Contact Page (`Contact.jsx`)
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
- Touch-friendly interactions
- Optimized typography scaling

### Performance Optimization
- Lazy loading for images
- Efficient data filtering
- Optimized animations
- Minimal re-renders

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## 📱 Page-Specific Features

### Home Page
- **Interactive Elements**: Clickable profile picture with confetti
- **Social Integration**: Dynamic social media links
- **Content Rotation**: Rotating fun facts and flip cards
- **Smooth Animations**: Staggered entrance animations

### Projects Page
- **Advanced Filtering**: Search by title, description, and technology
- **Dynamic Sorting**: Sort by recent or technology
- **Modal Views**: Detailed project information
- **Statistics**: Technology usage and project breakdown

### Resume Page
- **Print Optimization**: Clean layout for PDF generation
- **Skill Visualization**: Animated progress bars
- **Project Selection**: Filtered projects for resume
- **Professional Layout**: Clean, readable design

### Contact Page
- **Form Validation**: Real-time form validation
- **Progress Tracking**: Visual form completion progress
- **RPG Theme**: Gaming-inspired form design
- **Success Feedback**: Confirmation modal after submission

## 🚀 Customization Guide

### Adding New Pages
1. Create new page component in `src/pages/`
2. Add page styles in `src/styling/pages/`
3. Update navigation in `src/data/navigation.json`
4. Add route in `src/App.jsx`

### Modifying Page Content
1. Update data files in `src/data/`
2. Modify component composition as needed
3. Update page-specific styles
4. Test responsive behavior

### Adding New Features
1. Create new components in `src/components/`
2. Import and use in appropriate pages
3. Add necessary data to JSON files
4. Update documentation

## 🔍 Best Practices

### Component Composition
- Keep pages focused on layout and composition
- Delegate specific functionality to components
- Use data-driven content where possible
- Maintain consistent structure across pages

### Performance
- Optimize animations for smooth performance
- Use efficient data filtering and sorting
- Minimize unnecessary re-renders
- Implement proper loading states

### Accessibility
- Use semantic HTML elements
- Provide proper alt text for images
- Ensure keyboard navigation works
- Test with screen readers

### Code Organization
- Keep pages clean and focused
- Use consistent naming conventions
- Document complex logic
- Follow established patterns

## 🔮 Future Enhancements

### Potential Improvements
- **Page Transitions**: Smooth transitions between pages
- **Loading States**: Better loading indicators
- **Error Boundaries**: Graceful error handling
- **SEO Optimization**: Meta tags and structured data

### Technical Improvements
- **TypeScript**: Add type safety
- **Testing**: Unit and integration tests
- **Performance Monitoring**: Real-time performance tracking
- **Analytics**: Page view and interaction tracking

---

**Need help?** Check the main project README.md or component documentation for detailed instructions!

The pages directory provides the main user interface for the portfolio. Each page is designed to be responsive, accessible, and easily customizable through the data-driven architecture! 🚀 