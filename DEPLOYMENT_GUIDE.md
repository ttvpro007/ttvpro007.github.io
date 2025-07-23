# GitHub Pages Deployment Guide

This guide explains how to deploy your portfolio to GitHub Pages.

## Prerequisites

- Your repository is named `mylogin.github.io` (where `mylogin` is your GitHub username)
- You have push access to the repository

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys your site when you push to the main branch.

### Steps

1. **Push your changes to GitHub:**

   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Check the deployment:**
   - Go to your repository on GitHub
   - Click on the "Actions" tab
   - You should see a workflow running called "Deploy to GitHub Pages"
   - Wait for it to complete (usually takes 2-3 minutes)

3. **Access your site:**
   - Your site will be available at `https://mylogin.github.io`
   - It may take a few minutes for changes to appear

## Manual Deployment

If you prefer to deploy manually:

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

## GitHub Pages Settings

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch and "/ (root)" folder
6. Click "Save"

## Troubleshooting

### Site not updating

- Check the GitHub Actions tab for any errors
- Ensure the workflow completed successfully
- Wait a few minutes for changes to propagate

### 404 errors

- Make sure your repository is named exactly `mylogin.github.io`
- Check that the base URL in `vite.config.js` is set to `/`

### Build errors

- Run `npm run build` locally to check for build issues
- Check the Actions tab for detailed error messages

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain
2. Configure your domain's DNS settings
3. Update the GitHub Pages settings with your custom domain

## Notes

- The site is built from the `dist` folder after running `npm run build`
- GitHub Pages serves static files, so all routing must be handled client-side
- The site is automatically updated when you push to the main branch
