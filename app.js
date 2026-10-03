/**
 * MCP Tool Schema Builder - Interactive Engine
 * 100% Client-Side Generator for Model Context Protocol (MCP) Tools
 * Supports: JSON Schema (JSON-RPC 2.0), TypeScript + Zod, Python FastMCP, Multi-IDE Configs, and Starter Project ZIP
 */

// Global Application State
let toolData = {
  name: 'fetch_web_page',
  description: 'Fetches the text and HTML content of a given URL, strips tracking scripts, and returns clean markdown.',
  parameters: [
    {
      id: 'p1',
      name: 'url',
      type: 'string',
      description: 'The complete HTTP or HTTPS URL of the webpage to fetch and parse.',
      required: true,
      defaultValue: '',
      enums: '',
      itemType: 'string'
    },
    {
      id: 'p2',
      name: 'format',
      type: 'string',
      description: 'Target format of the extracted page content.',
      required: false,
      defaultValue: 'markdown',
      enums: 'markdown, text, html',
      itemType: 'string'
    },
    {
      id: 'p3',
      name: 'timeout',
      type: 'integer',
      description: 'Maximum request timeout in milliseconds before aborting.',
      required: false,
      defaultValue: '5000',
      enums: '',
      itemType: 'string'
    }
  ]
};

let currentTab = 'json';
let currentConfigIDE = 'claude'; // 'claude' | 'cursor' | 'antigravity' | 'windsurf'

// Curated Production Starter Templates
const TEMPLATES = {
  webScraper: {
    name: 'fetch_web_page',
    description: 'Fetches the text and HTML content of a given URL, strips tracking scripts, and returns clean markdown.',
    parameters: [
      { id: 'w1', name: 'url', type: 'string', description: 'The complete HTTP or HTTPS URL of the webpage to fetch and parse.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'w2', name: 'format', type: 'string', description: 'Target format of the extracted page content.', required: false, defaultValue: 'markdown', enums: 'markdown, text, html', itemType: 'string' },
      { id: 'w3', name: 'timeout', type: 'integer', description: 'Maximum request timeout in milliseconds before aborting.', required: false, defaultValue: '5000', enums: '', itemType: 'string' }
    ]
  },
  sqlQuery: {
    name: 'execute_sql_query',
    description: 'Executes a read-only SQL query against the configured database and returns structured JSON rows.',
    parameters: [
      { id: 's1', name: 'query', type: 'string', description: 'The sanitized SELECT query to run.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 's2', name: 'limit', type: 'integer', description: 'Maximum number of records to return.', required: false, defaultValue: '50', enums: '', itemType: 'string' },
      { id: 's3', name: 'database', type: 'string', description: 'Target database cluster.', required: false, defaultValue: 'primary', enums: 'primary, replica, analytics', itemType: 'string' }
    ]
  },
  githubIssue: {
    name: 'create_github_issue',
    description: 'Creates a new GitHub issue in the specified repository with title, markdown body, and labels.',
    parameters: [
      { id: 'g1', name: 'owner', type: 'string', description: 'GitHub username or organization name.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'g2', name: 'repo', type: 'string', description: 'Repository name.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'g3', name: 'title', type: 'string', description: 'Issue title summary.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'g4', name: 'body', type: 'string', description: 'Detailed markdown explanation of the bug or feature request.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'g5', name: 'labels', type: 'array', description: 'Array of issue labels to apply.', required: false, defaultValue: '', enums: '', itemType: 'string' }
    ]
  },
  fileManager: {
    name: 'read_workspace_file',
    description: 'Reads the text content of a file located within the approved project workspace.',
    parameters: [
      { id: 'f1', name: 'file_path', type: 'string', description: 'Relative path to the target file from project root.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 'f2', name: 'start_line', type: 'integer', description: 'Optional 1-indexed starting line to slice.', required: false, defaultValue: '1', enums: '', itemType: 'string' },
      { id: 'f3', name: 'end_line', type: 'integer', description: 'Optional ending line to slice.', required: false, defaultValue: '', enums: '', itemType: 'string' }
    ]
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  renderParameters();
  updateSchema();
});

// Render Dynamic Parameter Input Rows with strict accessibility IDs & labels
function renderParameters() {
  const container = document.getElementById('parametersList');
  document.getElementById('paramCount').textContent = toolData.parameters.length;

  if (toolData.parameters.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900/50">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto text-slate-400 mb-2"></i>
        <p class="text-xs text-slate-500 dark:text-slate-400">No parameters defined yet.</p>
        <button onclick="addParameter()" class="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">Add first parameter</button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = toolData.parameters.map((param) => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition shadow-sm hover:border-slate-300 dark:hover:border-slate-700 space-y-3 relative group" id="param-card-${param.id}">
      
      <!-- Top Row: Name, Type, Required Toggle, Delete -->
      <div class="grid grid-cols-12 gap-2.5 items-center">
        <!-- Param Name -->
        <div class="col-span-12 sm:col-span-5">
          <label for="param_name_${param.id}" class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Name <span class="text-rose-500">*</span></label>
          <input id="param_name_${param.id}" name="param_name_${param.id}" type="text" value="${escapeHtml(param.name)}" oninput="updateParam('${param.id}', 'name', this.value)" placeholder="e.g. query, limit"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-brand-500">
        </div>

        <!-- Type Selector -->
        <div class="col-span-7 sm:col-span-4">
          <label for="param_type_${param.id}" class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Type</label>
          <select id="param_type_${param.id}" name="param_type_${param.id}" onchange="updateParam('${param.id}', 'type', this.value)"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500">
            <option value="string" ${param.type === 'string' ? 'selected' : ''}>string</option>
            <option value="number" ${param.type === 'number' ? 'selected' : ''}>number (float)</option>
            <option value="integer" ${param.type === 'integer' ? 'selected' : ''}>integer</option>
            <option value="boolean" ${param.type === 'boolean' ? 'selected' : ''}>boolean</option>
            <option value="array" ${param.type === 'array' ? 'selected' : ''}>array</option>
            <option value="object" ${param.type === 'object' ? 'selected' : ''}>object</option>
          </select>
        </div>

        <!-- Required Checkbox & Delete -->
        <div class="col-span-5 sm:col-span-3 flex items-center justify-end space-x-3 pt-4 sm:pt-3">
          <label for="param_req_${param.id}" class="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input id="param_req_${param.id}" name="param_req_${param.id}" type="checkbox" ${param.required ? 'checked' : ''} onchange="updateParam('${param.id}', 'required', this.checked)"
              class="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-0">
            <span class="text-[11px] font-medium">Req</span>
          </label>
          <button onclick="removeParameter('${param.id}')" class="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition" title="Delete parameter" aria-label="Delete parameter ${escapeHtml(param.name)}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Description Input -->
      <div>
        <label for="param_desc_${param.id}" class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
          Description <span class="text-rose-500">*</span>
          <span class="text-[10px] text-slate-400 font-normal">(Informs the AI agent what value to supply)</span>
        </label>
        <input id="param_desc_${param.id}" name="param_desc_${param.id}" type="text" value="${escapeHtml(param.description)}" oninput="updateParam('${param.id}', 'description', this.value)" placeholder="e.g. Target filter for query..."
          class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500">
      </div>

      <!-- Advanced: Enums & Default Values -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div>
          <label for="param_enums_${param.id}" class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Allowed Values (comma-separated enums)</label>
          <input id="param_enums_${param.id}" name="param_enums_${param.id}" type="text" value="${escapeHtml(param.enums || '')}" oninput="updateParam('${param.id}', 'enums', this.value)" placeholder="e.g. asc, desc"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
        </div>

        <div>
          <label for="param_default_${param.id}" class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Default Value</label>
          <input id="param_default_${param.id}" name="param_default_${param.id}" type="text" value="${escapeHtml(param.defaultValue || '')}" oninput="updateParam('${param.id}', 'defaultValue', this.value)" placeholder="e.g. 10 or 'markdown'"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
        </div>
      </div>

    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// Add Parameter
function addParameter() {
  const newId = 'param_' + Date.now().toString().slice(-4);
  toolData.parameters.push({
    id: newId,
    name: 'param_' + (toolData.parameters.length + 1),
    type: 'string',
    description: '',
    required: true,
    defaultValue: '',
    enums: '',
    itemType: 'string'
  });
  renderParameters();
  updateSchema();
}

// Remove Parameter
function removeParameter(id) {
  toolData.parameters = toolData.parameters.filter(p => p.id !== id);
  renderParameters();
  updateSchema();
}

// Update Single Parameter Field
function updateParam(id, field, value) {
  const param = toolData.parameters.find(p => p.id === id);
  if (param) {
    param[field] = value;
    updateSchema();
  }
}

// Update Global Tool Schema & Rerun Linters
function updateSchema() {
  toolData.name = (document.getElementById('toolName').value || 'unnamed_tool').trim();
  toolData.description = (document.getElementById('toolDesc').value || '').trim();

  runDiagnostics();
  renderCode();
}

// Real-Time Linter for LLM Agent Compatibility
function runDiagnostics() {
  const diagContainer = document.getElementById('diagnosticsList');
  const validationPill = document.getElementById('validationPill');
  const issues = [];

  if (!toolData.name) {
    issues.push({ level: 'error', text: 'Tool name is required.' });
  } else if (!/^[a-zA-Z0-9_-]+$/.test(toolData.name)) {
    issues.push({ level: 'warning', text: 'Tool name should use snake_case or kebab-case without spaces.' });
  }

  if (!toolData.description) {
    issues.push({ level: 'error', text: 'Tool description is required so LLM agents know when to call it.' });
  } else if (toolData.description.length < 20) {
    issues.push({ level: 'warning', text: 'Short description: LLMs make better routing decisions with detailed descriptions.' });
  }

  const missingDesc = toolData.parameters.filter(p => !p.description || p.description.trim() === '');
  if (missingDesc.length > 0) {
    issues.push({
      level: 'warning',
      text: `${missingDesc.length} parameter(s) missing descriptions (${missingDesc.map(p => p.name || 'unnamed').join(', ')}). LLMs hallucinate arguments without descriptions.`
    });
  }

  const hasErrors = issues.some(i => i.level === 'error');
  const hasWarnings = issues.some(i => i.level === 'warning');

  if (hasErrors) {
    validationPill.className = "text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center space-x-1";
    validationPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span>Invalid Schema</span>';
  } else if (hasWarnings) {
    validationPill.className = "text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 flex items-center space-x-1";
    validationPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>' + issues.length + ' Recommendation(s)</span>';
  } else {
    validationPill.className = "text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1";
    validationPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Valid MCP Schema</span>';
  }

  if (issues.length === 0) {
    diagContainer.innerHTML = `
      <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>Schema is clean and compliant with Model Context Protocol standards.</span>
      </div>
    `;
  } else {
    diagContainer.innerHTML = issues.map(iss => `
      <div class="flex items-start space-x-2 ${iss.level === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}">
        <i data-lucide="${iss.level === 'error' ? 'alert-circle' : 'alert-triangle'}" class="w-4 h-4 mt-0.5 flex-shrink-0"></i>
        <span>${iss.text}</span>
      </div>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
}

// Multi-Language Code Generator Controller
function renderCode() {
  const codeEl = document.getElementById('codeOutput');
  const filenameEl = document.getElementById('tabFilename');
  const specEl = document.getElementById('tabSpec');
  const ideSubtabs = document.getElementById('ideSubtabs');

  if (ideSubtabs) {
    if (currentTab === 'config') {
      ideSubtabs.classList.remove('hidden');
    } else {
      ideSubtabs.classList.add('hidden');
    }
  }

  let code = '';
  let lang = 'json';

  switch (currentTab) {
    case 'json':
      filenameEl.textContent = `${toolData.name}.json`;
      specEl.textContent = 'Standard MCP JSON Schema';
      lang = 'json';
      code = generateMCPJsonSchema();
      break;

    case 'typescript':
      filenameEl.textContent = `${toolData.name}.ts`;
      specEl.textContent = '@modelcontextprotocol/sdk + Zod';
      lang = 'typescript';
      code = generateTypeScriptCode();
      break;

    case 'python':
      filenameEl.textContent = `${toolData.name}.py`;
      specEl.textContent = 'mcp.server.fastmcp';
      lang = 'python';
      code = generatePythonCode();
      break;

    case 'config':
      lang = 'json';
      if (currentConfigIDE === 'cursor') {
        filenameEl.textContent = '.cursor/mcp.json';
        specEl.textContent = 'Cursor IDE Configuration';
      } else if (currentConfigIDE === 'antigravity') {
        filenameEl.textContent = '.agents/settings.json';
        specEl.textContent = 'Google Antigravity MCP Config';
      } else if (currentConfigIDE === 'windsurf') {
        filenameEl.textContent = 'windsurf/mcp_config.json';
        specEl.textContent = 'Codeium Windsurf Configuration';
      } else {
        filenameEl.textContent = 'claude_desktop_config.json';
        specEl.textContent = 'Claude Desktop Configuration';
      }
      code = generateConfigSnippet(currentConfigIDE);
      break;

    case 'test':
      filenameEl.textContent = 'test_call.json';
      specEl.textContent = 'JSON-RPC 2.0 tools/call Request';
      lang = 'json';
      code = generateTestPayload();
      break;
  }

  codeEl.className = `language-${lang}`;
  codeEl.textContent = code;
  if (window.Prism) {
    Prism.highlightElement(codeEl);
  }
}

// Tab Switching
function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.code-tab').forEach(b => {
    b.className = "code-tab px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
  });
  const activeBtn = document.getElementById(`tab-${tab}`);
  if (activeBtn) {
    activeBtn.className = "code-tab px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-sm transition";
  }
  renderCode();
}

// Switch IDE Sub-Tab for MCP Config
function setConfigIDE(ide) {
  currentConfigIDE = ide;
  document.querySelectorAll('.ide-btn').forEach(btn => {
    btn.className = "ide-btn px-2.5 py-1 text-[11px] font-medium rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
  });
  const activeBtn = document.getElementById(`ide-btn-${ide}`);
  if (activeBtn) {
    activeBtn.className = "ide-btn px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 transition";
  }
  renderCode();
}

// 1. Generate Standard MCP JSON Schema
function generateMCPJsonSchema() {
  const properties = {};
  const required = [];

  toolData.parameters.forEach(p => {
    if (!p.name) return;
    const prop = {
      type: p.type,
      description: p.description || ''
    };

    if (p.enums && p.enums.trim()) {
      prop.enum = p.enums.split(',').map(e => e.trim()).filter(Boolean);
    }

    if (p.defaultValue !== undefined && p.defaultValue !== '') {
      prop.default = p.type === 'number' || p.type === 'integer' ? Number(p.defaultValue) : p.defaultValue;
    }

    if (p.type === 'array') {
      prop.items = { type: p.itemType || 'string' };
    }

    properties[p.name] = prop;

    if (p.required) {
      required.push(p.name);
    }
  });

  const schema = {
    name: toolData.name,
    description: toolData.description,
    inputSchema: {
      type: "object",
      properties: properties,
      required: required
    }
  };

  return JSON.stringify(schema, null, 2);
}

// 2. Generate TypeScript + Zod Handler Implementation
function generateTypeScriptCode() {
  const zodFields = toolData.parameters.map(p => {
    if (!p.name) return '';
    let zType = 'z.string()';

    if (p.type === 'number') zType = 'z.number()';
    if (p.type === 'integer') zType = 'z.number().int()';
    if (p.type === 'boolean') zType = 'z.boolean()';
    if (p.type === 'array') zType = 'z.array(z.string())';
    if (p.type === 'object') zType = 'z.record(z.any())';

    if (p.enums && p.enums.trim()) {
      const enumVals = p.enums.split(',').map(e => `"${e.trim()}"`).join(', ');
      zType = `z.enum([${enumVals}])`;
    }

    if (p.defaultValue) {
      const def = p.type === 'number' || p.type === 'integer' ? p.defaultValue : `"${p.defaultValue}"`;
      zType += `.default(${def})`;
    }

    if (!p.required) {
      zType += '.optional()';
    }

    if (p.description) {
      zType += `.describe("${escapeQuotes(p.description)}")`;
    }

    return `    ${p.name}: ${zType}`;
  }).filter(Boolean).join(',\n');

  return `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize MCP Server
const server = new McpServer({
  name: "${toolData.name}-server",
  version: "1.0.0"
});

// Register Tool: ${toolData.name}
server.tool(
  "${toolData.name}",
  "${escapeQuotes(toolData.description)}",
  {
${zodFields}
  },
  async (args) => {
    try {
      // 🚀 Implement your custom tool logic here
      // Access validated parameters: args.url, args.limit, etc.
      return {
        content: [
          {
            type: "text",
            text: \`Successfully executed \${toolData.name} with inputs: \${JSON.stringify(args)}\`
          }
        ]
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: "text", text: \`Error: \${error.message}\` }]
      };
    }
  }
);

// Connect over Standard I/O (stdio) transport
const transport = new StdioServerTransport();
await server.connect(transport);
`;
}

// 3. Generate Python FastMCP Server Code
function generatePythonCode() {
  const pyArgs = toolData.parameters.map(p => {
    if (!p.name) return '';
    let pyType = 'str';
    if (p.type === 'number') pyType = 'float';
    if (p.type === 'integer') pyType = 'int';
    if (p.type === 'boolean') pyType = 'bool';
    if (p.type === 'array') pyType = 'list[str]';
    if (p.type === 'object') pyType = 'dict[str, Any]';

    if (!p.required) {
      const defVal = p.defaultValue ? (p.type === 'string' ? `"${p.defaultValue}"` : p.defaultValue) : 'None';
      return `${p.name}: ${pyType} | None = ${defVal}`;
    }
    return `${p.name}: ${pyType}`;
  }).filter(Boolean).join(', ');

  const docArgs = toolData.parameters.map(p => `        ${p.name}: ${p.description || 'Parameter description.'}`).join('\n');

  return `from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("${toolData.name.replace(/_/g, '-')}-service")

@mcp.tool()
def ${toolData.name}(${pyArgs}) -> str:
    """
    ${toolData.description}

    Args:
${docArgs}
    """
    # 🚀 Implement your execution logic here
    # Return string output or JSON string back to the agent
    return f"Successfully executed ${toolData.name}."

if __name__ == "__main__":
    mcp.run()
`;
}

// 4. Generate Multi-IDE Config Snippets
function generateConfigSnippet(ide = 'claude') {
  if (ide === 'cursor') {
    const config = {
      mcpServers: {
        [`${toolData.name}-server`]: {
          command: "node",
          args: ["./dist/index.js"]
        }
      }
    };
    return `// Save this file in your project workspace at:
// .cursor/mcp.json

${JSON.stringify(config, null, 2)}
`;
  }

  if (ide === 'antigravity') {
    const config = {
      mcpServers: {
        [`${toolData.name}-server`]: {
          command: "node",
          args: ["./dist/index.js"]
        }
      }
    };
    return `// Save this file in your Antigravity workspace or global configuration:
// - Workspace: .agents/settings.json
// - Global: ~/.gemini/antigravity/mcp/settings.json

${JSON.stringify(config, null, 2)}
`;
  }

  if (ide === 'windsurf') {
    const config = {
      mcpServers: {
        [`${toolData.name}-server`]: {
          command: "node",
          args: ["./dist/index.js"]
        }
      }
    };
    return `// Save this file in your Windsurf configuration directory:
// - macOS: ~/Library/Application Support/Windsurf/mcp_config.json
// - Windows: %APPDATA%\\Windsurf\\mcp_config.json
// - Linux: ~/.codeium/windsurf/mcp_config.json

${JSON.stringify(config, null, 2)}
`;
  }

  // Default: Claude Desktop
  const config = {
    mcpServers: {
      [`${toolData.name}-server`]: {
        command: "node",
        args: ["./dist/index.js"]
      }
    }
  };

  return `// Save this file inside your Claude Desktop configuration:
// - Windows: %APPDATA%\\Claude\\claude_desktop_config.json
// - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json

${JSON.stringify(config, null, 2)}
`;
}

// 5. Generate Test Execution JSON-RPC Payload
function generateTestPayload() {
  const sampleArgs = {};
  toolData.parameters.forEach(p => {
    if (!p.name) return;
    if (p.defaultValue) {
      sampleArgs[p.name] = p.type === 'number' || p.type === 'integer' ? Number(p.defaultValue) : p.defaultValue;
    } else {
      sampleArgs[p.name] = p.type === 'string' ? `sample_${p.name}` : p.type === 'number' || p.type === 'integer' ? 1 : p.type === 'boolean' ? true : [];
    }
  });

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: toolData.name,
      arguments: sampleArgs
    }
  };

  return JSON.stringify(payload, null, 2);
}

// Parse Raw JSON or Existing MCP Schema from Modal
function importJSONSchema() {
  const rawInput = document.getElementById('jsonImportInput').value.trim();
  if (!rawInput) return;

  try {
    const parsed = JSON.parse(rawInput);

    if (parsed.name && parsed.inputSchema) {
      toolData.name = parsed.name;
      toolData.description = parsed.description || '';
      toolData.parameters = [];

      const props = parsed.inputSchema.properties || {};
      const requiredList = parsed.inputSchema.required || [];

      Object.entries(props).forEach(([key, val], idx) => {
        toolData.parameters.push({
          id: 'imp_' + idx + '_' + Date.now().toString().slice(-4),
          name: key,
          type: val.type || 'string',
          description: val.description || '',
          required: requiredList.includes(key),
          defaultValue: val.default !== undefined ? String(val.default) : '',
          enums: val.enum ? val.enum.join(', ') : '',
          itemType: val.items ? val.items.type || 'string' : 'string'
        });
      });
    } else if (typeof parsed === 'object') {
      toolData.name = 'imported_custom_tool';
      toolData.parameters = [];

      Object.entries(parsed).forEach(([key, val], idx) => {
        let detectedType = 'string';
        if (typeof val === 'number') {
          detectedType = Number.isInteger(val) ? 'integer' : 'number';
        } else if (typeof val === 'boolean') {
          detectedType = 'boolean';
        } else if (Array.isArray(val)) {
          detectedType = 'array';
        } else if (typeof val === 'object' && val !== null) {
          detectedType = 'object';
        }

        toolData.parameters.push({
          id: 'imp_' + idx + '_' + Date.now().toString().slice(-4),
          name: key,
          type: detectedType,
          description: `Value for ${key}`,
          required: true,
          defaultValue: typeof val === 'object' ? '' : String(val),
          enums: '',
          itemType: 'string'
        });
      });
    }

    document.getElementById('toolName').value = toolData.name;
    document.getElementById('toolDesc').value = toolData.description;
    renderParameters();
    updateSchema();
    closeImportModal();
    showToast('Schema successfully imported!');
  } catch (err) {
    alert('Invalid JSON: ' + err.message);
  }
}

// Copy Code Helper
function copyCurrentCode() {
  const code = document.getElementById('codeOutput').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Code copied to clipboard!');
  });
}

// Toast Alert
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  msgEl.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// Load Pre-defined Template
function loadTemplate(key) {
  const tmpl = TEMPLATES[key];
  if (tmpl) {
    toolData = JSON.parse(JSON.stringify(tmpl));
    document.getElementById('toolName').value = toolData.name;
    document.getElementById('toolDesc').value = toolData.description;
    renderParameters();
    updateSchema();
    showToast(`Loaded ${tmpl.name} template!`);
  }
}

// Export Schema as JSON File
function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(generateMCPJsonSchema());
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${toolData.name}_mcp_schema.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`Exported ${toolData.name}_mcp_schema.json`);
}

// One-Click Starter Repo ZIP Generator (Client-Side via JSZip)
function downloadStarterZip(runtime = 'typescript') {
  if (typeof JSZip === 'undefined') {
    showToast('Loading ZIP compressor, please retry in a second...');
    return;
  }

  const zip = new JSZip();
  const toolName = toolData.name || 'my-mcp-tool';

  if (runtime === 'typescript') {
    const pkgJson = {
      name: `${toolName}-mcp-server`,
      version: "1.0.0",
      description: toolData.description,
      type: "module",
      main: "dist/index.js",
      scripts: {
        build: "tsc",
        start: "node dist/index.js",
        dev: "tsx src/index.ts"
      },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.6.1",
        "zod": "^3.24.2"
      },
      devDependencies: {
        "@types/node": "^22.13.0",
        "tsx": "^4.19.2",
        "typescript": "^5.7.3"
      }
    };

    const tsConfig = {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ["src/**/*"]
    };

    const readme = `# ${toolName} MCP Server

Built with [MCP Tool Schema Builder](https://seobegin.com/mcp-tool-builder/) using the official Model Context Protocol specifications.

## 🚀 Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Build the server:
\`\`\`bash
npm run build
\`\`\`

3. Connect to Claude Desktop:
Add the following to your \`claude_desktop_config.json\`:
\`\`\`json
{
  "mcpServers": {
    "${toolName}": {
      "command": "node",
      "args": ["${process.cwd ? process.cwd() : '/path/to'}/dist/index.js"]
    }
  }
}
\`\`\`
`;

    zip.file("package.json", JSON.stringify(pkgJson, null, 2));
    zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
    zip.file(".gitignore", "node_modules/\ndist/\n.env\n*.log\n");
    zip.file("README.md", readme);
    zip.file("src/index.ts", generateTypeScriptCode());
    zip.file("schema.json", generateMCPJsonSchema());

  } else {
    // Python FastMCP project
    const pyproject = `[project]
name = "${toolName}-mcp-server"
version = "0.1.0"
description = "${toolData.description}"
dependencies = [
    "mcp[cli]>=1.3.0",
    "pydantic>=2.0.0"
]
`;

    const requirements = `mcp[cli]>=1.3.0
pydantic>=2.0.0
`;

    const readme = `# ${toolName} FastMCP Python Server

Built with [MCP Tool Schema Builder](https://seobegin.com/mcp-tool-builder/) using FastMCP.

## 🚀 Quick Start

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run server directly:
\`\`\`bash
python server.py
\`\`\`

3. Run with MCP Inspector / Claude Desktop:
\`\`\`bash
mcp dev server.py
\`\`\`
`;

    zip.file("pyproject.toml", pyproject);
    zip.file("requirements.txt", requirements);
    zip.file(".gitignore", "__pycache__/\n.venv/\n.env\n*.pyc\n");
    zip.file("README.md", readme);
    zip.file("server.py", generatePythonCode());
    zip.file("schema.json", generateMCPJsonSchema());
  }

  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `${toolName}-${runtime}-mcp-starter.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Downloaded ${runtime} starter project .zip!`);
    closeStarterModal();
  });
}

// Shareable URL Hash Link
function copyShareLink() {
  const stateStr = btoa(encodeURIComponent(JSON.stringify(toolData)));
  const url = `${window.location.origin}${window.location.pathname}#state=${stateStr}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Sharable link copied to clipboard!');
  });
}

// Load state from URL hash if present
function loadFromURL() {
  if (window.location.hash.startsWith('#state=')) {
    try {
      const b64 = window.location.hash.replace('#state=', '');
      const decoded = JSON.parse(decodeURIComponent(atob(b64)));
      if (decoded && decoded.name && decoded.parameters) {
        toolData = decoded;
        document.getElementById('toolName').value = toolData.name;
        document.getElementById('toolDesc').value = toolData.description;
      }
    } catch (e) {
      console.warn('Could not parse shared URL state', e);
    }
  }
}

// Starter Modal Helpers
function openStarterModal() {
  const modal = document.getElementById('starterModal');
  if (modal) modal.classList.remove('hidden');
}

function closeStarterModal() {
  const modal = document.getElementById('starterModal');
  if (modal) modal.classList.add('hidden');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('hidden');
}

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, ' ');
}
