# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

## 1. Get Free API Keys

### Groq (Required - FREE, fastest LLM)
1. Visit https://console.groq.com
2. Sign up for free account
3. Create API key
4. Copy key for `.env` file

### Clerk (Required - FREE auth)
1. Visit https://dashboard.clerk.com
2. Create new application
3. Copy Publishable Key and Secret Key
4. Add to `.env` files

### Supabase (Required - FREE database)
1. Visit https://supabase.com
2. Create new project
3. Copy Project URL and anon key
4. Add to backend `.env`

### Qdrant Cloud (Optional - FREE 1GB vector DB)
1. Visit https://cloud.qdrant.io
2. Create free cluster
3. Copy cluster URL and API key
4. Add to backend `.env`

## 2. Setup Environment

```bash
# Root directory
cp .env.example .env.local

# Backend
cd backend
cp .env.example .env
# Edit .env and add your API keys

# Frontend  
cd ../frontend
# .env.local already copied from root
```

## 3. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

## 4. Run Development Servers

### Option A: Run Both Together
```bash
# From root directory
npm install concurrently
npm run dev
```

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Next Steps

1. **Create Your First Agent**
   - Go to http://localhost:3000/builder
   - Drag agent nodes onto canvas
   - Configure roles and goals
   - Connect agents to create workflow

2. **Try Pre-built Templates**
   - Visit http://localhost:3000/templates
   - Clone a template (e.g., "Blog Writer Team")
   - Customize and run

3. **Monitor Executions**
   - Go to http://localhost:3000/dashboard
   - Watch agents collaborate in real-time
   - View execution history

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Check `.env` file has all required keys

### Frontend won't start
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules && npm install`
- Check `.env.local` file exists

### API errors
- Verify backend is running on port 8000
- Check CORS_ORIGINS in backend `.env`
- Verify API keys are correct

## Development Tips

- Use React Query Devtools (bottom-left icon) to inspect queries
- Check WebSocket connection in browser console
- Use Swagger UI at http://localhost:8000/docs for API testing
- Enable debug mode in backend `.env` for detailed logs

## Ready to Deploy?

See [Deployment Guide](docs/deployment.md) for production deployment instructions.
