# Obsidian MCP (Model Context Protocol) 服务器 - 增强版

[English](./README.md) | 中文 | [📚 完整安装指南](./COMPLETE_GUIDE.md)

这个项目实现了一个增强版 Model Context Protocol (MCP) 服务器，用于连接 AI 模型与 Obsidian 知识库。通过这个服务器，AI 模型可以直接访问和操作 Obsidian 笔记，包括读取、创建、更新和删除笔记，以及管理文件夹结构。

**增强版特色：在原有10个基础工具基础上，新增15个AI智能工具，总共提供25个强大功能。**

## 功能特点

- 与 Obsidian 知识库的无缝集成
- 支持笔记的读取、创建、更新和删除
- 支持文件夹的创建、重命名、移动和删除
- 支持全文搜索功能
- 🆕 智能自动链接 - 自动检测笔记名称并转换为 wikilink
- 🆕 高级标签管理 - AI驱动的标签推荐和批量标签操作
- 🆕 模板系统 - 支持变量替换的动态模板创建和应用
- 🆕 AI内容分析 - TF-IDF关键词提取、智能摘要、相似度分析
- 🆕 知识图谱生成 - 导出可视化就绪的图谱数据
- 🆕 关系分析 - 发现笔记间的隐藏连接和孤立内容
- 符合 Model Context Protocol 规范

## 🛠️ 完整工具套件（25个工具）

### 📚 **核心笔记管理（10个工具）**

#### 📄 **笔记操作**
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `list_notes` | 列出知识库中的所有笔记，支持文件夹过滤 | 浏览库内容，按文件夹过滤，获取笔记元数据（大小、日期、路径） |
| `read_note` | 读取单个笔记内容 | 获取完整笔记内容及元数据、文件统计信息和修改历史 |
| `read_multiple_notes` | 批量同时读取多个笔记 | 高效加载多个笔记，适用于内容分析或批量操作 |
| `create_note` | 创建带有内容的新笔记 | 生成新的markdown文件，自动创建目录结构 |
| `update_note` | 高级内容编辑，支持精确定位 | 精准编辑笔记 - 替换文本、在指定位置插入、删除片段 |
| `delete_note` | 从知识库中删除笔记 | 安全删除笔记，保持库的完整性 |
| `move_note` | 重命名或移动笔记 | 在文件夹间移动笔记，重命名文件，自动更新链接 |

#### 📁 **文件夹与组织**
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `manage_folder` | 完整文件夹操作（创建/重命名/移动/删除） | 完整文件夹管理 - 创建嵌套结构，重组知识库层次 |
| `search_vault` | 全文搜索所有内容 | 强大搜索支持正则表达式，上下文片段，相关性评分 |
| `auto_backlink_vault` | 智能自动链接，具备模式识别功能 | 扫描整个知识库，检测内容中的笔记名称，自动转换为[[维基链接]] |

### 🏷️ **标签管理系统（3个工具）**
| 工具 | 描述 | 高级功能 |
|------|------|----------|
| `add_tags` | 为笔记添加多个标签 | 批量标签操作 |
| `list_tags` | 列出所有标签及使用统计 | 标签分析和洞察 |
| `search_by_tags` | 高级基于标签的搜索，支持AND/OR操作符 | 复杂过滤 |

### 📝 **模板系统（4个工具）**
| 工具 | 描述 | 智能功能 |
|------|------|----------|
| `create_template` | 创建可重用的笔记模板，支持变量 | 动态内容生成 |
| `list_templates` | 浏览可用模板 | 模板管理 |
| `apply_template` | 应用模板并进行变量替换 | 自动笔记创建 |
| `delete_template` | 删除未使用的模板 | 模板清理 |

### 🧠 **AI内容分析（4个工具）**
| 工具 | 描述 | AI技术 |
|------|------|--------|
| `extract_keywords` | 使用TF-IDF算法提取关键词 | 统计分析 |
| `generate_summary` | 创建智能内容摘要 | 自然语言处理 |
| `suggest_tags` | AI驱动的标签推荐 | 内容理解 |
| `find_similar_notes` | 使用余弦相似度发现相似内容 | 语义分析 |

### 📊 **知识图谱与分析（4个工具）**
| 工具 | 描述 | 可视化就绪 |
|------|------|------------|
| `analyze_note_relationships` | 全面的关系映射 | 网络分析 |
| `generate_knowledge_graph` | 导出图数据供可视化工具使用 | 兼容Cytoscape/D3.js |
| `find_orphan_notes` | 识别孤立内容 | 内容审计 |
| `suggest_connections` | AI驱动的连接推荐 | 关系发现 |

## 🚀 快速开始

### 方案1：NPM安装（推荐）

**全局安装：**
```bash
npm install -g @jianruidutong/obsidian-mcp
```

**或使用npx（无需安装）：**
```bash
npx @jianruidutong/obsidian-mcp
```

### 方案2：从源码安装

**克隆并构建：**
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
npm install
npm run build
npm start
```

### 方案3：Docker安装

#### 使用 Docker Compose（推荐）

**克隆项目：**
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
```

**配置环境变量：**
```bash
cp .env.example .env
nano .env
```

**启动容器：**
```bash
docker-compose up -d
```

.env 文件示例：
```bash
OBSIDIAN_VAULT_PATH=/path/to/your/vault
OBSIDIAN_API_TOKEN=your_api_token_here
OBSIDIAN_API_PORT=27123
```

#### 使用 Docker 命令

**构建镜像：**
```bash
docker build -t obsidian-mcp .
```

**运行容器：**
```bash
docker run -d \
  --name obsidian-mcp \
  --network host \
  -e OBSIDIAN_VAULT_PATH=/path/to/your/vault \
  -e OBSIDIAN_API_TOKEN=your_token \
  -e OBSIDIAN_API_PORT=27123 \
  -v /path/to/your/vault:/path/to/your/vault \
  obsidian-mcp
```

## ⚙️ 配置

### MCP客户端配置

#### 方案1：NPM安装配置
在你的MCP客户端配置文件中添加：

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

#### 方案2：本地源码安装配置
用于本地源码安装：

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

#### 方案3：Docker安装配置
用于Docker部署：

```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "docker",
      "args": [
        "exec",
        "-i",
        "obsidian-mcp-server",
        "npm",
        "start"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**注意：** Docker配置中，环境变量通过`.env`文件或`docker-compose.yml`在容器中设置。

### 环境变量
| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `OBSIDIAN_VAULT_PATH` | Obsidian知识库路径 | ✅ 是 | - |
| `OBSIDIAN_API_TOKEN` | 本地REST API令牌 | ✅ 是 | - |
| `OBSIDIAN_API_PORT` | API端口号 | 🔧 建议 | 27123 |

## 📋 先决条件

1. **Node.js**（v16或更高版本）
2. **Obsidian桌面应用程序**
3. **Local REST API插件**已在Obsidian中安装

### 设置Obsidian Local REST API

1. 在Obsidian中安装"Local REST API"插件
2. 在插件设置中生成API令牌
3. 记录端口号（默认：27123）
4. 确保插件已启用

## 支持的工具

MCP 服务器提供以下工具：

**基础笔记管理：**
- `list_notes`: 列出知识库中的所有笔记
- `read_note`: 读取指定笔记的内容
- `read_multiple_notes`: 批量读取多个笔记内容
- `create_note`: 创建新笔记
- `update_note`: 更新现有笔记
- `delete_note`: 删除笔记
- `move_note`: 移动/重命名笔记
- `manage_folder`: 管理文件夹 (创建、重命名、移动、删除)
- `search_vault`: 在知识库中搜索内容

**AI增强功能：**
- `auto_backlink_vault`: 智能自动链接检测
- `add_tags`: 添加标签到笔记
- `list_tags`: 列出所有标签及统计
- `search_by_tags`: 基于标签搜索
- `create_template`: 创建笔记模板
- `list_templates`: 列出可用模板
- `apply_template`: 应用模板创建笔记
- `delete_template`: 删除模板
- `extract_keywords`: TF-IDF关键词提取
- `generate_summary`: 生成内容摘要
- `suggest_tags`: AI标签推荐
- `find_similar_notes`: 查找相似笔记
- `analyze_note_relationships`: 分析笔记关系
- `generate_knowledge_graph`: 生成知识图谱
- `find_orphan_notes`: 查找孤立笔记
- `suggest_connections`: 推荐潜在连接

## 📚 文档

- [📖 完整安装指南](./INSTALLATION.md)
- [🔧 配置参考](./docs/configuration.md)
- [🛠️ API文档](./docs/api.md)
- [🚀 使用示例](./docs/examples.md)

## 🤝 贡献

欢迎贡献！请查看我们的[贡献指南](./CONTRIBUTING.md)了解详情。

### 开发环境设置
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
npm install
npm run dev
```

## 🐛 故障排除

### 常见问题

**连接被拒绝错误：**
- 确保Obsidian Local REST API插件已安装并启用
- 验证API令牌和端口号
- 检查Obsidian是否正在运行

**权限被拒绝：**
- 验证知识库路径权限
- 确保API令牌具有适当的访问权限

**环境变量不工作：**
- 对所有环境变量使用`OBSIDIAN_`前缀
- 配置更改后重启MCP客户端

## 📄 许可证

此项目基于MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

## 🙏 致谢

- [Model Context Protocol](https://github.com/anthropics/model-context-protocol) by Anthropic
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) 插件
- Obsidian社区的宝贵反馈和支持

## 📞 支持

- 🐛 [报告问题](https://github.com/jianruidutong/obsidian-mcp/issues)
- 💬 [讨论](https://github.com/jianruidutong/obsidian-mcp/discussions)

---

⭐ **如果你觉得这个项目有用，请给它一个Star！** ⭐