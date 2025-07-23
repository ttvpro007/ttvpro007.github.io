import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting deployment...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create a temporary directory with shorter path
  const tempDir = path.join(process.cwd(), 'temp-deploy');
  const distDir = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  // Copy dist to temp directory
  console.log('📋 Copying files...');
  execSync(`xcopy "${distDir}" "${tempDir}" /E /I /Y`, { stdio: 'inherit' });
  
  // Change to temp directory and deploy
  process.chdir(tempDir);
  
  // Initialize git and deploy
  console.log('🔧 Setting up git...');
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  
  console.log('📤 Pushing to gh-pages branch...');
  execSync('git push -f https://github.com/ttvpro007/ttvpro007.github.io.git HEAD:gh-pages', { stdio: 'inherit' });
  
  // Clean up
  process.chdir(process.cwd());
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Your site should be available at: https://ttvpro007.github.io');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 