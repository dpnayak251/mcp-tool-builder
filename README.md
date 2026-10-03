<div align="center">

# 🛠️ MCP Tool Schema Builder

**Visual Interactive Schema Generator for Anthropic's Model Context Protocol (MCP)**

[![License: MIT](https://img.shields.io/badge/License-MIT-16a34a.svg)](https://opensource.org/licenses/MIT)
[![MCP Spec](https://img.shields.io/badge/MCP-JSON--RPC%202.0-blue.svg)](https://modelcontextprotocol.io)
[![Client-Side](https://img.shields.io/badge/Client--Side-100%25%20In--Browser-emerald.svg)](https://mcptoolbuilder.com)
[![Hostinger Ready](https://img.shields.io/badge/Deploy-Hostinger%20public__html-purple.svg)](https://hostinger.com)

[**Live Application**](https://mcptoolbuilder.com) • [**Documentation & Guides**](https://mcptoolbuilder.com/blog/) • [**Report a Bug**](https://github.com/dpnayak251/mcp-tool-builder/issues)

</div>

---

## ⚡ Overview

Building custom **Model Context Protocol (MCP)** servers for **Claude Desktop**, **Antigravity**, and **Cursor** requires writing rigid, verbose JSON Schemas and Zod definitions. A single missing field description or incorrect JSON Schema nesting will cause an LLM to hallucinate arguments or fail tool execution.

**MCP Tool Schema Builder** is an open-source, 100% client-side web utility that lets you visually design tool parameters and immediately generate production-ready code.

### 🌟 Key Features

- **Multi-Target Generation (1-Click Copy):**
  - **Standard MCP JSON Schema:** Full JSON-RPC 2.0 compliant schema for `tools/list`.
  - **TypeScript + Zod:** Ready-to-paste `@modelcontextprotocol/sdk` server code.
  - **Python FastMCP:** Modern `@mcp.tool()` decorators with automatic type hints & docstrings.
  - **Claude Desktop & Antigravity Config:** Instant `claude_desktop_config.json` snippet.
  - **Test Call Payload:** Standard `tools/call` JSON-RPC request for cURL / MCP inspectors.
- **LLM Function Calling Linter:** Real-time diagnostics that flag missing parameter descriptions (the #1 cause of agent tool failures).
- **JSON & Schema Importer:** Paste any sample JSON payload or existing schema to auto-populate parameters in 1 second.
- **Theme Support:** Clean minimalist Light theme by default, with dark theme toggle saved to `localStorage`.
- **Modern Typography:** Styled with **Plus Jakarta Sans** and **JetBrains Mono**.
- **100% Client-Side Privacy:** Zero server dependencies. No parameters, API keys, or schemas ever leave your browser.

---

## 🚀 Quick Start

### Option 1: Run Locally (Node.js)
```bash
git clone https://github.com/dpnayak251/mcp-tool-builder.git
cd mcp-tool-builder
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Open Directly Without a Server
You can open `index.html` directly in Chrome, Edge, or Safari with zero build or install steps!

---

## 🌐 Deploying to Hostinger (Zero Cost / Zero Maintenance)

Because this tool is completely static and client-side, it runs with sub-50ms loading times on Hostinger:

1. Run the build script to generate the latest production bundle:
   ```bash
   npm run build
   ```
2. Upload the generated `dist.zip` (or the contents of `dist/`) directly into your Hostinger **File Manager** under `public_html/`.
3. Point your custom domain to the directory. Done!

---

## 🛡️ Embeddable GitHub Badge (Link Building)

Are you building an open-source MCP server? Show your users your tools comply with official MCP specifications by adding this badge to your GitHub repository `README.md`:

```markdown
[![Built with MCP Tool Builder](https://img.shields.io/badge/MCP%20Tool%20Builder-Generated-16a34a?style=flat&logo=anthropic)](https://mcptoolbuilder.com)
```

**Preview:**  
[![Built with MCP Tool Builder](https://img.shields.io/badge/MCP%20Tool%20Builder-Generated-16a34a?style=flat&logo=anthropic)](https://mcptoolbuilder.com)

---

## 📂 Source Code Structure

```
mcp-tool-builder/
├── index.html                 # Main tool application with SEO & FAQ schema
├── app.js                     # Client-side state & code generators
├── favicon.svg                # Modern SVG vector favicon
├── robots.txt                 # Search crawler directives
├── sitemap.xml                # Search sitemap
├── about.html                 # About Us trust page
├── contact.html               # Contact & support page
├── privacy.html               # 100% In-browser Privacy Policy (GDPR/AdSense)
├── terms.html                 # Terms of Service (MIT License)
├── blog/                      # SEO Technical Articles & Guides
│   ├── index.html             # Blog Hub
│   ├── how-to-build-mcp-server-typescript.html
│   ├── mcp-vs-openai-function-calling.html
│   └── fastmcp-python-guide.html
├── build.js                   # Automated packaging script (outputs to dist/)
├── server.js                  # Zero-dependency local development server
├── package.json               # NPM scripts
├── CONTRIBUTING.md            # Guidelines for open source contributors
└── LICENSE                    # MIT License
```

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
Feel free to fork, customize, and self-host for your personal or commercial projects.
