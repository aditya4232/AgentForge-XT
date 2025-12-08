# 🔒 Pre-Commit Security Checklist

**ALWAYS run this before `git commit` or `git push`!**

---

## ✅ Quick Security Check

### 1. Run Automated Check
```bash
# Run the security check script
security-check.bat

# Or manually check git status
git status
```

### 2. Verify These Files Are NOT Staged

❌ **NEVER commit these:**
- [ ] `.env.local` - Contains YOUR credentials
- [ ] `.env` - Contains secrets
- [ ] Any file with API keys
- [ ] Any file with passwords
- [ ] `/node_modules` - Dependencies
- [ ] `/.next` - Build output
- [ ] `.n8n/` - n8n data
- [ ] `postgres_data/` - Database data

### 3. Verify These Files ARE Safe

✅ **Safe to commit:**
- [ ] `.env.example` - Template only (no real values)
- [ ] `/src/**/*.tsx` - Source code (no secrets)
- [ ] `/src/**/*.ts` - Source code (no secrets)
- [ ] `README.md` - Documentation
- [ ] `CONTRIBUTING.md` - Contribution guide
- [ ] `SECURITY.md` - Security policy
- [ ] `LICENSE` - MIT License
- [ ] `package.json` - Dependencies list
- [ ] `.gitignore` - Ignore rules

---

## 🔍 Manual Verification

### Check for Secrets in Code

```bash
# Search for potential API keys
findstr /S /I "AIza" src\*.tsx src\*.ts
findstr /S /I "sk-" src\*.tsx src\*.ts
findstr /S /I "pk_" src\*.tsx src\*.ts

# Should return nothing!
```

### Check Git Diff

```bash
# Review all changes
git diff

# Look for:
# - API keys (AIza, sk-, pk-)
# - Passwords
# - Database URLs
# - Email addresses (if personal)
```

### Check Staged Files

```bash
# See what will be committed
git status

# See detailed changes
git diff --staged
```

---

## 🚨 If You Find Secrets

### Remove from Staging

```bash
# Unstage a file
git reset HEAD .env.local

# Or unstage all
git reset HEAD .
```

### Remove from History (if already committed)

```bash
# Remove from last commit
git reset --soft HEAD~1

# Remove file from git tracking
git rm --cached .env.local

# Force push (if already pushed - DANGEROUS!)
git push --force
```

### Rotate Compromised Credentials

If you accidentally committed secrets:
1. **Immediately** change all exposed credentials
2. Rotate API keys
3. Update passwords
4. Revoke tokens
5. Check for unauthorized access

---

## ✅ Safe to Commit Checklist

Before running `git commit`:

- [ ] Ran `security-check.bat`
- [ ] Checked `git status`
- [ ] Reviewed `git diff`
- [ ] No `.env.local` in staged files
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database URLs in code
- [ ] All secrets in environment variables
- [ ] `.gitignore` is working
- [ ] Commit message is clear

---

## 📝 Good Commit Message

Follow Conventional Commits:

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(workflow): add AI agent node
fix(dashboard): correct stats calculation
docs(readme): update installation steps
refactor(api): improve error handling
test(workflow): add integration tests
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

---

## 🎯 Commit Workflow

```bash
# 1. Check status
git status

# 2. Run security check
security-check.bat

# 3. Review changes
git diff

# 4. Stage files (carefully!)
git add src/
git add docs/
git add README.md
# etc.

# 5. Verify staging
git status
git diff --staged

# 6. Commit
git commit -m "feat: your message here"

# 7. Push
git push
```

---

## 🔒 Environment Variables Best Practices

### In Code - ✅ GOOD
```typescript
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### In Code - ❌ BAD
```typescript
const apiKey = "AIzaSyA1YZd8J-wmPdovAwASAUtwdpVm9LYh8a4";
const dbUrl = "https://myproject.supabase.co";
```

### In .env.local - ✅ GOOD (but never commit!)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_real_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
```

### In .env.example - ✅ GOOD (safe to commit)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
```

---

## 🆘 Emergency: Secrets Leaked

If you accidentally pushed secrets:

### 1. Immediate Actions
```bash
# Remove from repository
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

### 2. Rotate All Credentials
- Change all API keys
- Update all passwords
- Revoke all tokens
- Generate new secrets

### 3. Monitor for Abuse
- Check API usage
- Review access logs
- Monitor for unauthorized access

### 4. Learn and Prevent
- Add to `.gitignore`
- Use pre-commit hooks
- Enable secret scanning
- Review this checklist regularly

---

## 🎓 Resources

- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Security](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)

---

**Remember: It's easier to prevent than to fix!** 🔒

**Always double-check before committing!** ✅
