# 🧪 Testing Guide - AgentForge-XT

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
│   └── app.spec.ts        # Main app flow tests
└── integration/            # Integration tests (Jest)
    └── supabase.test.ts   # Database tests
```

---

## Running Tests

### 1. Install Test Dependencies

```bash
npm install
```

This installs:
- Jest (unit/integration tests)
- Playwright (E2E tests)
- Testing Library (React component tests)

### 2. Run All Tests

```bash
# Run everything
npm run test:all

# Or run individually:
npm run lint          # ESLint
npm run test          # Jest tests
npm run test:e2e      # Playwright E2E tests
```

### 3. Watch Mode (Development)

```bash
# Jest in watch mode
npm run test:watch

# Playwright with UI
npm run test:e2e:ui
```

---

## Test Categories

### ✅ Unit Tests (Jest)
**Location**: `tests/integration/`

**What they test**:
- Supabase connection
- Data structures
- Workflow operations
- Node validation

**Run**:
```bash
npm run test
```

### ✅ E2E Tests (Playwright)
**Location**: `tests/e2e/`

**What they test**:
- User authentication flow
- Navigation
- Workflow creation
- Dashboard functionality

**Run**:
```bash
npm run test:e2e
```

---

## Manual Testing Checklist

### 🔐 Authentication
- [ ] Can sign up with email/password
- [ ] Can sign in with existing account
- [ ] Can sign out
- [ ] Redirects to sign-in when not authenticated
- [ ] Stays logged in after refresh

### 📊 Dashboard
- [ ] Shows real workflow count
- [ ] Shows active/inactive counts
- [ ] Displays workflows from Supabase
- [ ] Empty state shows when no workflows
- [ ] Can click workflow to edit
- [ ] Can create new workflow

### 🎨 Workflow Editor
- [ ] Canvas loads correctly
- [ ] Can drag nodes from sidebar
- [ ] Can drop nodes on canvas
- [ ] Can connect nodes (drag handles)
- [ ] Can select nodes
- [ ] Can delete nodes
- [ ] Can configure nodes in right panel
- [ ] Can save workflow
- [ ] Can execute workflow
- [ ] Can toggle active/inactive
- [ ] Logs panel shows/hides
- [ ] n8n link works

### 💾 Data Persistence
- [ ] Workflows save to Supabase
- [ ] Workflows load from Supabase
- [ ] Stats calculate correctly
- [ ] User profile created on signup
- [ ] RLS prevents unauthorized access

---

## Test Data Setup

### Create Test User

1. Go to http://localhost:3000/auth/sign-up
2. Use email: `test@example.com`
3. Password: `testpassword123`
4. Sign up

### Create Test Workflows

1. Sign in as test user
2. Create 3-4 workflows with different states:
   - Active workflow
   - Inactive workflow
   - Workflow with nodes
   - Empty workflow

### Verify in Supabase

1. Go to Supabase Dashboard
2. Table Editor → `profiles`
   - Should see test user
3. Table Editor → `workflows`
   - Should see test workflows
   - Check `user_id` matches profile

---

## Common Test Scenarios

### Scenario 1: New User Journey
```
1. Visit homepage
2. Click "Sign Up"
3. Create account
4. Redirected to dashboard
5. See empty state
6. Click "Create Workflow"
7. Add nodes
8. Save workflow
9. Return to dashboard
10. See workflow listed
```

### Scenario 2: Returning User
```
1. Visit homepage
2. Click "Sign In"
3. Enter credentials
4. Redirected to dashboard
5. See existing workflows
6. Click workflow to edit
7. Make changes
8. Save
9. Verify changes persist
```

### Scenario 3: Workflow Execution
```
1. Open workflow editor
2. Add trigger node
3. Add action nodes
4. Connect them
5. Click "Execute"
6. Watch status updates
7. Check logs panel
8. Verify completion
```

---

## Debugging Tests

### Jest Tests Failing?

```bash
# Run with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- supabase.test.ts

# Update snapshots
npm run test -- -u
```

### Playwright Tests Failing?

```bash
# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- --grep "sign in"

# Debug mode
npm run test:e2e -- --debug
```

### Check Supabase Connection

```typescript
// In browser console or test file
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('profiles')
  .select('count');

console.log({ data, error });
```

---

## Performance Testing

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Run Lighthouse

```bash
# Install globally
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

---

## Security Testing

### Check RLS Policies

```sql
-- In Supabase SQL Editor
SELECT * FROM workflows;
-- Should return empty or only your workflows
```

### Test Unauthorized Access

1. Open incognito window
2. Try to access `/dashboard`
3. Should redirect to sign-in
4. Try to access `/workflow/some-id`
5. Should redirect to sign-in

---

## CI/CD Testing

### GitHub Actions (Future)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:all
```

---

## Test Coverage

### View Coverage Report

```bash
npm run test -- --coverage
```

### Target Coverage
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

---

## Troubleshooting

### "Cannot find module '@/lib/supabase'"
**Fix**: Check `tsconfig.json` has correct paths

### "Supabase connection failed"
**Fix**: 
1. Check `.env.local` has correct credentials
2. Verify Supabase project is running
3. Check network connection

### "Tests timeout"
**Fix**:
1. Increase timeout in test config
2. Check if dev server is running
3. Verify no port conflicts

---

## Best Practices

1. **Write tests first** (TDD when possible)
2. **Keep tests isolated** (no dependencies between tests)
3. **Use descriptive names** (`test('User can create workflow')`)
4. **Mock external services** (except integration tests)
5. **Clean up after tests** (delete test data)
6. **Run tests before commits** (`npm run test:all`)

---

## Next Steps

1. ✅ Run `npm install` to get test dependencies
2. ✅ Run `npm run test` to verify Jest works
3. ✅ Run `npm run test:e2e` to verify Playwright works
4. ✅ Create test user and workflows
5. ✅ Run manual testing checklist
6. ✅ Check coverage report
7. ✅ Set up CI/CD (optional)

---

**Happy Testing!** 🧪
