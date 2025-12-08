# 🚀 AgentForge-XT

> **A modern, open-source workflow automation platform powered by AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![n8n](https://img.shields.io/badge/n8n-Integrated-orange)](https://n8n.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

AgentForge-XT is a production-ready workflow automation platform inspired by n8n, featuring a visual workflow editor, AI-powered agents, and seamless integrations. Built with modern web technologies and designed for developers who want full control over their automation infrastructure.

---

## ✨ Features

### 🎨 Visual Workflow Editor
- **Drag-and-drop interface** - Intuitive node-based workflow builder
- **Real-time execution** - Watch workflows execute with live status updates
- **n8n-inspired design** - Professional, modern UI/UX
- **Responsive canvas** - Works on desktop and tablet devices
- **Pre-built templates** - 6+ ready-to-use workflow templates

### 🤖 AI & Automation
- **AI Agents** - OpenAI-powered intelligent automation (GPT-4, GPT-3.5)
- **Vector Stores** - Qdrant integration for semantic search
- **RAG Workflows** - Build retrieval-augmented generation pipelines
- **Embeddings** - Text embedding generation for AI features
- **Chat Triggers** - Conversational AI workflows
- **Background Execution** - 24/7 automation via n8n engine

### 🔌 Integrations
- **n8n Engine** - Full integration with n8n for backend execution
- **Slack** - Team notifications and messaging
- **Email** - Automated email workflows
- **HTTP APIs** - Connect to any REST API
- **Webhooks** - Event-driven automation
- **Scheduled Tasks** - Cron-based workflows

### 🗄️ Backend & Data
- **Supabase** - PostgreSQL with Row Level Security
- **Firebase Auth** - Secure user authentication
- **Real-time Sync** - Live updates across sessions
- **Data Retention** - Automatic cleanup policies

### ⚙️ Settings & Configuration
- **Service Status Monitoring** - Real-time n8n and AI service status
- **API Key Management** - Secure storage for OpenAI and other services
- **User Preferences** - Auto-save, notifications, theme settings
- **n8n Integration Settings** - Configure your n8n instance

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Docker Desktop** (for n8n and Qdrant)
- **Supabase account** (free tier works)
- **Firebase project** (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/aditya4232/AgentForge-XT.git
cd AgentForge-XT

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the schema from `supabase/schema.sql`
4. Update `.env.local` with your Supabase credentials

### n8n + AI Services Setup

```bash
# Start n8n automation engine, Qdrant, and Redis
docker-compose up -d

# Access n8n at http://localhost:5678
# Default credentials: admin / password (change immediately!)

# Qdrant is available at http://localhost:6333
```

---

## 🔧 Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n Configuration
NEXT_PUBLIC_N8N_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Qdrant Vector Database
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
```

---

## 📖 Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed installation instructions
- **[Architecture](docs/ARCHITECTURE.md)** - System design and structure
- **[Enhancement Plan](docs/ENHANCEMENT_PLAN.md)** - Roadmap and feature planning
- **[Testing Guide](docs/TESTING.md)** - How to run and write tests
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Security](SECURITY.md)** - Security best practices

---

## 📋 Workflow Templates

AgentForge-XT comes with 6 pre-built workflow templates:

| Template | Category | Difficulty | Description |
|----------|----------|------------|-------------|
| Slack Notification Bot | Notifications | Beginner | Send automated Slack notifications |
| Email Automation | Email | Intermediate | Process and respond to emails |
| Data ETL Pipeline | Data Processing | Intermediate | Extract, transform, and load data |
| AI Q&A Chatbot (RAG) | AI | Advanced | Intelligent chatbot with RAG |
| AI Content Generator | AI | Intermediate | Generate content with GPT-4 |
| Multi-API Orchestration | Integration | Advanced | Coordinate multiple API calls |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Workflow** | ReactFlow |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Firebase Authentication |
| **Automation** | n8n (integrated) |
| **AI** | OpenAI (GPT-4, Embeddings) |
| **Vector Store** | Qdrant |
| **Deployment** | Vercel, Docker |

---

## 🎯 Use Cases

- **AI Chatbots** - Build conversational AI with RAG
- **Data Pipelines** - ETL workflows with transformations
- **Notifications** - Multi-channel alert systems
- **Content Generation** - Automated content workflows
- **API Orchestration** - Complex API integrations
- **Scheduled Tasks** - Cron-based automation
- **Lead Generation** - Automated lead processing
- **Customer Support** - AI-powered support workflows

---

## 📊 Project Status

- ✅ **Core Features** - Complete
- ✅ **AI Integration** - Complete
- ✅ **n8n Integration** - Complete
- ✅ **Database** - Complete
- ✅ **Authentication** - Complete
- ✅ **Workflow Templates** - Complete
- ✅ **Settings Page** - Complete
- 🚧 **Analytics Dashboard** - In Progress
- 📋 **Mobile App** - Planned

---

## 🧪 Testing

```bash
# Run all tests
run-tests.bat

# Or run individually:
npm run lint        # ESLint
npm run test        # Unit tests
npm run test:e2e    # E2E tests (requires dev server)
```

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🔒 Security

Security is a top priority. Please review our [Security Policy](SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Known security considerations

**Never commit sensitive data!** Always use environment variables.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [n8n](https://n8n.io) - Inspiration and backend automation
- [ReactFlow](https://reactflow.dev) - Visual workflow library
- [Supabase](https://supabase.com) - Backend infrastructure
- [OpenAI](https://openai.com) - AI capabilities
- [Qdrant](https://qdrant.tech) - Vector database
- [Vercel](https://vercel.com) - Deployment platform

---

## 📞 Support & Community

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/aditya4232/AgentForge-XT/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aditya4232/AgentForge-XT/discussions)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps others discover the project.

---

**Built with ❤️ by [Aditya Shenvi](https://linkedin.com/in/aditya-shenvi) • Final Year Project 2024**
