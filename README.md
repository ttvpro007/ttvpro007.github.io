# 🎮 Vi Tiet's Portfolio [Live Demo](https://ttvpro007.github.io/)

A modern, gamer-themed portfolio built with React + Vite, featuring smooth animations, interactive elements, and a fully customizable data-driven architecture. Perfect for developers, designers, and creators who want to showcase their work with style.

## ✨ Features

- **🎨 Gamer Aesthetic**: Dark theme with golden accents and gaming-inspired design
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts
- **🎬 Smooth Animations**: Framer Motion powered animations with centralized animation system
- **🔧 Data-Driven**: Easy content updates through JSON files
- **⚡ Performance Optimized**: Fast loading with Vite and optimized animations
- **🎯 Interactive Elements**: Flip cards, modals, search, and filtering
- **🌙 Theme Support**: Dark/light mode toggle
- **🎮 Easter Eggs**: Konami code for confetti celebration!

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
Portfolio/
├── public/                    # Static assets
│   ├── portfolio-profile-pic.png
│   ├── projects-images/       # Project screenshots
│   ├── tech-icons/           # Technology icons
│   └── kenney_cursor-pack/   # Custom cursor pack
├── src/
│   ├── components/           # React components
│   │   ├── base/            # Reusable base components
│   │   │   ├── AnimatedContainer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── ...          # Other base components
│   │   ├── ProjectCard.jsx
│   │   ├── FeaturedProject.jsx
│   │   ├── SearchAndFilter.jsx
│   │   └── ...              # Other components
│   ├── data/                # Dynamic content (JSON files)
│   │   ├── profile.json     # Personal info, skills, journey
│   │   ├── projects.json    # Project portfolio
│   │   ├── navigation.json  # Navigation config
│   │   ├── uiContent.json   # UI text and config
│   │   └── contact.json     # Contact form config
│   ├── pages/               # Main page components
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── Resume.jsx
│   │   └── Contact.jsx
│   ├── styling/             # CSS architecture
│   │   ├── themes/          # CSS variables and themes
│   │   ├── components/      # Component-specific styles
│   │   ├── pages/           # Page-specific styles
│   │   └── animations/      # Keyframes and animations
│   └── utils/               # Utility functions
│       ├── animations.js    # Centralized animation system
│       └── projectUtils.js  # Project-related utilities
└── package.json
```

## 🎯 Customizing Your Portfolio

### 1. Personal Information (`src/data/profile.json`)

Update your personal details, bio, and social links:

```json
{
  "personal": {
    "name": "Your Name",
    "tagline": "Your catchy tagline",
    "profilePic": "/your-profile-pic.png",
    "bio": "Your bio description",
    "email": "your.email@example.com"
  },
  "socialLinks": [
    {
      "name": "GitHub",
      "type": "github",
      "url": "https://github.com/yourusername",
      "icon": "github-icon-url",
      "color": "#333"
    }
  ]
}
```

### 2. Skills & Journey (`src/data/profile.json`)

Customize your skills and career journey:

```json
{
  "skills": {
    "categories": {
      "Programming": {
        "highlights": ["React", "Node.js", "Python"],
        "skills": [
          {
            "name": "React",
            "level": 90,
            "icon": "⚛️",
            "description": "Frontend development with React",
            "animation": "battery",
            "color": "#61dafb"
          }
        ]
      }
    }
  },
  "journey": [
    {
      "title": "Career Milestone",
      "year": "2023",
      "icon": "🚀",
      "description": "Description of your achievement",
      "animation": "rocket"
    }
  ]
}
```

### 3. Projects (`src/data/projects.json`)

Add your projects with detailed information:

```json
{
  "items": [
    {
      "title": "Project Name",
      "description": "Short description",
      "longDescription": "Detailed project description",
      "tech": ["React", "Node.js", "MongoDB"],
      "link": "https://github.com/yourusername/project",
      "image": "/projects-images/project-screenshot.png",
      "images": ["/projects-images/screenshot1.png", "/screenshot2.png"],
      "linkSource": "github",
      "category": "Web Development",
      "year": 2024,
      "featured": true,
      "demo": "https://demo.example.com",
      "appStore": null,
      "showOnResume": true,
      "resumeOrder": 1
    }
  ]
}
```

### 4. Navigation (`src/data/navigation.json`)

Customize navigation and theme settings:

```json
{
  "pages": ["Home", "Projects", "Resume", "Contact"],
  "brandName": "Your Name",
  "themeConfig": {
    "defaultTheme": "dark",
    "storageKey": "theme"
  }
}
```

### 5. UI Content (`src/data/uiContent.json`)

Customize UI text and configuration:

```json
{
  "pages": {
    "projects": {
      "title": "Projects",
      "searchPlaceholder": "Search projects...",
      "noResultsMessage": {
        "icon": "🔍",
        "title": "No projects found",
        "description": "Try adjusting your search terms"
      }
    }
  }
}
```

### 6. Contact Form (`src/data/contact.json`)

Configure your contact form:

```json
{
  "titleText": "Get In Touch!",
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
  ]
}
```

## 🎨 Customizing the Design

### Colors & Theme (`src/styling/themes/variables.css`)

Update the color palette and design tokens:

```css
:root {
  --primary: #EEB64B;        /* Gold */
  --secondary: #FC9460;      /* Orange */
  --accent: #E54264;         /* Red-Pink */
  --background: #181622;     /* Dark */
  --card-bg: #221B36;        /* Dark Purple */
  --text: #F3F3F3;          /* Light */
  --text-secondary: #B8B8B8; /* Muted */
}
```

### Animations (`src/utils/animations.js`)

The project uses a centralized animation system. You can customize animations by modifying the animation strategies in `src/utils/animations.js`.

## 🚀 Deployment

### GitHub Pages

1. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag the `dist` folder to Netlify**

### Vercel

1. **Connect your GitHub repository to Vercel**
2. **Vercel will automatically detect and deploy your React app**

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. **Create component in `src/components/`**
2. **Use base components for consistency:**
   ```jsx
   import { Card, Button, AnimatedContainer } from './base';
   ```

3. **Add component-specific styles in `src/styling/components/`**

4. **Import and use in pages**

### Adding New Pages

1. **Create page component in `src/pages/`**
2. **Add page styles in `src/styling/pages/`**
3. **Update navigation in `src/data/navigation.json`**
4. **Add route in `src/App.jsx`**

## 🎮 Easter Eggs

- **Konami Code**: Press ↑↑↓↓←→←→BA to trigger confetti celebration!
- **Custom Cursors**: The project includes a custom cursor pack for enhanced UX

## 📚 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: CSS3 with custom properties
- **Animations**: Framer Motion
- **Icons**: Custom tech icons + emoji
- **Forms**: FormSubmit.co integration
- **Deployment**: GitHub Pages, Netlify, or Vercel ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Kenney** for the custom cursor pack
- **Framer Motion** for smooth animations
- **Vite** for fast development experience

---

**Ready to showcase your work?** 🚀

This portfolio template is designed to be easily customizable while maintaining a professional, gamer-inspired aesthetic. Update the data files, customize the styling, and deploy to share your projects with the world!
