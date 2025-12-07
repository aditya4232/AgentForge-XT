# AgentForge-XT 🚀

**Visual Multi-Agent Workflow Builder** - Build AI agent teams with drag-and-drop simplicity.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)](https://fastapi.tiangolo.com/)
[![CrewAI](https://img.shields.io/badge/CrewAI-Latest-blue)](https://www.crewai.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 What Makes Us Unique

AgentForge-XT is the **first visual multi-agent builder** that lets you create AI agent teams without writing code. Watch agents collaborate, debate, and solve complex tasks in real-time.

### Key Features

- 🎨 **Visual Agent Builder** - Drag-and-drop interface powered by React Flow
- 🤖 **Multi-Agent Collaboration** - Agents work together using CrewAI
- ⚡ **100% Free Tier** - Groq, Supabase, Qdrant Cloud, Clerk, Vercel
- 📊 **Real-Time Dashboard** - Watch agents think and collaborate live
- 🏪 **Template Marketplace** - Pre-built agent teams ready to use
- 🔐 **Enterprise Auth** - Clerk with social logins and MFA
- 🧠 **Vector Memory** - RAG-powered context-aware agents

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AgentForge-XT.git
cd AgentForge-XT
```

### 2. Set Up Environment Variables

```bash
# Copy example env files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Edit `.env.local` and `backend/.env` with your API keys:

```env
# Get free API keys from:
# Groq: https://console.groq.com
# Clerk: https://clerk.com
# Supabase: https://supabase.com
# Qdrant: https://cloud.qdrant.io
```

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 4. Run Development Servers

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn main:app --reload
```

Visit **http://localhost:3000** 🎉

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Tremor** - Dashboard components
- **TanStack Query** - Server state management
- **React Flow** - Visual workflow builder
- **Clerk** - Authentication

### Backend
- **FastAPI** - Python async framework
- **CrewAI** - Multi-agent orchestration
- **Groq** - Free LLM inference
- **Supabase** - PostgreSQL database
- **Qdrant** - Vector database
- **Redis** - Caching & queues

## 🎯 Use Cases

### Pre-built Agent Teams

1. **Blog Writer Team**
   - Researcher → Writer → SEO Optimizer
   - Perfect for content creation

2. **Code Review Team**
   - Coder → Security Reviewer → Performance Optimizer
   - Automated code quality checks

3. **Market Research Team**
   - Data Collector → Analyst → Report Writer
   - Business intelligence automation

4. **Customer Support Team**
   - Ticket Classifier → Responder → Quality Checker
   - Automated support workflows

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Building Your First Agent Team](docs/first-agent-team.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

## 🚢 Deployment

### Vercel (Frontend)

```bash
vercel --prod
```

### Railway (Backend)

```bash
railway up
```

See [Deployment Guide](docs/deployment.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CrewAI](https://www.crewai.com/) - Multi-agent framework
- [Groq](https://groq.com/) - Lightning-fast LLM inference
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Tremor](https://tremor.so/) - Dashboard components

## 📧 Contact

- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **LinkedIn**: [Your Name](https://linkedin.com/in/yourprofile)
- **Email**: your.email@example.com

---

**Built with ❤️ by [Your Name]**

⭐ Star us on GitHub if you find this project useful!
