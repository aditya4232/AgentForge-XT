# 📁 Project Structure - AgentForge-XT

## Root Directory

```
AgentForge-XT/
├── 📄 README.md                    # Main documentation
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 SECURITY.md                  # Security policy
├── 📄 LICENSE                      # MIT License
├── 📄 package.json                 # Dependencies & scripts
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Environment template
├── 📄 tsconfig.json                # TypeScript config
├── 📄 tailwind.config.ts           # Tailwind CSS config
├── 📄 next.config.js               # Next.js config
├── 📄 postcss.config.js            # PostCSS config
├── 📄 jest.config.ts               # Jest test config
├── 📄 jest.setup.ts                # Jest setup
├── 📄 playwright.config.ts         # Playwright config
├── 📄 docker-compose.yml           # n8n Docker setup
├── 📄 security-check.bat           # Pre-commit security check
├── 📄 start.bat                    # Quick start script
└── 📄 start-n8n.bat                # n8n startup script
```

## Source Code (`/src`)

```
src/
├── app/                            # Next.js App Router
│   ├── page.tsx                   # Home page
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   │
│   ├── auth/                      # Authentication
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   │
│   ├── dashboard/                 # Dashboard
│   │   └── page.tsx
│   │
│   ├── workflow/                  # Workflow Editor
│   │   └── [id]/page.tsx
│   │
│   └── api/                       # API Routes
│       ├── health/route.ts
│       └── workflows/
│           ├── route.ts           # List/Create
│           └── [id]/
│               ├── route.ts       # Get/Update/Delete
│               └── execute/
│                   └── route.ts   # Execute workflow
│
├── components/                     # React Components
│   ├── auth-provider.tsx          # Auth context
│   ├── providers.tsx              # App providers
│   ├── ui/                        # UI components
│   └── workflow/
│       └── CustomNode.tsx         # Workflow node
│
└── lib/                           # Utilities
    ├── supabase.ts                # Supabase client
    ├── firebase.ts                # Firebase config
    ├── workflow-constants.ts      # Node definitions
    └── utils.ts                   # Helper functions
```

## Documentation (`/docs`)

```
docs/
├── SETUP.md                       # Installation guide
├── ARCHITECTURE.md                # System design
├── TESTING.md                     # Testing guide
├── FINAL_SUMMARY.md               # Complete overview
├── PRE_COMMIT_CHECKLIST.md        # Safety checklist
└── PROJECT_STRUCTURE.md           # This file
```

## Tests (`/tests`)

```
tests/
├── e2e/                           # End-to-end tests
│   └── app.spec.ts               # Playwright tests
└── integration/                   # Integration tests
    └── supabase.test.ts          # Database tests
```

## Database (`/supabase`)

```
supabase/
├── schema.sql                     # Database schema
└── retention_policy.sql           # Data cleanup policy
```

## Public Assets (`/public`)

```
public/
├── next.svg                       # Next.js logo
└── vercel.svg                     # Vercel logo
```

---

## Files NOT in Git (Ignored)

### Build & Dependencies
- `node_modules/` - NPM packages
- `.next/` - Next.js build output
- `out/` - Export output
- `build/` - Production build
- `dist/` - Distribution files

### Environment & Secrets
- `.env.local` - **YOUR credentials (NEVER commit!)**
- `.env` - Environment variables
- `*.env` - Any env files

### Development
- `tsconfig.tsbuildinfo` - TypeScript cache
- `next-env.d.ts` - Next.js types
- `.DS_Store` - macOS files
- `Thumbs.db` - Windows files

### Docker & Data
- `.n8n/` - n8n data
- `postgres_data/` - PostgreSQL data
- `.supabase/` - Supabase temp files

### IDE & Editors
- `.vscode/` - VS Code settings
- `.idea/` - JetBrains IDEs
- `*.swp` - Vim swap files

### Testing
- `coverage/` - Test coverage
- `playwright-report/` - Test reports
- `.nyc_output/` - Coverage data

---

## Important Files Explained

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS customization |
| `next.config.js` | Next.js configuration |
| `.gitignore` | Files to ignore in Git |
| `.env.example` | Environment variable template |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & quick start |
| `CONTRIBUTING.md` | How to contribute |
| `SECURITY.md` | Security policy |
| `LICENSE` | MIT License |

### Script Files

| File | Purpose |
|------|---------|
| `start.bat` | Quick start development server |
| `start-n8n.bat` | Start n8n with Docker |
| `security-check.bat` | Pre-commit security validation |

---

## File Count Summary

### Total Files in Git: ~50-60 files
- Source code: ~20 files
- Documentation: ~10 files
- Configuration: ~10 files
- Tests: ~5 files
- Database: ~2 files
- Scripts: ~3 files

### NOT in Git (Ignored): ~1000+ files
- `node_modules/`: ~1000+ files
- `.next/`: ~100+ files
- Build artifacts
- Temporary files

---

## Clean Project Checklist

✅ **What SHOULD be in Git:**
- [x] All `/src` source code
- [x] All `/docs` documentation
- [x] All `/tests` test files
- [x] `/supabase` database schema
- [x] Configuration files
- [x] `.env.example` (template only)
- [x] `README.md` and other docs
- [x] `package.json`
- [x] `.gitignore`

❌ **What should NOT be in Git:**
- [ ] `.env.local` (your credentials)
- [ ] `node_modules/` (dependencies)
- [ ] `.next/` (build output)
- [ ] `tsconfig.tsbuildinfo` (cache)
- [ ] `next-env.d.ts` (generated)
- [ ] Any file with secrets

---

## Maintenance

### Adding New Files

**Source Code:**
```bash
# Add to /src
src/components/new-component.tsx
src/lib/new-utility.ts
```

**Documentation:**
```bash
# Add to /docs
docs/NEW_GUIDE.md
```

**Tests:**
```bash
# Add to /tests
tests/unit/new-test.test.ts
```

### Cleaning Up

```bash
# Remove build artifacts
rm -rf .next
rm -rf out
rm -rf build

# Remove dependencies
rm -rf node_modules

# Reinstall
npm install
```

---

## Best Practices

1. **Keep root clean** - Only essential files in root
2. **Organize by type** - Group similar files together
3. **Use meaningful names** - Clear, descriptive file names
4. **Document everything** - Add README to complex folders
5. **Follow conventions** - Stick to Next.js structure
6. **Update .gitignore** - Add new patterns as needed

---

**This structure is optimized for:**
- ✅ Easy navigation
- ✅ Clear organization
- ✅ Scalability
- ✅ Open source collaboration
- ✅ Security (no secrets in git)
