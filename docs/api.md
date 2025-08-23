# 🛠️ API文档

本文档详细描述了Enhanced Obsidian MCP Server提供的25个AI工具的API接口，包括参数说明、返回值格式和使用示例。

## 📋 目录

1. [API概述](#api概述)
2. [核心笔记管理工具 (10个)](#核心笔记管理工具)
3. [标签管理系统 (3个)](#标签管理系统)
4. [模板系统 (4个)](#模板系统)
5. [AI内容分析 (4个)](#ai内容分析)
6. [知识图谱与分析 (4个)](#知识图谱与分析)
7. [错误处理](#错误处理)
8. [最佳实践](#最佳实践)

---

## 🔍 API概述

### 调用方式
所有工具通过Model Context Protocol (MCP)调用，支持JSON-RPC 2.0协议。

### 通用响应格式
```json
{
  "content": [
    {
      "type": "text", 
      "text": "响应内容"
    }
  ]
}
```

### 错误响应格式
```json
{
  "error": {
    "code": -32000,
    "message": "错误描述",
    "data": {
      "details": "详细错误信息"
    }
  }
}
```

---

## 📚 核心笔记管理工具

### 1. list_notes
列出知识库中的所有笔记，支持文件夹过滤。

**参数**:
```json
{
  "folder": "string (可选) - 要过滤的文件夹路径"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "找到 X 个笔记:\n\n📁 folder1/\n  📄 note1.md (1.2KB, 修改于: 2024-01-15)\n  📄 note2.md (0.8KB, 修改于: 2024-01-14)\n\n📁 folder2/\n  📄 note3.md (2.1KB, 修改于: 2024-01-13)"
    }
  ]
}
```

**示例调用**:
```javascript
// 列出所有笔记
await mcp.callTool("list_notes", {});

// 列出特定文件夹的笔记
await mcp.callTool("list_notes", {"folder": "Projects"});
```

### 2. read_note
读取单个笔记的内容。

**参数**:
```json
{
  "path": "string (必需) - 笔记的相对路径"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text", 
      "text": "📄 note.md\n文件大小: 1.2KB\n修改时间: 2024-01-15 10:30:00\n\n--- 内容 ---\n# 笔记标题\n笔记内容..."
    }
  ]
}
```

### 3. read_multiple_notes
批量读取多个笔记的内容。

**参数**:
```json
{
  "paths": ["string"] // 笔记路径数组
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "成功读取 2 个笔记:\n\n=== note1.md ===\n内容1...\n\n=== note2.md ===\n内容2..."
    }
  ]
}
```

### 4. create_note
创建新笔记。

**参数**:
```json
{
  "path": "string (必需) - 新笔记的路径",
  "content": "string (必需) - 笔记内容"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "✅ 成功创建笔记: path/to/note.md"
    }
  ]
}
```

### 5. update_note
更新笔记内容，支持精确定位编辑。

**参数**:
```json
{
  "path": "string (必需) - 笔记路径",
  "dryRun": "boolean (可选) - 预览模式，默认false",
  "edits": [
    {
      "mode": "replace|insert",
      "oldText": "string - 要替换的文本 (replace模式)",
      "newText": "string - 新文本 (replace模式)",
      "heading": "string - 标题名称 (insert模式)",
      "content": "string - 要插入的内容 (insert模式)",
      "position": "before|after|append|prepend - 插入位置"
    }
  ]
}
```

### 6. delete_note
删除指定笔记。

**参数**:
```json
{
  "path": "string (必需) - 要删除的笔记路径"
}
```

### 7. move_note
移动或重命名笔记。

**参数**:
```json
{
  "sourcePath": "string (必需) - 源路径",
  "destinationPath": "string (必需) - 目标路径"
}
```

### 8. manage_folder
管理文件夹操作。

**参数**:
```json
{
  "operation": "create|rename|move|delete",
  "path": "string (必需) - 文件夹路径",
  "newPath": "string (可选) - 新路径，用于rename和move操作"
}
```

### 9. search_vault
在整个知识库中搜索内容。

**参数**:
```json
{
  "query": "string (必需) - 搜索关键词"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "🔍 搜索结果 (找到 3 个匹配项):\n\n📄 note1.md\n匹配内容: ...关键词...\n\n📄 note2.md\n匹配内容: ...关键词..."
    }
  ]
}
```

### 10. auto_backlink_vault
智能自动链接，检测并创建笔记间的链接。

**参数**:
```json
{
  "dryRun": "boolean (可选) - 预览模式，默认true",
  "minLength": "number (可选) - 最小笔记名长度，默认3", 
  "caseSensitive": "boolean (可选) - 大小写敏感，默认false",
  "wholeWords": "boolean (可选) - 全词匹配，默认true",
  "excludePatterns": "string[] (可选) - 排除的文件模式",
  "batchSize": "number (可选) - 批处理大小，默认50"
}
```

---

## 🏷️ 标签管理系统

### 1. add_tags
为笔记添加标签。

**参数**:
```json
{
  "path": "string (必需) - 笔记路径",
  "tags": "string[] (必需) - 要添加的标签数组"
}
```

**示例**:
```javascript
await mcp.callTool("add_tags", {
  "path": "Projects/Web Development.md",
  "tags": ["#web", "#javascript", "#project/active"]
});
```

### 2. list_tags
列出所有标签及使用统计。

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "🏷️ 标签统计 (共 15 个标签):\n\n#web (使用 5 次)\n#javascript (使用 3 次)\n#project/active (使用 8 次)"
    }
  ]
}
```

### 3. search_by_tags
基于标签搜索笔记。

**参数**:
```json
{
  "tags": "string[] (必需) - 标签数组",
  "operator": "AND|OR (可选) - 逻辑操作符，默认AND"
}
```

---

## 📝 模板系统

### 1. create_template
创建可复用的笔记模板。

**参数**:
```json
{
  "name": "string (必需) - 模板名称",
  "content": "string (必需) - 模板内容，支持{{变量}}",
  "description": "string (可选) - 模板描述"
}
```

**模板变量示例**:
```markdown
# {{title}}

创建日期: {{date}}
作者: {{author}}

## 概述
{{summary}}

## 详细内容
{{content}}
```

### 2. list_templates
列出所有可用模板。

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "📝 可用模板 (3 个):\n\n1. meeting-notes\n   描述: 会议记录模板\n   变量: {{date}}, {{attendees}}, {{agenda}}\n\n2. project-template\n   描述: 项目笔记模板\n   变量: {{title}}, {{deadline}}, {{status}}"
    }
  ]
}
```

### 3. apply_template
应用模板创建新笔记。

**参数**:
```json
{
  "templateName": "string (必需) - 模板名称",
  "outputPath": "string (必需) - 输出路径",
  "variables": {
    "title": "项目名称",
    "date": "2024-01-15",
    "author": "张三"
  }
}
```

### 4. delete_template
删除不需要的模板。

**参数**:
```json
{
  "name": "string (必需) - 要删除的模板名称"
}
```

---

## 🧠 AI内容分析

### 1. extract_keywords
使用TF-IDF算法提取关键词。

**参数**:
```json
{
  "path": "string (必需) - 笔记路径",
  "count": "number (可选) - 提取数量，默认10"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "🔑 关键词提取结果:\n\n1. 机器学习 (权重: 0.85)\n2. 神经网络 (权重: 0.72)\n3. 深度学习 (权重: 0.68)"
    }
  ]
}
```

### 2. generate_summary
生成内容摘要。

**参数**:
```json
{
  "path": "string (必需) - 笔记路径",
  "maxLength": "number (可选) - 最大摘要长度，默认200"
}
```

### 3. suggest_tags
AI推荐相关标签。

**参数**:
```json
{
  "path": "string (必需) - 笔记路径",
  "count": "number (可选) - 推荐数量，默认5"
}
```

### 4. find_similar_notes
基于内容相似度查找相关笔记。

**参数**:
```json
{
  "path": "string (必需) - 参考笔记路径",
  "threshold": "number (可选) - 相似度阈值，默认0.3",
  "limit": "number (可选) - 结果数量限制，默认10"
}
```

---

## 📊 知识图谱与分析

### 1. analyze_note_relationships
分析笔记间的关系。

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "📊 笔记关系分析:\n\n总计: 50 个笔记, 120 个连接\n\n🔗 连接最多的笔记:\n1. 机器学习基础.md (15 个连接)\n2. Python编程.md (12 个连接)\n\n📈 知识集群:\n- 编程相关 (18 个笔记)\n- 机器学习 (12 个笔记)"
    }
  ]
}
```

### 2. generate_knowledge_graph
生成知识图谱数据。

**参数**:
```json
{
  "format": "json|cytoscape (可选) - 输出格式，默认json",
  "includeOrphans": "boolean (可选) - 包含孤立笔记，默认false"
}
```

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "📈 知识图谱数据 (JSON格式):\n\n{\n  \"nodes\": [\n    {\"id\": \"note1\", \"label\": \"机器学习\", \"size\": 10},\n    {\"id\": \"note2\", \"label\": \"深度学习\", \"size\": 8}\n  ],\n  \"edges\": [\n    {\"source\": \"note1\", \"target\": \"note2\", \"weight\": 0.8}\n  ]\n}"
    }
  ]
}
```

### 3. find_orphan_notes
查找孤立笔记（无链接的笔记）。

**返回值**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "🔍 孤立笔记 (3 个):\n\n📄 未分类/随机想法.md\n📄 草稿/临时记录.md\n📄 archive/旧项目.md\n\n💡 建议: 考虑为这些笔记添加相关链接或标签。"
    }
  ]
}
```

### 4. suggest_connections
AI推荐潜在的笔记连接。

**参数**:
```json
{
  "path": "string (可选) - 特定笔记路径",
  "threshold": "number (可选) - 相似度阈值，默认0.4",
  "limit": "number (可选) - 推荐数量，默认5"
}
```

---

## ❌ 错误处理

### 常见错误代码

| 错误代码 | 错误类型 | 描述 |
|---------|----------|------|
| `-32000` | 服务器错误 | 内部服务器错误 |
| `-32001` | 文件不存在 | 请求的笔记文件不存在 |
| `-32002` | 权限错误 | 无法访问文件或文件夹 |
| `-32003` | 验证错误 | 参数验证失败 |
| `-32004` | API错误 | Obsidian API调用失败 |

### 错误处理示例

```javascript
try {
  const result = await mcp.callTool("read_note", {"path": "nonexistent.md"});
} catch (error) {
  if (error.code === -32001) {
    console.log("文件不存在，请检查路径");
  } else if (error.code === -32002) {
    console.log("权限不足，请检查文件权限");
  }
}
```

---

## 💡 最佳实践

### 1. 性能优化

**批量操作**:
```javascript
// ✅ 推荐：使用batch操作
await mcp.callTool("read_multiple_notes", {
  "paths": ["note1.md", "note2.md", "note3.md"]
});

// ❌ 不推荐：多次单独调用
await mcp.callTool("read_note", {"path": "note1.md"});
await mcp.callTool("read_note", {"path": "note2.md"});
await mcp.callTool("read_note", {"path": "note3.md"});
```

### 2. 错误预防

**路径验证**:
```javascript
// 使用相对路径，避免绝对路径
const validPath = "Projects/Web Development.md";  // ✅
const invalidPath = "/Users/name/vault/note.md"; // ❌
```

### 3. 内容管理

**使用dry-run模式**:
```javascript
// 先预览更改
const preview = await mcp.callTool("update_note", {
  "path": "note.md",
  "dryRun": true,
  "edits": [...]
});

// 确认后执行
const result = await mcp.callTool("update_note", {
  "path": "note.md", 
  "dryRun": false,
  "edits": [...]
});
```

### 4. 模板使用

**定义清晰的变量名**:
```markdown
# ✅ 清晰的变量名
# {{project_title}}
开始日期: {{start_date}}
负责人: {{project_manager}}

# ❌ 模糊的变量名
# {{title}}
日期: {{date}}
人员: {{person}}
```

---

## 🔗 相关链接

- [配置参考](./configuration.md)
- [使用示例](./examples.md)
- [安装指南](../INSTALLATION.md)
- [项目主页](https://github.com/jianruidutong/obsidian-mcp)