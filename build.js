/**
 * Production Build Script for Hostinger public_html Deployment
 * Packages all HTML, JS, CSS, Blogs, Legal Pages, and SEO Assets into dist/
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('🚀 Starting Production Build for MCP Tool Builder...\n');

// 1. Clean or create dist/
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Helper to copy files
function copyFile(relPath) {
  const src = path.join(ROOT_DIR, relPath);
  const dest = path.join(DIST_DIR, relPath);
  const destDir = path.dirname(dest);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Copied: ${relPath}`);
  } else {
    console.warn(`  ⚠ Missing: ${relPath}`);
  }
}

// Helper to copy directory recursively
function copyDirectory(relDir) {
  const srcDir = path.join(ROOT_DIR, relDir);
  const destDir = path.join(DIST_DIR, relDir);

  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(path.relative(ROOT_DIR, srcPath));
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${path.relative(ROOT_DIR, srcPath)}`);
    }
  }
}

// 2. Copy root files
console.log('📦 Bundling core pages & assets:');
copyFile('index.html');
copyFile('app.js');
copyFile('favicon.svg');
copyFile('robots.txt');
copyFile('sitemap.xml');
copyFile('about.html');
copyFile('contact.html');
copyFile('privacy.html');
copyFile('terms.html');

// 3. Copy blog pages
console.log('\n📚 Bundling SEO blog articles:');
copyDirectory('blog');

// 4. Verify dist contents
const distFiles = [];
function listDistFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listDistFiles(fullPath);
    } else {
      distFiles.push(path.relative(DIST_DIR, fullPath));
    }
  }
}
listDistFiles(DIST_DIR);

console.log('\n======================================================');
console.log(`✅ Build Complete! Production files located in:`);
console.log(`📁 ${DIST_DIR}`);
console.log(`Total files generated: ${distFiles.length}`);
console.log('======================================================');
console.log('\nReady for Hostinger: Upload all files in dist/ directly into public_html/');
