# Deployment & Pipelines Guide

## 📋 Visão Geral dos Pipelines

Este projeto possui 4 pipelines automatizados:

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
Pipeline principal de integração contínua que executa em cada push/PR.

#### Etapas:
- **Lint & Type Check**: Valida ESLint e TypeScript
- **Build**: Compila a aplicação Next.js
- **Security Scan**: Verifica vulnerabilidades (npm audit)
- **Deploy Staging**: Deploy automático para staging (branch `develop`)
- **Deploy Production**: Deploy automático para produção (branch `main`)

#### Triggers:
- Push em `main` ou `develop`
- Pull Requests para `main` ou `develop`

---

### 2. **Docker Build & Push** (`docker-build.yml`)
Constrói e publica imagem Docker no GitHub Container Registry.

#### Etapas:
- Build multi-stage otimizado
- Push automático em branches e tags
- Scan de vulnerabilidades com Trivy

#### Triggers:
- Push em `main`, `develop`, ou tags `v*`
- PRs (apenas build, sem push)

---

### 3. **Code Quality** (`code-quality.yml`)
Análise de qualidade de código com relatórios detalhados.

#### Verificações:
- ESLint com relatório JSON
- Detecção de `console.log` em produção
- Bundle size analysis
- Verificação de dependências desatualizadas

---

## 🔐 Secrets Necessários no GitHub

Configure os seguintes secrets no repositório:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### APIs Externas
```
API_KEY_OPEN_AI
CHRONOS_REPORT_API_URL
CHRONOS_UPLOAD_API_URL
CNPJA_API_KEY
```

### Azure Deployment
```
AZURE_APP_NAME_STAGING
AZURE_PUBLISH_PROFILE_STAGING
AZURE_APP_NAME_PRODUCTION
AZURE_PUBLISH_PROFILE_PRODUCTION
```

---

## 🚀 Fluxos de Deployment

### Desenvolvimento → Staging
```
git push origin develop
↓
Lint + Build + Security Scan
↓
Deploy para Azure Staging
↓
https://cronos-audit-staging.azurewebsites.net
```

### Staging → Produção
```
git push origin main
↓
Lint + Build + Security Scan
↓
Deploy para Azure Production
↓
https://cronos-audit.azurewebsites.net
```

---

## 🐳 Pipeline de Docker

### Build Local
```bash
docker build -t cronos-audit:latest .
```

### Test Local
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=<url> \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<key> \
  -e API_KEY_OPEN_AI=<key> \
  cronos-audit:latest
```

---

## 📊 Pipelines de Dados da Aplicação

### 1. Pipeline de Autenticação
```
User Input
  ↓
[Login/Signup Page]
  ↓
[AuthContext + Supabase Auth]
  ↓
[JWT Token Storage]
  ↓
[Protected Routes]
```

### 2. Pipeline de Chat/Audit
```
User Question
  ↓
[Chat UI Component]
  ↓
[API: /api/chat]
  ↓
[OpenAI Processing]
  ↓
[Response Stream]
  ↓
[Chat Conversation View]
  ↓
[Supabase Storage]
```

### 3. Pipeline de Upload de Documentos
```
File Selection
  ↓
[Upload Component]
  ↓
[API: /api/upload-documento]
  ↓
[Chronos Report API]
  ↓
[Document Processing]
  ↓
[Supabase Storage]
  ↓
[Dashboard Display]
```

### 4. Pipeline de CNPJ Search
```
CNPJ Input
  ↓
[CNPJ Search Component]
  ↓
[API: /api/cnpj/search]
  ↓
[CNPJA SDK]
  ↓
[Company Data]
  ↓
[UI Display + Cache]
```

### 5. Pipeline de Geração de Relatório
```
Audit Data Collection
  ↓
[Metadata Form]
  ↓
[API: /api/gerar-relatorio]
  ↓
[Chronos Report Service]
  ↓
[PDF Generation]
  ↓
[Download/Storage]
```

---

## ✅ Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Todos os testes passando
- [ ] Sem console.log/warn/debug em código
- [ ] Code review aprovado
- [ ] Dependências atualizadas e sem vulnerabilidades
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco de dados realizado
- [ ] Documentação atualizada

---

## 🔍 Monitoramento & Alertas

### Health Check
```
GET /api/health
```

### Logs
- Staging: Azure App Service Logs
- Production: Azure Application Insights

### Métricas
- CPU/Memory: Azure Monitor
- Error Rate: Application Insights
- Response Time: Application Insights

---

## 🛠️ Troubleshooting

### Build falha com "Module not found"
```bash
npm ci
npm run build
```

### Deploy falha com "Publish Profile inválido"
1. Gere novo profile no Azure Portal
2. Atualize secret no GitHub

### Docker build muito lento
- Use cache: `docker build --cache-from`
- Verifique `.dockerignore`

---

## 📚 Referências

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
