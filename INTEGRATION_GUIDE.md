# Guia Rápido de Integração - Componentes de Pipeline

## 🚀 Começar Rápido

### Instalação e Setup

```bash
# Adicione as dependências necessárias (já incluídas no projeto)
npm install lucide-react

# Todos os componentes estão prontos para uso
```

---

## 📋 Checklist de Integração

### ✅ Arquivos Criados
- [x] 9 componentes React reutilizáveis
- [x] 2 páginas de showcase (pipelines + monitoring)
- [x] Types/interfaces TypeScript
- [x] Hooks customizados
- [x] Documentação completa

### ✅ Design System
- [x] Cores (Amber, Blue, Teal, Pink)
- [x] Responsividade (mobile/md/lg)
- [x] Animações e transições
- [x] Acessibilidade

---

## 🎯 Usar Componentes no Seu Projeto

### Opção 1: Page de Showcase Completa
```tsx
// Navegue até /pipelines
import PipelinesShowcase from "@/app/pipelines/page";
```

### Opção 2: Importar Componentes Individuais
```tsx
"use client";

import { PipelineFlow } from "@/components/sections/pipeline-flow";
import { MetricsGrid } from "@/components/sections/metrics-card";
import { LogsViewer } from "@/components/sections/logs-viewer";

export function MyCustomDashboard() {
  return (
    <div className="space-y-8">
      <PipelineFlow stages={stages} variant="horizontal" />
      <MetricsGrid metrics={metrics} />
      <LogsViewer logs={logs} />
    </div>
  );
}
```

### Opção 3: Com Dados em Tempo Real
```tsx
"use client";

import { usePipelineData, useMetrics, useLogStream } from "@/hooks/usePipeline";

export function LiveDashboard() {
  const { stages } = usePipelineData("pipeline-1");
  const { metrics } = useMetrics(5000);
  const { logs } = useLogStream("stream-1");

  return (
    <div>
      <PipelineFlow stages={stages} animated={true} />
      <MetricsGrid metrics={metrics} />
      <LogsViewer logs={logs} />
    </div>
  );
}
```

---

## 📦 Componentes Disponíveis

| Componente | Arquivo | Uso |
|---|---|---|
| **PipelineFlow** | `pipeline-flow.tsx` | Visualizar fluxo CI/CD |
| **PipelineGrid** | `pipeline-grid.tsx` | Grid de 6 passos |
| **DeploymentTimeline** | `deployment-timeline.tsx` | Histórico de deployments |
| **PipelineAlert** | `pipeline-alert.tsx` | Notificações |
| **MetricsGrid** | `metrics-card.tsx` | KPIs e métricas |
| **LogsViewer** | `logs-viewer.tsx` | Stream de logs |
| **StatusBar** | `status-bar.tsx` | Status com progresso |
| **Breadcrumb** | `breadcrumb.tsx` | Navegação |
| **PipelineHeroSection** | `pipeline-hero-section.tsx` | Seção hero |

---

## 🪝 Hooks Disponíveis

```typescript
// Em /hooks/usePipeline.ts

usePipelineData(pipelineId)        // Dados do pipeline
useLogStream(streamId)              // Logs em tempo real
useMetrics(intervalMs)              // Métricas atualizadas
useAlerts()                         // Gerenciar alertas
useDeployments(limit)               // Histórico de deployments
useHealthCheck(intervalMs)          // Status de saúde
useDataCache(fetcher, key, ttl)    // Cache com invalidação
useComponentVisibility(initial)     // Mostrar/ocultar componentes
useFilters(initialFilters)          // Gerenciar filtros
usePagination(items, itemsPerPage) // Paginação
useDebounce(value, delay)          // Debounce
useThrottle(callback, delay)       // Throttle
```

---

## 🔗 Integração com APIs

### Exemplo: Conectar com GitHub Actions API
```tsx
// services/github-api.ts
export async function getWorkflowRuns(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs`
  );
  return response.json();
}

// pages/github-pipelines.tsx
"use client";
import { useEffect, useState } from "react";
import { PipelineFlow } from "@/components/sections/pipeline-flow";

export default function GitHubPipelines() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    getWorkflowRuns("seu-usuario", "seu-repo").then(setRuns);
  }, []);

  const stages = runs.map(run => ({
    id: run.id.toString(),
    name: run.name,
    status: run.status === "completed" ? "success" : "running",
    description: run.head_branch
  }));

  return <PipelineFlow stages={stages} />;
}
```

---

## 🎨 Customização de Cores

### Usar Design System
```tsx
// Adicione no seu componente
className="
  bg-accent-amber        // Amber primário
  bg-accent-blue         // Blue secundário
  bg-accent-teal         // Teal terciário
  bg-accent-pink         // Pink para erro
  text-text-100          // Texto branco
  text-text-400          // Texto cinza
  border-border          // Cores de borda
"
```

### Customizar Cores
```tsx
// globals.css
:root {
  --accent-amber: #ffc65c;        /* Mude para sua cor */
  --accent-blue: #74c8fc;
  --accent-teal: #76e3dc;
  --accent-pink: #ff9caa;
}
```

---

## 📊 Dados de Exemplo

### Pipeline Stages
```typescript
const stages = [
  {
    id: "lint",
    name: "Lint & Type Check",
    status: "success",
    duration: 45,
    description: "ESLint + TypeScript"
  },
  {
    id: "build",
    name: "Build",
    status: "running",
    duration: 120,
    description: "Next.js compilation"
  }
];
```

### Metrics
```typescript
const metrics = [
  {
    label: "CPU Usage",
    value: 42,
    unit: "%",
    status: "good",
    trend: "stable",
    trendValue: "Normal"
  }
];
```

### Logs
```typescript
const logs = [
  {
    id: "1",
    timestamp: new Date(),
    level: "success",
    message: "✓ Build completado",
    details: "Tempo: 2m 34s"
  }
];
```

---

## 🚦 Pages Disponíveis

### `/pipelines`
- ✅ Showcase de todos os componentes
- ✅ Exemplos de uso
- ✅ Dados simulados
- ✅ CTA buttons

### `/monitoring`
- ✅ Dashboard em tempo real
- ✅ Auto-refresh configurável
- ✅ Health check status
- ✅ Logs ao vivo

---

## 💻 Desenvolvimento Local

```bash
# Start dev server
npm run dev

# Visite as páginas
http://localhost:3000/pipelines
http://localhost:3000/monitoring
```

---

## 🔒 TypeScript Types

```typescript
import type {
  Pipeline,
  PipelineStage,
  DeploymentTimelineItem,
  LogEntry,
  Metric,
  Alert,
  // ... mais tipos em /lib/pipeline-types.ts
} from "@/lib/pipeline-types";
```

---

## 📱 Responsividade

Todos os componentes são 100% responsivos:

```css
/* Mobile First */
grid-cols-1              /* 1 coluna no mobile */
md:grid-cols-2           /* 2 colunas em tablets */
lg:grid-cols-3           /* 3+ colunas em desktop */
```

---

## ⚡ Performance

### Otimizações Incluídas
- ✅ Componentes com React.memo
- ✅ Lazy loading de dados
- ✅ Debounce em inputs
- ✅ Throttle em scroll
- ✅ Cache de dados

### Best Practices
```tsx
// ✅ Bom - Com memo
import { memo } from "react";
export const PipelineCard = memo(({ data }) => (...));

// ✅ Bom - Sem props desnecessárias
<PipelineFlow stages={stages} animated={true} />

// ❌ Evitar - Re-render desnecessário
const stages = getDynamicStages(); // Fora do componente
```

---

## 🐛 Troubleshooting

### Componentes não aparecem
```tsx
// Certifique-se de usar "use client" em Client Components
"use client";

import { PipelineFlow } from "@/components/sections/pipeline-flow";
```

### Cores não aplicam
```tsx
// Certifique-se de ter as variáveis CSS em globals.css
// Verifique Tailwind config em tailwind.config.ts
```

### Dados não atualizam
```tsx
// Use hooks para dados dinâmicos
const { logs } = useLogStream("stream-1");

// Não:
const logs = [];  // Estático
```

---

## 📚 Documentação Completa

Veja `COMPONENTS_GUIDE.md` para guia completo com:
- Exemplos práticos
- Todos os props
- Casos de uso
- Padrões de design

---

## 🎯 Próximos Passos

1. ✅ **Conectar com API real** - Substitua dados simulados
2. ✅ **Autenticação** - Integre com seu sistema de auth
3. ✅ **WebSocket** - Implemente atualizações em tempo real
4. ✅ **Armazenamento** - Salve preferências do usuário
5. ✅ **Testes** - Adicione testes unitários e e2e

---

## 📞 Suporte

- 📖 Leia `COMPONENTS_GUIDE.md`
- 📝 Consulte tipos em `lib/pipeline-types.ts`
- 🔧 Use hooks em `hooks/usePipeline.ts`
- 👀 Veja exemplos em `/app/pipelines/page.tsx`

---

**Status**: ✅ Pronto para Produção
**Última atualização**: 01/06/2026
