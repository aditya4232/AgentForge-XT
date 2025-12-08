# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@agentforge-xt.dev**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

* Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new security fix versions as soon as possible

## Security Best Practices for Users

### Environment Variables

* **Never commit** `.env.local` or any file containing secrets
* Use `.env.example` as a template
* Rotate credentials regularly
* Use different credentials for development and production

### Database Security

* Enable Row Level Security (RLS) in Supabase
* Use the anon key for client-side operations
* Never expose service role keys to the client
* Regularly review and update RLS policies

### Authentication

* Use strong passwords
* Enable 2FA where available
* Don't share authentication tokens
* Implement proper session management

### API Keys

* Store API keys in environment variables only
* Use different keys for development and production
* Rotate keys regularly
* Monitor API usage for anomalies

### Docker & n8n

* Change default n8n credentials immediately
* Use strong passwords for n8n admin account
* Keep Docker images updated
* Don't expose n8n to the public internet without proper security

### Dependencies

* Regularly update dependencies
* Run `npm audit` to check for vulnerabilities
* Use `npm audit fix` to automatically fix issues
* Review security advisories for dependencies

## Known Security Considerations

### Client-Side Environment Variables

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only use this prefix for non-sensitive data like:
* API endpoints
* Public configuration
* Feature flags

**Never** use `NEXT_PUBLIC_` for:
* API keys
* Database credentials
* Service role keys
* Any sensitive data

### Supabase Anon Key

The Supabase anon key is safe to expose to the client **only if**:
* Row Level Security (RLS) is properly configured
* All tables have appropriate RLS policies
* Service role key is kept secret

### Firebase Configuration

Firebase client configuration (API key, auth domain, etc.) is safe to expose as it's designed for client-side use. However:
* Enable App Check for additional security
* Configure security rules properly
* Monitor usage for anomalies

## Security Checklist for Contributors

Before submitting a PR, ensure:

- [ ] No secrets in code or commits
- [ ] Environment variables used for sensitive data
- [ ] RLS policies updated if database schema changed
- [ ] Input validation implemented
- [ ] Output sanitization implemented
- [ ] Authentication checks in place
- [ ] Authorization checks in place
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date
- [ ] No console.log with sensitive data

## Automated Security

We use the following tools:

* **GitHub Dependabot**: Automatic dependency updates
* **npm audit**: Vulnerability scanning
* **ESLint**: Code quality and security rules
* **TypeScript**: Type safety

## Contact

For security concerns, contact: **security@agentforge-xt.dev**

For general questions: **hello@agentforge-xt.dev**

---

Thank you for helping keep AgentForge-XT secure! 🔒
