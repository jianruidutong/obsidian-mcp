# Contributing to Enhanced Obsidian MCP Server

We welcome contributions to the Enhanced Obsidian MCP Server! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Let us know!
- 💡 **Feature Requests**: Have an idea for improvement?
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code**: Submit bug fixes or new features
- 🧪 **Testing**: Help us test new features
- 🌐 **Translation**: Help us support more languages

### Before You Start

1. Check existing [issues](https://github.com/jianruidutong/obsidian-mcp/issues) and [discussions](https://github.com/jianruidutong/obsidian-mcp/discussions)
2. For large changes, open an issue first to discuss your approach
3. Fork the repository and create a feature branch

## Development Setup

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Git
- Obsidian with Local REST API plugin

### Setup Steps

1. **Fork and clone the repository**:
```bash
git clone https://github.com/yourusername/obsidian-mcp.git
cd obsidian-mcp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
# Edit .env with your Obsidian vault settings
```

4. **Build the project**:
```bash
npm run build
```

5. **Run in development mode**:
```bash
npm run dev
```

### Project Structure

```
obsidian-mcp/
├── src/                    # Source code
│   └── index.ts           # Main server implementation
├── build/                 # Compiled JavaScript
├── test/                  # Test files
├── docs/                  # Documentation
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Making Changes

### Branching Strategy

1. Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

2. Use descriptive branch names:
- `feature/add-template-system`
- `fix/search-case-sensitivity`
- `docs/update-installation-guide`

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "feat: add template system with variable substitution"
git commit -m "fix: resolve case sensitivity issue in search"
git commit -m "docs: update installation guide for Windows"

# Format: type(scope): description
# Types: feat, fix, docs, style, refactor, test, chore
```

### Adding New Tools

When adding new MCP tools:

1. **Define the tool** in the `setupToolHandlers()` method
2. **Implement the handler** method (e.g., `handleYourNewTool()`)
3. **Add comprehensive error handling**
4. **Include input validation**
5. **Write tests** for the new functionality
6. **Update documentation**

Example tool structure:
```typescript
{
  name: 'your_new_tool',
  description: 'Clear description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Parameter description' },
      param2: { type: 'number', default: 10, description: 'Optional parameter' }
    },
    required: ['param1'],
  },
}
```

## Submitting Changes

### Pull Request Process

1. **Ensure your code passes all tests**:
```bash
npm test
npm run build
```

2. **Update documentation** if needed:
- README.md for new features
- INSTALLATION.md for setup changes
- Code comments for complex logic

3. **Create a pull request**:
- Use a descriptive title
- Include a detailed description
- Reference any related issues
- Add screenshots for UI changes

4. **PR Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Documentation** review if applicable

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use meaningful variable and function names
- Add JSDoc comments for public methods

```typescript
/**
 * Extracts keywords from note content using TF-IDF algorithm
 * @param args - Arguments containing path and maxKeywords
 * @returns Promise with extracted keywords
 */
private async handleExtractKeywords(args: any): Promise<any> {
  // Implementation
}
```

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line structures
- Use meaningful comments

### Error Handling

Always include proper error handling:

```typescript
try {
  // Operation
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  throw new McpError(
    ErrorCode.InternalError,
    `Operation failed: ${error.message}`
  );
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
node test-specific-feature.js

# Run with verbose output
npm test -- --verbose
```

### Writing Tests

Create tests for new functionality:

```javascript
// test/test-your-feature.js
const { testTool } = require('./test-utils');

async function testYourNewTool() {
  try {
    const result = await testTool('your_new_tool', {
      param1: 'test-value'
    });
    
    console.log('✅ Your new tool test passed');
    return true;
  } catch (error) {
    console.error('❌ Your new tool test failed:', error);
    return false;
  }
}

module.exports = { testYourNewTool };
```

### Test Coverage

Aim for high test coverage:
- Unit tests for individual functions
- Integration tests for tool workflows
- Error condition testing

## Documentation

### What to Document

- **New features**: Add to README.md
- **API changes**: Update relevant documentation
- **Configuration changes**: Update INSTALLATION.md
- **Breaking changes**: Clearly document migration steps

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for visual changes
- Keep examples up-to-date

## Getting Help

Need help contributing?

- 💬 [Start a discussion](https://github.com/jianruidutong/obsidian-mcp/discussions)
- 📧 Email us at [support@jianruidutong.com](jianruidutong@foxmail.com)
- 🐛 [Open an issue](https://github.com/jianruidutong/obsidian-mcp/issues) for bugs

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to the Enhanced Obsidian MCP Server! 🎉