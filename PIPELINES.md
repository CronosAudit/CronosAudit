# 🚀 Cronos Audit - CI/CD Pipelines

## 📊 Arquitetura dos Pipelines

```
┌─────────────────────────────────────────────────────────────────┐
│                      Git Push/Pull Request                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
            ┌─────────────────────────────────────────┐
            │   1️⃣  LINT & TYPE CHECK                  │
            │  • ESLint validation                    │
            │  • TypeScript type checking             │
            │  • YAML/Config validation               │
            └─────────────────────────────────────────┘
                              ↓ (if passed)
            ┌─────────────────────────────────────────┐
            │   2️⃣  BUILD APPLICATION                 │
            │  • npm ci                               │
            │  • next build                           │
            │  • Generate .next folder                │
            └─────────────────────────────────────────┘
                              ↓ (if passed)
        ┌──────────────────────┴──────────────────────┐
        ↓                                              ↓
┌──────────────────────┐                    ┌──────────────────────┐
│   3️⃣  SECURITY SCAN   │                    │ 4️⃣  CODE QUALITY     │
│  • npm audit         │                    │  • ESLint report     │
│  • Dependency check  │                    │  • Bundle analysis   │
│  • Trivy scan        │                    │  • Outdated packages │
└──────────────────────┘                    └──────────────────────┘
        ↓                                              ↓
        └──────────────────────┬──────────────────────┘
                              ↓
            ┌──────────────────────────────────────┐
            │  Branch Detection                    │
            └──────────────────────────────────────┘
              /                        \
          develop                      main
           ↓                             ↓
    ┌──────────────┐           ┌──────────────────┐
    │  STAGING     │           │  PRODUCTION      │
    │  Deploy      │           │  Deploy          │
    │  Environment │           │  Environment     │
    └──────────────┘           └──────────────────┘
         ↓                             ↓
  🌍 staging-*.azurewebsites.net  🌍 prod-*.azurewebsites.net
```

## 📁 Estrutura de Arquivos

```
.github/
├── workflows/
│   ├── ci-cd.yml              ← Pipeline principal (lint, build, deploy)
│   ├── docker-build.yml       ← Build e push de imagem Docker
│   ├── code-quality.yml       ← Análise de qualidade de código
│   └── manual-deploy.yml      ← Deploy manual sob demanda
├── DEPLOYMENT_CHECKLIST.md    ← Checklist pré/pós deploy
└── CODEOWNERS                 ← Aprovadores de PR (opcional)

├── Dockerfile                  ← Multi-stage build otimizado
├── .dockerignore               ← Arquivos ignorados no build Docker
├── docker-compose.yml          ← Composição local com Nginx
├── nginx.conf                  ← Reverse proxy config
│
├── azure-pipelines.yml         ← Pipeline Azure DevOps (alternativa)
├── .env.example                ← Template de variáveis de ambiente
├── DEPLOYMENT.md               ← Documentação de deployment
│
├── app/api/health/route.ts     ← Health check endpoint
└── package.json                ← Scripts de build/deploy
```

---

## 🔄 Pipelines Disponíveis

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
**Trigger**: Push em `main`/`develop` ou PR

| Stage | Ação | Condição |
|-------|------|----------|
| **Lint & Type** | Valida ESLint + TypeScript | Sempre |
| **Build** | Compila Next.js | Se Lint passou |
| **Security** | npm audit + Trivy | Se Build passou |
| **Deploy Staging** | → Azure App Service | Branch `develop` + Push |
| **Deploy Production** | → Azure App Service | Branch `main` + Push |

### 2. **Docker Build** (`docker-build.yml`)
**Trigger**: Push em `main`/`develop`/tags ou PR

- Build multi-stage otimizado
- Push para GitHub Container Registry (GHCR)
- Scan de vulnerabilidades com Trivy
- Cache automático

### 3. **Code Quality** (`code-quality.yml`)
**Trigger**: Push ou PR

Gera relatórios de:
- ESLint (JSON format)
- Bundle size analysis
- Outdated packages
- Vulnerabilities

### 4. **Manual Deploy** (`manual-deploy.yml`)
**Trigger**: Workflow dispatch (manual)

Deploy sob demanda para qualquer branch/tag:
```bash
# Via GitHub UI: Actions → Manual Deployment
```

### 5. **Azure DevOps Pipeline** (`azure-pipelines.yml`)
**Alternativa** ao GitHub Actions

Stages: Validate → Build → Security → Deploy Staging → Deploy Production

---

## 🛠️ Setup Inicial

### 1. Preparar Repositório GitHub

```bash
# Clonar repositório
git clone <seu-repo>
cd cronos-audit

# Criar branches
git checkout -b develop origin/develop || git checkout -b develop
git push -u origin develop
```

### 2. Configurar Secrets no GitHub

Vá para **Settings → Secrets and variables → Actions** e adicione:

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### APIs
```
API_KEY_OPEN_AI
CHRONOS_REPORT_API_URL
CHRONOS_UPLOAD_API_URL
CNPJA_API_KEY
```

#### Azure (Staging)
```
AZURE_APP_NAME_STAGING
AZURE_PUBLISH_PROFILE_STAGING
AZURE_SUBSCRIPTION_STAGING
```

#### Azure (Production)
```
AZURE_APP_NAME_PRODUCTION
AZURE_PUBLISH_PROFILE_PRODUCTION
AZURE_SUBSCRIPTION_PRODUCTION
```

### 3. Gerar Publish Profile Azure

```bash
# Via Azure CLI
az webapp deployment list-publishing-profiles \
  --resource-group <seu-rg> \
  --name <seu-app-name> \
  --query "[0]" \
  --output json > publish-profile.json

# Copiar conteúdo para GitHub Secret
cat publish-profile.json | pbcopy  # macOS
cat publish-profile.json | clip    # Windows
# xclip -selection clipboard < publish-profile.json  # Linux
```

### 4. Configurar Azure App Service

```bash
# Criar App Service (se não existir)
az appservice plan create \
  --name cronos-plan \
  --resource-group cronos-rg \
  --sku B2 --is-linux

az webapp create \
  --resource-group cronos-rg \
  --plan cronos-plan \
  --name cronos-audit \
  --runtime "NODE|20-lts"

# Configurar variáveis de ambiente
az webapp config appsettings set \
  --resource-group cronos-rg \
  --name cronos-audit \
  --settings \
    NEXT_PUBLIC_SUPABASE_URL="https://..." \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..." \
    API_KEY_OPEN_AI="..." \
    NODE_ENV="production"
```

### 5. Enable Continuous Deployment

```bash
# Conectar GitHub repository
az webapp deployment source config \
  --resource-group cronos-rg \
  --name cronos-audit \
  --repo-url <repo-url> \
  --branch main \
  --manual-integration
```

---

## 🚀 Fluxos de Uso

### Desenvolvimento Regular

```bash
# 1. Criar feature branch
git checkout -b feature/nova-feature develop

# 2. Fazer changes e commit
git add .
git commit -m "feat: nova feature"

# 3. Push e criar PR
git push origin feature/nova-feature

# 4. GitHub Actions roda automaticamente:
#    - Lint & Type Check ✓
#    - Build ✓
#    - Security Scan ✓

# 5. Code review + approval

# 6. Merge para develop
git checkout develop
git merge feature/nova-feature
git push origin develop

# 7. Deploy automático para STAGING
```

### Release para Produção

```bash
# 1. Garantir que develop está estável
# 2. Criar release branch (se usar git-flow)
git checkout -b release/v1.0.0 develop

# 3. Merge para main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"

# 4. Push
git push origin main --tags

# 5. Deploy automático para PRODUCTION
```

### Deploy Manual Emergencial

```bash
# Via GitHub UI:
# 1. Actions → Manual Deployment
# 2. Selecionar environment (staging/production)
# 3. Selecionar version (branch/tag)
# 4. Clicar em "Run workflow"

# Ou via CLI:
gh workflow run manual-deploy.yml \
  -f environment=production \
  -f version=hotfix/bug-critico
```

---

## 📊 Monitoramento

### Health Check

```bash
# Local
curl http://localhost:3000/api/health

# Staging
curl https://<staging-app>.azurewebsites.net/api/health

# Production
curl https://<prod-app>.azurewebsites.net/api/health

# Response esperado:
{
  "status": "healthy",
  "timestamp": "2024-06-01T12:00:00Z",
  "environment": "production",
  "services": {
    "nextjs": "running"
  }
}
```

### Logs em Tempo Real

```bash
# Azure App Service
az webapp log tail \
  --resource-group cronos-rg \
  --name cronos-audit-prod

# Application Insights
az monitor app-insights query \
  --app <app-insights-name> \
  --analytics-query "traces | order by timestamp desc | limit 100"
```

### Métricas

- **Response Time**: Application Insights → Performance
- **Error Rate**: Application Insights → Failures
- **Resource Usage**: Azure Monitor → Metrics
- **Availability**: Application Insights → Availability

---

## 🐳 Docker Local

### Build

```bash
docker build -t cronos-audit:latest .
```

### Run

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=<url> \
  -e API_KEY_OPEN_AI=<key> \
  cronos-audit:latest
```

### Docker Compose

```bash
# Copiar .env
cp .env.example .env.local

# Build
docker-compose build

# Run
docker-compose up -d

# Acessar em http://localhost:80
# Nginx reverse proxy na porta 80
# App Next.js na porta 3000
```

---

## 🔍 Troubleshooting

| Problema | Solução |
|----------|---------|
| Build falha com "Module not found" | `npm ci && npm run build` |
| Deploy falha com "Publish Profile inválido" | Gerar novo profile no Azure Portal |
| Docker build muito lento | Verificar `.dockerignore`, usar BuildKit |
| Health check 503 | Revisar variáveis de ambiente, logs do App Service |
| PR não roda pipeline | Verificar branch protection rules |

---

## 📝 Best Practices

✅ **Fazer**:
- Usar feature branches para desenvolvimento
- Escrever meaningful commit messages
- Executar `npm run build` localmente antes de push
- Revisar código antes de merge
- Monitorar deploy logs
- Manter `.env.local` no `.gitignore`

❌ **Não fazer**:
- Commitar secrets no git
- Forçar push em `main` ou `develop`
- Ignorar security warnings
- Deploy em produção sem teste em staging
- Compartilhar secrets por email/chat

---

## 📚 Referências

- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [GitHub Actions](https://docs.github.com/actions)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ✨ Próximos Passos

1. [ ] Configurar todos os secrets no GitHub
2. [ ] Testar pipeline em staging
3. [ ] Validar health checks
4. [ ] Configurar alertas no Application Insights
5. [ ] Documentar runbook de incident response
6. [ ] Setup de monitoring dashboards
7. [ ] Treinar time em processo de deployment

---

**Última atualização**: 01/06/2026
**Mantido por**: DevOps Team
