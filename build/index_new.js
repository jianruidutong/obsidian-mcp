#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import * as path from 'path';
import * as fs from 'fs';
// Enhanced MCP Server for Obsidian with all 25 tools (10 original + 15 enhanced)
class ObsidianMcpServer {
    constructor() {
        // 使用环境变量指定的Obsidian vault路径，或默认为当前项目的vault目录
        this.vaultPath = process.env.OBSIDIAN_VAULT_PATH || path.resolve('./vault');
        this.server = new Server({
            name: 'obsidian-mcp-server',
            version: '1.8.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    setupErrorHandling() {
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'list_notes',
                        description: 'List all notes in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                folder: { type: 'string', description: 'Folder path within the vault (optional)' }
                            },
                        },
                    },
                    {
                        name: 'delete_note',
                        description: 'Delete a note from the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note within the vault' }
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'read_note',
                        description: 'Read the content of a note in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note within the vault' }
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'create_note',
                        description: 'Create a new note in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path where the note should be created' },
                                content: { type: 'string', description: 'Content of the note' },
                            },
                            required: ['path', 'content'],
                        },
                    },
                    {
                        name: 'search_vault',
                        description: 'Search for content in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: { type: 'string', description: 'Search query' }
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'move_note',
                        description: 'Move or rename a note to a new location in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                sourcePath: { type: 'string', description: 'Current path to the note within the vault' },
                                destinationPath: { type: 'string', description: 'New path where the note should be moved' }
                            },
                            required: ['sourcePath', 'destinationPath'],
                        },
                    },
                    {
                        name: 'manage_folder',
                        description: 'Create, rename, move, or delete a folder in the Obsidian vault',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: { type: 'string', enum: ['create', 'rename', 'move', 'delete'], description: 'The operation to perform' },
                                path: { type: 'string', description: 'Path to the folder within the vault' },
                                newPath: { type: 'string', description: 'New path for the folder (required for rename and move operations)' }
                            },
                            required: ['operation', 'path'],
                        },
                    },
                    {
                        name: 'update_note',
                        description: 'Update content in an existing note using text replacements, deletions or precise insertions',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note within the vault' },
                                edits: { type: 'array', description: 'Array of edit operations to apply' },
                                dryRun: { type: 'boolean', default: false, description: 'Preview changes without applying them' }
                            },
                            required: ['path', 'edits'],
                        },
                    },
                    {
                        name: 'read_multiple_notes',
                        description: 'Read content from multiple notes simultaneously',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                paths: { type: 'array', items: { type: 'string' }, description: 'Array of note paths to read' }
                            },
                            required: ['paths'],
                        },
                    },
                    {
                        name: 'auto_backlink_vault',
                        description: 'Automatically add backlinks throughout the entire vault by detecting note names in content and converting them to wikilinks',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                dryRun: { type: 'boolean', default: true, description: 'Preview changes without applying them' },
                                caseSensitive: { type: 'boolean', default: false, description: 'Whether matching should be case sensitive' },
                                wholeWords: { type: 'boolean', default: true, description: 'Whether to match only whole words' },
                                minLength: { type: 'number', default: 3, description: 'Minimum note name length to consider for linking' },
                                excludePatterns: { type: 'array', items: { type: 'string' }, default: [], description: 'Array of glob patterns to exclude from processing' },
                                batchSize: { type: 'number', default: 50, description: 'Number of notes to process in each batch' }
                            },
                        },
                    },
                    {
                        name: 'add_tags',
                        description: 'Add tags to a note',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note within the vault' },
                                tags: { type: 'array', description: 'Array of tags to add', items: { type: 'string' } },
                            },
                            required: ['path', 'tags'],
                        },
                    },
                    {
                        name: 'list_tags',
                        description: 'List all tags in the vault with usage count',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                sortBy: { type: 'string', enum: ['name', 'count'], default: 'count' },
                                limit: { type: 'number', default: 100 }
                            },
                        },
                    },
                    {
                        name: 'search_by_tags',
                        description: 'Search notes by tags',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                tags: { type: 'array', items: { type: 'string' } },
                                operator: { type: 'string', enum: ['AND', 'OR'], default: 'AND' }
                            },
                            required: ['tags'],
                        },
                    },
                    {
                        name: 'create_template',
                        description: 'Create a new template',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', description: 'Template name' },
                                content: { type: 'string', description: 'Template content with variables like {{title}}, {{date}}' },
                                variables: { type: 'array', items: { type: 'string' }, description: 'List of variable names used in template' }
                            },
                            required: ['name', 'content'],
                        },
                    },
                    {
                        name: 'list_templates',
                        description: 'List all available templates',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'apply_template',
                        description: 'Apply a template to create a new note',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                templateName: { type: 'string', description: 'Name of the template to apply' },
                                notePath: { type: 'string', description: 'Path for the new note' },
                                variables: { type: 'object', description: 'Variable values to substitute in template' }
                            },
                            required: ['templateName', 'notePath'],
                        },
                    },
                    {
                        name: 'delete_template',
                        description: 'Delete a template',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', description: 'Template name to delete' }
                            },
                            required: ['name'],
                        },
                    },
                    // 智能内容分析功能
                    {
                        name: 'extract_keywords',
                        description: 'Extract keywords from note content using TF-IDF algorithm',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note' },
                                maxKeywords: { type: 'number', default: 10, description: 'Maximum number of keywords to extract' }
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'generate_summary',
                        description: 'Generate a summary of note content',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note' },
                                maxSentences: { type: 'number', default: 3, description: 'Maximum number of sentences in summary' }
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'suggest_tags',
                        description: 'Suggest tags for a note based on content analysis',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the note' },
                                maxTags: { type: 'number', default: 5, description: 'Maximum number of tags to suggest' }
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'find_similar_notes',
                        description: 'Find notes with similar content using cosine similarity',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Path to the reference note' },
                                threshold: { type: 'number', default: 0.3, description: 'Similarity threshold (0-1)' },
                                maxResults: { type: 'number', default: 5, description: 'Maximum number of similar notes to return' }
                            },
                            required: ['path'],
                        },
                    },
                    // 图谱和关系分析功能
                    {
                        name: 'analyze_note_relationships',
                        description: 'Analyze relationships between notes based on links and references',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                includeBacklinks: { type: 'boolean', default: true, description: 'Include backlink analysis' },
                                includeTagRelations: { type: 'boolean', default: true, description: 'Include tag-based relationships' }
                            },
                        },
                    },
                    {
                        name: 'generate_knowledge_graph',
                        description: 'Generate knowledge graph data for visualization',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                format: { type: 'string', enum: ['json', 'cytoscape'], default: 'json', description: 'Output format' },
                                includeOrphans: { type: 'boolean', default: false, description: 'Include orphan nodes' }
                            },
                        },
                    },
                    {
                        name: 'find_orphan_notes',
                        description: 'Find notes that have no incoming or outgoing links',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                includeTagged: { type: 'boolean', default: false, description: 'Include notes that only have tags' }
                            },
                        },
                    },
                    {
                        name: 'suggest_connections',
                        description: 'Suggest potential connections between notes based on content similarity',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                threshold: { type: 'number', default: 0.4, description: 'Similarity threshold for suggestions' },
                                maxSuggestions: { type: 'number', default: 10, description: 'Maximum number of suggestions' }
                            },
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'list_notes':
                        return await this.handleListNotes(args);
                    case 'delete_note':
                        return await this.handleDeleteNote(args);
                    case 'read_note':
                        return await this.handleReadNote(args);
                    case 'create_note':
                        return await this.handleCreateNote(args);
                    case 'search_vault':
                        return await this.handleSearchVault(args);
                    case 'move_note':
                        return await this.handleMoveNote(args);
                    case 'manage_folder':
                        return await this.handleManageFolder(args);
                    case 'update_note':
                        return await this.handleUpdateNote(args);
                    case 'read_multiple_notes':
                        return await this.handleReadMultipleNotes(args);
                    case 'auto_backlink_vault':
                        return await this.handleAutoBacklinkVault(args);
                    case 'add_tags':
                        return await this.handleAddTags(args);
                    case 'list_tags':
                        return await this.handleListTags(args);
                    case 'search_by_tags':
                        return await this.handleSearchByTags(args);
                    case 'create_template':
                        return await this.handleCreateTemplate(args);
                    case 'list_templates':
                        return await this.handleListTemplates(args);
                    case 'apply_template':
                        return await this.handleApplyTemplate(args);
                    case 'delete_template':
                        return await this.handleDeleteTemplate(args);
                    // 智能内容分析功能
                    case 'extract_keywords':
                        return await this.handleExtractKeywords(args);
                    case 'generate_summary':
                        return await this.handleGenerateSummary(args);
                    case 'suggest_tags':
                        return await this.handleSuggestTags(args);
                    case 'find_similar_notes':
                        return await this.handleFindSimilarNotes(args);
                    // 图谱和关系分析功能
                    case 'analyze_note_relationships':
                        return await this.handleAnalyzeNoteRelationships(args);
                    case 'generate_knowledge_graph':
                        return await this.handleGenerateKnowledgeGraph(args);
                    case 'find_orphan_notes':
                        return await this.handleFindOrphanNotes(args);
                    case 'suggest_connections':
                        return await this.handleSuggestConnections(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
            }
        });
    }
    // Note Management Methods
    async handleListNotes(args) {
        try {
            const files = await this.listVaultFiles();
            return {
                content: [{ type: 'text', text: `Found ${files.length} notes:\\n${files.join('\\n')}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to list notes: ${error}`);
        }
    }
    async handleCreateNote(args) {
        if (!args?.path || !args?.content) {
            throw new Error('Path and content are required');
        }
        try {
            await this.createNote(args.path, args.content);
            return {
                content: [{ type: 'text', text: `Note created successfully at ${args.path}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to create note: ${error}`);
        }
    }
    // 新增的8个原版工具处理方法
    async handleDeleteNote(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const fullPath = path.join(this.vaultPath, args.path);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Note not found: ${args.path}`);
            }
            fs.unlinkSync(fullPath);
            return {
                content: [{ type: 'text', text: `Note deleted successfully: ${args.path}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to delete note: ${error}`);
        }
    }
    async handleReadNote(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const fullPath = path.join(this.vaultPath, args.path);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Note not found: ${args.path}`);
            }
            const content = fs.readFileSync(fullPath, 'utf-8');
            return {
                content: [{ type: 'text', text: content }],
            };
        }
        catch (error) {
            throw new Error(`Failed to read note: ${error}`);
        }
    }
    async handleSearchVault(args) {
        if (!args?.query) {
            throw new Error('Query is required');
        }
        try {
            const files = await this.listVaultFiles();
            const results = [];
            for (const file of files) {
                try {
                    const fullPath = path.join(this.vaultPath, file);
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const lines = content.split('\n');
                    let matches = [];
                    // Search in filename
                    if (file.toLowerCase().includes(args.query.toLowerCase())) {
                        matches.push({ line: 0, type: 'filename' });
                    }
                    // Search in content
                    lines.forEach((line, index) => {
                        if (line.toLowerCase().includes(args.query.toLowerCase())) {
                            matches.push({ line: index + 1, type: 'content' });
                        }
                    });
                    if (matches.length > 0) {
                        results.push({
                            path: file,
                            score: matches.length,
                            matches: matches
                        });
                    }
                }
                catch (error) {
                    continue;
                }
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
            };
        }
        catch (error) {
            throw new Error(`Failed to search vault: ${error}`);
        }
    }
    async handleMoveNote(args) {
        if (!args?.sourcePath || !args?.destinationPath) {
            throw new Error('Source path and destination path are required');
        }
        try {
            const sourceFullPath = path.join(this.vaultPath, args.sourcePath);
            const destFullPath = path.join(this.vaultPath, args.destinationPath);
            if (!fs.existsSync(sourceFullPath)) {
                throw new Error(`Source note not found: ${args.sourcePath}`);
            }
            const destDir = path.dirname(destFullPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.renameSync(sourceFullPath, destFullPath);
            return {
                content: [{ type: 'text', text: `Note moved from ${args.sourcePath} to ${args.destinationPath}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to move note: ${error}`);
        }
    }
    async handleManageFolder(args) {
        if (!args?.operation || !args?.path) {
            throw new Error('Operation and path are required');
        }
        try {
            const folderPath = path.join(this.vaultPath, args.path);
            switch (args.operation) {
                case 'create':
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                        return {
                            content: [{ type: 'text', text: `Folder created: ${args.path}` }],
                        };
                    }
                    else {
                        throw new Error(`Folder already exists: ${args.path}`);
                    }
                case 'delete':
                    if (fs.existsSync(folderPath)) {
                        fs.rmSync(folderPath, { recursive: true, force: true });
                        return {
                            content: [{ type: 'text', text: `Folder deleted: ${args.path}` }],
                        };
                    }
                    else {
                        throw new Error(`Folder not found: ${args.path}`);
                    }
                case 'rename':
                case 'move':
                    if (!args?.newPath) {
                        throw new Error('New path is required for rename/move operation');
                    }
                    const newFolderPath = path.join(this.vaultPath, args.newPath);
                    if (fs.existsSync(folderPath)) {
                        fs.renameSync(folderPath, newFolderPath);
                        return {
                            content: [{ type: 'text', text: `Folder ${args.operation}d from ${args.path} to ${args.newPath}` }],
                        };
                    }
                    else {
                        throw new Error(`Folder not found: ${args.path}`);
                    }
                default:
                    throw new Error(`Unknown operation: ${args.operation}`);
            }
        }
        catch (error) {
            throw new Error(`Failed to manage folder: ${error}`);
        }
    }
    async handleUpdateNote(args) {
        if (!args?.path || !args?.edits) {
            throw new Error('Path and edits are required');
        }
        try {
            const fullPath = path.join(this.vaultPath, args.path);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Note not found: ${args.path}`);
            }
            let content = fs.readFileSync(fullPath, 'utf-8');
            // Apply edits
            for (const edit of args.edits) {
                if (edit.type === 'replace' && edit.oldText && edit.newText !== undefined) {
                    content = content.replace(edit.oldText, edit.newText);
                }
                else if (edit.type === 'append' && edit.text) {
                    content += edit.text;
                }
                else if (edit.type === 'prepend' && edit.text) {
                    content = edit.text + content;
                }
            }
            if (!args.dryRun) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                return {
                    content: [{ type: 'text', text: `Note updated successfully: ${args.path}` }],
                };
            }
            else {
                return {
                    content: [{ type: 'text', text: `Preview of changes:\n${content}` }],
                };
            }
        }
        catch (error) {
            throw new Error(`Failed to update note: ${error}`);
        }
    }
    async handleReadMultipleNotes(args) {
        if (!args?.paths || !Array.isArray(args.paths)) {
            throw new Error('Paths array is required');
        }
        try {
            const results = [];
            for (const notePath of args.paths) {
                try {
                    const fullPath = path.join(this.vaultPath, notePath);
                    if (fs.existsSync(fullPath)) {
                        const content = fs.readFileSync(fullPath, 'utf-8');
                        results.push({ path: notePath, content });
                    }
                    else {
                        results.push({ path: notePath, error: 'Note not found' });
                    }
                }
                catch (error) {
                    results.push({ path: notePath, error: String(error) });
                }
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
            };
        }
        catch (error) {
            throw new Error(`Failed to read multiple notes: ${error}`);
        }
    }
    async handleAutoBacklinkVault(args) {
        try {
            const files = await this.listVaultFiles();
            const changes = [];
            // Get all note names (without extension)
            const noteNames = files.map(file => {
                const basename = path.basename(file, '.md');
                return { name: basename, path: file };
            }).filter(note => note.name.length >= (args?.minLength || 3));
            let totalChanges = 0;
            for (const file of files) {
                try {
                    const fullPath = path.join(this.vaultPath, file);
                    let content = fs.readFileSync(fullPath, 'utf-8');
                    let fileChanges = 0;
                    // Look for note names in content and convert to wikilinks
                    for (const note of noteNames) {
                        if (note.path === file)
                            continue; // Skip self-references
                        const regex = args?.caseSensitive
                            ? new RegExp(`\\b${note.name}\\b`, 'g')
                            : new RegExp(`\\b${note.name}\\b`, 'gi');
                        const matches = content.match(regex);
                        if (matches) {
                            // Only replace if not already a wikilink
                            const linkRegex = new RegExp(`\\[\\[${note.name}\\]\\]`, args?.caseSensitive ? 'g' : 'gi');
                            if (!linkRegex.test(content)) {
                                content = content.replace(regex, `[[${note.name}]]`);
                                fileChanges += matches.length;
                            }
                        }
                    }
                    if (fileChanges > 0) {
                        if (!args?.dryRun) {
                            fs.writeFileSync(fullPath, content, 'utf-8');
                        }
                        changes.push({ file, changes: fileChanges });
                        totalChanges += fileChanges;
                    }
                }
                catch (error) {
                    continue;
                }
            }
            const summary = args?.dryRun
                ? `Preview: Found ${totalChanges} potential backlinks in ${changes.length} files`
                : `Added ${totalChanges} backlinks in ${changes.length} files`;
            return {
                content: [{ type: 'text', text: `${summary}\n\nDetails:\n${JSON.stringify(changes, null, 2)}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to auto backlink vault: ${error}`);
        }
    }
    // Tag Management Methods
    async handleAddTags(args) {
        if (!args?.path || !args?.tags) {
            throw new Error('Path and tags are required');
        }
        try {
            const result = await this.addTagsToNote(args.path, args.tags);
            return {
                content: [{ type: 'text', text: result }],
            };
        }
        catch (error) {
            throw new Error(`Failed to add tags: ${error}`);
        }
    }
    async handleListTags(args) {
        try {
            const tags = await this.listAllTags(args?.sortBy, args?.limit);
            return {
                content: [{ type: 'text', text: tags }],
            };
        }
        catch (error) {
            throw new Error(`Failed to list tags: ${error}`);
        }
    }
    async handleSearchByTags(args) {
        if (!args?.tags) {
            throw new Error('Tags are required');
        }
        try {
            const results = await this.searchNotesByTags(args.tags, args?.operator || 'AND');
            return {
                content: [{ type: 'text', text: results }],
            };
        }
        catch (error) {
            throw new Error(`Failed to search by tags: ${error}`);
        }
    }
    // Template System Methods
    get templatesPath() {
        return path.join(this.vaultPath, '.templates');
    }
    async handleCreateTemplate(args) {
        if (!args?.name || !args?.content) {
            throw new Error('Template name and content are required');
        }
        try {
            await this.createTemplate(args.name, args.content, args.variables || []);
            return {
                content: [{ type: 'text', text: `Template '${args.name}' created successfully` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to create template: ${error}`);
        }
    }
    async handleListTemplates(args) {
        try {
            const templates = await this.listTemplates();
            return {
                content: [{ type: 'text', text: templates }],
            };
        }
        catch (error) {
            throw new Error(`Failed to list templates: ${error}`);
        }
    }
    async handleApplyTemplate(args) {
        if (!args?.templateName || !args?.notePath) {
            throw new Error('Template name and note path are required');
        }
        try {
            const result = await this.applyTemplate(args.templateName, args.notePath, args.variables || {});
            return {
                content: [{ type: 'text', text: result }],
            };
        }
        catch (error) {
            throw new Error(`Failed to apply template: ${error}`);
        }
    }
    async handleDeleteTemplate(args) {
        if (!args?.name) {
            throw new Error('Template name is required');
        }
        try {
            await this.deleteTemplate(args.name);
            return {
                content: [{ type: 'text', text: `Template '${args.name}' deleted successfully` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to delete template: ${error}`);
        }
    }
    // Core Implementation Methods
    async listVaultFiles() {
        if (!fs.existsSync(this.vaultPath)) {
            fs.mkdirSync(this.vaultPath, { recursive: true });
        }
        const files = [];
        const scanDirectory = (dir, relativePath = '') => {
            const entries = fs.readdirSync(dir);
            for (const entry of entries) {
                const fullPath = path.join(dir, entry);
                const entryRelativePath = path.join(relativePath, entry);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory() && !entry.startsWith('.')) {
                    scanDirectory(fullPath, entryRelativePath);
                }
                else if (entry.endsWith('.md')) {
                    files.push(entryRelativePath);
                }
            }
        };
        scanDirectory(this.vaultPath);
        return files.sort();
    }
    async createNote(notePath, content) {
        const fullPath = path.join(this.vaultPath, notePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(fullPath)) {
            throw new Error(`Note already exists: ${notePath}`);
        }
        fs.writeFileSync(fullPath, content, 'utf-8');
    }
    async addTagsToNote(notePath, tags) {
        const fullPath = path.join(this.vaultPath, notePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Note not found: ${notePath}`);
        }
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\\n');
        const formattedTags = tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
        let frontmatterEnd = -1;
        let hasFrontmatter = false;
        if (lines[0] === '---') {
            hasFrontmatter = true;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    frontmatterEnd = i;
                    break;
                }
            }
        }
        if (hasFrontmatter && frontmatterEnd > 0) {
            let tagsLineIndex = -1;
            for (let i = 1; i < frontmatterEnd; i++) {
                if (lines[i].startsWith('tags:')) {
                    tagsLineIndex = i;
                    break;
                }
            }
            if (tagsLineIndex >= 0) {
                const existingTagsMatch = lines[tagsLineIndex].match(/tags:\\s*\\[(.*?)\\]/);
                const existingTags = existingTagsMatch ?
                    existingTagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [];
                const allTags = [...new Set([...existingTags, ...formattedTags])];
                lines[tagsLineIndex] = `tags: [${allTags.map(t => `"${t}"`).join(', ')}]`;
            }
            else {
                lines.splice(frontmatterEnd, 0, `tags: [${formattedTags.map(t => `"${t}"`).join(', ')}]`);
            }
        }
        else {
            const frontmatter = [
                '---',
                `tags: [${formattedTags.map(t => `"${t}"`).join(', ')}]`,
                '---',
                ''
            ];
            lines.splice(0, 0, ...frontmatter);
        }
        const newContent = lines.join('\\n');
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        return `Added tags ${formattedTags.join(', ')} to note ${notePath}`;
    }
    async listAllTags(sortBy = 'count', limit = 100) {
        const files = await this.listVaultFiles();
        const tagCount = new Map();
        for (const file of files) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                const frontmatterMatch = content.match(/^---\\n([\\s\\S]*?)\\n---/);
                if (frontmatterMatch) {
                    const tagsMatch = frontmatterMatch[1].match(/tags:\\s*\\[(.*?)\\]/);
                    if (tagsMatch) {
                        const tags = tagsMatch[1]
                            .split(',')
                            .map(t => t.trim().replace(/['"]/g, ''))
                            .filter(t => t.length > 0);
                        tags.forEach(tag => {
                            tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
                        });
                    }
                }
                const inlineTagMatches = content.match(/#[a-zA-Z0-9_-]+/g);
                if (inlineTagMatches) {
                    inlineTagMatches.forEach(tag => {
                        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        let sortedTags = Array.from(tagCount.entries());
        switch (sortBy) {
            case 'name':
                sortedTags.sort((a, b) => a[0].localeCompare(b[0]));
                break;
            case 'count':
                sortedTags.sort((a, b) => b[1] - a[1]);
                break;
            default:
                sortedTags.sort((a, b) => b[1] - a[1]);
        }
        sortedTags = sortedTags.slice(0, limit);
        const tagList = sortedTags.map(([tag, count]) => `${tag} (${count})`).join('\\n');
        return `Found ${tagCount.size} unique tags:\\n${tagList}`;
    }
    async searchNotesByTags(tags, operator = 'AND') {
        const files = await this.listVaultFiles();
        const results = [];
        const searchTags = tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
        for (const file of files) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                const fileTags = [];
                const frontmatterMatch = content.match(/^---\\n([\\s\\S]*?)\\n---/);
                if (frontmatterMatch) {
                    const tagsMatch = frontmatterMatch[1].match(/tags:\\s*\\[(.*?)\\]/);
                    if (tagsMatch) {
                        const extractedTags = tagsMatch[1]
                            .split(',')
                            .map(t => t.trim().replace(/['"]/g, ''))
                            .filter(t => t.length > 0);
                        fileTags.push(...extractedTags);
                    }
                }
                const inlineTagMatches = content.match(/#[a-zA-Z0-9_-]+/g);
                if (inlineTagMatches) {
                    fileTags.push(...inlineTagMatches);
                }
                let matches = false;
                if (operator === 'AND') {
                    matches = searchTags.every(tag => fileTags.includes(tag));
                }
                else {
                    matches = searchTags.some(tag => fileTags.includes(tag));
                }
                if (matches) {
                    results.push(file);
                }
            }
            catch (error) {
                continue;
            }
        }
        return `Found ${results.length} notes with tags [${tags.join(', ')}] (${operator}):\\n${results.join('\\n')}`;
    }
    async createTemplate(name, content, variables) {
        if (!fs.existsSync(this.templatesPath)) {
            fs.mkdirSync(this.templatesPath, { recursive: true });
        }
        const templatePath = path.join(this.templatesPath, name + '.json');
        if (fs.existsSync(templatePath)) {
            throw new Error('Template ' + name + ' already exists');
        }
        const template = {
            name,
            content,
            variables,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf-8');
    }
    async listTemplates() {
        if (!fs.existsSync(this.templatesPath)) {
            return 'No templates found. Templates directory does not exist.';
        }
        const files = fs.readdirSync(this.templatesPath)
            .filter(file => file.endsWith('.json'))
            .map(file => path.basename(file, '.json'));
        if (files.length === 0) {
            return 'No templates found.';
        }
        const templateDetails = [];
        for (const templateName of files) {
            try {
                const templatePath = path.join(this.templatesPath, templateName + '.json');
                const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
                const variables = templateData.variables && templateData.variables.length > 0
                    ? ' (Variables: ' + templateData.variables.join(', ') + ')'
                    : '';
                templateDetails.push('- ' + templateName + variables);
            }
            catch (error) {
                templateDetails.push('- ' + templateName + ' (Error reading template)');
            }
        }
        return 'Found ' + files.length + ' templates:\\n' + templateDetails.join('\\n');
    }
    async applyTemplate(templateName, notePath, variables) {
        const templatePath = path.join(this.templatesPath, templateName + '.json');
        if (!fs.existsSync(templatePath)) {
            throw new Error('Template ' + templateName + ' not found');
        }
        const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        let content = templateData.content;
        // 替换预定义变量
        const now = new Date();
        const predefinedVariables = {
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            datetime: now.toISOString(),
            year: now.getFullYear().toString(),
            month: (now.getMonth() + 1).toString().padStart(2, '0'),
            day: now.getDate().toString().padStart(2, '0'),
            title: path.basename(notePath, '.md')
        };
        // 合并用户提供的变量和预定义变量
        const allVariables = { ...predefinedVariables, ...variables };
        // 替换模板中的变量
        for (const [key, value] of Object.entries(allVariables)) {
            const regex = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
            content = content.replace(regex, String(value));
        }
        // 创建笔记
        await this.createNote(notePath, content);
        return 'Applied template ' + templateName + ' to create note at ' + notePath;
    }
    async deleteTemplate(name) {
        const templatePath = path.join(this.templatesPath, name + '.json');
        if (!fs.existsSync(templatePath)) {
            throw new Error('Template ' + name + ' not found');
        }
        fs.unlinkSync(templatePath);
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Obsidian MCP server running on stdio');
    }
    // ===========================================
    // 智能内容分析功能
    // ===========================================
    // 文本预处理工具函数
    preprocessText(text) {
        // 移除 Markdown 语法、数字、特殊字符，转为小写
        const cleanText = text
            .replace(/#{1,6}\s/g, '') // 移除标题标记
            .replace(/\*\*|__|\*|_/g, '') // 移除加粗和斜体
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
            .replace(/\[\[([^\]]+)\]\]/g, '$1') // 移除 wikilinks
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/`[^`]+`/g, '') // 移除内联代码
            .replace(/[0-9]+/g, '') // 移除数字
            .replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, ' ') // 只保留中文、英文和空格
            .toLowerCase();
        // 分词并过滤停用词
        const words = cleanText.split(/\s+/).filter(word => word.length > 1 &&
            !this.isStopWord(word));
        return words;
    }
    isStopWord(word) {
        const stopWords = new Set([
            // 英文停用词
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'over', 'after', 'is', 'are', 'was', 'were',
            'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these',
            'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
            'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
            // 中文停用词
            '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
            '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着',
            '没有', '看', '好', '自己', '这', '那', '他', '她', '们', '来',
            '出', '还', '可以', '都', '什么', '怎么', '为什么'
        ]);
        return stopWords.has(word);
    }
    // TF-IDF 算法实现
    calculateTfIdf(documents) {
        const documentCount = documents.length;
        const wordDocumentCount = new Map();
        // 计算每个词在多少文档中出现
        documents.forEach(doc => {
            const uniqueWords = new Set(doc);
            uniqueWords.forEach(word => {
                wordDocumentCount.set(word, (wordDocumentCount.get(word) || 0) + 1);
            });
        });
        // 为每个文档计算 TF-IDF
        return documents.map(doc => {
            const wordCount = new Map();
            doc.forEach(word => {
                wordCount.set(word, (wordCount.get(word) || 0) + 1);
            });
            const tfIdf = new Map();
            wordCount.forEach((count, word) => {
                const tf = count / doc.length; // 词频
                const idf = Math.log(documentCount / (wordDocumentCount.get(word) || 1)); // 逆向文档频率
                tfIdf.set(word, tf * idf);
            });
            return tfIdf;
        });
    }
    // 余弦相似度计算
    calculateCosineSimilarity(vec1, vec2) {
        const words1 = new Set(vec1.keys());
        const words2 = new Set(vec2.keys());
        const allWords = new Set([...words1, ...words2]);
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        allWords.forEach(word => {
            const val1 = vec1.get(word) || 0;
            const val2 = vec2.get(word) || 0;
            dotProduct += val1 * val2;
            norm1 += val1 * val1;
            norm2 += val2 * val2;
        });
        if (norm1 === 0 || norm2 === 0)
            return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    // 关键词提取处理函数
    async handleExtractKeywords(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const keywords = await this.extractKeywords(args.path, args.maxKeywords || 10);
            return {
                content: [{ type: 'text', text: `关键词提取结果：\n${keywords.map(k => `${k.word} (权重: ${k.score.toFixed(3)})`).join('\n')}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to extract keywords: ${error}`);
        }
    }
    async extractKeywords(notePath, maxKeywords) {
        const fullPath = path.join(this.vaultPath, notePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Note not found: ${notePath}`);
        }
        const content = fs.readFileSync(fullPath, 'utf-8');
        const words = this.preprocessText(content);
        if (words.length === 0) {
            return [];
        }
        // 获取所有笔记作为文档集合
        const allFiles = await this.listVaultFiles();
        const documents = [];
        for (const file of allFiles) {
            try {
                const fileContent = fs.readFileSync(path.join(this.vaultPath, file), 'utf-8');
                documents.push(this.preprocessText(fileContent));
            }
            catch (error) {
                continue;
            }
        }
        // 计算 TF-IDF
        const tfIdfScores = this.calculateTfIdf(documents);
        const currentDocIndex = allFiles.indexOf(notePath);
        if (currentDocIndex === -1) {
            // 如果当前文档不在列表中，单独计算
            const singleDocTfIdf = this.calculateTfIdf([words]);
            const scores = singleDocTfIdf[0];
            return Array.from(scores.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, maxKeywords)
                .map(([word, score]) => ({ word, score }));
        }
        const scores = tfIdfScores[currentDocIndex];
        return Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxKeywords)
            .map(([word, score]) => ({ word, score }));
    }
    // 摘要生成处理函数
    async handleGenerateSummary(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const summary = await this.generateSummary(args.path, args.maxSentences || 3);
            return {
                content: [{ type: 'text', text: `内容摘要：\n${summary}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to generate summary: ${error}`);
        }
    }
    async generateSummary(notePath, maxSentences) {
        const fullPath = path.join(this.vaultPath, notePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Note not found: ${notePath}`);
        }
        const content = fs.readFileSync(fullPath, 'utf-8');
        // 清理内容并分句
        const cleanContent = content
            .replace(/#{1,6}\s/g, '') // 移除标题标记
            .replace(/\*\*|__|\*|_/g, '') // 移除加粗和斜体
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
            .replace(/\[\[([^\]]+)\]\]/g, '$1') // 移除 wikilinks
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/`[^`]+`/g, ''); // 移除内联代码
        const sentences = cleanContent
            .split(/[。！？.!?]\s*/)
            .filter(s => s.trim().length > 10) // 过滤太短的句子
            .map(s => s.trim());
        if (sentences.length === 0) {
            return '无法生成摘要：内容太少或格式不支持';
        }
        // 如果句子数少于或等于要求的数量，直接返回
        if (sentences.length <= maxSentences) {
            return sentences.join('。') + '。';
        }
        // 简单的句子重要性评分（基于长度和关键词）
        const keywords = await this.extractKeywords(notePath, 20);
        const keywordSet = new Set(keywords.map(k => k.word));
        const sentenceScores = sentences.map((sentence, index) => {
            let score = sentence.length; // 基础分数：句子长度
            // 关键词加分
            const words = this.preprocessText(sentence);
            const keywordCount = words.filter(word => keywordSet.has(word)).length;
            score += keywordCount * 10;
            // 位置加分（开头和结尾的句子更重要）
            if (index === 0)
                score += 5;
            if (index === sentences.length - 1)
                score += 3;
            return { sentence, score, index };
        });
        // 选择得分最高的句子
        const selectedSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, maxSentences)
            .sort((a, b) => a.index - b.index) // 按原始顺序排列
            .map(item => item.sentence);
        return selectedSentences.join('。') + '。';
    }
    // 标签建议处理函数
    async handleSuggestTags(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const suggestedTags = await this.suggestTags(args.path, args.maxTags || 5);
            return {
                content: [{ type: 'text', text: `建议标签：\n${suggestedTags.map(t => `#${t.tag} (相关度: ${t.relevance.toFixed(3)})`).join('\n')}` }],
            };
        }
        catch (error) {
            throw new Error(`Failed to suggest tags: ${error}`);
        }
    }
    async suggestTags(notePath, maxTags) {
        const fullPath = path.join(this.vaultPath, notePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Note not found: ${notePath}`);
        }
        // 提取当前笔记的关键词
        const keywords = await this.extractKeywords(notePath, 20);
        // 获取所有现有标签
        const allFiles = await this.listVaultFiles();
        const existingTags = new Map();
        for (const file of allFiles) {
            try {
                const fileContent = fs.readFileSync(path.join(this.vaultPath, file), 'utf-8');
                // 提取 Frontmatter 标签
                const frontmatterMatch = fileContent.match(/^---\\n([\\s\\S]*?)\\n---/);
                if (frontmatterMatch) {
                    const tagsMatch = frontmatterMatch[1].match(/tags:\\s*\\[(.*?)\\]/);
                    if (tagsMatch) {
                        const tags = tagsMatch[1]
                            .split(',')
                            .map(t => t.trim().replace(/["'#]/g, ''))
                            .filter(t => t.length > 0);
                        tags.forEach(tag => {
                            existingTags.set(tag, (existingTags.get(tag) || 0) + 1);
                        });
                    }
                }
                // 提取内联标签
                const inlineTagMatches = fileContent.match(/#[a-zA-Z0-9\u4e00-\u9fa5_-]+/g);
                if (inlineTagMatches) {
                    inlineTagMatches.forEach(tag => {
                        const cleanTag = tag.substring(1); // 移除 #
                        existingTags.set(cleanTag, (existingTags.get(cleanTag) || 0) + 1);
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        // 基于关键词和现有标签的相似性计算建议
        const suggestions = [];
        // 1. 直接使用关键词作为标签建议
        keywords.slice(0, maxTags).forEach(keyword => {
            if (keyword.word.length >= 2 && !this.isStopWord(keyword.word)) {
                suggestions.push({
                    tag: keyword.word,
                    relevance: keyword.score
                });
            }
        });
        // 2. 基于现有标签的相似性建议
        const keywordSet = new Set(keywords.map(k => k.word));
        existingTags.forEach((count, tag) => {
            if (count >= 2) { // 只考虑使用频率较高的标签
                const tagWords = this.preprocessText(tag);
                const similarity = tagWords.filter(word => keywordSet.has(word)).length / Math.max(tagWords.length, 1);
                if (similarity > 0.3) {
                    suggestions.push({
                        tag: tag,
                        relevance: similarity * Math.log(count + 1)
                    });
                }
            }
        });
        // 去重并排序
        const uniqueSuggestions = new Map();
        suggestions.forEach(s => {
            const existing = uniqueSuggestions.get(s.tag) || 0;
            uniqueSuggestions.set(s.tag, Math.max(existing, s.relevance));
        });
        return Array.from(uniqueSuggestions.entries())
            .map(([tag, relevance]) => ({ tag, relevance }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, maxTags);
    }
    // 相似笔记查找处理函数
    async handleFindSimilarNotes(args) {
        if (!args?.path) {
            throw new Error('Path is required');
        }
        try {
            const similarNotes = await this.findSimilarNotes(args.path, args.threshold || 0.3, args.maxResults || 5);
            return {
                content: [{
                        type: 'text',
                        text: `相似笔记查找结果：\n${similarNotes.map(n => `${n.path} (相似度: ${n.similarity.toFixed(3)})`).join('\n')}`
                    }],
            };
        }
        catch (error) {
            throw new Error(`Failed to find similar notes: ${error}`);
        }
    }
    async findSimilarNotes(refNotePath, threshold, maxResults) {
        const refFullPath = path.join(this.vaultPath, refNotePath);
        if (!fs.existsSync(refFullPath)) {
            throw new Error(`Reference note not found: ${refNotePath}`);
        }
        // 获取所有笔记
        const allFiles = await this.listVaultFiles();
        const documents = [];
        const filePaths = [];
        for (const file of allFiles) {
            try {
                const fileContent = fs.readFileSync(path.join(this.vaultPath, file), 'utf-8');
                documents.push(this.preprocessText(fileContent));
                filePaths.push(file);
            }
            catch (error) {
                continue;
            }
        }
        // 计算 TF-IDF 向量
        const tfIdfVectors = this.calculateTfIdf(documents);
        const refIndex = filePaths.indexOf(refNotePath);
        if (refIndex === -1) {
            throw new Error('Reference note not found in processed documents');
        }
        const refVector = tfIdfVectors[refIndex];
        const similarities = [];
        // 计算与其他笔记的相似度
        tfIdfVectors.forEach((vector, index) => {
            if (index !== refIndex) {
                const similarity = this.calculateCosineSimilarity(refVector, vector);
                if (similarity >= threshold) {
                    similarities.push({
                        path: filePaths[index],
                        similarity: similarity
                    });
                }
            }
        });
        // 按相似度排序并返回前N个结果
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxResults);
    }
    // ===========================================
    // 图谱和关系分析功能
    // ===========================================
    // 分析笔记关系处理函数
    async handleAnalyzeNoteRelationships(args) {
        try {
            const analysis = await this.analyzeNoteRelationships(args?.includeBacklinks !== false, args?.includeTagRelations !== false);
            return {
                content: [{
                        type: 'text',
                        text: `笔记关系分析结果：\n${JSON.stringify(analysis, null, 2)}`
                    }],
            };
        }
        catch (error) {
            throw new Error(`Failed to analyze note relationships: ${error}`);
        }
    }
    async analyzeNoteRelationships(includeBacklinks, includeTagRelations) {
        const allFiles = await this.listVaultFiles();
        const relationships = {
            totalNotes: allFiles.length,
            linkedNotes: 0,
            orphanNotes: 0,
            totalLinks: 0,
            linkTypes: {
                wikilinks: 0,
                markdownLinks: 0,
                tagRelations: 0
            },
            topConnectedNotes: [],
            clusters: []
        };
        const noteConnections = new Map();
        const tagGroups = new Map();
        // 分析每个笔记
        for (const file of allFiles) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                const connections = new Set();
                if (includeBacklinks) {
                    // 提取 wikilinks
                    const wikilinkMatches = content.match(/\[\[([^\]]+)\]\]/g);
                    if (wikilinkMatches) {
                        wikilinkMatches.forEach(match => {
                            const linkedNote = match.slice(2, -2).split('|')[0]; // 移除 [[ ]] 和别名
                            connections.add(linkedNote + '.md');
                            relationships.linkTypes.wikilinks++;
                        });
                    }
                    // 提取 markdown 链接
                    const markdownLinkMatches = content.match(/\[([^\]]+)\]\(([^)]+\.md)\)/g);
                    if (markdownLinkMatches) {
                        markdownLinkMatches.forEach(match => {
                            const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
                            if (linkMatch) {
                                connections.add(linkMatch[2]);
                                relationships.linkTypes.markdownLinks++;
                            }
                        });
                    }
                }
                if (includeTagRelations) {
                    // 提取标签关系
                    const tags = this.extractTagsFromContent(content);
                    tags.forEach(tag => {
                        if (!tagGroups.has(tag)) {
                            tagGroups.set(tag, []);
                        }
                        tagGroups.get(tag).push(file);
                    });
                }
                if (connections.size > 0) {
                    relationships.linkedNotes++;
                    noteConnections.set(file, connections);
                    relationships.totalLinks += connections.size;
                }
                else {
                    relationships.orphanNotes++;
                }
            }
            catch (error) {
                continue;
            }
        }
        // 计算标签关系
        if (includeTagRelations) {
            tagGroups.forEach((notes, tag) => {
                if (notes.length > 1) {
                    relationships.clusters.push({ tag, notes });
                    // 为每个标签组内的笔记添加关系
                    for (let i = 0; i < notes.length; i++) {
                        for (let j = i + 1; j < notes.length; j++) {
                            relationships.linkTypes.tagRelations++;
                        }
                    }
                }
            });
        }
        // 计算最具连接性的笔记
        const connectionCounts = new Map();
        noteConnections.forEach((connections, note) => {
            connectionCounts.set(note, connections.size);
        });
        relationships.topConnectedNotes = Array.from(connectionCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, connections]) => ({ path, connections }));
        return relationships;
    }
    extractTagsFromContent(content) {
        const tags = [];
        // 提取 Frontmatter 标签
        const frontmatterMatch = content.match(/^---\\n([\\s\\S]*?)\\n---/);
        if (frontmatterMatch) {
            const tagsMatch = frontmatterMatch[1].match(/tags:\\s*\\[(.*?)\\]/);
            if (tagsMatch) {
                const frontmatterTags = tagsMatch[1]
                    .split(',')
                    .map(t => t.trim().replace(/["'#]/g, ''))
                    .filter(t => t.length > 0);
                tags.push(...frontmatterTags);
            }
        }
        // 提取内联标签
        const inlineTagMatches = content.match(/#[a-zA-Z0-9\u4e00-\u9fa5_-]+/g);
        if (inlineTagMatches) {
            const inlineTags = inlineTagMatches.map(tag => tag.substring(1));
            tags.push(...inlineTags);
        }
        return [...new Set(tags)]; // 去重
    }
    // 生成知识图谱处理函数
    async handleGenerateKnowledgeGraph(args) {
        try {
            const graph = await this.generateKnowledgeGraph(args?.format || 'json', args?.includeOrphans !== false);
            return {
                content: [{
                        type: 'text',
                        text: `知识图谱数据：\n${JSON.stringify(graph, null, 2)}`
                    }],
            };
        }
        catch (error) {
            throw new Error(`Failed to generate knowledge graph: ${error}`);
        }
    }
    async generateKnowledgeGraph(format, includeOrphans) {
        const allFiles = await this.listVaultFiles();
        const nodes = [];
        const edges = [];
        const nodeMap = new Map();
        // 创建节点
        allFiles.forEach((file, index) => {
            const nodeId = format === 'cytoscape' ? `n${index}` : index;
            nodeMap.set(file, nodeId);
            const node = format === 'cytoscape' ? {
                data: {
                    id: nodeId,
                    name: path.basename(file, '.md'),
                    path: file
                }
            } : {
                id: nodeId,
                name: path.basename(file, '.md'),
                path: file,
                type: 'note'
            };
            nodes.push(node);
        });
        // 分析连接关系
        for (const file of allFiles) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                const sourceId = nodeMap.get(file);
                // 提取 wikilinks
                const wikilinkMatches = content.match(/\[\[([^\]]+)\]\]/g);
                if (wikilinkMatches) {
                    wikilinkMatches.forEach(match => {
                        const linkedNote = match.slice(2, -2).split('|')[0] + '.md';
                        const targetId = nodeMap.get(linkedNote);
                        if (targetId !== undefined) {
                            const edge = format === 'cytoscape' ? {
                                data: {
                                    id: `e${edges.length}`,
                                    source: sourceId,
                                    target: targetId,
                                    type: 'wikilink'
                                }
                            } : {
                                id: `e${edges.length}`,
                                source: sourceId,
                                target: targetId,
                                type: 'wikilink'
                            };
                            edges.push(edge);
                        }
                    });
                }
                // 提取 markdown 链接
                const markdownLinkMatches = content.match(/\[([^\]]+)\]\(([^)]+\.md)\)/g);
                if (markdownLinkMatches) {
                    markdownLinkMatches.forEach(match => {
                        const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
                        if (linkMatch) {
                            const targetId = nodeMap.get(linkMatch[2]);
                            if (targetId !== undefined) {
                                const edge = format === 'cytoscape' ? {
                                    data: {
                                        id: `e${edges.length}`,
                                        source: sourceId,
                                        target: targetId,
                                        type: 'markdown'
                                    }
                                } : {
                                    id: `e${edges.length}`,
                                    source: sourceId,
                                    target: targetId,
                                    type: 'markdown'
                                };
                                edges.push(edge);
                            }
                        }
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        // 过滤孤立节点
        if (!includeOrphans) {
            const connectedNodeIds = new Set();
            edges.forEach(edge => {
                const sourceId = format === 'cytoscape' ? edge.data.source : edge.source;
                const targetId = format === 'cytoscape' ? edge.data.target : edge.target;
                connectedNodeIds.add(sourceId);
                connectedNodeIds.add(targetId);
            });
            const filteredNodes = nodes.filter(node => {
                const nodeId = format === 'cytoscape' ? node.data.id : node.id;
                return connectedNodeIds.has(nodeId);
            });
            return format === 'cytoscape' ? {
                nodes: filteredNodes,
                edges: edges
            } : {
                nodes: filteredNodes,
                links: edges
            };
        }
        return format === 'cytoscape' ? {
            nodes: nodes,
            edges: edges
        } : {
            nodes: nodes,
            links: edges
        };
    }
    // 查找孤立笔记处理函数
    async handleFindOrphanNotes(args) {
        try {
            const orphanNotes = await this.findOrphanNotes(args?.includeTagged !== true);
            return {
                content: [{
                        type: 'text',
                        text: `孤立笔记查找结果：\n${orphanNotes.length === 0 ? '未找到孤立笔记' : orphanNotes.join('\n')}`
                    }],
            };
        }
        catch (error) {
            throw new Error(`Failed to find orphan notes: ${error}`);
        }
    }
    async findOrphanNotes(excludeTagged) {
        const allFiles = await this.listVaultFiles();
        const linkedNotes = new Set();
        const orphanNotes = [];
        // 查找所有被引用的笔记
        for (const file of allFiles) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                // 提取 wikilinks
                const wikilinkMatches = content.match(/\[\[([^\]]+)\]\]/g);
                if (wikilinkMatches) {
                    wikilinkMatches.forEach(match => {
                        const linkedNote = match.slice(2, -2).split('|')[0] + '.md';
                        linkedNotes.add(linkedNote);
                    });
                }
                // 提取 markdown 链接
                const markdownLinkMatches = content.match(/\[([^\]]+)\]\(([^)]+\.md)\)/g);
                if (markdownLinkMatches) {
                    markdownLinkMatches.forEach(match => {
                        const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
                        if (linkMatch) {
                            linkedNotes.add(linkMatch[2]);
                        }
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        // 查找没有入链和出链的笔记
        for (const file of allFiles) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                // 检查是否有出链
                const hasOutgoingLinks = /\[\[([^\]]+)\]\]/.test(content) ||
                    /\[([^\]]+)\]\(([^)]+\.md)\)/.test(content);
                // 检查是否有入链
                const hasIncomingLinks = linkedNotes.has(file);
                // 检查是否有标签（如果需要排除有标签的笔记）
                let hasTags = false;
                if (excludeTagged) {
                    const tags = this.extractTagsFromContent(content);
                    hasTags = tags.length > 0;
                }
                // 如果没有入链、出链，且符合标签过滤条件，则为孤立笔记
                if (!hasOutgoingLinks && !hasIncomingLinks && (!excludeTagged || !hasTags)) {
                    orphanNotes.push(file);
                }
            }
            catch (error) {
                continue;
            }
        }
        return orphanNotes.sort();
    }
    // 建议连接处理函数
    async handleSuggestConnections(args) {
        try {
            const suggestions = await this.suggestConnections(args?.threshold || 0.4, args?.maxSuggestions || 10);
            return {
                content: [{
                        type: 'text',
                        text: `连接建议：\n${suggestions.map(s => `${s.note1} ↔ ${s.note2} (相似度: ${s.similarity.toFixed(3)}, 原因: ${s.reason})`).join('\n')}`
                    }],
            };
        }
        catch (error) {
            throw new Error(`Failed to suggest connections: ${error}`);
        }
    }
    async suggestConnections(threshold, maxSuggestions) {
        const allFiles = await this.listVaultFiles();
        const suggestions = [];
        // 获取现有连接
        const existingConnections = new Set();
        for (const file of allFiles) {
            try {
                const fullPath = path.join(this.vaultPath, file);
                const content = fs.readFileSync(fullPath, 'utf-8');
                // 记录现有的 wikilinks
                const wikilinkMatches = content.match(/\[\[([^\]]+)\]\]/g);
                if (wikilinkMatches) {
                    wikilinkMatches.forEach(match => {
                        const linkedNote = match.slice(2, -2).split('|')[0] + '.md';
                        const connection1 = `${file}|${linkedNote}`;
                        const connection2 = `${linkedNote}|${file}`;
                        existingConnections.add(connection1);
                        existingConnections.add(connection2);
                    });
                }
                // 记录现有的 markdown 链接
                const markdownLinkMatches = content.match(/\[([^\]]+)\]\(([^)]+\.md)\)/g);
                if (markdownLinkMatches) {
                    markdownLinkMatches.forEach(match => {
                        const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
                        if (linkMatch) {
                            const connection1 = `${file}|${linkMatch[2]}`;
                            const connection2 = `${linkMatch[2]}|${file}`;
                            existingConnections.add(connection1);
                            existingConnections.add(connection2);
                        }
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        // 计算所有笔记的 TF-IDF 向量
        const documents = [];
        const filePaths = [];
        for (const file of allFiles) {
            try {
                const fileContent = fs.readFileSync(path.join(this.vaultPath, file), 'utf-8');
                documents.push(this.preprocessText(fileContent));
                filePaths.push(file);
            }
            catch (error) {
                continue;
            }
        }
        const tfIdfVectors = this.calculateTfIdf(documents);
        // 计算所有笔记对之间的相似度
        for (let i = 0; i < filePaths.length; i++) {
            for (let j = i + 1; j < filePaths.length; j++) {
                const file1 = filePaths[i];
                const file2 = filePaths[j];
                const connectionKey = `${file1}|${file2}`;
                // 跳过现有连接
                if (existingConnections.has(connectionKey)) {
                    continue;
                }
                // 计算内容相似度
                const contentSimilarity = this.calculateCosineSimilarity(tfIdfVectors[i], tfIdfVectors[j]);
                if (contentSimilarity >= threshold) {
                    // 分析相似性原因
                    const reason = await this.analyzeSimilarityReason(file1, file2, tfIdfVectors[i], tfIdfVectors[j]);
                    suggestions.push({
                        note1: file1,
                        note2: file2,
                        similarity: contentSimilarity,
                        reason: reason
                    });
                }
            }
        }
        // 按相似度排序并返回前N个建议
        return suggestions
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxSuggestions);
    }
    async analyzeSimilarityReason(file1, file2, vector1, vector2) {
        // 找到共同的高权重词汇
        const commonWords = [];
        vector1.forEach((score1, word) => {
            const score2 = vector2.get(word);
            if (score2 && score2 > 0) {
                commonWords.push({
                    word: word,
                    score: (score1 + score2) / 2
                });
            }
        });
        // 按分数排序并取前3个
        const topCommonWords = commonWords
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.word);
        if (topCommonWords.length === 0) {
            return '内容相似';
        }
        // 检查是否有共同标签
        try {
            const content1 = fs.readFileSync(path.join(this.vaultPath, file1), 'utf-8');
            const content2 = fs.readFileSync(path.join(this.vaultPath, file2), 'utf-8');
            const tags1 = new Set(this.extractTagsFromContent(content1));
            const tags2 = new Set(this.extractTagsFromContent(content2));
            const commonTags = Array.from(tags1).filter(tag => tags2.has(tag));
            if (commonTags.length > 0) {
                return `共同标签: ${commonTags.slice(0, 2).map(t => '#' + t).join(', ')}`;
            }
        }
        catch (error) {
            // 忽略错误，继续处理
        }
        return `关键词相似: ${topCommonWords.join(', ')}`;
    }
}
// Create and run the server
const server = new ObsidianMcpServer();
server.run().catch(console.error);
//# sourceMappingURL=index_new.js.map