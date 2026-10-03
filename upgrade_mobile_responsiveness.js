const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const BLOG_DIR = path.join(ROOT_DIR, 'blog');

// Header template for blog articles
const BLOG_HEADER = `  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
    <a href="../index.html" class="flex items-center space-x-2 font-extrabold text-slate-900 dark:text-white text-base shrink-0">
      <img src="../favicon.svg" alt="MCP Tool Builder Logo" class="w-6 h-6">
      <span class="truncate max-w-[160px] xs:max-w-none">MCP Tool Builder</span>
    </a>
    
    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-5 text-sm">
      <a href="../index.html" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">Interactive Builder</a>
      <a href="index.html" class="text-brand-600 dark:text-brand-400 font-bold">Blog & Guides</a>
      <a href="../about.html" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">About</a>
      <a href="../contact.html" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">Contact</a>
      <button id="themeToggle" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Toggle Light/Dark Theme">
        <i data-lucide="moon" class="w-4 h-4 hidden dark:block"></i>
        <i data-lucide="sun" class="w-4 h-4 block dark:hidden text-amber-500"></i>
      </button>
    </div>

    <!-- Mobile Navigation Actions -->
    <div class="flex md:hidden items-center space-x-2">
      <button id="themeToggleMobile" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition" title="Toggle Light/Dark Theme">
        <i data-lucide="moon" class="w-4 h-4 hidden dark:block"></i>
        <i data-lucide="sun" class="w-4 h-4 block dark:hidden text-amber-500"></i>
      </button>
      <button onclick="toggleMobileNav()" aria-label="Toggle navigation menu" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
        <i data-lucide="menu" class="w-4 h-4"></i>
      </button>
    </div>
  </header>

  <!-- Mobile Dropdown Navigation -->
  <div id="mobileNavDropdown" class="hidden md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shadow-lg z-40">
    <a href="../index.html" class="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400">⚡ Interactive Builder</a>
    <a href="index.html" class="block py-2 text-sm font-semibold text-brand-600 dark:text-brand-400">📚 Blog & Guides</a>
    <a href="../about.html" class="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">ℹ️ About Us</a>
    <a href="../contact.html" class="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">✉️ Contact & Support</a>
  </div>`;

// Footer template for blog articles
const BLOG_FOOTER = `  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 sm:py-8 px-4 sm:px-6 text-center text-xs text-slate-500 font-medium">
    <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      <p>© 2026 MCP Tool Schema Builder. Open Source under MIT License.</p>
      <div class="flex flex-wrap justify-center items-center gap-4 sm:space-x-5">
        <a href="../about.html" class="hover:text-slate-700 dark:hover:text-slate-300">About Us</a>
        <a href="../contact.html" class="hover:text-slate-700 dark:hover:text-slate-300">Contact</a>
        <a href="../privacy.html" class="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</a>
        <a href="../terms.html" class="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</a>
        <a href="../sitemap.xml" class="hover:text-slate-700 dark:hover:text-slate-300">Sitemap</a>
      </div>
    </div>
  </footer>

  <script>
    const themeBtn = document.getElementById('themeToggle');
    const themeBtnMobile = document.getElementById('themeToggleMobile');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('mcp_theme') || localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }

    const toggleTheme = () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('mcp_theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('mcp_theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      lucide.createIcons();
    };

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);

    function toggleMobileNav() {
      const el = document.getElementById('mobileNavDropdown');
      if (el) el.classList.toggle('hidden');
    }

    lucide.createIcons();
  </script>`;

// Header template for root pages (about, contact, privacy, terms)
function getRootHeader(activePage) {
  return `  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
    <a href="index.html" class="flex items-center space-x-2 font-extrabold text-slate-900 dark:text-white text-base shrink-0">
      <img src="favicon.svg" alt="MCP Logo" class="w-6 h-6">
      <span class="truncate max-w-[160px] xs:max-w-none">MCP Tool Builder</span>
    </a>
    
    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-5 text-sm font-semibold">
      <a href="index.html" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Builder</a>
      <a href="blog/index.html" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Blog</a>
      <a href="about.html" class="${activePage === 'about' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition">About</a>
      <a href="contact.html" class="${activePage === 'contact' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition">Contact</a>
      <button id="themeToggle" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Toggle Light/Dark Theme">
        <i data-lucide="moon" class="w-4 h-4 hidden dark:block"></i>
        <i data-lucide="sun" class="w-4 h-4 block dark:hidden text-amber-500"></i>
      </button>
    </div>

    <!-- Mobile Navigation Actions -->
    <div class="flex md:hidden items-center space-x-2">
      <button id="themeToggleMobile" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition" title="Toggle Light/Dark Theme">
        <i data-lucide="moon" class="w-4 h-4 hidden dark:block"></i>
        <i data-lucide="sun" class="w-4 h-4 block dark:hidden text-amber-500"></i>
      </button>
      <button onclick="toggleMobileNav()" aria-label="Toggle navigation menu" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
        <i data-lucide="menu" class="w-4 h-4"></i>
      </button>
    </div>
  </header>

  <!-- Mobile Dropdown Navigation -->
  <div id="mobileNavDropdown" class="hidden md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shadow-lg z-40">
    <a href="index.html" class="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400">⚡ Interactive Builder</a>
    <a href="blog/index.html" class="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">📚 Blog & Guides</a>
    <a href="about.html" class="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">ℹ️ About Us</a>
    <a href="contact.html" class="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">✉️ Contact & Support</a>
  </div>`;
}

// 1. Process all blog articles
const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

blogFiles.forEach(file => {
  const filePath = path.join(BLOG_DIR, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Body overflow
  html = html.replace(/<body class="([^"]*)">/, (match, classes) => {
    let newClasses = classes;
    if (!newClasses.includes('overflow-x-hidden')) newClasses += ' overflow-x-hidden';
    if (!newClasses.includes('min-w-0')) newClasses += ' min-w-0';
    return `<body class="${newClasses}">`;
  });

  // Replace Header
  html = html.replace(/<header[\s\S]*?<\/header>/, BLOG_HEADER);

  // Replace Main container
  html = html.replace(/<main class="flex-1 max-w-3xl[^"]*">/, '<main class="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 min-w-0">');

  // Replace Article container
  html = html.replace(/<article class="prose dark:prose-invert[^"]*">/, '<article class="prose dark:prose-invert max-w-none w-full min-w-0 overflow-hidden">');

  // Replace Title H1
  html = html.replace(/<h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">/, '<h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 break-words">');

  // Replace Interactive CTA box
  html = html.replace(/<div class="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950\/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">([\s\S]*?)<\/div>/, (match, inner) => {
    let updatedInner = inner.replace(/<a href="\.\.\/index\.html" class="px-3\.5 py-1\.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition shadow">([\s\S]*?)<\/a>/, 
      '<a href="../index.html" class="inline-flex items-center justify-center self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition shadow shrink-0">$1</a>');
    return `<div class="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">${updatedInner}</div>`;
  });

  // Ensure pre tag responsiveness
  html = html.replace(/<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">/g, '<pre class="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded-lg overflow-x-auto text-[11px] sm:text-xs font-mono max-w-full">');

  // Replace Footer and Script
  html = html.replace(/<footer[\s\S]*?<\/html>/, `${BLOG_FOOTER}\n</body>\n</html>`);

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Updated blog article: ${file}`);
});

// 2. Process root pages (about, contact, privacy, terms)
const rootPages = [
  { file: 'about.html', id: 'about' },
  { file: 'contact.html', id: 'contact' },
  { file: 'privacy.html', id: 'privacy' },
  { file: 'terms.html', id: 'terms' }
];

rootPages.forEach(({ file, id }) => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Body overflow
  html = html.replace(/<body class="([^"]*)">/, (match, classes) => {
    let newClasses = classes;
    if (!newClasses.includes('overflow-x-hidden')) newClasses += ' overflow-x-hidden';
    if (!newClasses.includes('min-w-0')) newClasses += ' min-w-0';
    return `<body class="${newClasses}">`;
  });

  // Header
  html = html.replace(/<header[\s\S]*?<\/header>/, getRootHeader(id));

  // Main container
  html = html.replace(/<main class="flex-1 max-w-3xl[^"]*">/, '<main class="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 min-w-0">');

  // Footer script
  html = html.replace(/<script>\s*lucide\.createIcons\(\);[\s\S]*?<\/script>/, `<script>
    const themeBtn = document.getElementById('themeToggle');
    const themeBtnMobile = document.getElementById('themeToggleMobile');
    const html = document.documentElement;

    const toggleTheme = () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('mcp_theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('mcp_theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      lucide.createIcons();
    };

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);

    function toggleMobileNav() {
      const el = document.getElementById('mobileNavDropdown');
      if (el) el.classList.toggle('hidden');
    }

    lucide.createIcons();
  </script>`);

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Updated root page: ${file}`);
});

// 3. Process tables to guarantee smooth internal scrolling on mobile
const filesWithTables = [
  'blog/converting-rest-apis-and-openapi-to-mcp.html',
  'blog/mcp-vs-openai-function-calling.html',
  'blog/model-context-protocol-security-best-practices.html'
];
filesWithTables.forEach(rel => {
  const p = path.join(ROOT_DIR, rel);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    content = content.replace(/<table class="w-full (?!min-w)/g, '<table class="w-full min-w-[500px] ');
    fs.writeFileSync(p, content, 'utf-8');
    console.log(`✓ Ensured scrollable table in: ${rel}`);
  }
});

console.log('\nAll pages updated for 100% mobile responsiveness successfully.');
