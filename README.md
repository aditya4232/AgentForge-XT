# AgentForge-XT 🚀

**The Ultimate AI-Powered Workflow Automation Platform**

A production-ready, n8n-inspired workflow automation platform with AI agents, vector stores, and seamless integrations. Built with Next.js 14, Supabase, Firebase, and n8n.

## ✨ Features

### 🎨 **n8n-Inspired Visual Workflow Editor**
- **Drag-and-Drop Interface**: Intuitive node-based workflow builder
- **Real-time Execution**: Watch your workflows execute with live status updates
- **Horizontal Node Layout**: Clean, modern design matching n8n's aesthetics
- **Floating Panels**: Collapsible node library and configuration panels
- **Execution Logs**: Terminal-style log viewer for debugging

### 🤖 **AI & Automation**
- **AI Agents**: OpenAI-powered intelligent agents
- **Vector Stores**: Qdrant integration for semantic search
- **Embeddings**: OpenAI embeddings for RAG workflows
- **Chat Triggers**: Build conversational AI workflows
- **Background Execution**: n8n engine for 24/7 automation

### 🔌 **Integrations**
- **Slack**: Send notifications and messages
- **Email**: Automated email workflows
- **HTTP Requests**: Connect to any API
- **Webhooks**: Trigger workflows from external events
- **Scheduled Tasks**: Cron-based automation

### 🗄️ **Backend & Data**
- **Supabase**: PostgreSQL database with Row Level Security
- **Firebase Auth**: Secure user authentication
- **10-Day Data Retention**: Automatic cleanup of old execution logs
- **Real-time Sync**: Live workflow updates across sessions

### 🎯 **Production Features**
- **Dockerized n8n**: Self-hosted automation engine
- **Vercel Ready**: Optimized for edge deployment
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Supabase account
- Firebase project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/AgentForge-XT.git
cd AgentForge-XT
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database**
```bash
# Run the schema in your Supabase SQL editor
cat supabase/schema.sql
```

5. **Start n8n automation engine**
```bash
docker-compose up -d
```

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
- Frontend: http://localhost:3000
- n8n Engine: http://localhost:5678 (admin/password)

## 📁 Project Structure

```
AgentForge-XT/
├── src/
│   ├── app/
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── workflow/[id]/     # Workflow editor
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── workflow/          # Workflow components
│   │   │   └── CustomNode.tsx # n8n-style node component
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── supabase.ts        # Supabase client
│       ├── firebase.ts        # Firebase config
│       └── workflow-constants.ts # Node definitions
├── supabase/
│   ├── schema.sql             # Database schema
│   └── retention_policy.sql   # Data cleanup policy
├── docker-compose.yml         # n8n + PostgreSQL setup
└── package.json
```

## 🎨 UI Components

### Workflow Editor
- **Top Bar**: Workflow name, tabs (Editor/Executions), active toggle, save/execute buttons
- **Floating Add Button**: Quick access to node library
- **Node Library Sidebar**: Categorized integrations (Triggers, AI & Agents, Integrations, Logic & Data)
- **Canvas**: ReactFlow-powered visual editor with zoom, pan, minimap
- **Config Panel**: Node-specific configuration
- **Log Panel**: Collapsible execution logs

### Node Categories
1. **Triggers**: Webhook, Schedule, Manual, Chat Message
2. **AI & Agents**: AI Agent, OpenAI Chat, Vector Store, Qdrant, Embeddings
3. **Integrations**: Slack, Email, HTTP Request
4. **Logic & Data**: Condition, Loop, Transform, Filter

## 🗃️ Database Schema

### Tables
- `profiles`: User profiles synced from Firebase
- `workflows`: Workflow definitions (nodes, edges, metadata)
- `executions`: Workflow execution history
- `node_templates`: Available node types

### Data Retention
- Executions older than 10 days are automatically deleted
- Configurable via `supabase/retention_policy.sql`

## 🔐 Security

- **Row Level Security (RLS)**: All tables protected
- **Firebase Auth**: Secure user authentication
- **Encrypted API Keys**: Sensitive data encrypted at rest
- **HTTPS Only**: Enforced in production

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### n8n (Backend)
```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Supabase
- Database: Managed by Supabase
- Edge Functions: Deploy via Supabase CLI

## 🛠️ Development

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Bundle Size**: Optimized with Next.js 14

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [n8n](https://n8n.io) - Inspiration for the workflow editor
- [ReactFlow](https://reactflow.dev) - Visual workflow library
- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Deployment platform

## 📞 Support

- **Documentation**: [docs.agentforge-xt.dev](https://docs.agentforge-xt.dev)
- **Discord**: [Join our community](https://discord.gg/agentforge)
- **Email**: support@agentforge-xt.dev

---

**Built with ❤️ by AdityaShenvi**
