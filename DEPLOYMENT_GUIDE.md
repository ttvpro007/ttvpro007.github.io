# 🚀 Deployment Guide

This guide covers different ways to deploy your portfolio to the web. Choose the option that best fits your needs!

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Updated your data files** (see `DATA_CUSTOMIZATION_GUIDE.md`)
2. **Built the project** (`npm run build`)
3. **A GitHub account** (for most deployment options)

## 🎯 Deployment Options

### 1. GitHub Pages (Recommended for Beginners)

**Pros:** Free, easy setup, automatic updates
**Cons:** Limited to public repositories

#### Step-by-Step Setup

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update package.json:**
   ```json
   {
     "name": "your-portfolio",
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Click "Save"

Your site will be available at `https://yourusername.github.io/your-repo-name`

### 2. Netlify (Recommended for Professionals)

**Pros:** Free tier, custom domains, form handling, automatic deployments
**Cons:** None for basic use

#### Option A: Drag & Drop (Quick)

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Drag the `dist` folder to the deployment area
   - Your site is live!

#### Option B: Git Integration (Recommended)

1. **Connect GitHub repository:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Click "Deploy site"

2. **Automatic deployments:**
   - Every push to main branch triggers a new deployment
   - Pull requests create preview deployments

### 3. Vercel (Great for React Apps)

**Pros:** Optimized for React, automatic deployments, great performance
**Cons:** None for basic use

#### Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Automatic deployments:**
   - Connect your GitHub repository
   - Every push triggers automatic deployment

### 4. Firebase Hosting (Google's Platform)

**Pros:** Fast CDN, good for future expansion
**Cons:** Requires Google account

#### Setup

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

4. **Configure:**
   - Select your project
   - Set public directory: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

5. **Deploy:**
   ```bash
   firebase deploy
   ```

## 🌐 Custom Domain Setup

### GitHub Pages

1. **Add custom domain to repository:**
   - Go to repository Settings → Pages
   - Enter your domain in "Custom domain"
   - Save

2. **Configure DNS:**
   - Add CNAME record pointing to `yourusername.github.io`
   - Or add A records for apex domain

### Netlify

1. **Add custom domain:**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain

2. **Configure DNS:**
   - Netlify provides nameservers or CNAME records
   - Update your domain registrar's DNS settings

### Vercel

1. **Add custom domain:**
   - Go to Project settings → Domains
   - Add your domain

2. **Configure DNS:**
   - Vercel provides nameservers
   - Update your domain registrar's DNS settings

## 🔧 Environment Configuration

### Production Build Optimization

1. **Update vite.config.js for production:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       sourcemap: false,
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             animations: ['framer-motion']
           }
         }
       }
     }
   })
   ```

2. **Add meta tags to index.html:**
   ```html
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="description" content="Your portfolio description" />
     <meta name="keywords" content="portfolio, developer, designer" />
     <meta name="author" content="Your Name" />
     <title>Your Name - Portfolio</title>
   </head>
   ```

## 📱 PWA Setup (Optional)

### Add PWA Features

1. **Install PWA plugin:**
   ```bash
   npm install vite-plugin-pwa
   ```

2. **Update vite.config.js:**
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}']
         },
         manifest: {
           name: 'Your Portfolio',
           short_name: 'Portfolio',
           description: 'Your portfolio description',
           theme_color: '#EEB64B',
           background_color: '#181622',
           display: 'standalone',
           icons: [
             {
               src: '/icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: '/icon-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

## 🔍 SEO Optimization

### Meta Tags

Add these to your `index.html`:

```html
<head>
  <!-- Basic Meta Tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Your portfolio description" />
  <meta name="keywords" content="portfolio, developer, designer, your skills" />
  <meta name="author" content="Your Name" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="Your Name - Portfolio" />
  <meta property="og:description" content="Your portfolio description" />
  <meta property="og:image" content="/your-profile-pic.png" />
  <meta property="og:url" content="https://yourdomain.com" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your Name - Portfolio" />
  <meta name="twitter:description" content="Your portfolio description" />
  <meta name="twitter:image" content="/your-profile-pic.png" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  
  <title>Your Name - Portfolio</title>
</head>
```

### Sitemap

Create a `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/projects</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/resume</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/contact</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

## 🔄 Continuous Deployment

### GitHub Actions (GitHub Pages)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify Functions (Optional)

For server-side functionality, create `netlify/functions/contact.js`:

```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Process form data here
    // Send email, save to database, etc.
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails:**
   - Check for syntax errors in JSON files
   - Verify all imports are correct
   - Run `npm run lint` to check for issues

2. **Images not loading:**
   - Ensure images are in the `public/` directory
   - Check file paths start with `/`
   - Verify file extensions match exactly

3. **Form not working:**
   - Confirm FormSubmit email verification
   - Check form action URL
   - Test with a simple message first

4. **Deployment fails:**
   - Check build logs for errors
   - Verify all dependencies are installed
   - Ensure build command is correct

### Performance Optimization

1. **Image optimization:**
   ```bash
   npm install --save-dev vite-plugin-imagemin
   ```

2. **Bundle analysis:**
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   ```

3. **Lighthouse optimization:**
   - Run Lighthouse audit
   - Address performance issues
   - Optimize images and fonts

## 📊 Analytics Setup

### Google Analytics

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Netlify Analytics

- Enable in Netlify dashboard
- No code changes required

## 🔒 Security Considerations

1. **Environment variables:**
   - Don't commit sensitive data
   - Use environment variables for API keys
   - Use `.env.local` for local development

2. **Content Security Policy:**
   Add to `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';">
   ```

3. **HTTPS:**
   - All modern hosting platforms provide HTTPS
   - Ensure your custom domain uses HTTPS

## 📈 Monitoring

### Uptime Monitoring

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **Netlify Status**: Built-in monitoring

### Performance Monitoring

- **Google PageSpeed Insights**: Performance analysis
- **WebPageTest**: Detailed performance testing
- **Lighthouse**: Comprehensive audits

---

**Need help?** Check the main README.md or open an issue on GitHub!

Your portfolio is now ready to impress the world! 🚀 