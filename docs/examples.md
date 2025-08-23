# 🚀 使用示例

本文档提供Enhanced Obsidian MCP Server的实用示例，展示25个AI工具的具体使用方法和最佳实践。

## 📋 目录

1. [快速开始示例](#快速开始示例)
2. [笔记管理示例](#笔记管理示例)
3. [标签系统示例](#标签系统示例)
4. [模板系统示例](#模板系统示例)
5. [AI分析示例](#ai分析示例)
6. [知识图谱示例](#知识图谱示例)
7. [实际应用场景](#实际应用场景)

---

## 🎯 快速开始示例

### 基础笔记操作
```javascript
// 1. 列出所有笔记
const allNotes = await mcp.callTool("list_notes", {});

// 2. 读取特定笔记
const noteContent = await mcp.callTool("read_note", {
  "path": "Projects/机器学习项目.md"
});

// 3. 创建新笔记
const newNote = await mcp.callTool("create_note", {
  "path": "学习笔记/深度学习基础.md",
  "content": "# 深度学习基础\n\n## 概述\n今天开始学习深度学习..."
});

// 4. 搜索笔记内容
const searchResults = await mcp.callTool("search_vault", {
  "query": "机器学习"
});
```

---

## 📚 笔记管理示例

### 创建项目笔记结构
```javascript
// 创建项目文件夹
await mcp.callTool("manage_folder", {
  "operation": "create",
  "path": "Projects/Web开发项目"
});

// 创建项目主文档
await mcp.callTool("create_note", {
  "path": "Projects/Web开发项目/项目概述.md",
  "content": `# Web开发项目概述

## 项目信息
- 开始时间: 2024-01-15
- 预计完成: 2024-03-15
- 技术栈: React, Node.js, MongoDB

## 项目目标
构建一个现代化的知识管理系统...`
});

// 批量创建相关文档
const projectFiles = [
  "需求分析.md",
  "技术设计.md", 
  "开发计划.md",
  "测试计划.md"
];

for (const file of projectFiles) {
  await mcp.callTool("create_note", {
    "path": `Projects/Web开发项目/${file}`,
    "content": `# ${file.replace('.md', '')}\n\n待完善...`
  });
}
```

### 笔记内容更新
```javascript
// 精确更新笔记内容
await mcp.callTool("update_note", {
  "path": "Projects/Web开发项目/项目概述.md",
  "edits": [
    {
      "mode": "replace",
      "oldText": "预计完成: 2024-03-15",
      "newText": "预计完成: 2024-04-01"
    },
    {
      "mode": "insert",
      "heading": "项目目标",
      "position": "after",
      "content": "\n## 技术难点\n- 用户认证系统\n- 实时数据同步\n- 性能优化"
    }
  ]
});
```

### 智能自动链接
```javascript
// 先预览自动链接效果
const preview = await mcp.callTool("auto_backlink_vault", {
  "dryRun": true,
  "minLength": 3,
  "wholeWords": true
});

// 确认后执行自动链接
const result = await mcp.callTool("auto_backlink_vault", {
  "dryRun": false,
  "minLength": 3,
  "wholeWords": true,
  "excludePatterns": ["archive/*", "templates/*"]
});
```

---

## 🏷️ 标签系统示例

### 标签管理工作流
```javascript
// 为笔记添加多个标签
await mcp.callTool("add_tags", {
  "path": "学习笔记/深度学习基础.md",
  "tags": ["#AI", "#机器学习", "#深度学习", "#学习笔记"]
});

// 查看所有标签使用情况
const tagStats = await mcp.callTool("list_tags", {});

// 基于标签搜索笔记
const aiNotes = await mcp.callTool("search_by_tags", {
  "tags": ["#AI", "#机器学习"],
  "operator": "AND"
});

const techNotes = await mcp.callTool("search_by_tags", {
  "tags": ["#前端", "#后端", "#数据库"],
  "operator": "OR"
});
```

### 标签分类系统
```javascript
// 创建分层标签体系
const tagHierarchy = {
  "技术": ["#技术/前端", "#技术/后端", "#技术/数据库"],
  "项目": ["#项目/进行中", "#项目/已完成", "#项目/暂停"],
  "学习": ["#学习/书籍", "#学习/课程", "#学习/实践"]
};

// 批量添加分层标签
for (const [category, tags] of Object.entries(tagHierarchy)) {
  await mcp.callTool("add_tags", {
    "path": `分类/${category}说明.md`,
    "tags": tags
  });
}
```

---

## 📝 模板系统示例

### 创建常用模板
```javascript
// 会议记录模板
await mcp.callTool("create_template", {
  "name": "meeting-notes",
  "description": "标准会议记录模板",
  "content": `# {{meeting_title}}

**时间**: {{date}}
**参会人员**: {{attendees}}
**会议类型**: {{meeting_type}}

## 会议议程
{{agenda}}

## 讨论要点
{{discussion_points}}

## 决策事项
{{decisions}}

## 行动计划
- [ ] {{action_item_1}} - 负责人: {{assignee_1}} - 截止: {{deadline_1}}
- [ ] {{action_item_2}} - 负责人: {{assignee_2}} - 截止: {{deadline_2}}

## 下次会议
**时间**: {{next_meeting_date}}
**议题**: {{next_meeting_agenda}}`
});

// 项目笔记模板
await mcp.callTool("create_template", {
  "name": "project-note",
  "description": "项目管理笔记模板",
  "content": `# 项目: {{project_name}}

## 基本信息
- **项目经理**: {{project_manager}}
- **开始日期**: {{start_date}}
- **预计完成**: {{end_date}}
- **项目状态**: {{status}}
- **优先级**: {{priority}}

## 项目概述
{{project_description}}

## 技术栈
{{tech_stack}}

## 里程碑
- [ ] {{milestone_1}} ({{milestone_1_date}})
- [ ] {{milestone_2}} ({{milestone_2_date}})
- [ ] {{milestone_3}} ({{milestone_3_date}})

## 风险评估
{{risks}}

## 相关链接
- 项目仓库: {{repo_link}}
- 设计文档: {{design_doc}}
- 部署地址: {{deploy_url}}`
});
```

### 使用模板创建笔记
```javascript
// 使用会议记录模板
await mcp.callTool("apply_template", {
  "templateName": "meeting-notes",
  "outputPath": "会议记录/2024-01-15 产品规划会议.md",
  "variables": {
    "meeting_title": "产品功能规划会议",
    "date": "2024-01-15 14:00",
    "attendees": "张三, 李四, 王五",
    "meeting_type": "产品规划",
    "agenda": "讨论Q1产品功能规划和开发优先级",
    "discussion_points": "- 用户反馈分析\n- 竞品功能对比\n- 技术可行性评估",
    "decisions": "- 优先开发用户管理功能\n- 推迟高级分析功能到Q2",
    "action_item_1": "完成用户管理功能设计文档",
    "assignee_1": "张三",
    "deadline_1": "2024-01-22",
    "next_meeting_date": "2024-01-22 14:00",
    "next_meeting_agenda": "用户管理功能技术方案评审"
  }
});

// 使用项目模板
await mcp.callTool("apply_template", {
  "templateName": "project-note", 
  "outputPath": "Projects/电商平台重构.md",
  "variables": {
    "project_name": "电商平台重构",
    "project_manager": "李四",
    "start_date": "2024-01-15",
    "end_date": "2024-06-30",
    "status": "进行中",
    "priority": "高",
    "project_description": "对现有电商平台进行全面重构，提升性能和用户体验",
    "tech_stack": "React 18, Node.js, PostgreSQL, Redis, Docker",
    "milestone_1": "需求分析和架构设计完成",
    "milestone_1_date": "2024-02-15"
  }
});
```

---

## 🧠 AI分析示例

### 内容分析工作流
```javascript
// 提取文档关键词
const keywords = await mcp.callTool("extract_keywords", {
  "path": "研究报告/AI发展趋势.md",
  "count": 15
});

// 生成文档摘要
const summary = await mcp.callTool("generate_summary", {
  "path": "研究报告/AI发展趋势.md",
  "maxLength": 300
});

// AI推荐标签
const suggestedTags = await mcp.callTool("suggest_tags", {
  "path": "研究报告/AI发展趋势.md",
  "count": 8
});

// 查找相似内容
const similarNotes = await mcp.callTool("find_similar_notes", {
  "path": "研究报告/AI发展趋势.md",
  "threshold": 0.4,
  "limit": 5
});
```

### 批量内容分析
```javascript
// 获取所有笔记列表
const allNotes = await mcp.callTool("list_notes", {});

// 批量分析笔记内容
const analysisResults = [];
const noteList = /* 从allNotes中解析笔记路径 */;

for (const notePath of noteList) {
  try {
    const keywords = await mcp.callTool("extract_keywords", {
      "path": notePath,
      "count": 5
    });
    
    const tags = await mcp.callTool("suggest_tags", {
      "path": notePath,
      "count": 3
    });
    
    analysisResults.push({
      path: notePath,
      keywords: keywords,
      suggestedTags: tags
    });
    
    // 避免过于频繁的API调用
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.log(`分析失败: ${notePath}`);
  }
}
```

---

## 📊 知识图谱示例

### 知识关系分析
```javascript
// 分析整个知识库的关系结构
const relationships = await mcp.callTool("analyze_note_relationships", {});

// 生成可视化知识图谱数据
const graphData = await mcp.callTool("generate_knowledge_graph", {
  "format": "json",
  "includeOrphans": false
});

// 查找孤立笔记
const orphanNotes = await mcp.callTool("find_orphan_notes", {});

// 获取智能连接建议
const connectionSuggestions = await mcp.callTool("suggest_connections", {
  "threshold": 0.5,
  "limit": 10
});
```

### 知识库优化工作流
```javascript
// 1. 识别知识结构问题
const orphans = await mcp.callTool("find_orphan_notes", {});
const suggestions = await mcp.callTool("suggest_connections", {
  "threshold": 0.4,
  "limit": 20
});

// 2. 自动添加智能链接
await mcp.callTool("auto_backlink_vault", {
  "dryRun": false,
  "minLength": 4,
  "wholeWords": true
});

// 3. 为孤立笔记添加标签
const orphanPaths = /* 从orphans结果中提取路径 */;
for (const path of orphanPaths) {
  const suggestedTags = await mcp.callTool("suggest_tags", {
    "path": path,
    "count": 3
  });
  
  if (suggestedTags.length > 0) {
    await mcp.callTool("add_tags", {
      "path": path,
      "tags": suggestedTags
    });
  }
}

// 4. 重新分析优化后的知识结构
const updatedGraph = await mcp.callTool("generate_knowledge_graph", {
  "format": "json",
  "includeOrphans": true
});
```

---

## 🎨 实际应用场景

### 场景1: 学术研究管理
```javascript
// 创建研究项目结构
const researchProject = "机器学习在自然语言处理中的应用";

// 1. 创建项目文件夹
await mcp.callTool("manage_folder", {
  "operation": "create",
  "path": `研究项目/${researchProject}`
});

// 2. 使用模板创建研究笔记
await mcp.callTool("apply_template", {
  "templateName": "research-project",
  "outputPath": `研究项目/${researchProject}/项目概述.md`,
  "variables": {
    "title": researchProject,
    "start_date": "2024-01-15",
    "supervisor": "王教授",
    "research_questions": "如何提升NLP模型在中文处理上的效果"
  }
});

// 3. 批量分析相关文献
const literatureFolder = `研究项目/${researchProject}/文献阅读`;
const papers = await mcp.callTool("list_notes", {"folder": literatureFolder});

for (const paper of papers) {
  await mcp.callTool("add_tags", {
    "path": paper,
    "tags": ["#研究", "#文献", "#机器学习", "#NLP"]
  });
}

// 4. 生成研究知识图谱
const researchGraph = await mcp.callTool("generate_knowledge_graph", {
  "format": "json"
});
```

### 场景2: 产品开发文档管理
```javascript
// 产品开发全流程文档管理
const productName = "智能知识助手";

// 1. 创建产品目录结构
const folders = [
  `产品开发/${productName}/需求分析`,
  `产品开发/${productName}/设计文档`,
  `产品开发/${productName}/开发文档`,
  `产品开发/${productName}/测试文档`,
  `产品开发/${productName}/发布记录`
];

for (const folder of folders) {
  await mcp.callTool("manage_folder", {
    "operation": "create",
    "path": folder
  });
}

// 2. 创建需求文档
await mcp.callTool("create_note", {
  "path": `产品开发/${productName}/需求分析/用户需求.md`,
  "content": `# 用户需求分析

## 目标用户
- 知识工作者
- 研究人员
- 学生群体

## 核心需求
- 智能笔记整理
- 知识关联发现
- 内容自动分类

## 功能优先级
1. 基础笔记管理
2. 智能搜索
3. 关联推荐`
});

// 3. 添加产品标签体系
await mcp.callTool("add_tags", {
  "path": `产品开发/${productName}/需求分析/用户需求.md`,
  "tags": ["#产品", "#需求分析", "#智能助手", "#优先级高"]
});

// 4. 智能关联相关文档
const similarDocs = await mcp.callTool("find_similar_notes", {
  "path": `产品开发/${productName}/需求分析/用户需求.md`,
  "threshold": 0.3,
  "limit": 5
});
```

### 场景3: 个人知识库维护
```javascript
// 每周知识库维护例行工作

// 1. 检查孤立笔记
const orphans = await mcp.callTool("find_orphan_notes", {});
console.log(`发现 ${orphans.length} 个孤立笔记需要处理`);

// 2. 更新自动链接
await mcp.callTool("auto_backlink_vault", {
  "dryRun": false,
  "minLength": 3,
  "wholeWords": true,
  "excludePatterns": ["archive/*", "temp/*"]
});

// 3. 分析知识结构
const relationships = await mcp.callTool("analyze_note_relationships", {});

// 4. 获取连接建议
const suggestions = await mcp.callTool("suggest_connections", {
  "threshold": 0.4,
  "limit": 10
});

// 5. 生成标签使用报告
const tagStats = await mcp.callTool("list_tags", {});

// 6. 创建维护报告
const maintenanceDate = new Date().toISOString().split('T')[0];
await mcp.callTool("create_note", {
  "path": `系统维护/知识库维护报告-${maintenanceDate}.md`,
  "content": `# 知识库维护报告 - ${maintenanceDate}

## 统计信息
- 总笔记数: ${/* 从relationships中提取 */}
- 孤立笔记: ${orphans.length}个
- 新增连接: ${/* 从auto_backlink结果提取 */}个

## 改进建议
${suggestions}

## 标签使用情况
${tagStats}

## 下次维护计划
- 日期: ${/* 计算下周日期 */}
- 重点: 处理剩余孤立笔记`
});
```

---

## 💡 最佳实践总结

### 1. 工作流优化
- **批量操作**: 使用`read_multiple_notes`而不是多次`read_note`
- **预览模式**: 重要操作前先使用`dryRun: true`预览
- **错误处理**: 对所有工具调用添加适当的错误处理

### 2. 性能考虑
- **适当延迟**: 批量操作时添加适当延迟避免过载
- **结果缓存**: 对分析结果进行适当缓存避免重复计算
- **分批处理**: 大量数据处理时采用分批策略

### 3. 内容组织
- **标签规范**: 建立一致的标签命名规范
- **文件夹结构**: 保持清晰的文件夹层次结构
- **模板复用**: 为常见文档类型创建标准模板

---

## 🔗 相关链接

- [API文档](./api.md)
- [配置参考](./configuration.md)
- [安装指南](../INSTALLATION.md)
- [项目主页](https://github.com/jianruidutong/obsidian-mcp)