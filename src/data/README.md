# 📊 Data Directory

This directory contains all the dynamic content for the portfolio application. The data is organized into JSON files that can be easily updated without touching any code, making the portfolio highly customizable.

## 📁 File Structure

```
src/data/
├── index.js           # Centralized exports for all data files
├── profile.json       # Personal information, skills, journey, fun facts
├── projects.json      # Project portfolio with detailed metadata
├── navigation.json    # Navigation and theme configuration
├── uiContent.json     # UI text and component configuration
└── contact.json       # Contact form configuration
```

## 🎯 Data Architecture

### Centralized Exports (`index.js`)
All data files are exported through a single entry point for easy importing:

```javascript
// Core data files
export { default as profile } from './profile.json';
export { default as projects } from './projects.json';

// Component-specific data files
export { default as navigation } from './navigation.json';
export { default as uiContent } from './uiContent.json';
export { default as contact } from './contact.json';
```

### Usage in Components
```javascript
import { profile, projects, navigation, uiContent, contact } from '../data';
```

## 📋 Data Files Overview

### 1. Profile Data (`profile.json`)
Contains all personal information and content for the Home page.

#### Structure
```json
{
  "personal": {
    "name": "Your Name",
    "tagline": "Your tagline",
    "profilePic": "/profile-pic.png",
    "bio": "Your bio description",
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
  "education": [...],
  "funFacts": [...],
  "showAndTell": [...],
  "hq": {...}
}
```

#### Sections
- **personal**: Basic profile information
- **socialLinks**: Social media and contact links
- **journey**: Career timeline and milestones
- **flipCards**: Interactive flip card content
- **skills**: Skills organized by categories
- **education**: Educational background and qualifications
- **funFacts**: Rotating fun facts
- **showAndTell**: Image gallery content
- **hq**: Contact page header information

#### Education Structure
```json
{
  "education": [
    {
      "degree": "Bachelor of Science in Nursing",
      "institution": "University of Toronto",
      "year": "2015-2019",
      "description": "Comprehensive nursing education with focus on patient care and healthcare systems",
      "icon": "🎓",
      "relevantCourses": ["Anatomy & Physiology", "Patient Care", "Healthcare Systems"]
    },
    {
      "degree": "Self-Taught Programming",
      "institution": "Online Learning Platforms",
      "year": "2019-Present",
      "description": "Intensive self-directed learning in game development, programming, and software engineering",
      "icon": "💻",
      "relevantCourses": ["Unity & C#", "C++ Programming", "Swift Development", "Game Design"]
    }
  ]
}
```

#### Education Properties
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `degree` | string | Degree or qualification name | "Bachelor of Science in Nursing" |
| `institution` | string | Educational institution | "University of Toronto" |
| `year` | string | Year or date range | "2015-2019" or "2019-Present" |
| `description` | string | Brief description of education | "Comprehensive nursing education..." |
| `icon` | string | Emoji or icon representation | "🎓" or "💻" |
| `relevantCourses` | array | List of relevant courses | `["Unity & C#", "C++ Programming"]` |

### 2. Projects Data (`projects.json`)
Contains all project information for the Projects page.

#### Structure
```json
{
  "items": [
    {
      "title": "Project Name",
      "description": "Short description",
      "longDescription": "Detailed description",
      "tech": ["React", "Node.js"],
      "link": "https://github.com/...",
      "image": "/projects-images/project.png",
      "images": [...],
      "linkSource": "github",
      "category": "Web Development",
      "year": 2024,
      "featured": true,
      "demo": "https://demo.com",
      "appStore": null,
      "showOnResume": true,
      "resumeOrder": 1
    }
  ]
}
```

#### Project Properties
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `title` | string | Project name | "E-commerce Platform" |
| `description` | string | Short description | "A full-stack e-commerce solution" |
| `longDescription` | string | Detailed description | "Built with React frontend..." |
| `tech` | array | Technologies used | `["React", "Node.js"]` |
| `link` | string | Project URL | "https://github.com/..." |
| `image` | string | Main project image | "/projects-images/project.png" |
| `images` | array | All project images | `["/img1.png", "/img2.png"]` |
| `linkSource` | string | Link type | `"github"`, `"itchio"` |
| `category` | string | Project category | `"Web Development"` |
| `year` | number | Project year | `2024` |
| `featured` | boolean | Featured project | `true` or `false` |
| `demo` | string | Live demo URL | "https://demo.com" |
| `appStore` | string | App store link | "https://apps.apple.com/..." |
| `showOnResume` | boolean | Show on resume | `true` or `false` |
| `resumeOrder` | number | Resume display order | `1`, `2`, `3` |

### 🎬 Video Background Themes for Project Modals

You can add animated video background effects to the project modal gallery when a project has a video. The effect is controlled by the `videoBackgroundTheme` property in each project object.

#### Available Themes
- `raindrops` (default)
// Add more themes here as you implement them, e.g.:
// - `bokeh`
// - `snow`

#### How to Use
Add the `videoBackgroundTheme` property to your project in `projects.json`:
```json
{
  "title": "Catavaneer",
  ...
  "video": "https://www.youtube.com/embed/BYTxPFj44uo?si=eBDT605T5Q7QH_aM",
  "videoBackgroundTheme": "raindrops"
}
```
If not specified, the default theme is `raindrops`.

#### How to Add More Themes
1. **Implement a new strategy function** in `src/components/base/videoBgStrategies.js`:
   ```js
   function bokehStrategy(canvas) {
     // Animation logic for bokeh effect
   }
   ```
2. **Register the new strategy** in the `getVideoBgStrategy` switch:
   ```js
   export function getVideoBgStrategy(theme) {
     switch (theme) {
       case 'raindrops':
         return raindropsStrategy;
       case 'bokeh':
         return bokehStrategy;
       // ...
       default:
         return null;
     }
   }
   ```
3. **Set the theme in your project data**:
   ```json
   "videoBackgroundTheme": "bokeh"
   ```
4. **Document the new theme** in this README under 'Available Themes'.

### 3. Navigation Data (`navigation.json`)
Contains navigation and theme configuration.

#### Structure
```json
{
  "pages": ["Home", "Projects", "Resume", "Contact"],
  "brandName": "Your Name",
  "themeConfig": {
    "defaultTheme": "dark",
    "storageKey": "theme"
  },
  "icons": {
    "moon": {...},
    "sun": {...}
  }
}
```

#### Sections
- **pages**: Array of page names for navigation
- **brandName**: Name displayed in navbar
- **themeConfig**: Theme settings
- **icons**: SVG icon definitions for theme toggle

### 4. UI Content Data (`uiContent.json`)
Contains all UI text and component configuration.

#### Structure
```json
{
  "pages": {
    "projects": {
      "title": "Projects",
      "searchPlaceholder": "Search projects...",
      "noResultsMessage": {...}
    }
  },
  "sections": {
    "timeline": {
      "title": "My Journey",
      "icon": "⏰"
    }
  },
  "animations": {...},
  "config": {...},
  "ui": {...}
}
```

#### Sections
- **pages**: Page-specific text and configuration
- **sections**: Section titles and icons
- **animations**: Animation configuration
- **config**: Component configuration
- **ui**: UI element text and settings

### 5. Contact Data (`contact.json`)
Contains contact form configuration.

#### Structure
```json
{
  "titleText": "Let's Connect!",
  "subtitleText": "Send me a message below.",
  "formConfig": {
    "action": "https://formsubmit.co/your-email@example.com",
    "method": "POST"
  },
  "formFields": [
    {
      "id": "name",
      "label": "Your Name",
      "type": "text",
      "placeholder": "What should I call you?",
      "required": true
    }
  ],
  "submitLabel": "Send Message",
  "confirmationTitle": "Message Sent!",
  "confirmationText": "Thanks for reaching out!"
}
```

#### Sections
- **titleText**: Contact page title
- **subtitleText**: Contact page subtitle
- **formConfig**: Form submission configuration
- **formFields**: Form field definitions
- **submitLabel**: Submit button text
- **confirmationTitle**: Success modal title
- **confirmationText**: Success modal text

## 🎨 Customization Guide

### Adding New Projects
1. Open `projects.json`
2. Add a new object to the `items` array
3. Fill in all required properties
4. Add project images to `public/projects-images/`
5. Update image paths in the project object

### Updating Skills
1. Open `profile.json`
2. Navigate to the `skills.categories` section
3. Add new categories or modify existing ones
4. Update skill levels, descriptions, and animations

### Updating Education
1. Open `profile.json`
2. Navigate to the `education` array
3. Add new education entries or modify existing ones
4. Include degree, institution, year, description, icon, and relevant courses
5. Education entries are displayed on the Resume page in chronological order

### Changing UI Text
1. Open `uiContent.json`
2. Find the relevant section (pages, sections, ui)
3. Update text content as needed
4. Save the file

### Modifying Navigation
1. Open `navigation.json`
2. Update the `pages` array to add/remove pages
3. Change `brandName` to update navbar title
4. Modify theme settings if needed

## 🔧 Data Validation

### JSON Syntax
- All files must be valid JSON
- Use double quotes for strings
- No trailing commas
- Proper nesting and indentation

### Required Fields
- **profile.json**: `personal.name`, `personal.tagline`
- **projects.json**: `items` array with project objects
- **navigation.json**: `pages` array, `brandName`
- **uiContent.json**: `pages`, `sections` objects
- **contact.json**: `formConfig.action`, `formFields` array

### Image Paths
- All image paths should start with `/`
- Images should be placed in the `public/` directory
- Use relative paths from the public directory
- Supported formats: PNG, JPG, SVG

## 📱 Responsive Considerations

### Image Optimization
- Use appropriate image sizes for different devices
- Compress images before adding to the project
- Consider using WebP format for better performance
- Provide fallback images for older browsers

### Text Content
- Keep descriptions concise for mobile devices
- Use appropriate line lengths for readability
- Consider character limits for different screen sizes

## 🔄 Data Updates

### Regular Maintenance
- **Weekly**: Check for broken links
- **Monthly**: Update project status and add new projects
- **Quarterly**: Review and update skills and achievements
- **Annually**: Refresh profile picture and bio

### Version Control
- Commit data changes separately from code changes
- Use descriptive commit messages
- Keep a backup of your data files
- Document major changes in commit messages

## 🚨 Common Issues

### JSON Errors
- **Syntax Errors**: Use a JSON validator to check syntax
- **Missing Commas**: Ensure proper comma placement
- **Unclosed Brackets**: Check for matching brackets and braces

### Image Issues
- **Broken Images**: Verify image paths and file existence
- **Large File Sizes**: Compress images before adding
- **Wrong Format**: Use supported image formats

### Import Errors
- **Missing Exports**: Ensure all files are exported in `index.js`
- **Wrong Paths**: Check import paths in components
- **Case Sensitivity**: Ensure file names match exactly

## 📚 Best Practices

### Content Organization
- Group related data logically
- Use consistent naming conventions
- Keep descriptions concise but informative
- Update content regularly

### Performance
- Optimize images before adding
- Use appropriate image formats
- Minimize data file sizes
- Cache data when possible

### Accessibility
- Provide alt text for images
- Use descriptive link text
- Ensure proper contrast ratios
- Include fallback content

## 🔮 Future Enhancements

### Potential Improvements
- **CMS Integration**: Connect to a content management system
- **API Integration**: Load data from external APIs
- **Dynamic Content**: Real-time content updates
- **Localization**: Multi-language support
- **Analytics**: Track content performance

### Technical Improvements
- **TypeScript**: Add type definitions for data structures
- **Validation**: Add JSON schema validation
- **Caching**: Implement data caching strategies
- **Compression**: Optimize data file sizes

---

**Need help?** Check the main project README.md or the DATA_CUSTOMIZATION_GUIDE.md for detailed instructions!

The data directory is the heart of your portfolio's content management system. Keep it organized, validated, and up-to-date for the best user experience! 🚀 