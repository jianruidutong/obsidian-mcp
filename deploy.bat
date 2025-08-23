@echo off
echo.
echo 🚀 Enhanced Obsidian MCP Server - Repository Setup
echo ==================================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Initialize git repository if not already initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
)

REM Add all files
echo 📋 Adding files to Git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "feat: Enhanced Obsidian MCP Server v2.0.0 with 25 AI tools

- 🧠 15 new AI-enhanced tools for intelligent content analysis
- 🔗 Smart auto-linking with advanced pattern recognition  
- 📊 Knowledge graph generation for visualization
- 🏷️ Advanced tag management with intelligent suggestions
- 📝 Template system for consistent note creation
- 🔍 Content similarity analysis using TF-IDF and cosine similarity
- 📈 Relationship analysis for discovering hidden connections

Core Features:
- 10 enhanced note management tools
- 3 advanced tag management tools  
- 4 template system tools
- 4 AI content analysis tools
- 4 knowledge graph & analytics tools

Breaking Changes:
- Updated to v2.0.0 with new package name @jianruidutong/obsidian-mcp
- Enhanced API with additional intelligent features
- Improved error handling and validation"

REM Set up remote repository
echo 🔗 Setting up remote repository...
git branch -M main
git remote add origin https://github.com/newtype-01/obsidian-mcp.git

REM Push to repository
echo ⬆️ Pushing to GitHub...
echo Note: You may need to authenticate with GitHub
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo.
echo 📋 Next Steps:
echo 1. Go to https://github.com/newtype-01/obsidian-mcp
echo 2. Verify all files are uploaded correctly
echo 3. Update repository description and topics
echo 4. Enable GitHub Pages if needed
echo 5. Create releases and tags
echo.
echo 🔧 To install the package:
echo npm install -g @jianruidutong/obsidian-mcp
echo.
echo 📖 Documentation links:
echo - README.md: Main documentation
echo - README.zh.md: Chinese documentation
echo - INSTALLATION.md: Detailed installation guide
echo - CONTRIBUTING.md: Contribution guidelines
echo.
pause