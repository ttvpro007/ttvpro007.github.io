#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSS_DIRS = [
  'src/styling',
  'src/components',
  'src/pages'
];

const CSS_EXTENSIONS = ['.css'];

// Simple CSS analysis without external dependencies
function analyzeCSSSimple(css) {
  const lines = css.split('\n');
  const selectors = new Set();
  const properties = new Set();
  const mediaQueries = [];
  const comments = [];
  
  let inMediaQuery = false;
  let currentMediaQuery = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) return;
    
    // Count comments
    if (trimmed.startsWith('/*') || trimmed.startsWith('//')) {
      comments.push(trimmed);
      return;
    }
    
    // Detect media queries
    if (trimmed.startsWith('@media')) {
      inMediaQuery = true;
      currentMediaQuery = trimmed;
      mediaQueries.push(trimmed);
      return;
    }
    
    // End of media query
    if (trimmed === '}') {
      if (inMediaQuery) {
        inMediaQuery = false;
        currentMediaQuery = '';
      }
      return;
    }
    
    // Extract selectors (simple regex)
    const selectorMatch = trimmed.match(/^([^{]+){/);
    if (selectorMatch) {
      const selector = selectorMatch[1].trim();
      selectors.add(selector);
    }
    
    // Extract properties
    const propertyMatch = trimmed.match(/^([a-zA-Z-]+):/);
    if (propertyMatch) {
      const property = propertyMatch[1].trim();
      properties.add(property);
    }
  });
  
  return {
    lines: lines.length,
    selectors: selectors.size,
    properties: properties.size,
    mediaQueries: mediaQueries.length,
    comments: comments.length,
    size: css.length
  };
}

function getAllCSSFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllCSSFiles(fullPath, files);
    } else if (CSS_EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeCSSFile(filePath) {
  try {
    const css = fs.readFileSync(filePath, 'utf8');
    const stats = analyzeCSSSimple(css);
    
    return {
      file: path.relative(process.cwd(), filePath),
      ...stats,
      sizeKB: (stats.size / 1024).toFixed(2)
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function generateSimpleReport(allStats) {
  const validStats = allStats.filter(Boolean);
  
  const totals = validStats.reduce((acc, stat) => ({
    files: acc.files + 1,
    totalSize: acc.totalSize + stat.size,
    totalSelectors: acc.totalSelectors + stat.selectors,
    totalProperties: acc.totalProperties + stat.properties,
    totalMediaQueries: acc.totalMediaQueries + stat.mediaQueries,
    totalLines: acc.totalLines + stat.lines,
    totalComments: acc.totalComments + stat.comments
  }), {
    files: 0,
    totalSize: 0,
    totalSelectors: 0,
    totalProperties: 0,
    totalMediaQueries: 0,
    totalLines: 0,
    totalComments: 0
  });
  
  return {
    summary: {
      files: totals.files,
      totalSize: {
        bytes: totals.totalSize,
        kb: (totals.totalSize / 1024).toFixed(2),
        gzipped: Math.round(totals.totalSize * 0.3 / 1024).toFixed(2)
      },
      selectors: totals.totalSelectors,
      properties: totals.totalProperties,
      mediaQueries: totals.totalMediaQueries,
      lines: totals.totalLines,
      comments: totals.totalComments
    },
    fileDetails: validStats
  };
}

function printSimpleReport(report) {
  console.log('\n🎨 CSS QUICK STATS REPORT\n');
  console.log('='.repeat(50));
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log(`Files analyzed: ${report.summary.files}`);
  console.log(`Total size: ${report.summary.totalSize.kb} KB (${report.summary.totalSize.gzipped} KB gzipped)`);
  console.log(`Total selectors: ${report.summary.selectors}`);
  console.log(`Total properties: ${report.summary.properties}`);
  console.log(`Total media queries: ${report.summary.mediaQueries}`);
  console.log(`Total lines: ${report.summary.lines}`);
  console.log(`Total comments: ${report.summary.comments}`);

  // File details
  console.log('\n📁 FILE DETAILS');
  report.fileDetails.forEach(stat => {
    console.log(`\n${stat.file}:`);
    console.log(`  Size: ${stat.sizeKB} KB`);
    console.log(`  Selectors: ${stat.selectors}`);
    console.log(`  Properties: ${stat.properties}`);
    console.log(`  Media queries: ${stat.mediaQueries}`);
    console.log(`  Lines: ${stat.lines}`);
    console.log(`  Comments: ${stat.comments}`);
  });
  
  // Largest files
  console.log('\n📈 LARGEST FILES');
  const sortedBySize = [...report.fileDetails].sort((a, b) => b.size - a.size).slice(0, 5);
  sortedBySize.forEach(stat => {
    console.log(`${stat.file}: ${stat.sizeKB} KB`);
  });
}

// Main execution
function main() {
  console.log('🔍 Scanning CSS files...');
  
  const allCSSFiles = [];
  CSS_DIRS.forEach(dir => {
    const files = getAllCSSFiles(dir);
    allCSSFiles.push(...files);
  });

  console.log(`Found ${allCSSFiles.length} CSS files`);

  const allStats = allCSSFiles.map(analyzeCSSFile);
  const report = generateSimpleReport(allStats);
  
  printSimpleReport(report);

  // Save report to file
  const reportPath = 'css-quick-stats-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

main(); 