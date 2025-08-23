# 🔧 配置参考

本文档提供了Enhanced Obsidian MCP Server的完整配置参考，涵盖所有安装方式和配置选项。

## 📋 目录

1. [环境变量配置](#环境变量配置)
2. [MCP客户端配置](#mcp客户端配置)
3. [Docker配置](#docker配置)
4. [高级配置选项](#高级配置选项)
5. [故障排除](#故障排除)

---

## 🌍 环境变量配置

### 必需环境变量

| 变量名 | 描述 | 示例值 | 必需 |
|--------|------|--------|------|
| `OBSIDIAN_VAULT_PATH` | Obsidian知识库的绝对路径 | `/Users/username/Documents/MyVault` | ✅ |
| `OBSIDIAN_API_TOKEN` | Local REST API插件生成的令牌 | `abc123def456` | ✅ |
| `OBSIDIAN_API_PORT` | API服务端口号 | `27123` | ❌ |

### 可选环境变量

| 变量名 | 描述 | 默认值 | 示例值 |
|--------|------|--------|--------|
| `NODE_ENV` | Node.js运行环境 | `production` | `development` |
| `MCP_LOG_LEVEL` | 日志级别 | `info` | `debug`, `error` |
| `OBSIDIAN_TIMEOUT` | API请求超时(毫秒) | `30000` | `60000` |

### 环境变量设置方式

#### Windows
```cmd
set OBSIDIAN_VAULT_PATH=C:\Users\YourName\Documents\MyVault
set OBSIDIAN_API_TOKEN=your_token_here
set OBSIDIAN_API_PORT=27123
```

#### macOS/Linux
```bash
export OBSIDIAN_VAULT_PATH="/Users/YourName/Documents/MyVault"
export OBSIDIAN_API_TOKEN="your_token_here"
export OBSIDIAN_API_PORT="27123"
```

#### .env文件
创建`.env`文件：
```bash
OBSIDIAN_VAULT_PATH=/path/to/your/vault
OBSIDIAN_API_TOKEN=your_api_token_here
OBSIDIAN_API_PORT=27123
NODE_ENV=production
```

---

## 🔌 MCP客户端配置

### Claude Desktop配置

#### NPM安装方式
在Claude Desktop的配置文件中添加：

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": [
        "-y",
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

#### 全局安装方式
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "obsidian-mcp",
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

#### 源码安装方式
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "node",
      "args": [
        "/path/to/obsidian-mcp/build/index.js"
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

### 其他MCP客户端

#### Continue.dev配置
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/your/vault/path",
        "OBSIDIAN_API_TOKEN": "your_token"
      }
    }
  }
}
```

---

## 🐳 Docker配置

### Docker Compose配置

#### 基础配置
```yaml
version: '3.8'

services:
  obsidian-mcp:
    image: jianruidutong/obsidian-mcp:latest
    container_name: obsidian-mcp-server
    restart: unless-stopped
    network_mode: "host"
    environment:
      - NODE_ENV=production
      - OBSIDIAN_VAULT_PATH=/vault
      - OBSIDIAN_API_TOKEN=${OBSIDIAN_API_TOKEN}
      - OBSIDIAN_API_PORT=27123
    volumes:
      - ${OBSIDIAN_VAULT_PATH}:/vault:ro
    healthcheck:
      test: ["CMD", "node", "--version"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### 高级配置
```yaml
version: '3.8'

services:
  obsidian-mcp:
    build: .
    container_name: obsidian-mcp-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OBSIDIAN_VAULT_PATH=/vault
      - OBSIDIAN_API_TOKEN=${OBSIDIAN_API_TOKEN}
      - OBSIDIAN_API_PORT=27123
      - MCP_LOG_LEVEL=info
    volumes:
      - ${OBSIDIAN_VAULT_PATH}:/vault:ro
      - ./logs:/app/logs
    networks:
      - obsidian-network
    depends_on:
      - redis  # 可选：如果需要缓存
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  obsidian-network:
    driver: bridge
```

### 环境变量文件(.env)
```bash
# Obsidian配置
OBSIDIAN_VAULT_PATH=/path/to/your/vault
OBSIDIAN_API_TOKEN=your_api_token_here
OBSIDIAN_API_PORT=27123

# Docker配置
COMPOSE_PROJECT_NAME=obsidian-mcp
DOCKER_RESTART_POLICY=unless-stopped

# 可选配置
NODE_ENV=production
MCP_LOG_LEVEL=info
OBSIDIAN_TIMEOUT=30000
```

---

## ⚙️ 高级配置选项

### 性能优化配置

#### 内存限制
```bash
# 限制Node.js内存使用
NODE_OPTIONS="--max-old-space-size=512" npx @jianruidutong/obsidian-mcp
```

#### 并发限制
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": ["@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/vault",
        "OBSIDIAN_API_TOKEN": "token",
        "OBSIDIAN_MAX_CONCURRENT_REQUESTS": "5"
      }
    }
  }
}
```

### 安全配置

#### API令牌安全
- 使用强随机令牌
- 定期轮换令牌
- 限制令牌权限范围

#### 网络安全
```yaml
# Docker网络隔离
networks:
  obsidian-internal:
    driver: bridge
    internal: true
```

---

## 🔍 故障排除

### 常见配置问题

#### 1. 路径格式错误
**问题**: 路径包含反斜杠或空格
```json
// ❌ 错误
"OBSIDIAN_VAULT_PATH": "C:\\Users\\Name\\My Vault"

// ✅ 正确
"OBSIDIAN_VAULT_PATH": "C:/Users/Name/My Vault"
```

#### 2. API端口冲突
**问题**: 端口被其他服务占用
**解决**: 检查端口占用并更改端口
```bash
# 检查端口占用
netstat -an | findstr :27123

# 更改端口
"OBSIDIAN_API_PORT": "27124"
```

#### 3. 令牌无效
**问题**: API令牌过期或错误
**解决**: 重新生成令牌
1. 在Obsidian中打开Local REST API插件设置
2. 点击"Generate New Token"
3. 复制新令牌到配置文件

### 配置验证

#### 验证环境变量
```bash
# Windows
echo %OBSIDIAN_VAULT_PATH%

# macOS/Linux
echo $OBSIDIAN_VAULT_PATH
```

#### 验证MCP连接
```bash
# 测试服务器启动
npx @jianruidutong/obsidian-mcp --test

# 查看日志
npx @jianruidutong/obsidian-mcp --verbose
```

### 调试配置

#### 启用详细日志
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": ["@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/vault",
        "OBSIDIAN_API_TOKEN": "token",
        "MCP_LOG_LEVEL": "debug",
        "DEBUG": "obsidian-mcp:*"
      }
    }
  }
}
```

---

## 📝 配置模板

### 快速开始模板
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": ["-y", "@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "替换为你的知识库路径",
        "OBSIDIAN_API_TOKEN": "替换为你的API令牌",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

### 生产环境模板
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "obsidian-mcp",
      "env": {
        "NODE_ENV": "production",
        "OBSIDIAN_VAULT_PATH": "/production/vault/path",
        "OBSIDIAN_API_TOKEN": "production_token",
        "OBSIDIAN_API_PORT": "27123",
        "MCP_LOG_LEVEL": "warn",
        "OBSIDIAN_TIMEOUT": "60000"
      }
    }
  }
}
```

---

## 🔗 相关链接

- [安装指南](../INSTALLATION.md)
- [API文档](./api.md)
- [使用示例](./examples.md)
- [故障排除指南](../README.md#troubleshooting)