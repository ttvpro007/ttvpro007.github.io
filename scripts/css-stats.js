#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cssstats from 'cssstats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSS_DIRS = [
  'src/styling',
  'src/components',
  'src/pages'
];

const CSS_EXTENSIONS = ['.css'];

// Utility functions
function getAllCSSFiles(dir, files = []) {
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
    const stats = cssstats(css);
    
    return {
      file: path.relative(process.cwd(), filePath),
      size: {
        raw: css.length,
        gzipped: Math.round(css.length * 0.3), // Approximate gzip ratio
        minified: Math.round(css.length * 0.8) // Approximate minification ratio
      },
      selectors: {
        total: stats.selectors?.total || 0,
        id: stats.selectors?.id || 0,
        class: stats.selectors?.class || 0,
        type: stats.selectors?.type || 0,
        pseudoClass: stats.selectors?.pseudoClass || 0,
        pseudoElement: stats.selectors?.pseudoElement || 0
      },
      declarations: {
        total: stats.declarations?.total || 0,
        unique: stats.declarations?.unique || 0
      },
      rules: {
        total: stats.rules?.total || 0,
        mediaQueries: stats.mediaQueries?.total || 0
      },
      properties: stats.properties || {},
      values: stats.values || {},
      specificity: {
        average: stats.specificity?.average || 0,
        max: stats.specificity?.max || 0
      }
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function generateReport(allStats) {
  const totalStats = {
    files: allStats.length,
    totalSize: 0,
    totalSelectors: 0,
    totalDeclarations: 0,
    totalRules: 0,
    topProperties: {},
    topValues: {},
    specificityStats: {
      total: 0,
      max: 0
    }
  };

  // Aggregate stats
  allStats.forEach(stat => {
    if (!stat) return;
    
    totalStats.totalSize += stat.size.raw;
    totalStats.totalSelectors += stat.selectors.total;
    totalStats.totalDeclarations += stat.declarations.total;
    totalStats.totalRules += stat.rules.total;
    totalStats.specificityStats.total += stat.specificity.average;
    totalStats.specificityStats.max = Math.max(totalStats.specificityStats.max, stat.specificity.max);

    // Aggregate properties
    Object.entries(stat.properties).forEach(([prop, count]) => {
      totalStats.topProperties[prop] = (totalStats.topProperties[prop] || 0) + count;
    });

    // Aggregate values
    Object.entries(stat.values).forEach(([value, count]) => {
      totalStats.topValues[value] = (totalStats.topValues[value] || 0) + count;
    });
  });

  // Calculate averages
  totalStats.specificityStats.average = totalStats.specificityStats.total / allStats.length;

  // Sort top properties and values
  const sortedProperties = Object.entries(totalStats.topProperties)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const sortedValues = Object.entries(totalStats.topValues)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return {
    summary: {
      files: totalStats.files,
      totalSize: {
        raw: totalStats.totalSize,
        gzipped: Math.round(totalStats.totalSize * 0.3),
        minified: Math.round(totalStats.totalSize * 0.8)
      },
      selectors: totalStats.totalSelectors,
      declarations: totalStats.totalDeclarations,
      rules: totalStats.totalRules,
      averageSpecificity: Math.round(totalStats.specificityStats.average * 100) / 100,
      maxSpecificity: totalStats.specificityStats.max
    },
    topProperties: sortedProperties,
    topValues: sortedValues,
    fileDetails: allStats.filter(Boolean)
  };
}

function printReport(report) {
  console.log('\n🎨 CSS STATS REPORT\n');
  console.log('='.repeat(50));
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log(`Files analyzed: ${report.summary.files}`);
  console.log(`Total size: ${(report.summary.totalSize.raw / 1024).toFixed(2)} KB`);
  console.log(`Gzipped size: ${(report.summary.totalSize.gzipped / 1024).toFixed(2)} KB`);
  console.log(`Minified size: ${(report.summary.totalSize.minified / 1024).toFixed(2)} KB`);
  console.log(`Total selectors: ${report.summary.selectors}`);
  console.log(`Total declarations: ${report.summary.declarations}`);
  console.log(`Total rules: ${report.summary.rules}`);
  console.log(`Average specificity: ${report.summary.averageSpecificity}`);
  console.log(`Max specificity: ${report.summary.maxSpecificity}`);

  // Top properties
  console.log('\n🏆 TOP 10 PROPERTIES');
  report.topProperties.forEach(([prop, count]) => {
    console.log(`${prop}: ${count}`);
  });

  // Top values
  console.log('\n🏆 TOP 10 VALUES');
  report.topValues.forEach(([value, count]) => {
    console.log(`${value}: ${count}`);
  });

  // File details
  console.log('\n📁 FILE DETAILS');
  report.fileDetails.forEach(stat => {
    console.log(`\n${stat.file}:`);
    console.log(`  Size: ${(stat.size.raw / 1024).toFixed(2)} KB`);
    console.log(`  Selectors: ${stat.selectors.total} (${stat.selectors.class} classes, ${stat.selectors.id} IDs)`);
    console.log(`  Declarations: ${stat.declarations.total}`);
    console.log(`  Rules: ${stat.rules.total}`);
    console.log(`  Specificity: ${stat.specificity.average.toFixed(2)} (max: ${stat.specificity.max})`);
  });
}

// Main execution
function main() {
  console.log('🔍 Scanning CSS files...');
  
  const allCSSFiles = [];
  CSS_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = getAllCSSFiles(dir);
      allCSSFiles.push(...files);
    }
  });

  console.log(`Found ${allCSSFiles.length} CSS files`);

  const allStats = allCSSFiles.map(analyzeCSSFile);
  const report = generateReport(allStats);
  
  printReport(report);

  // Save report to file
  const reportPath = 'css-stats-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

main(); 