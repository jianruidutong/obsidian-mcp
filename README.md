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
| Tool | Description | Use Case |
|------|-------------|----------|
| `list_notes` | List all notes in vault with optional folder filtering | Browse and organize content |
| `read_note` | Read individual note content | Content retrieval and analysis |
| `read_multiple_notes` | Batch read multiple notes simultaneously | Efficient bulk operations |
| `create_note` | Create new notes with content | Content creation workflows |
| `update_note` | Advanced content editing with precise positioning | Targeted content updates |
| `delete_note` | Remove notes from vault | Content cleanup |
| `move_note` | Rename or relocate notes | Organization and restructuring |
| `manage_folder` | Full folder operations (create/rename/move/delete) | Vault structure management |
| `search_vault` | Full-text search across all content | Information discovery |
| `auto_backlink_vault` | Intelligent auto-linking with pattern recognition | Automated relationship building |

### 🏷️ **Tag Management System (3 Tools)**
| Tool | Description | Advanced Features |
|------|-------------|-------------------|
| `add_tags` | Add multiple tags to notes | Bulk tagging operations |
| `list_tags` | List all tags with usage statistics | Tag analytics and insights |
| `search_by_tags` | Advanced tag-based search with AND/OR operators | Complex filtering |

### 📝 **Template System (4 Tools)**
| Tool | Description | Smart Features |
|------|-------------|----------------|
| `create_template` | Create reusable note templates with variables | Dynamic content generation |
| `list_templates` | Browse available templates | Template management |
| `apply_template` | Apply templates with variable substitution | Automated note creation |
| `delete_template` | Remove unused templates | Template cleanup |

### 🧠 **AI Content Analysis (4 Tools)**
| Tool | Description | AI Technology |
|------|-------------|---------------|
| `extract_keywords` | Extract key terms using TF-IDF algorithm | Statistical analysis |
| `generate_summary` | Create intelligent content summaries | Natural language processing |
| `suggest_tags` | AI-powered tag recommendations | Content understanding |
| `find_similar_notes` | Discover similar content using cosine similarity | Semantic analysis |

### 📊 **Knowledge Graph & Analytics (4 Tools)**
| Tool | Description | Visualization Ready |
|------|-------------|-------------------|
| `analyze_note_relationships` | Comprehensive relationship mapping | Network analysis |
| `generate_knowledge_graph` | Export graph data for visualization tools | Cytoscape/D3.js compatible |
| `find_orphan_notes` | Identify isolated content | Content audit |
| `suggest_connections` | AI-powered connection recommendations | Relationship discovery |

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