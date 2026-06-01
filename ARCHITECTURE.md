# 📦 Cronos Audit - Complete Pipeline Architecture

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Developer Workflow                             │
│                                                                        │
│  Local Development → Feature Branch → GitHub → Automated Pipeline     │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Pipeline                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Stage 1: VALIDATE (Lint & Type Check)                               │
│  ├─ ESLint validation                                                 │
│  ├─ TypeScript type checking                                          │
│  └─ Config validation                                                 │
│       ↓ (on success)                                                  │
│  Stage 2: BUILD                                                       │
│  ├─ Install dependencies                                              │
│  ├─ Compile Next.js                                                   │
│  └─ Generate artifacts                                                │
│       ↓ (on success)                                                  │
│  Stage 3: SECURITY SCAN                                               │
│  ├─ npm audit                                                         │
│  ├─ Dependency check (OWASP)                                          │
│  └─ Trivy image scan                                                  │
│       ↓ (on success)                                                  │
│  Stage 4: CODE QUALITY                                                │
│  ├─ ESLint report (JSON)                                              │
│  ├─ Bundle size analysis                                              │
│  └─ Outdated packages check                                           │
│                                                                        │
│  Branch Decision:                                                      │
│  ├─ develop → Deploy to STAGING                                       │
│  └─ main    → Deploy to PRODUCTION                                    │
│                                                                        │
│  Stage 5: DEPLOYMENT                                                  │
│  ├─ Pull build artifacts                                              │
│  ├─ Configure environment                                             │
│  └─ Push to Azure App Service                                         │
│                                                                        │
│  Stage 6: VERIFICATION                                                │
│  ├─ Health check                                                      │
│  ├─ Warm-up request                                                   │
│  └─ Smoke tests                                                       │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                   Azure App Service (Live)                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Staging:          Production:                                        │
│  cronos-audit-staging.azurewebsites.net                               │
│  cronos-audit-prod.azurewebsites.net                                  │
│                                                                        │
│  ├─ Node.js 20 LTS Runtime                                            │
│  ├─ Nginx Reverse Proxy                                               │
│  ├─ Application Insights                                              │
│  └─ Application Settings (Secrets)                                    │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                  Docker Registry (Optional)                           │
│                                                                        │
│  ghcr.io/username/cronos-audit:latest                                 │
│  ghcr.io/username/cronos-audit:v1.0.0                                 │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow

```
USER INPUT
    ↓
┌─────────────────────────┐
│  Next.js Frontend       │
│  - React Components     │
│  - TailwindCSS UI       │
│  - Framer Motion        │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│  API Routes             │
│  - /api/chat            │
│  - /api/upload-documento│
│  - /api/cnpj/search     │
│  - /api/gerar-relatorio │
└─────────────────────────┘
    ↓┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
    ↓                          ↓                          ↓                          ↓
┌─────────────────┐  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Supabase Auth   │  │ OpenAI API       │   │ Chronos Reports  │   │ CNPJ Search      │
│ - Authentication│  │ - Chat/Audit     │   │ - Document Proc. │   │ - Company Data   │
│ - User Data     │  │ - Analysis       │   │ - PDF Generate   │   │ - Validation     │
└─────────────────┘  └──────────────────┘   └──────────────────┘   └──────────────────┘
    ↓                          ↓                          ↓                          ↓
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        Database (Supabase)                                        │
│                        - Users                                                   │
│                        - Chat History                                            │
│                        - Documents                                               │
│                        - Reports                                                 │
└──────────────────────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    Cache & Storage (Supabase Storage)                            │
│                    - Document uploads                                            │
│                    - Generated reports                                           │
│                    - User files                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
    ↓
USER OUTPUT (PDF, JSON, UI Display)
```

---

## 📊 Pipeline Stages Timeline

```
Timeline (minutes): 0    5    10   15   20   25   30
                    |----|----|----|----|----|----|----|
Checkout           ✓
Install deps       ✓----✓
Lint               ✓----✓
Type Check                ✓----✓
Build                     ✓----✓----✓
Upload Artifacts                ✓----✓
Security Scan                    ✓----✓----✓
Docker Build                               ✓----✓----✓----✓
Deploy (Staging)                                ✓----✓
Health Check                                    ✓----✓
Tests                                               ✓----✓
                                                Total: ~25 min
```

---

## 🔐 Security Layers

```
Level 1: Code Validation
├─ ESLint rules
├─ TypeScript strict mode
└─ Pre-commit hooks

Level 2: Dependency Security
├─ npm audit (moderate level)
├─ OWASP Dependency Check
├─ Trivy image scan
└─ CVE database checks

Level 3: Runtime Security
├─ Non-root Docker user
├─ Minimal base image
├─ Health checks
└─ Resource limits

Level 4: Infrastructure Security
├─ Azure Key Vault (secrets)
├─ HTTPS/TLS
├─ CORS headers
├─ CSP headers
└─ Rate limiting (Nginx)

Level 5: Monitoring & Alerting
├─ Application Insights
├─ Error rate monitoring
├─ Performance metrics
└─ Log aggregation
```

---

## 🚀 Deployment Scenarios

### Scenario 1: Regular Feature Release
```
Monday 9:00 AM
└─ Feature complete & tested
└─ Create PR against develop
└─ Code review & approval
└─ Merge to develop
   └─ GitHub Actions triggers
      └─ ✓ Lint
      └─ ✓ Build
      └─ ✓ Security Scan
      └─ ✓ Deploy to Staging
         └─ 🌐 Available at staging-app.azurewebsites.net
         └─ QA testing
         └─ Monday 5:00 PM - Approved for production

Tuesday 10:00 AM
└─ Merge develop to main
   └─ GitHub Actions triggers
      └─ ✓ Full pipeline
      └─ ✓ Deploy to Production
         └─ 🌐 Live at cronos-audit.azurewebsites.net
         └─ Monitor for 24h
         └─ No issues = Success ✓
```

### Scenario 2: Hotfix Emergency
```
Production Issue Found
└─ Create hotfix/critical-bug from main
└─ Fix code
└─ Push to GitHub
   └─ Manual Deploy trigger
      └─ Environment: production
      └─ Version: hotfix/critical-bug
      └─ GitHub Actions triggers full pipeline
      └─ Deploy directly to production
         └─ 🚨 5-10 minutes from issue to fix
         └─ Health check verifies
         └─ Monitor closely
         └─ Merge back to main & develop
```

### Scenario 3: Blue-Green Deployment
```
Current: Blue (Production)
New:     Green (Staging)

1. Deploy to Green (Staging)
   └─ Full testing
   └─ Performance validation
   └─ User acceptance testing

2. Traffic Switch
   └─ Nginx routes 100% to Green
   └─ Blue remains as backup
   └─ Monitor metrics

3. Rollback (if needed)
   └─ Switch back to Blue
   └─ Zero downtime
   └─ Investigate issue

4. Cleanup
   └─ Remove old version
   └─ Update documentation
```

---

## 📈 Monitoring Dashboard

```
Application Health Status
┌─────────────────────────────────────────────────────┐
│ Environment     │ Status │ Response Time │ Error Rate │
├─────────────────────────────────────────────────────┤
│ Staging         │   ✓    │   145ms       │   0.2%    │
│ Production      │   ✓    │   152ms       │   0.1%    │
└─────────────────────────────────────────────────────┘

Recent Deployments
┌──────────────────────────────────────────────────┐
│ Deployment  │ Time  │ Status   │ Duration      │
├──────────────────────────────────────────────────┤
│ v1.2.0 → Prod │ 2:15 PM │ Success  │ 8m 32s    │
│ v1.2.0 → Stage│ 1:45 PM │ Success  │ 7m 12s    │
│ v1.1.9 → Prod │ 1:00 PM │ Success  │ 7m 45s    │
└──────────────────────────────────────────────────┘

System Metrics
┌──────────────────────────────────────────────────┐
│ Metric           │ Staging  │ Production       │
├──────────────────────────────────────────────────┤
│ CPU Usage        │ 35%      │ 42%              │
│ Memory Usage     │ 620MB    │ 845MB            │
│ Requests/min     │ 125      │ 1,250            │
│ Avg Response     │ 145ms    │ 152ms            │
│ Error Rate       │ 0.2%     │ 0.1%             │
│ Uptime           │ 99.99%   │ 99.99%           │
└──────────────────────────────────────────────────┘
```

---

## ✅ Pre-Deployment Validation Checklist

```
Code Quality
  ☐ ESLint: 0 errors
  ☐ TypeScript: 0 errors
  ☐ Tests passing (if applicable)
  ☐ Code review approved

Dependencies
  ☐ npm audit: 0 vulnerabilities
  ☐ No outdated packages
  ☐ All required packages present

Docker Image
  ☐ Image builds successfully
  ☐ Trivy scan: 0 critical issues
  ☐ Runs on localhost
  ☐ Health check responds

Environment
  ☐ All secrets configured
  ☐ Database connections valid
  ☐ External APIs accessible
  ☐ CORS properly configured

Performance
  ☐ Build time < 15 minutes
  ☐ Image size < 500MB
  ☐ Startup time < 30 seconds
  ☐ API response time < 200ms

Security
  ☐ No console.log in production code
  ☐ No hardcoded secrets
  ☐ HTTPS enabled
  ☐ Security headers present

Monitoring
  ☐ Health check endpoint working
  ☐ Logging configured
  ☐ Alerts configured
  ☐ Metrics being collected
```

---

## 🎓 Team Training

### For Frontend Developers
- [ ] How to run local CI: `./scripts/pipeline.sh full-ci`
- [ ] How to run pre-commit: `./scripts/pipeline.sh pre-commit`
- [ ] How to read pipeline logs on GitHub
- [ ] How to debug failed builds locally

### For Backend/DevOps
- [ ] How to configure Azure App Service
- [ ] How to manage secrets in Azure Key Vault
- [ ] How to deploy manually: GitHub UI workflow dispatch
- [ ] How to monitor and roll back: `./scripts/monitor-deployment.sh`

### For Managers/Leads
- [ ] Release process and timeline
- [ ] How to read deployment status
- [ ] Incident response procedures
- [ ] Performance and uptime SLOs

---

## 📞 Getting Help

| Issue | Solution |
|-------|----------|
| Build fails locally | Run `npm ci && npm run build` |
| Pipeline fails | Check GitHub Actions logs |
| Deploy fails | Verify Azure publish profile & secrets |
| App doesn't start | Check Application Insights logs |
| Health check 503 | Verify environment variables |
| Docker image too large | Review `.dockerignore` |

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| [QUICK_START.md](QUICK_START.md) | Quick reference guide (5-15 min) |
| [PIPELINES.md](PIPELINES.md) | Detailed pipeline documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment guide |
| [DEPLOYMENT_CHECKLIST.md](.github/DEPLOYMENT_CHECKLIST.md) | Pre/post deployment checklist |
| [ARCHITECTURE.md](ARCHITECTURE.md) | This file - system overview |

---

## 🎯 Success Metrics

```
Before Pipelines:
├─ Deployment time: 45+ minutes (manual)
├─ Error rate in prod: 0.5%
├─ Mean time to recovery: 2+ hours
└─ Code review time: varies

After Pipelines:
├─ Deployment time: 8-10 minutes (automated)
├─ Error rate in prod: < 0.1%
├─ Mean time to recovery: 15-30 minutes
└─ Code review time: standardized
```

---

**Document Version**: 1.0
**Last Updated**: 01/06/2026
**Status**: ✅ Production Ready
**Maintained by**: DevOps Team
