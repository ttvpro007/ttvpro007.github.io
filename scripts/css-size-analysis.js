#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findCSSFiles(dir) {
  const cssFiles = [];
  
  if (!fs.existsSync(dir)) {
    return cssFiles;
  }
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.css')) {
        cssFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return cssFiles;
}

function analyzeCSSSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const css = fs.readFileSync(filePath, 'utf8');
    
    // Calculate sizes
    const rawSize = stats.size;
    const gzippedSize = Math.round(rawSize * 0.3); // Approximate gzip ratio
    const minifiedSize = Math.round(rawSize * 0.8); // Approximate minification ratio
    
    return {
      file: path.relative(process.cwd(), filePath),
      size: {
        raw: rawSize,
        rawKB: (rawSize / 1024).toFixed(2),
        gzipped: gzippedSize,
        gzippedKB: (gzippedSize / 1024).toFixed(2),
        minified: minifiedSize,
        minifiedKB: (minifiedSize / 1024).toFixed(2)
      }
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function main() {
  console.log('🔍 Analyzing built CSS files...');
  
  // Check if dist directory exists
  const distDir = 'dist';
  if (!fs.existsSync(distDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    console.log('💡 You can also run "npm run css:quick" for source file analysis.');
    return;
  }
  
  // Find all CSS files in dist directory
  const cssFiles = findCSSFiles(distDir);
  
  if (cssFiles.length === 0) {
    console.log('❌ No CSS files found in build directory.');
    console.log('💡 Make sure to run "npm run build" first.');
    return;
  }
  
  console.log(`Found ${cssFiles.length} CSS files in build directory`);
  
  // Analyze each file
  const results = cssFiles.map(analyzeCSSSize).filter(Boolean);
  
  if (results.length === 0) {
    console.log('❌ No valid CSS files could be analyzed.');
    return;
  }
  
  // Calculate totals
  const totals = results.reduce((acc, result) => ({
    raw: acc.raw + result.size.raw,
    gzipped: acc.gzipped + result.size.gzipped,
    minified: acc.minified + result.size.minified
  }), { raw: 0, gzipped: 0, minified: 0 });
  
  // Print results
  console.log('\n📦 CSS BUNDLE SIZE ANALYSIS');
  console.log('='.repeat(50));
  
  console.log('\n📊 SUMMARY');
  console.log(`Files analyzed: ${results.length}`);
  console.log(`Total raw size: ${(totals.raw / 1024).toFixed(2)} KB`);
  console.log(`Total gzipped: ${(totals.gzipped / 1024).toFixed(2)} KB`);
  console.log(`Total minified: ${(totals.minified / 1024).toFixed(2)} KB`);
  
  console.log('\n📁 FILE DETAILS');
  results.forEach(result => {
    console.log(`\n${result.file}:`);
    console.log(`  Raw: ${result.size.rawKB} KB`);
    console.log(`  Gzipped: ${result.size.gzippedKB} KB`);
    console.log(`  Minified: ${result.size.minifiedKB} KB`);
  });
  
  // Largest files
  console.log('\n📈 LARGEST FILES');
  const sortedBySize = [...results].sort((a, b) => b.size.raw - a.size.raw).slice(0, 5);
  sortedBySize.forEach(result => {
    console.log(`${result.file}: ${result.size.rawKB} KB`);
  });
  
  // Performance assessment
  console.log('\n🎯 PERFORMANCE ASSESSMENT');
  if (totals.raw < 50 * 1024) {
    console.log('✅ Total CSS size is under 50KB (good)');
  } else if (totals.raw < 100 * 1024) {
    console.log('⚠️  Total CSS size is between 50KB-100KB (acceptable)');
  } else {
    console.log('❌ Total CSS size is over 100KB (needs optimization)');
  }
  
  if (totals.gzipped < 15 * 1024) {
    console.log('✅ Gzipped size is under 15KB (excellent)');
  } else if (totals.gzipped < 30 * 1024) {
    console.log('⚠️  Gzipped size is between 15KB-30KB (acceptable)');
  } else {
    console.log('❌ Gzipped size is over 30KB (needs optimization)');
  }
  
  // Save report
  const report = {
    summary: {
      files: results.length,
      totalSize: {
        raw: totals.raw,
        rawKB: (totals.raw / 1024).toFixed(2),
        gzipped: totals.gzipped,
        gzippedKB: (totals.gzipped / 1024).toFixed(2),
        minified: totals.minified,
        minifiedKB: (totals.minified / 1024).toFixed(2)
      }
    },
    fileDetails: results
  };
  
  const reportPath = 'css-bundle-size-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

main(); 