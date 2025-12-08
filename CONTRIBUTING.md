# Contributing to AgentForge-XT

First off, thank you for considering contributing to AgentForge-XT! It's people like you that make AgentForge-XT such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples** to demonstrate the steps
* **Describe the behavior you observed** and what behavior you expected
* **Include screenshots** if relevant
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description** of the suggested enhancement
* **Explain why this enhancement would be useful**
* **List some examples** of how it would be used

### Pull Requests

* Fill in the required template
* Follow the TypeScript/React style guide
* Include tests when adding new features
* Update documentation as needed
* End all files with a newline

## Development Setup

### Prerequisites

* Node.js 18+ and npm
* Docker Desktop (for n8n)
* Git

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AgentForge-XT.git
   cd AgentForge-XT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up Supabase**
   * Create a project at https://supabase.com
   * Run the schema from `supabase/schema.sql`
   * Update `.env.local` with your Supabase credentials

5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

* `feature/` - New features
* `fix/` - Bug fixes
* `docs/` - Documentation updates
* `refactor/` - Code refactoring
* `test/` - Test additions/updates

Example: `feature/add-ai-agent-node`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
* `feat`: New feature
* `fix`: Bug fix
* `docs`: Documentation
* `style`: Formatting, missing semicolons, etc.
* `refactor`: Code restructuring
* `test`: Adding tests
* `chore`: Maintenance

Examples:
```
feat(workflow): add AI agent node type

fix(dashboard): correct workflow count calculation

docs(readme): update installation instructions
```

### Code Style

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused

### Testing

Before submitting a PR:

```bash
# Run linter
npm run lint

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Or run all
npm run test:all
```

### Documentation

* Update README.md if you change functionality
* Add JSDoc comments for new functions
* Update relevant docs in `/docs` folder
* Include examples for new features

## Project Structure

```
AgentForge-XT/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── lib/              # Utilities
├── supabase/             # Database schema
├── tests/                # Test files
├── docs/                 # Documentation
└── public/               # Static assets
```

## Security

### Reporting Security Issues

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, email security@agentforge-xt.dev with:
* Description of the vulnerability
* Steps to reproduce
* Potential impact
* Suggested fix (if any)

### Security Best Practices

* Never commit `.env.local` or any file with secrets
* Use environment variables for all sensitive data
* Follow the principle of least privilege
* Keep dependencies updated
* Use Supabase RLS for data access control

## Getting Help

* **Documentation**: Check `/docs` folder
* **Issues**: Search existing issues
* **Discussions**: Use GitHub Discussions for questions
* **Discord**: Join our community (link in README)

## Recognition

Contributors will be recognized in:
* README.md Contributors section
* Release notes
* Project website (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AgentForge-XT! 🚀
