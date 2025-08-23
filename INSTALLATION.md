# Complete Installation Guide

This guide provides **step-by-step installation instructions** for the Enhanced Obsidian MCP Server. Choose your preferred installation method and follow the detailed instructions.

> 📋 **Quick Overview**: For a brief project overview, see [README.md](./README.md)  
> 🔧 **Configuration Help**: For configuration details, see [Configuration Reference](./docs/configuration.md)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Prerequisites

### 1. Node.js Installation
Ensure you have Node.js v16 or higher installed:

```bash
# Check Node.js version
node --version

# If not installed, download from: https://nodejs.org/
```

### 2. Obsidian Setup
1. **Install Obsidian Desktop**: Download from [obsidian.md](https://obsidian.md)
2. **Create or Open a Vault**: Set up your knowledge base
3. **Install Local REST API Plugin**:
   - Open Obsidian Settings
   - Go to Community Plugins
   - Browse and install "Local REST API"
   - Enable the plugin

### 3. Configure Local REST API Plugin
1. Open the Local REST API plugin settings
2. Generate an API token (save this securely)
3. Note the port number (default: 27123)
4. Ensure CORS is enabled if needed

## Installation Methods

### Method 1: NPM Global Installation (Recommended)

#### Step 1: Install the Package
```bash
npm install -g @jianruidutong/obsidian-mcp
```

#### Step 2: Verify Installation
```bash
obsidian-mcp --version
```

#### Step 3: Configure Your MCP Client
Add this configuration to your MCP client:

```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "obsidian-mcp",
      "env": {
        "OBSIDIAN_VAULT_PATH": "/absolute/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_generated_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

### Method 2: NPX (No Installation Required)

#### Direct Usage
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": [
        "@jianruidutong/obsidian-mcp"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/absolute/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_generated_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

### Method 3: From Source

#### Step 1: Clone the Repository
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Build the Project
```bash
npm run build
```

#### Step 4: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

Example `.env` file:
```bash
OBSIDIAN_VAULT_PATH=/absolute/path/to/your/vault
OBSIDIAN_API_TOKEN=your_generated_api_token
OBSIDIAN_API_PORT=27123
```

#### Step 5: Start the Server
```bash
npm start
```

#### Step 6: Configure MCP Client
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "node",
      "args": ["/path/to/obsidian-mcp/build/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/absolute/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_generated_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

## Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OBSIDIAN_VAULT_PATH` | Absolute path to your Obsidian vault | ✅ | `/Users/john/Documents/MyVault` |
| `OBSIDIAN_API_TOKEN` | Token from Local REST API plugin | ✅ | `abc123def456...` |
| `OBSIDIAN_API_PORT` | Port for Local REST API | ❌ | `27123` (default) |

### Important Notes

1. **Use Absolute Paths**: Always use absolute paths for `OBSIDIAN_VAULT_PATH`
2. **Environment Variable Prefix**: All variables must use the `OBSIDIAN_` prefix
3. **Token Security**: Keep your API token secure and don't share it
4. **Path Separators**: Use forward slashes (/) even on Windows for better compatibility

### Platform-Specific Paths

#### Windows
```bash
OBSIDIAN_VAULT_PATH=C:/Users/Username/Documents/MyVault
```

#### macOS
```bash
OBSIDIAN_VAULT_PATH=/Users/Username/Documents/MyVault
```

#### Linux
```bash
OBSIDIAN_VAULT_PATH=/home/username/Documents/MyVault
```

## Verification

### Test the Installation

1. **Check if the server starts correctly**:
```bash
# For global installation
obsidian-mcp

# For source installation
npm start
```

2. **Run the test suite**:
```bash
npm test
```

3. **Test individual tools** using your MCP client or the test script:
```bash
node test-mcp.js
```

### Verify Tool Availability

Your MCP client should show all 25 tools:

**Core Tools (10):**
- list_notes, read_note, read_multiple_notes, create_note, update_note
- delete_note, move_note, manage_folder, search_vault, auto_backlink_vault

**Tag Management (3):**
- add_tags, list_tags, search_by_tags

**Templates (4):**
- create_template, list_templates, apply_template, delete_template

**AI Analysis (4):**
- extract_keywords, generate_summary, suggest_tags, find_similar_notes

**Knowledge Graph (4):**
- analyze_note_relationships, generate_knowledge_graph, find_orphan_notes, suggest_connections

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot connect to Obsidian" Error

**Symptoms:**
- Connection refused errors
- API timeout errors

**Solutions:**
1. Ensure Obsidian is running
2. Verify Local REST API plugin is enabled
3. Check if the port is correct (default: 27123)
4. Confirm the API token is valid

#### 2. "Invalid vault path" Error

**Symptoms:**
- Path not found errors
- Permission denied errors

**Solutions:**
1. Use absolute paths only
2. Ensure the path exists and is accessible
3. Check file permissions
4. Use forward slashes (/) in paths

#### 3. "Environment variables not working"

**Symptoms:**
- Configuration not being read
- Default values being used

**Solutions:**
1. Ensure all variables use the `OBSIDIAN_` prefix
2. Restart your MCP client after configuration changes
3. Check for typos in variable names
4. Verify the configuration file syntax

#### 4. "Tools not appearing"

**Symptoms:**
- Missing tools in MCP client
- Incomplete tool list

**Solutions:**
1. Ensure you're using the latest version
2. Check that the build completed successfully
3. Verify the installation method
4. Restart your MCP client

#### 5. "Permission denied" on macOS/Linux

**Symptoms:**
- EACCES errors
- Cannot execute file

**Solutions:**
```bash
# Make the file executable
chmod +x build/index.js

# Or reinstall with proper permissions
sudo npm install -g @jianruidutong/obsidian-mcp
```

### Debug Mode

Enable verbose logging by setting the environment variable:
```bash
DEBUG=obsidian-mcp:* npm start
```

### Getting Help

If you encounter issues:

1. **Check the logs**: Look for error messages in your MCP client logs
2. **Verify prerequisites**: Ensure all prerequisites are properly installed
3. **Test step by step**: Isolate the issue by testing each component
4. **Update dependencies**: Ensure you're using the latest versions

**Get Support:**
- 🐛 [Report Issues](https://github.com/jianruidutong/obsidian-mcp/issues)
- 💬 [Discussions](https://github.com/jianruidutong/obsidian-mcp/discussions)

## Advanced Configuration

### Custom Port Configuration

If port 27123 is in use:

1. Change the port in Obsidian Local REST API settings
2. Update your environment variable:
```bash
OBSIDIAN_API_PORT=8080
```

### Multiple Vault Support

To use multiple vaults, create separate configurations:

```json
{
  "mcpServers": {
    "obsidian-personal": {
      "command": "npx",
      "args": ["@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/personal/vault",
        "OBSIDIAN_API_TOKEN": "personal_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    },
    "obsidian-work": {
      "command": "npx",
      "args": ["@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/work/vault",
        "OBSIDIAN_API_TOKEN": "work_token",
        "OBSIDIAN_API_PORT": "27124"
      }
    }
  }
}
```

### Security Considerations

1. **Token Management**: Store API tokens securely
2. **Network Security**: Use HTTPS when possible
3. **Access Control**: Limit API access to trusted sources only
4. **Regular Updates**: Keep the package updated for security fixes

### Performance Optimization

1. **Vault Size**: Large vaults may impact performance
2. **Batch Operations**: Use batch operations for multiple files
3. **Indexing**: Consider vault organization for better search performance
4. **Memory Usage**: Monitor memory usage with large knowledge graphs

---

This completes the installation guide. For additional help, please refer to our documentation or contact support.