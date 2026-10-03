/**
 * Interactive MCP Tool Schema Builder
 * 100% Client-Side Model Context Protocol Schema Generator
 */

// Application State
let currentTab = 'json';
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
      type: 'number',
      description: 'Maximum time to wait for the HTTP response in milliseconds.',
      required: false,
      defaultValue: '5000',
      enums: '',
      itemType: 'string'
    }
  ]
};

// Available Templates
const TEMPLATES = {
  webScraper: {
    name: 'fetch_web_page',
    description: 'Fetches the text and HTML content of a given URL, strips tracking scripts, and returns clean markdown.',
    parameters: [
      { id: 't1', name: 'url', type: 'string', description: 'The complete HTTP or HTTPS URL to fetch.', required: true, defaultValue: '', enums: '', itemType: 'string' },
      { id: 't2', name: 'format', type: 'string', description: 'Target format of extracted content.', required: false, defaultValue: 'markdown', enums: 'markdown, text, raw_html', itemType: 'string' },
      { id: 't3', name: 'timeout_ms', type: 'number', description: 'Maximum network timeout in milliseconds.', required: false, defaultValue: '10000', enums: '', itemType: 'string' }
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

// Render Dynamic Parameter Input Rows (Clean Light & Dark Theme Support)
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
    lucide.createIcons();
    return;
  }

  container.innerHTML = toolData.parameters.map((param, index) => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition shadow-sm hover:border-slate-300 dark:hover:border-slate-700 space-y-3 relative group" id="param-card-${param.id}">
      
      <!-- Top Row: Name, Type, Required Toggle, Delete -->
      <div class="grid grid-cols-12 gap-2.5 items-center">
        <!-- Param Name -->
        <div class="col-span-5">
          <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Name <span class="text-rose-500">*</span></label>
          <input type="text" value="${escapeHtml(param.name)}" oninput="updateParam('${param.id}', 'name', this.value)" placeholder="e.g. query, limit"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-brand-500">
        </div>

        <!-- Type Selector -->
        <div class="col-span-4">
          <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Type</label>
          <select onchange="updateParam('${param.id}', 'type', this.value)"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500">
            <option value="string" ${param.type === 'string' ? 'selected' : ''}>string</option>
            <option value="number" ${param.type === 'number' ? 'selected' : ''}>number (float)</option>
            <option value="integer" ${param.type === 'integer' ? 'selected' : ''}>integer</option>
            <option value="boolean" ${param.type === 'boolean' ? 'selected' : ''}>boolean</option>
            <option value="array" ${param.type === 'array' ? 'selected' : ''}>array</option>
            <option value="object" ${param.type === 'object' ? 'selected' : ''}>object</option>
          </select>
        </div>

        <!-- Required Checkbox -->
        <div class="col-span-2 flex flex-col items-center justify-center pt-2">
          <label class="flex items-center space-x-1.5 cursor-pointer">
            <input type="checkbox" ${param.required ? 'checked' : ''} onchange="updateParam('${param.id}', 'required', this.checked)"
              class="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-950 w-3.5 h-3.5">
            <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300">Req</span>
          </label>
        </div>

        <!-- Delete Button -->
        <div class="col-span-1 flex justify-end pt-2">
          <button onclick="removeParameter('${param.id}')" class="text-slate-400 hover:text-rose-500 transition p-1" title="Delete parameter">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>

      <!-- Second Row: Description (Crucial for LLM Function Calling) -->
      <div>
        <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
          Description <span class="${param.description.trim() ? 'text-slate-400' : 'text-amber-500 font-bold'}">*</span>
          <span class="text-[10px] text-slate-400 font-normal">(Informs the AI agent what value to supply)</span>
        </label>
        <input type="text" value="${escapeHtml(param.description)}" oninput="updateParam('${param.id}', 'description', this.value)"
          placeholder="e.g. Target filter for query..."
          class="w-full bg-slate-50 dark:bg-slate-950 border ${param.description.trim() ? 'border-slate-300 dark:border-slate-700' : 'border-amber-400 dark:border-amber-500'} rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500">
      </div>

      <!-- Third Row (Enums & Default Value) -->
      <div class="grid grid-cols-12 gap-2.5 pt-0.5 text-xs">
        <div class="col-span-6">
          <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Allowed Values (comma-separated enums)</label>
          <input type="text" value="${escapeHtml(param.enums || '')}" oninput="updateParam('${param.id}', 'enums', this.value)" placeholder="e.g. asc, desc"
            class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-brand-500">
        </div>

        <div class="col-span-6">
          <label class="block text-[10px] font-medium text-slate-500 mb-0.5">Default Value</label>
          <input type="text" value="${escapeHtml(param.defaultValue || '')}" oninput="updateParam('${param.id}', 'defaultValue', this.value)" placeholder="e.g. 10 or 'markdown'"
            class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-brand-500">
        </div>
      </div>

    </div>
  `).join('');

  lucide.createIcons();
}

// Add New Parameter
function addParameter() {
  const newId = 'param_' + Date.now();
  toolData.parameters.push({
    id: newId,
    name: 'param_' + (toolData.parameters.length + 1),
    type: 'string',
    description: '',
    required: false,
    defaultValue: '',
    enums: '',
    itemType: 'string'
  });
  renderParameters();
  updateSchema();
  setTimeout(() => {
    const card = document.getElementById(`param-card-${newId}`);
    if (card) card.querySelector('input')?.focus();
  }, 50);
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

// Update Global Tool Schema
function updateSchema() {
  toolData.name = document.getElementById('toolName').value.trim() || 'unnamed_tool';
  toolData.description = document.getElementById('toolDesc').value.trim() || '';

  runDiagnostics();
  renderCode();
}

// Real-Time Schema Diagnostics / Linter
function runDiagnostics() {
  const container = document.getElementById('diagnosticsList');
  const pill = document.getElementById('validationPill');
  const issues = [];

  if (!/^[a-zA-Z0-9_-]+$/.test(toolData.name)) {
    issues.push({
      type: 'error',
      msg: 'Tool name contains spaces or special characters. Use snake_case or kebab-case.'
    });
  }

  if (toolData.description.length < 15) {
    issues.push({
      type: 'warning',
      msg: 'Tool description is short. LLMs need rich descriptions to know when to trigger this tool.'
    });
  }

  const missingDesc = toolData.parameters.filter(p => !p.description.trim());
  if (missingDesc.length > 0) {
    issues.push({
      type: 'warning',
      msg: `${missingDesc.length} parameter(s) missing descriptions (${missingDesc.map(p => p.name).join(', ')}). LLMs hallucinate arguments without descriptions.`
    });
  }

  const duplicateNames = toolData.parameters.map(p => p.name).filter((name, idx, arr) => arr.indexOf(name) !== idx && name);
  if (duplicateNames.length > 0) {
    issues.push({
      type: 'error',
      msg: `Duplicate parameter names detected: ${[...new Set(duplicateNames)].join(', ')}.`
    });
  }

  if (issues.length === 0) {
    pill.className = "text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1";
    pill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Valid MCP Schema</span>`;
    container.innerHTML = `
      <div class="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
        <i data-lucide="check" class="w-3.5 h-3.5"></i>
        <span>Schema is clean and compliant with Model Context Protocol standards.</span>
      </div>
    `;
  } else {
    const hasError = issues.some(i => i.type === 'error');
    pill.className = hasError 
      ? "text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center space-x-1"
      : "text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 flex items-center space-x-1";
    pill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${hasError ? 'bg-rose-500' : 'bg-amber-500'}"></span><span>${issues.length} Recommendation(s)</span>`;
    
    container.innerHTML = issues.map(item => `
      <div class="flex items-start space-x-1.5 ${item.type === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}">
        <i data-lucide="${item.type === 'error' ? 'x-circle' : 'alert-triangle'}" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0"></i>
        <span>${item.msg}</span>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

// Generate Code for Current Tab
function renderCode() {
  const codeEl = document.getElementById('codeOutput');
  const filenameEl = document.getElementById('tabFilename');
  const specEl = document.getElementById('tabSpec');
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
      filenameEl.textContent = 'claude_desktop_config.json';
      specEl.textContent = 'Claude Desktop / Antigravity Config';
      lang = 'json';
      code = generateConfigSnippet();
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

// 2. Generate TypeScript + Zod Server Code
function generateTypeScriptCode() {
  const zodProps = toolData.parameters.map(p => {
    if (!p.name) return '';
    let zType = `z.${p.type === 'integer' ? 'number().int()' : p.type}()`;

    if (p.enums && p.enums.trim()) {
      const enumVals = p.enums.split(',').map(e => `"${e.trim()}"`).join(', ');
      zType = `z.enum([${enumVals}])`;
    }

    if (p.description) {
      zType += `.describe("${escapeQuotes(p.description)}")`;
    }

    if (!p.required) {
      if (p.defaultValue) {
        const def = p.type === 'number' || p.type === 'integer' ? p.defaultValue : `"${p.defaultValue}"`;
        zType += `.default(${def})`;
      } else {
        zType += `.optional()`;
      }
    }

    return `    ${p.name}: ${zType}`;
  }).filter(Boolean).join(',\n');

  const argsDestructured = toolData.parameters.map(p => p.name).filter(Boolean).join(', ');

  return `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Initialize your MCP Server instance
const server = new McpServer({
  name: "custom-mcp-server",
  version: "1.0.0"
});

/**
 * Tool: ${toolData.name}
 * ${toolData.description}
 */
server.tool(
  "${toolData.name}",
  "${escapeQuotes(toolData.description)}",
  {
${zodProps}
  },
  async ({ ${argsDestructured} }) => {
    try {
      // 🚀 Place your business logic here (e.g. database query, API fetch, or file system access)
      const result = {
        status: "success",
        data: { ${argsDestructured} },
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: \`Error executing ${toolData.name}: \${error.message}\`
          }
        ]
      };
    }
  }
);
`;
}

// 3. Generate Python (FastMCP) Code
function generatePythonCode() {
  const typeMap = {
    string: 'str',
    number: 'float',
    integer: 'int',
    boolean: 'bool',
    array: 'list[str]',
    object: 'dict'
  };

  const pyArgs = toolData.parameters.map(p => {
    if (!p.name) return '';
    const pyType = typeMap[p.type] || 'str';
    if (!p.required) {
      const defVal = p.defaultValue ? (p.type === 'string' ? `"${p.defaultValue}"` : p.defaultValue) : 'None';
      return `${p.name}: ${pyType} | None = ${defVal}`;
    }
    return `${p.name}: ${pyType}`;
  }).filter(Boolean).join(', ');

  const docArgs = toolData.parameters.map(p => `        ${p.name}: ${p.description || 'Parameter description.'}`).join('\n');

  return `from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("CustomToolSuite")

@mcp.tool()
def ${toolData.name}(${pyArgs}) -> str:
    """
    ${toolData.description}

    Args:
${docArgs}
    """
    # 🚀 Implement your execution logic here
    # Returns string or JSON string to the agent
    return f"Successfully executed ${toolData.name} with inputs."
`;
}

// 4. Generate Claude Desktop / Antigravity MCP Config Snippet
function generateConfigSnippet() {
  const config = {
    mcpServers: {
      "my-tool-server": {
        command: "node",
        args: ["./dist/index.js"],
        env: {
          API_KEY: "your_api_key_here"
        }
      }
    }
  };

  return `// Save this inside your configuration file:
// - Claude Desktop: %APPDATA%\\Claude\\claude_desktop_config.json (Windows) or ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// - Antigravity: .agents/settings.json or ~/.gemini/antigravity/mcp/settings.json

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

// Import JSON or Schema
function processImport() {
  const raw = document.getElementById('importInput').value.trim();
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    
    // Check if it's already an MCP Tool Schema
    if (parsed.name && (parsed.inputSchema || parsed.properties)) {
      toolData.name = parsed.name;
      if (parsed.description) toolData.description = parsed.description;
      const schemaProps = parsed.inputSchema ? parsed.inputSchema.properties : parsed.properties;
      const requiredList = parsed.inputSchema ? (parsed.inputSchema.required || []) : (parsed.required || []);
      
      toolData.parameters = Object.keys(schemaProps || {}).map((key, i) => {
        const item = schemaProps[key];
        return {
          id: 'imp_' + i + '_' + Date.now(),
          name: key,
          type: item.type || 'string',
          description: item.description || '',
          required: requiredList.includes(key),
          defaultValue: item.default !== undefined ? String(item.default) : '',
          enums: item.enum ? item.enum.join(', ') : '',
          itemType: item.items ? item.items.type : 'string'
        };
      });
    } else {
      // It's a sample JSON payload
      toolData.name = 'imported_custom_tool';
      toolData.parameters = Object.keys(parsed).map((key, i) => {
        const val = parsed[key];
        let pType = typeof val;
        if (Array.isArray(val)) pType = 'array';
        if (pType === 'number' && Number.isInteger(val)) pType = 'integer';

        return {
          id: 'imp_' + i + '_' + Date.now(),
          name: key,
          type: pType,
          description: `Value for ${key}`,
          required: true,
          defaultValue: String(val),
          enums: '',
          itemType: 'string'
        };
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

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, ' ');
}
