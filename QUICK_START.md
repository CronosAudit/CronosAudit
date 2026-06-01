# 🎯 Quick Reference - Cronos Audit Pipelines

## 📋 Arquivos Criados

```
.github/
├── workflows/
│   ├── ci-cd.yml              ✅ Pipeline principal
│   ├── docker-build.yml       ✅ Build Docker
│   ├── code-quality.yml       ✅ Análise de qualidade
│   └── manual-deploy.yml      ✅ Deploy manual
└── DEPLOYMENT_CHECKLIST.md    ✅ Checklist pré/pós

Dockerfile                      ✅ Multi-stage build
docker-compose.yml             ✅ Composição local com Nginx
nginx.conf                      ✅ Reverse proxy config
azure-pipelines.yml            ✅ Alternativa Azure DevOps

app/api/health/route.ts        ✅ Health check endpoint
scripts/
├── pipeline.sh                ✅ Local CI helpers
├── setup-azure.sh             ✅ Setup Azure resources
└── monitor-deployment.sh      ✅ Monitor deployments

.env.example                    ✅ Template de ENV vars
.dockerignore                   ✅ Docker build excludes
DEPLOYMENT.md                   ✅ Guia completo
PIPELINES.md                    ✅ Documentação detalhada
QUICK_START.md                  ✅ Este arquivo
```

---

## 🚀 Quick Start

### 1️⃣ Setup Local (5 min)

```bash
# Clone e instale
git clone <repo>
cd cronos-audit
npm ci

# Configure env
cp .env.example .env.local
# Edit .env.local com suas credenciais

# Valide
chmod +x scripts/*.sh
./scripts/pipeline.sh full-ci
```

### 2️⃣ Configure GitHub Secrets (10 min)

Via: **Settings → Secrets and variables → Actions**

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**APIs:**
```
API_KEY_OPEN_AI
CHRONOS_REPORT_API_URL
CHRONOS_UPLOAD_API_URL
CNPJA_API_KEY
```

**Azure:**
```
AZURE_APP_NAME_STAGING
AZURE_PUBLISH_PROFILE_STAGING
AZURE_APP_NAME_PRODUCTION
AZURE_PUBLISH_PROFILE_PRODUCTION
```

### 3️⃣ Setup Azure (15 min)

```bash
# Rode setup script (requer Azure CLI)
chmod +x scripts/setup-azure.sh
./scripts/setup-azure.sh

# Copie os publish profiles para GitHub Secrets
cat .azure/publish-profile-staging.json
cat .azure/publish-profile-prod.json
```

### 4️⃣ Primeiro Deploy

```bash
# Crie branch e faça commit
git checkout -b feature/initial develop
git add .
git commit -m "Initial pipeline setup"
git push origin feature/initial

# Crie PR
# → GitHub Actions roda automaticamente ✓

# Merge para develop
# → Deploy automático para STAGING ✓

# Merge para main
# → Deploy automático para PRODUCTION ✓
```

---

## 🔄 Fluxos do Dia-a-Dia

### 📝 Desenvolvimento
```bash
# Criar feature
git checkout -b feature/minha-feature develop

# Local validation
./scripts/pipeline.sh pre-commit

# Push
git push origin feature/minha-feature

# → Pipeline roda: lint ✓ build ✓ security ✓
# → PR criada
# → Code review
# → Merge
# → Deploy automático para staging
```

### 🚀 Release
```bash
# Merge develop → main
git checkout main
git merge develop
git push origin main

# → Pipeline roda completo
# → Deploy automático para production
# → Health checks
# → Monitoring ativa
```

### 🆘 Hotfix Emergencial
```bash
# Criar hotfix
git checkout -b hotfix/bug-critico main

# Fix + commit
git push origin hotfix/bug-critico

# Deploy manual via GitHub UI:
# Actions → Manual Deployment
# Environment: production
# Version: hotfix/bug-critico
```

---

## 📊 Status dos Pipelines

### ✅ Functional

| Pipeline | Trigger | Status |
|----------|---------|--------|
| **CI/CD** | Push/PR | ✅ Ready |
| **Docker** | Push/Tags | ✅ Ready |
| **Code Quality** | Push/PR | ✅ Ready |
| **Manual Deploy** | Dispatch | ✅ Ready |

### 🔧 To Configure

- [ ] GitHub Secrets (23 variables)
- [ ] Azure App Services (2 apps)
- [ ] Publish Profiles (2 files)
- [ ] Health Checks (monitoring)
- [ ] Alertas (opcional)

---

## 🛠️ Comandos Úteis

### Local Development

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build

# Full CI
./scripts/pipeline.sh full-ci
```

### Docker

```bash
# Build
docker build -t cronos-audit:latest .

# Run
docker-compose up -d

# Stop
docker-compose down
```

### Azure CLI

```bash
# Check app status
az webapp show -g cronos-rg -n cronos-audit-prod --query state

# Tail logs
az webapp log tail -g cronos-rg -n cronos-audit-prod

# Deploy slot swap
az webapp deployment slot swap -g cronos-rg -n cronos-audit-prod --slot staging
```

### GitHub CLI

```bash
# List runs
gh run list

# View run
gh run view <run-id>

# Manual dispatch
gh workflow run manual-deploy.yml -f environment=production -f version=main

# View logs
gh run view <run-id> --log
```

---

## 🔍 Troubleshooting

### Build Falha
```bash
npm ci
npm run build
# Se ainda falhar, checar logs do GitHub Actions
```

### Deploy Falha
```bash
# 1. Verificar publish profile
az webapp deployment list-publishing-profiles \
  -g cronos-rg -n cronos-audit-prod

# 2. Verificar app settings
az webapp config appsettings list \
  -g cronos-rg -n cronos-audit-prod

# 3. Tail logs
az webapp log tail -g cronos-rg -n cronos-audit-prod
```

### Health Check Falha
```bash
# Verificar endpoint
curl https://cronos-audit-prod.azurewebsites.net/api/health

# Deve retornar 200 com JSON
# {"status":"healthy","timestamp":"..."}
```

---

## 📞 Support

| Tópico | Referência |
|--------|-----------|
| Pipeline detalhado | [PIPELINES.md](PIPELINES.md) |
| Deployment completo | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Checklist pré-deploy | [DEPLOYMENT_CHECKLIST.md](.github/DEPLOYMENT_CHECKLIST.md) |
| Next.js docs | https://nextjs.org/docs/deployment |
| Azure App Service | https://docs.microsoft.com/azure/app-service/ |

---

## ✨ Próximos Passos

### Hoje
1. [ ] Fork/clone repositório
2. [ ] Configure .env.local
3. [ ] Rode `./scripts/pipeline.sh full-ci`
4. [ ] Crie GitHub Secrets

### Semana 1
5. [ ] Setup Azure resources
6. [ ] Primeiro deploy em staging
7. [ ] Testar fluxos principais
8. [ ] Configurar alertas

### Semana 2
9. [ ] Treinar time em procedimentos
10. [ ] Documentar runbooks
11. [ ] Setup de monitoring dashboards
12. [ ] Review e otimizações

---

**Status**: ✅ Pronto para uso
**Última atualização**: 01/06/2026
**Maintainer**: DevOps Team
