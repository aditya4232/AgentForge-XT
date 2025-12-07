export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              ✨ 100% Free & Open Source
            </div>
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AgentForge-XT
            </h1>
            <p className="text-2xl text-slate-600 dark:text-slate-400">
              Visual Multi-Agent Workflow Builder
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
              Build AI agent teams with drag-and-drop simplicity. Watch agents collaborate, debate, and solve complex tasks in real-time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Visual Builder</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Drag-and-drop interface powered by React Flow. No coding required.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Agent Teams</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Agents work together using CrewAI orchestration
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Powered by Groq - fastest free LLM inference
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Dashboard</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor agent execution with live WebSocket updates
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-2">Template Marketplace</h3>
              <p className="text-slate-600 dark:text-slate-400">
                6+ pre-built agent teams ready to clone and customize
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Secure Auth</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Clerk authentication with social logins
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-12">
            <a
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started →
            </a>
            <a
              href="/templates"
              className="px-8 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              Browse Templates
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Built with Modern Technologies</h3>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Next.js 15</span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">FastAPI</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">CrewAI</span>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">Groq</span>
              <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">TanStack Query</span>
              <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">React Flow</span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">Supabase</span>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">Clerk</span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✅ Backend Ready | ✅ Frontend Complete | ✅ Add API Keys to Start
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              See SETUP.md for detailed instructions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
