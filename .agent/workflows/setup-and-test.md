---
description: Complete setup and testing workflow for AgentForge-XT
---

# AgentForge-XT Setup and Testing Workflow

This workflow guides you through setting up, enhancing, and testing the AgentForge-XT project.

## Prerequisites

1. Node.js 18+ installed
2. Docker Desktop installed and running
3. Supabase account (free tier)
4. Firebase account (free tier)

## Phase 1: Environment Setup

// turbo
1. Install dependencies
```bash
npm install
```

2. Copy environment file
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
   - Add Firebase credentials
   - Add Supabase credentials
   - Set APP_URL to http://localhost:3000

## Phase 2: Database Setup

4. Go to Supabase dashboard and run the schema from `supabase/schema.sql`

5. Enable Row Level Security (RLS) on all tables

6. Verify database connection:
```bash
npm run test
```

## Phase 3: n8n Integration

// turbo
7. Start n8n automation engine:
```bash
docker-compose up -d
```

8. Access n8n at http://localhost:5678
   - Default credentials: admin / password
   - IMPORTANT: Change password immediately!

9. Configure n8n webhook URL in environment

## Phase 4: Build and Test

// turbo
10. Run linter to check for errors:
```bash
npm run lint
```

11. Fix any linting errors

// turbo
12. Build the project:
```bash
npm run build
```

13. Run unit tests:
```bash
npm run test
```

14. Run E2E tests:
```bash
npm run test:e2e
```

## Phase 5: Development Server

// turbo
15. Start development server:
```bash
npm run dev
```

16. Open http://localhost:3000 in browser

17. Test the following flows:
    - User registration
    - User login
    - Create workflow
    - Edit workflow
    - Execute workflow
    - View executions

## Phase 6: Example Workflow Test

18. Create a sample workflow with:
    - Webhook trigger
    - HTTP request node
    - Condition node
    - Notification node

19. Test workflow execution

20. Verify logs and monitoring

## Troubleshooting

- If Docker fails: Ensure Docker Desktop is running
- If build fails: Check for TypeScript errors
- If tests fail: Verify environment variables
- If n8n fails: Check port 5678 is not in use
