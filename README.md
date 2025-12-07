# 🚀 FlowForge - Modern Workflow Automation Platform

<div align="center">

![FlowForge Banner](https://img.shields.io/badge/FlowForge-Workflow%20Automation-8B5CF6?style=for-the-badge&logo=workflow&logoColor=white)

**Build, automate, and scale your workflows with our visual automation platform.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

[Demo](https://flowforge.vercel.app) · [Documentation](#documentation) · [Report Bug](https://github.com/aditya4232/flowforge/issues)

</div>

---

## ✨ Features

- 🎨 **Visual Workflow Builder** - Drag-and-drop interface with React Flow
- 🔐 **Enterprise Authentication** - Firebase Auth with Google & GitHub SSO
- 📊 **Real-time Execution** - Live workflow execution with detailed logs
- 🌙 **Dark Mode First** - Beautiful glassmorphism UI with animations
- 📱 **Responsive Design** - Works on desktop and tablet
- 🚀 **Production Ready** - Optimized for Vercel deployment

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Styling** | Tailwind CSS, Framer Motion |
| **Canvas** | React Flow |
| **Auth** | Firebase Authentication |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aditya4232/flowforge.git
   cd flowforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase and Supabase credentials in `.env.local`

4. **Set up Supabase database**
   - Go to Supabase Dashboard > SQL Editor
   - Run the contents of `supabase/schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
flowforge/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── workflow/           # Workflow builder
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── auth-provider.tsx   # Firebase auth context
│   │   └── providers.tsx       # App providers
│   └── lib/                    # Utilities
│       ├── firebase.ts         # Firebase config
│       ├── supabase.ts         # Supabase client
│       └── utils.ts            # Helper functions
├── supabase/
│   └── schema.sql              # Database schema
├── public/                     # Static assets
└── tailwind.config.ts          # Tailwind configuration
```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication > Sign-in methods:
   - Google
   - GitHub (requires GitHub OAuth app)
3. Copy your Firebase config to `.env.local`

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Copy your API credentials to `.env.local`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aditya4232/flowforge)

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## 👨‍💻 Author

**Aditya Shenvi**

- LinkedIn: [@aditya-shenvi](https://linkedin.com/in/aditya-shenvi)
- GitHub: [@aditya4232](https://github.com/aditya4232)

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for Final Year Project**

⭐ Star this repo if you found it helpful!

</div>
