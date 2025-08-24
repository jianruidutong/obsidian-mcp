# Obsidian MCP 增强版服务器 - 25个AI智能工具

[![npm version](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp.svg)](https://badge.fury.io/js/@jianruidutong%2Fobsidian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%E2%89%A516.0.0-brightgreen)](https://nodejs.org/)

[English](./README.md) | 中文

这个项目实现了一个增强版 Model Context Protocol (MCP) 服务器，专为AI模型与Obsidian知识库的无缝集成而设计。提供**25个强大工具**，实现智能化知识管理、自动化内容分析和智能链接功能。
### ✨ 基础特性
- 🔗 **无缝 Obsidian 集成：**通过 MCP 协议直接访问 Obsidian 知识库
- 📝 **完整的笔记管理：**使用高级文本替换功能阅读、创建、更新和删除笔记
- 📁 **文件夹操作：**创建、重命名、移动和删除文件夹，并支持完整的层次结构
- 🔍 **智能搜索：**通过智能评分对所有文件类型进行全文搜索
- 🤖 **人工智能分析：**使用三难原则框架的全新战略洞察
- 🔗 **自动反向链接生成：**全新智能检测笔记名称并将其转换为 wikilinks
- ⚡ **精确编辑：**具有标题和块级定位的高级 PATCH 操作
- 🚀 **双 API 策略：**Obsidian REST API 结合文件系统回退，实现最大可靠性
- 🎯 **上下文优化：**用于 LLM 上下文长度管理的智能内容摘要
- 📊 **批处理：**高效的批量操作，并带有进度跟踪
### ✨ 新特性
- 🧠 **15个全新AI增强工具** 实现智能内容分析
- 🔗 **智能自动链接** 具备高级模式识别功能
- 📊 **知识图谱生成** 可视化笔记关系网络
- 🏷️ **高级标签管理** 智能标签推荐系统
- 📝 **模板系统** 一致性笔记创建
- 🔍 **内容相似度分析** 基于TF-IDF和余弦相似度
- 📈 **关系分析** 发现隐藏连接

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
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `add_tags` | 为笔记添加多个标签 | 在笔记前言或内容中插入井号标签，支持嵌套标签（如 #项目/网络） |
| `list_tags` | 列出所有标签及使用统计 | 全面标签清单，使用次数统计，排序选项，标签层次分析 |
| `search_by_tags` | 高级基于标签的搜索，支持AND/OR操作符 | 复杂标签查询 - 查找具有特定标签组合的笔记，支持布尔逻辑 |

### 📝 **模板系统（4个工具）**
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `create_template` | 创建可重用的笔记模板，支持变量 | 设计带有{{变量}}的动态模板，支持日期、标题、自定义占位符 |
| `list_templates` | 浏览可用模板 | 查看所有保存的模板及元数据、使用统计和变量信息 |
| `apply_template` | 应用模板并进行变量替换 | 从模板生成新笔记，自动变量替换，自定义值注入 |
| `delete_template` | 删除未使用的模板 | 清理模板库，维护模板组织结构 |

### 🧠 **AI内容分析（4个工具）**
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `extract_keywords` | 使用TF-IDF算法提取关键词 | 识别重要关键词和短语，统计相关性评分，可配置结果数量 |
| `generate_summary` | 创建智能内容摘要 | 自动文本摘要，提取式摘要生成，可自定义长度 |
| `suggest_tags` | AI驱动的标签推荐 | 分析内容并建议相关标签，从现有标签模式中学习 |
| `find_similar_notes` | 使用余弦相似度发现相似内容 | 基于内容的相似性匹配，语义分析，基于阈值的过滤 |

### 📊 **知识图谱与分析（4个工具）**
| 工具 | 描述 | 详细功能 |
|------|------|----------|
| `analyze_note_relationships` | 全面的关系映射 | 映射笔记间连接，分析链接模式，识别知识集群 |
| `generate_knowledge_graph` | 导出图数据供可视化工具使用 | 生成JSON/Cytoscape格式的网络数据，节点/边定义，兼容D3.js/Gephi |
| `find_orphan_notes` | 识别孤立内容 | 检测无链接的笔记，发现断开的内容，知识库完整性分析 |
| `suggest_connections` | AI驱动的连接推荐 | 基于内容相似性推荐潜在链接，发现隐藏关系 |

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

**Docker快速开始：**
```bash
git clone https://github.com/jianruidutong/obsidian-mcp.git
cd obsidian-mcp
cp .env.example .env
# 编辑 .env 设置知识库配置
docker-compose up -d
```

> 📚 **详细安装说明，请参阅 [安装指南](./INSTALLATION.md)**

## ⚙️ 配置

### MCP客户端配置

#### 方式1：NPM安装配置
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "npx",
      "args": ["-y", "@jianruidutong/obsidian-mcp"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

#### 方式2：源码安装配置
```json
{
  "mcpServers": {
    "obsidian-mcp": {
      "command": "node",
      "args": ["/path/to/obsidian-mcp/build/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/vault",
        "OBSIDIAN_API_TOKEN": "your_api_token",
        "OBSIDIAN_API_PORT": "27123"
      }
    }
  }
}
```

#### 方式3：Docker安装配置
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
**注意：**Docker部署时，环境变量在`.env`文件或`docker-compose.yml`中配置。

### 环境变量
| 变量名 | 描述 | 必需 | 默认值 |
|----------|------|------|----------|
| `OBSIDIAN_VAULT_PATH` | Obsidian知识库路径 | ✅ 是 | - |
| `OBSIDIAN_API_TOKEN` | Local REST API令牌 | ✅ 是 | - |
| `OBSIDIAN_API_PORT` | API端口号 | 🔧 建议 | 27123 |

> 🔧 **所有配置选项，请参阅 [配置参考](./docs/configuration.md)**

## 📋 前置条件

1. **Node.js**（v16或更高版本）
2. **Obsidian桌面应用程序**
3. **Local REST API插件** 已安装在Obsidian中

### 设置 Obsidian Local REST API

1. 在Obsidian中安装"Local REST API"插件
2. 在插件设置中生成API令牌
3. 记下端口号（默认：27123）
4. 确保插件已启用

## 📚 文档

- [📖 安装指南](./INSTALLATION.md) - 所有安装方法的完整指导
- [🔧 配置参考](./docs/configuration.md) - 详细配置选项和故障排除
- [🛠️ API文档](./docs/api.md) - 全部25个工具的完整API参考
- [🚀 使用示例](./docs/examples.md) - 实用示例和真实应用场景

## 🤝 贡献

欢迎贡献！请查看我们的 [贡献指南](./CONTRIBUTING.md) 了解详情。

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

> 🔍 **详细故障排除，请参阅 [配置参考](./docs/configuration.md)**

## 📄 许可证

本项目采用MIT许可证 - 详情请见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Model Context Protocol](https://github.com/anthropics/model-context-protocol) by Anthropic
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) 插件
- 原项目地址： https://github.com/newtype-01/obsidian-mcp

## 📞 支持

- 🐛 [报告问题](https://github.com/jianruidutong/obsidian-mcp/issues)
- 💬 [讨论](https://github.com/jianruidutong/obsidian-mcp/discussions)

---

⭐ **如果觉得有用，请给仓库点个星！** ⭐
