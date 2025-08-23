# Enhanced Obsidian MCP Server - 25 Advanced AI Tools

[![npm version](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp.svg)](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%E2%89%A516.0.0-brightgreen)](https://nodejs.org/)

[English](./README.md) | [中文](./README.zh.md) | [Installation Guide](./INSTALLATION.md)

## 🚀 Overview

The **Enhanced Obsidian MCP Server** is a powerful Model Context Protocol (MCP) server that provides seamless integration between AI models and Obsidian knowledge bases. This enhanced version includes **25 advanced tools** that enable intelligent knowledge management, automated content analysis, and smart linking capabilities.

### ✨ What's New in v2.0.0
- 🧠 **15 New AI-Enhanced Tools** for intelligent content analysis
- 🔗 **Smart Auto-Linking** with advanced pattern recognition
- 📊 **Knowledge Graph Generation** for visualizing note relationships
- 🏷️ **Advanced Tag Management** with intelligent suggestions
- 📝 **Template System** for consistent note creation
- 🔍 **Content Similarity Analysis** using TF-IDF and cosine similarity
- 📈 **Relationship Analysis** for discovering hidden connections

## 🛠️ Complete Tool Suite (25 Tools)

### 📚 **Core Note Management (10 Tools)**

#### 📄 **Note Operations**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `list_notes` | List all notes in vault with optional folder filtering | Browse vault contents, filter by specific folders, get note metadata (size, dates, paths) |
| `read_note` | Read individual note content | Retrieve complete note content with metadata, file statistics, and modification history |
| `read_multiple_notes` | Batch read multiple notes simultaneously | Efficiently load multiple notes at once, perfect for content analysis or bulk operations |
| `create_note` | Create new notes with content | Generate new markdown files with specified content, automatic directory creation |
| `update_note` | Advanced content editing with precise positioning | Edit notes with surgical precision - replace text, insert at specific positions, delete sections |
| `delete_note` | Remove notes from vault | Safely delete notes with confirmation, maintains vault integrity |
| `move_note` | Rename or relocate notes | Move notes between folders, rename files, automatic link updates |

#### 📁 **Folder & Organization**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `manage_folder` | Full folder operations (create/rename/move/delete) | Complete folder management - create nested structures, reorganize vault hierarchy |
| `search_vault` | Full-text search across all content | Powerful search with regex support, context snippets, relevance scoring |
| `auto_backlink_vault` | Intelligent auto-linking with pattern recognition | Scan entire vault, detect note names in content, convert to [[wikilinks]] automatically |

### 🏷️ **Tag Management System (3 Tools)**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `add_tags` | Add multiple tags to notes | Insert hashtags into note frontmatter or content, support for nested tags (e.g., #project/web) |
| `list_tags` | List all tags with usage statistics | Comprehensive tag inventory with usage counts, sorting options, tag hierarchy analysis |
| `search_by_tags` | Advanced tag-based search with AND/OR operators | Complex tag queries - find notes with specific tag combinations, Boolean logic support |

### 📝 **Template System (4 Tools)**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `create_template` | Create reusable note templates with variables | Design dynamic templates with {{variables}}, support for dates, titles, custom placeholders |
| `list_templates` | Browse available templates | View all saved templates with metadata, usage statistics, and variable information |
| `apply_template` | Apply templates with variable substitution | Generate new notes from templates, automatic variable replacement, custom value injection |
| `delete_template` | Remove unused templates | Clean up template library, maintain template organization |

### 🧠 **AI Content Analysis (4 Tools)**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `extract_keywords` | Extract key terms using TF-IDF algorithm | Identify important keywords and phrases, statistical relevance scoring, configurable result count |
| `generate_summary` | Create intelligent content summaries | Automatic text summarization, extractive summary generation, customizable length |
| `suggest_tags` | AI-powered tag recommendations | Analyze content and suggest relevant tags, learn from existing tagging patterns |
| `find_similar_notes` | Discover similar content using cosine similarity | Content-based similarity matching, semantic analysis, threshold-based filtering |

### 📊 **Knowledge Graph & Analytics (4 Tools)**
| Tool | Description | Detailed Functionality |
|------|-------------|------------------------|
| `analyze_note_relationships` | Comprehensive relationship mapping | Map connections between notes, analyze link patterns, identify knowledge clusters |
| `generate_knowledge_graph` | Export graph data for visualization tools | Generate network data in JSON/Cytoscape formats, node/edge definitions, ready for D3.js/Gephi |
| `find_orphan_notes` | Identify isolated content | Detect notes without links, find disconnected content, vault completeness analysis |
| `suggest_connections` | AI-powered connection recommendations | Recommend potential links based on content similarity, discover hidden relationships |

## 🚀 Quick Start

### Option 1: NPM Installation (Recommended)
```bash
# Install globally
npm install -g @jianruidutong/obsidian-mcp

# Or use npx (no installation required)
npx @jianruidutong/obsidian-mcp
```

### Option 2: From Source
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
npm install
npm run build
npm start
```

## ⚙️ Configuration

### MCP Client Configuration
Add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": [
        "@jianruidutong/obsidian-mcp"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OBSIDIAN_VAULT_PATH` | Path to your Obsidian vault | ✅ Yes | - |
| `OBSIDIAN_API_TOKEN` | Local REST API token | ✅ Yes | - |
| `OBSIDIAN_API_PORT` | API port number | ❌ No | 27123 |

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Obsidian Desktop Application**
3. **Local REST API Plugin** installed in Obsidian

### Setting Up Obsidian Local REST API

1. Install the "Local REST API" plugin in Obsidian
2. Generate an API token in the plugin settings
3. Note the port number (default: 27123)
4. Ensure the plugin is enabled

## 🔧 Advanced Usage Examples

### 📄 Basic Note Operations
```javascript
// List all notes in a specific folder
const notes = await mcp.call('list_notes', {
  folder: 'projects/web-development'
});

// Read a specific note
const noteContent = await mcp.call('read_note', {
  path: 'daily/2024-01-15.md'
});

// Create a new note
await mcp.call('create_note', {
  path: 'ideas/new-project-idea.md',
  content: '# New Project Idea\n\nThis is a great idea for...'
});

// Update existing note content
await mcp.call('update_note', {
  path: 'daily/2024-01-15.md',
  edits: [
    {
      type: 'replace',
      search: 'old text',
      replace: 'new updated text'
    }
  ]
});

// Move/rename a note
await mcp.call('move_note', {
  sourcePath: 'old-location/note.md',
  destinationPath: 'new-location/renamed-note.md'
});
```

### 📁 Folder Management
```javascript
// Create a new folder structure
await mcp.call('manage_folder', {
  operation: 'create',
  path: 'projects/new-project/docs'
});

// Search across entire vault
const searchResults = await mcp.call('search_vault', {
  query: 'machine learning'
});
```

### 🏷️ Tag Operations
```javascript
// Add tags to a note
await mcp.call('add_tags', {
  path: 'projects/web-app.md',
  tags: ['#project', '#web-development', '#javascript']
});

// List all tags with usage statistics
const tags = await mcp.call('list_tags', {
  sortBy: 'count',
  limit: 50
});

// Find notes by specific tags
const taggedNotes = await mcp.call('search_by_tags', {
  tags: ['project', 'web-development'],
  operator: 'AND'
});
```

### Smart Auto-Linking
```javascript
// Automatically detect and link note names throughout your vault
await mcp.call('auto_backlink_vault', {
  dryRun: false,
  caseSensitive: false,
  wholeWords: true,
  minLength: 3,
  excludePatterns: ['templates/*', 'archive/*']
});
```

### Knowledge Graph Generation
```javascript
// Generate visualization-ready knowledge graph data
const graph = await mcp.call('generate_knowledge_graph', {
  format: 'cytoscape',
  includeOrphans: false
});
```

### AI Content Analysis
```javascript
// Extract keywords and find similar content
const keywords = await mcp.call('extract_keywords', {
  path: 'my-note.md',
  maxKeywords: 10
});

const similar = await mcp.call('find_similar_notes', {
  path: 'my-note.md',
  threshold: 0.3,
  maxResults: 5
});
```

### Template Usage
```javascript
// Create and apply templates
await mcp.call('create_template', {
  name: 'meeting-notes',
  content: '# {{title}}\n\nDate: {{date}}\nAttendees: {{attendees}}\n\n## Agenda\n\n## Notes\n\n## Action Items\n',
  variables: ['title', 'date', 'attendees']
});

await mcp.call('apply_template', {
  templateName: 'meeting-notes',
  notePath: 'meetings/2024-01-15.md',
  variables: {
    title: 'Weekly Team Meeting',
    date: '2024-01-15',
    attendees: 'Alice, Bob, Charlie'
  }
});
```

## 🧪 Testing

Test your installation:
```bash
# Run the test suite
npm test

# Test specific functionality
node test-mcp.js
```

## 📚 Documentation

- [📖 Complete Installation Guide](./INSTALLATION.md)
- [🔧 Configuration Reference](./docs/configuration.md)
- [🛠️ API Documentation](./docs/api.md)
- [🚀 Usage Examples](./docs/examples.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
npm install
npm run dev
```

## 🐛 Troubleshooting

### Common Issues

**Connection refused error:**
- Ensure Obsidian Local REST API plugin is installed and enabled
- Verify the API token and port number
- Check that Obsidian is running

**Permission denied:**
- Verify vault path permissions
- Ensure the API token has proper access rights

**Environment variables not working:**
- Use the `OBSIDIAN_` prefix for all environment variables
- Restart your MCP client after configuration changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://github.com/anthropics/model-context-protocol) by Anthropic
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin
- The Obsidian community for their invaluable feedback and support

## 📞 Support

- 🐛 [Report Issues](https://github.com/jianruidutong/obsidian-mcp/issues)
- 💬 [Discussions](https://github.com/jianruidutong/obsidian-mcp/discussions)

---

⭐ **Star this repository if you find it useful!** ⭐