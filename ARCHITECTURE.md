# 🏗️ AgentForge-XT Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                     (Your Browser)                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Frontend                         │  │
│  │                                                          │  │
│  │  Pages:                    Components:                  │  │
│  │  • Home (/)               • CustomNode                  │  │
│  │  • Auth (/auth/*)         • WorkflowEditor              │  │
│  │  • Dashboard              • NodeLibrary                 │  │
│  │  • Workflow Editor        • ConfigPanel                 │  │
│  │                                                          │  │
│  │  State Management:        Libraries:                    │  │
│  │  • React Hooks            • ReactFlow                   │  │
│  │  • Zustand (optional)     • Framer Motion               │  │
│  │                           • Lucide Icons                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                  │
│                   (Next.js API Routes)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/workflows                                          │  │
│  │    • GET    - List all workflows                         │  │
│  │    • POST   - Create new workflow                        │  │
│  │                                                          │  │
│  │  /api/workflows/[id]                                     │  │
│  │    • GET    - Get workflow details                       │  │
│  │    • PUT    - Update workflow                            │  │
│  │    • DELETE - Delete workflow                            │  │
│  │                                                          │  │
│  │  /api/workflows/[id]/execute                             │  │
│  │    • POST   - Execute workflow                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   AUTHENTICATION         │   │   DATABASE               │
│   (Firebase)             │   │   (Supabase)             │
│                          │   │                          │
│  • Email/Password        │   │  Tables:                 │
│  • Google OAuth          │   │  • profiles              │
│  • Session Management    │   │  • workflows             │
│  • JWT Tokens            │   │  • executions            │
│                          │   │  • node_templates        │
│  Port: N/A (Cloud)       │   │                          │
│  Status: ✅ Configured   │   │  Features:               │
│                          │   │  • Row Level Security    │
│                          │   │  • Real-time Sync        │
│                          │   │  • Auto Backups          │
│                          │   │  • 10-day Retention      │
│                          │   │                          │
│                          │   │  Port: 5432 (Cloud)      │
│                          │   │  Status: ⚠️ Needs Setup  │
└──────────────────────────┘   └──────────────────────────┘
                                           │
                                           │ Triggers
                                           ▼
                              ┌──────────────────────────┐
                              │   AUTOMATION ENGINE      │
                              │   (n8n - Optional)       │
                              │                          │
                              │  • Workflow Execution    │
                              │  • Background Jobs       │
                              │  • Cron Scheduling       │
                              │  • Webhooks              │
                              │  • API Integrations      │
                              │                          │
                              │  Port: 5678              │
                              │  Status: ⚠️ Optional     │
                              │                          │
                              │  Database:               │
                              │  • PostgreSQL (Docker)   │
                              │  • Port: 5432 (Local)    │
                              └──────────────────────────┘
```

---

## Data Flow

### 1. User Authentication Flow
```
User → Sign Up/In Page → Firebase Auth → JWT Token → Store in Browser
                                              ↓
                                        Create Profile in Supabase
```

### 2. Workflow Creation Flow
```
User → Dashboard → Click "New Workflow" → POST /api/workflows
                                              ↓
                                        Supabase Insert
                                              ↓
                                        Return Workflow ID
                                              ↓
                                        Redirect to Editor
```

### 3. Workflow Editing Flow
```
User → Workflow Editor → Drag Nodes → Connect → Configure
                                              ↓
                                        Click "Save"
                                              ↓
                                        PUT /api/workflows/[id]
                                              ↓
                                        Supabase Update
                                              ↓
                                        Show Success Toast
```

### 4. Workflow Execution Flow (Frontend)
```
User → Click "Execute" → Simulate Node Execution
                              ↓
                        Update Node Status (running → success/error)
                              ↓
                        Show Logs in Bottom Panel
                              ↓
                        Save Execution to Database
```

### 5. Workflow Execution Flow (n8n - Optional)
```
Trigger Event → n8n Webhook → Execute Workflow in n8n
                                    ↓
                              Process Nodes
                                    ↓
                              Call External APIs
                                    ↓
                              Log Results
                                    ↓
                              Update Supabase
```

---

## Technology Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Next.js | React Framework | 14.2.18 |
| React | UI Library | 18.3.1 |
| TypeScript | Type Safety | 5.7.2 |
| ReactFlow | Workflow Editor | 11.11.4 |
| Framer Motion | Animations | 11.11.17 |
| Tailwind CSS | Styling | 3.4.15 |
| Lucide Icons | Icons | 0.460.0 |

### Backend
| Technology | Purpose | Status |
|-----------|---------|--------|
| Supabase | Database | ⚠️ Setup Required |
| Firebase | Authentication | ✅ Configured |
| n8n | Automation | ⚠️ Optional |
| PostgreSQL | Database Engine | Via Supabase |

### DevOps
| Technology | Purpose | Status |
|-----------|---------|--------|
| Docker | Containerization | For n8n |
| Vercel | Deployment | Ready |
| Git | Version Control | ✅ |

---

## File Structure

```
AgentForge-XT/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── auth/                     # Authentication
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   │
│   │   ├── dashboard/                # Dashboard
│   │   │   └── page.tsx
│   │   │
│   │   ├── workflow/                 # Workflow Editor
│   │   │   └── [id]/page.tsx
│   │   │
│   │   └── api/                      # API Routes
│   │       ├── health/route.ts
│   │       └── workflows/
│   │           ├── route.ts          # List/Create
│   │           └── [id]/
│   │               ├── route.ts      # Get/Update/Delete
│   │               └── execute/
│   │                   └── route.ts  # Execute workflow
│   │
│   ├── components/                   # React Components
│   │   ├── auth-provider.tsx         # Auth context
│   │   ├── providers.tsx             # App providers
│   │   ├── ui/                       # UI components
│   │   └── workflow/
│   │       └── CustomNode.tsx        # Workflow node
│   │
│   └── lib/                          # Utilities
│       ├── supabase.ts               # Supabase client
│       ├── firebase.ts               # Firebase config
│       └── workflow-constants.ts     # Node definitions
│
├── supabase/                         # Database
│   ├── schema.sql                    # Database schema
│   └── retention_policy.sql          # Data cleanup
│
├── public/                           # Static assets
│
├── docker-compose.yml                # n8n setup
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── next.config.js                    # Next.js config
│
├── .env.local                        # Environment variables
├── .gitignore                        # Git ignore rules
│
└── Documentation/
    ├── README.md                     # Project overview
    ├── SETUP.md                      # Setup guide
    ├── CHECKLIST.md                  # Final checklist
    ├── ENHANCEMENTS.md               # Feature list
    └── ARCHITECTURE.md               # This file
```

---

## Security Architecture

### Authentication
```
User Credentials → Firebase Auth → JWT Token
                                      ↓
                              Stored in Browser
                                      ↓
                              Sent with API Requests
                                      ↓
                              Verified by Supabase RLS
```

### Row Level Security (RLS)
```sql
-- Users can only see their own workflows
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM profiles 
      WHERE email = current_user_email()
    )
  );
```

### Data Encryption
- ✅ HTTPS in production
- ✅ JWT tokens for auth
- ✅ Environment variables for secrets
- ✅ Supabase encrypts data at rest

---

## Deployment Architecture

### Development
```
localhost:3000 → Next.js Dev Server
localhost:5678 → n8n (Docker)
Cloud → Supabase
Cloud → Firebase
```

### Production
```
your-domain.com → Vercel Edge Network
                      ↓
                  Next.js App
                      ↓
              ┌───────┴───────┐
              ↓               ↓
         Supabase         Firebase
         (Database)       (Auth)
              ↓
         n8n Server
         (Optional)
```

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single Next.js instance
- Supabase free tier
- Firebase free tier
- n8n on local Docker

### Phase 2: Growth
- Vercel Pro plan
- Supabase Pro plan
- n8n on cloud server
- CDN for static assets

### Phase 3: Scale
- Multiple regions
- Load balancing
- Database replicas
- Caching layer (Redis)
- Queue system (BullMQ)

---

## Monitoring & Observability

### Recommended Tools
- **Frontend**: Vercel Analytics
- **Backend**: Supabase Dashboard
- **Errors**: Sentry
- **Logs**: LogRocket
- **Uptime**: UptimeRobot

---

**Built with ❤️ by AdityaShenvi**
