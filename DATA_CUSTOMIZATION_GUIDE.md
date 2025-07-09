# 📝 Data Customization Guide

This guide explains how to customize all the dynamic content in your portfolio by modifying the JSON data files. No coding required!

## 🎯 Overview

The portfolio uses a data-driven architecture where all content is stored in JSON files in the `src/data/` directory. This makes it easy to update your portfolio without touching any code.

## 📁 Data Files Structure

```
src/data/
├── profile.json      # Personal info, skills, journey, fun facts
├── projects.json     # Project portfolio
├── navigation.json   # Navigation and theme settings
├── uiContent.json    # UI text and configuration
└── contact.json      # Contact form configuration
```

## 👤 Personal Profile (`profile.json`)

### Basic Information

```json
{
  "personal": {
    "name": "Your Name",
    "tagline": "Your catchy tagline",
    "profilePic": "/your-profile-pic.png",
    "bio": "Your bio description - keep it engaging and concise",
    "email": "your.email@example.com"
  }
}
```

**Tips:**
- Use a high-quality profile picture (recommended: 400x400px)
- Keep your tagline short and memorable
- Write a bio that tells your story and what you do

### Social Links

```json
{
  "socialLinks": [
    {
      "name": "GitHub",
      "type": "github",
      "url": "https://github.com/yourusername",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      "color": "#333"
    },
    {
      "name": "LinkedIn",
      "type": "linkedin",
      "url": "https://www.linkedin.com/in/yourprofile",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
      "color": "#0077b5"
    },
    {
      "name": "Portfolio",
      "type": "website",
      "url": "https://yourwebsite.com",
      "icon": "🌐",
      "color": "#4A90E2"
    }
  ]
}
```

**Available social types:** `github`, `linkedin`, `twitter`, `youtube`, `instagram`, `email`, `website`

### Career Journey

```json
{
  "journey": [
    {
      "title": "First Job",
      "year": "2020-2022",
      "icon": "💼",
      "description": "Started my career as a junior developer",
      "animation": "slideIn"
    },
    {
      "title": "Major Project",
      "year": "2022",
      "icon": "🚀",
      "description": "Launched my first major project",
      "animation": "bounce"
    },
    {
      "title": "Current Role",
      "year": "2023-Present",
      "icon": "⭐",
      "description": "Senior developer at amazing company",
      "animation": "fadeIn"
    }
  ]
}
```

**Available animations:** `slideIn`, `bounce`, `fadeIn`, `scale`, `rotate`

### Skills

```json
{
  "skills": {
    "categories": {
      "Frontend Development": {
        "highlights": ["React", "Vue", "TypeScript"],
        "skills": [
          {
            "name": "React",
            "level": 90,
            "icon": "⚛️",
            "description": "Building modern web applications",
            "animation": "battery",
            "color": "#61dafb"
          },
          {
            "name": "Vue.js",
            "level": 85,
            "icon": "🟢",
            "description": "Progressive JavaScript framework",
            "animation": "wave",
            "color": "#42b883"
          }
        ]
      },
      "Backend Development": {
        "highlights": ["Node.js", "Python", "Databases"],
        "skills": [
          {
            "name": "Node.js",
            "level": 88,
            "icon": "🟩",
            "description": "Server-side JavaScript development",
            "animation": "pulse",
            "color": "#339933"
          }
        ]
      }
    }
  }
}
```

**Skill level:** 0-100 (percentage)
**Available animations:** `battery`, `wave`, `pulse`, `typing`, `spinning`

### Fun Facts

```json
{
  "funFacts": [
    "I once debugged a production issue in my sleep",
    "My first computer was a Commodore 64",
    "I can solve a Rubik's cube in under 2 minutes",
    "I've contributed to 50+ open source projects",
    "I speak 3 programming languages fluently"
  ]
}
```

### Interactive Cards

```json
{
  "flipCards": [
    {
      "front": {
        "title": "Code Enthusiast",
        "icon": "💻",
        "subtitle": "Passion for Programming"
      },
      "back": {
        "content": "I love writing clean, efficient code and solving complex problems. When I'm not coding, I'm probably thinking about coding!"
      }
    },
    {
      "front": {
        "title": "Problem Solver",
        "icon": "🧩",
        "subtitle": "Analytical Mind"
      },
      "back": {
        "content": "I enjoy breaking down complex problems into manageable pieces and finding elegant solutions."
      }
    }
  ]
}
```

## 🚀 Projects (`projects.json`)

### Project Structure

```json
{
  "items": [
    {
      "title": "Amazing Project",
      "description": "Short project description",
      "longDescription": "Detailed project description with features, challenges, and solutions",
      "tech": ["React", "Node.js", "MongoDB"],
      "link": "https://github.com/yourusername/project",
      "image": "/projects-images/project-screenshot.png",
      "images": [
        "/projects-images/screenshot1.png",
        "/projects-images/screenshot2.png",
        "/projects-images/screenshot3.png"
      ],
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

### Project Properties Explained

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `title` | string | Project name | "E-commerce Platform" |
| `description` | string | Short description | "A full-stack e-commerce solution" |
| `longDescription` | string | Detailed description | "Built with React frontend and Node.js backend..." |
| `tech` | array | Technologies used | `["React", "Node.js", "MongoDB"]` |
| `link` | string | Project URL | "https://github.com/username/project" |
| `image` | string | Main project image | "/projects-images/project.png" |
| `images` | array | All project images | `["/img1.png", "/img2.png"]` |
| `linkSource` | string | Link type | `"github"`, `"itchio"`, `"website"` |
| `category` | string | Project category | `"Web Development"`, `"Game Dev"`, `"Mobile"` |
| `year` | number | Project year | `2024` |
| `featured` | boolean | Featured project | `true` or `false` |
| `demo` | string | Live demo URL | "https://demo.example.com" |
| `appStore` | string | App store link | "https://apps.apple.com/app/..." |
| `showOnResume` | boolean | Show on resume | `true` or `false` |
| `resumeOrder` | number | Resume display order | `1`, `2`, `3` |

### Link Sources

- `"github"` - GitHub repository
- `"itchio"` - itch.io game page
- `"website"` - Live website
- `"youtube"` - YouTube video
- `"appstore"` - App Store link

### Categories

Common categories include:
- `"Web Development"`
- `"Game Dev"`
- `"Mobile Development"`
- `"AR/VR"`
- `"Tools"`
- `"Design"`
- `"Data Science"`

## 🧭 Navigation (`navigation.json`)

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

**Available themes:** `"dark"`, `"light"`

## 🎨 UI Content (`uiContent.json`)

### Page Titles and Messages

```json
{
  "pages": {
    "projects": {
      "title": "My Projects",
      "searchPlaceholder": "Search projects (e.g., React, Unity, AR)...",
      "noResultsMessage": {
        "icon": "🔍",
        "title": "No projects found",
        "description": "Try adjusting your search terms or filters"
      }
    }
  }
}
```

### Section Titles

```json
{
  "sections": {
    "timeline": {
      "title": "My Journey",
      "icon": "⏰"
    },
    "funFacts": {
      "title": "Did you know...?",
      "icon": "🤔"
    },
    "skills": {
      "title": "Skills & Expertise",
      "icon": "⚡"
    }
  }
}
```

## 📧 Contact Form (`contact.json`)

### Form Configuration

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
    },
    {
      "id": "email",
      "label": "Email Address",
      "type": "email",
      "placeholder": "your.email@example.com",
      "required": true
    },
    {
      "id": "role",
      "label": "Your Role",
      "type": "select",
      "options": ["Developer", "Designer", "Project Manager", "Recruiter", "Other"],
      "required": true
    },
    {
      "id": "message",
      "label": "Message",
      "type": "textarea",
      "placeholder": "Tell me about your project or opportunity...",
      "required": true
    }
  ],
  "submitLabel": "Send Message",
  "confirmationTitle": "Message Sent!",
  "confirmationText": "Thanks for reaching out! I'll get back to you soon."
}
```

### Field Types

- `"text"` - Single line text input
- `"email"` - Email input with validation
- `"textarea"` - Multi-line text area
- `"select"` - Dropdown selection

### Setting Up FormSubmit

1. Go to [FormSubmit.co](https://formsubmit.co/)
2. Enter your email address
3. Check your email and confirm
4. Use the provided action URL in your form config

## 🖼️ Adding Images

### Profile Picture
- Place in `public/` directory
- Recommended size: 400x400px
- Format: PNG or JPG
- Reference: `"/your-profile-pic.png"`

### Project Images
- Place in `public/projects-images/` directory
- Recommended size: 800x600px for screenshots
- Format: PNG or JPG
- Reference: `"/projects-images/project-name.png"`

### Tech Icons
- Place in `public/tech-icons/` directory
- Recommended size: 64x64px
- Format: PNG, SVG, or JPG
- Reference: `"/tech-icons/technology-name.png"`

## 🎯 Best Practices

### Content Writing
- Keep descriptions concise but informative
- Use action verbs and specific achievements
- Include metrics when possible (e.g., "Improved performance by 50%")
- Write in first person for personal sections
- Use third person for project descriptions

### Image Optimization
- Compress images before uploading
- Use descriptive filenames
- Maintain consistent aspect ratios
- Include alt text in your mind (for accessibility)

### Data Organization
- Group related projects by category
- Order projects by importance or recency
- Keep skill levels honest and realistic
- Update content regularly

### SEO Considerations
- Use descriptive project titles
- Include relevant keywords in descriptions
- Keep URLs clean and descriptive
- Add meta descriptions for each project

## 🔄 Updating Content

### Regular Updates
- **Weekly**: Check for broken links
- **Monthly**: Update project status and add new projects
- **Quarterly**: Review and update skills and achievements
- **Annually**: Refresh profile picture and bio

### Version Control
- Commit data changes separately from code changes
- Use descriptive commit messages
- Keep a backup of your data files

## 🚨 Common Issues

### Images Not Loading
- Check file paths (must start with `/`)
- Ensure files are in the `public/` directory
- Verify file extensions match exactly

### Form Not Working
- Confirm FormSubmit email verification
- Check form action URL
- Test with a simple message first

### Styling Issues
- Check JSON syntax for errors
- Verify all required fields are present
- Use browser dev tools to debug

## 📚 Resources

- [JSON Validator](https://jsonlint.com/) - Validate your JSON files
- [FormSubmit Documentation](https://formsubmit.co/help) - Form setup guide
- [Image Compression Tools](https://tinypng.com/) - Optimize images
- [GitHub Pages](https://pages.github.com/) - Deployment guide

---

**Need help?** Check the main README.md for more detailed instructions or open an issue on GitHub! 