# Contributing to MCP Tool Schema Builder 🤝

Thank you for your interest in contributing to the **Model Context Protocol (MCP) Tool Schema Builder**!

## 🛠️ Development Setup

This project is built to be **100% client-side with zero heavy build tool requirements**:

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/mcp-tool-builder.git
   cd mcp-tool-builder
   ```

2. Start the local development server:
   ```bash
   node server.js
   ```
   Open `http://localhost:3000` in your browser.

3. When you make changes to templates or generators, compile the production distribution:
   ```bash
   npm run build
   ```

## 💡 Ways to Contribute
- **Add New Starter Templates:** Add realistic MCP tools to `TEMPLATES` in `app.js` (e.g. Slack bot, Stripe customer lookup, Docker CLI).
- **Add New Code Generators:** Help expand support for other MCP client targets (e.g., Go, C#, Rust).
- **Improve Schema Linting:** Add more diagnostic checks to catch LLM function-calling failure patterns.

## 📜 Pull Request Guidelines
- Ensure all generated code adheres strictly to the official [Model Context Protocol Specification](https://modelcontextprotocol.io).
- Verify that `npm run build` succeeds cleanly before opening a pull request.
