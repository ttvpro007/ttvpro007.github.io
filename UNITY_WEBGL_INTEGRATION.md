# Unity WebGL Integration Guide

## Overview

This guide explains how to integrate Unity WebGL builds into your portfolio using the new **Tab System** in the project modal. The system automatically detects Unity WebGL builds and adds a "Web Build" tab alongside the "Overview" tab.

## How It Works

### Automatic Detection
The system automatically detects Unity WebGL builds by checking if the `demo` URL:
- Starts with `/` (local path)
- Contains `unity-games` in the path

Example: `/unity-games/predictive-projectile-motion/`

### Tab System Behavior
- **With Unity WebGL Build**: Shows both "Overview" and "Web Build" tabs
- **Without Unity WebGL Build**: Shows only the "Overview" tab (original behavior)

## File Structure

```
public/
├── unity-games/
│   └── your-game-name/
│       ├── index.html          # Unity WebGL build
│       ├── Build/              # Unity build files
│       ├── StreamingAssets/    # Game assets
│       └── TemplateData/       # Unity template
├── projects-images/
│   └── your-game-screenshots.png
└── markdown/
    └── your-game.md
```

## Adding Your Unity WebGL Build

### 1. Create Directory Structure
```bash
mkdir -p public/unity-games/your-game-name
```

### 2. Copy Unity WebGL Build Files
Copy your Unity WebGL build files into `public/unity-games/your-game-name/`

### 3. Add Project to `projects.json`
```json
{
  "title": "Your Unity Game",
  "description": "Description of your Unity WebGL game",
  "longDescription": "Detailed description...",
  "roles": ["Game Developer"],
  "features": [
    "WebGL compatible",
    "Cross-platform gameplay"
  ],
  "tech": ["Unity", "C#", "WebGL"],
  "link": "https://github.com/your-username/your-game-repo",
  "image": "/projects-images/your-game-screenshot.png",
  "images": ["/projects-images/your-game-screenshot.png"],
  "demo": "/unity-games/your-game-name/",
  "linkSource": "github",
  "category": "Game Dev",
  "year": 2024,
  "featured": false,
  "showOnResume": true,
  "resumeOrder": 8
}
```

### 4. Add Screenshots
Add game screenshots to `public/projects-images/`

## Example: Predictive Projectile Motion

The "Predictive Projectile Motion" project demonstrates this integration:

- **Demo URL**: `/unity-games/predictive-projectile-motion/`
- **Tab System**: Shows both "Overview" and "Web Build" tabs
- **Web Build Tab**: Embeds the Unity WebGL game directly in the modal

## Technical Implementation

### Tab System Logic
```javascript
// Check if project has Unity WebGL build
const hasUnityWebGLBuild = isUnityWebGLBuild(project?.demo);
const showTabs = hasUnityWebGLBuild && hasOverview;

// isUnityWebGLBuild function
const isUnityWebGLBuild = (demoUrl) => {
  if (!demoUrl) return false;
  return demoUrl.startsWith('/') && demoUrl.includes('unity-games');
};
```

### CSS Classes
- `.project-tabs-section` - Main tab container
- `.tabs-navigation` - Tab navigation buttons
- `.tab-button` - Individual tab buttons
- `.tab-content` - Tab content area
- `.unity-webgl-container` - Unity iframe container
- `.unity-webgl-frame` - Unity iframe styling

## Best Practices

### 1. Unity WebGL Optimization
- Optimize your Unity build for web deployment
- Consider file size and loading times
- Test cross-browser compatibility

### 2. User Experience
- Provide clear instructions in the Web Build tab
- Include game controls information
- Consider loading states for large builds

### 3. Performance
- Monitor iframe performance
- Consider lazy loading for multiple Unity builds
- Test on different devices and connections

## Troubleshooting

### Tab Not Showing
- Ensure `demo` URL starts with `/` and contains `unity-games`
- Check that the project has both `demo` and overview content
- Verify the Unity build files are in the correct location

### Unity Build Not Loading
- Check browser console for errors
- Verify Unity WebGL build compatibility
- Ensure all Unity build files are present

### Styling Issues
- Check CSS variables in `variables.css`
- Verify responsive design on different screen sizes
- Test modal behavior with Unity iframe

## Future Enhancements

Potential improvements for the Unity WebGL integration:

1. **Loading States**: Add progress indicators for Unity builds
2. **Fullscreen Mode**: Add fullscreen toggle for Unity games
3. **Mobile Optimization**: Improve touch controls for mobile devices
4. **Performance Monitoring**: Add analytics for Unity build performance
5. **Multiple Builds**: Support for multiple Unity builds per project

## Support

For issues or questions about Unity WebGL integration:
1. Check the browser console for errors
2. Verify Unity build file structure
3. Test with different browsers
4. Review Unity WebGL documentation
