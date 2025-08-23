# 增强版 Obsidian MCP 服务器 - 25个高级AI工具

[![npm version](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp.svg)](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%E2%89%A516.0.0-brightgreen)](https://nodejs.org/)

[English](./README.md) | [中文](./README.zh.md) | [安装指南](./INSTALLATION.md)

## 🚀 项目概述

**增强版 Obsidian MCP 服务器**是一个强大的模型上下文协议(MCP)服务器，为AI模型与Obsidian知识库提供无缝集成。此增强版本包含**25个高级工具**，支持智能知识管理、自动内容分析和智能链接功能。

### ✨ v2.0.0 新特性
- 🧠 **15个全新AI增强工具**，用于智能内容分析
- 🔗 **智能自动链接**，具备高级模式识别功能
- 📊 **知识图谱生成**，可视化笔记关系
- 🏷️ **高级标签管理**，包含智能推荐功能
- 📝 **模板系统**，用于一致的笔记创建
- 🔍 **内容相似度分析**，基于TF-IDF和余弦相似度
- 📈 **关系分析**，发现隐藏的连接

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
```bash
# 全局安装
npm install -g @jianruidutong/obsidian-mcp

# 或使用npx（无需安装）
npx @jianruidutong/obsidian-mcp
```

### 方案2：从源码安装
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
npm install
npm run build
npm start
```

## ⚙️ 配置

### MCP客户端配置
在你的MCP客户端配置文件中添加：

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

### 环境变量
| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `OBSIDIAN_VAULT_PATH` | Obsidian知识库路径 | ✅ 是 | - |
| `OBSIDIAN_API_TOKEN` | 本地REST API令牌 | ✅ 是 | - |
| `OBSIDIAN_API_PORT` | API端口号 | ❌ 否 | 27123 |

## 📋 先决条件

1. **Node.js**（v16或更高版本）
2. **Obsidian桌面应用程序**
3. **Local REST API插件**已在Obsidian中安装

### 设置Obsidian Local REST API

1. 在Obsidian中安装"Local REST API"插件
2. 在插件设置中生成API令牌
3. 记录端口号（默认：27123）
4. 确保插件已启用

## 🔧 高级使用示例

### 📄 基础笔记操作
```javascript
// 列出特定文件夹中的所有笔记
const notes = await mcp.call('list_notes', {
  folder: 'projects/web-development'
});

// 读取指定笔记
const noteContent = await mcp.call('read_note', {
  path: 'daily/2024-01-15.md'
});

// 创建新笔记
await mcp.call('create_note', {
  path: 'ideas/new-project-idea.md',
  content: '# 新项目想法\n\n这是一个很棒的想法...'
});

// 更新现有笔记内容
await mcp.call('update_note', {
  path: 'daily/2024-01-15.md',
  edits: [
    {
      type: 'replace',
      search: '旧文本',
      replace: '新的更新文本'
    }
  ]
});

// 移动/重命名笔记
await mcp.call('move_note', {
  sourcePath: 'old-location/note.md',
  destinationPath: 'new-location/renamed-note.md'
});
```

### 📁 文件夹管理
```javascript
// 创建新的文件夹结构
await mcp.call('manage_folder', {
  operation: 'create',
  path: 'projects/new-project/docs'
});

// 在整个知识库中搜索
const searchResults = await mcp.call('search_vault', {
  query: '机器学习'
});
```

### 🏷️ 标签操作
```javascript
// 为笔记添加标签
await mcp.call('add_tags', {
  path: 'projects/web-app.md',
  tags: ['#project', '#web-development', '#javascript']
});

// 列出所有标签及使用统计
const tags = await mcp.call('list_tags', {
  sortBy: 'count',
  limit: 50
});

// 按指定标签查找笔记
const taggedNotes = await mcp.call('search_by_tags', {
  tags: ['project', 'web-development'],
  operator: 'AND'
});
```

### 智能自动链接
```javascript
// 自动检测并链接整个知识库中的笔记名称
await mcp.call('auto_backlink_vault', {
  dryRun: false,
  caseSensitive: false,
  wholeWords: true,
  minLength: 3,
  excludePatterns: ['templates/*', 'archive/*']
});
```

### 知识图谱生成
```javascript
// 生成可视化就绪的知识图谱数据
const graph = await mcp.call('generate_knowledge_graph', {
  format: 'cytoscape',
  includeOrphans: false
});
```

### AI内容分析
```javascript
// 提取关键词并查找相似内容
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

### 模板使用
```javascript
// 创建和应用模板
await mcp.call('create_template', {
  name: 'meeting-notes',
  content: '# {{title}}\n\n日期：{{date}}\n参与者：{{attendees}}\n\n## 议程\n\n## 笔记\n\n## 行动项\n',
  variables: ['title', 'date', 'attendees']
});

await mcp.call('apply_template', {
  templateName: 'meeting-notes',
  notePath: 'meetings/2024-01-15.md',
  variables: {
    title: '周例会',
    date: '2024-01-15',
    attendees: 'Alice, Bob, Charlie'
  }
});
```

## 🧪 测试

测试你的安装：
```bash
# 运行测试套件
npm test

# 测试特定功能
node test-mcp.js
```

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