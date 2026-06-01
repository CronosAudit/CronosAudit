# Pipeline Components - Guia de Uso

## 📚 Componentes Disponíveis

### 1. **PipelineFlow** (`pipeline-flow.tsx`)
Componente para visualizar o fluxo de um pipeline com diferentes status.

```tsx
import { PipelineFlow } from "@/components/sections/pipeline-flow";

<PipelineFlow
  stages={[
    {
      id: "lint",
      name: "Lint",
      status: "success",
      duration: 45,
      description: "ESLint validation"
    },
    {
      id: "build",
      name: "Build",
      status: "running",
      description: "Next.js compilation"
    },
  ]}
  variant="vertical" // or "horizontal"
  animated={true}
/>
```

**Props:**
- `stages`: Array de estágios do pipeline
- `variant`: "horizontal" ou "vertical" (padrão: "vertical")
- `showDescription`: Mostrar descrição (padrão: false)
- `animated`: Animar entrada dos estágios (padrão: true)

**Status disponíveis:**
- `pending`: Aguardando início
- `running`: Em execução
- `success`: Completado com sucesso
- `failed`: Falha na execução

---

### 2. **PipelineGrid** (`pipeline-grid.tsx`)
Grade de cards mostrando os passos do pipeline.

```tsx
import { PipelineGrid } from "@/components/sections/pipeline-grid";

<PipelineGrid />
```

**Features:**
- 6 cards responsivos
- Icons customizados
- Variantes de cores (primary, secondary, tertiary)
- Animações ao hover

---

### 3. **DeploymentTimeline** (`deployment-timeline.tsx`)
Timeline visual de deployments históricos.

```tsx
import { DeploymentTimeline } from "@/components/sections/deployment-timeline";

<DeploymentTimeline
  items={[
    {
      id: "dep-1",
      environment: "production",
      version: "v1.2.5",
      status: "success",
      timestamp: new Date(),
      duration: 8,
      commitHash: "a1b2c3d4e5f6",
    },
  ]}
/>
```

**Props:**
- `items`: Array de deployments
- `className`: Classes customizadas

---

### 4. **PipelineAlert** (`pipeline-alert.tsx`)
Componentes de alerta com diferentes tipos.

```tsx
import { PipelineAlert, AlertGroup } from "@/components/sections/pipeline-alert";

// Single alert
<PipelineAlert
  type="success"
  title="Deploy bem-sucedido"
  message="Version 1.2.5 foi deployada com sucesso"
  dismissible={true}
  action={{
    label: "Ver detalhes",
    onClick: () => {}
  }}
/>

// Multiple alerts
<AlertGroup alerts={alerts} />
```

**Tipos:**
- `success`: Operação bem-sucedida
- `warning`: Aviso importante
- `error`: Erro crítico
- `info`: Informação

---

### 5. **MetricsGrid** (`metrics-card.tsx`)
Cards para exibir métricas do sistema.

```tsx
import { MetricsGrid, MetricCard } from "@/components/sections/metrics-card";

<MetricsGrid
  metrics={[
    {
      label: "CPU Usage",
      value: 42,
      unit: "%",
      status: "good",
      trend: "stable",
      trendValue: "Normal"
    },
  ]}
/>
```

**Status:**
- `good`: ✅ Tudo bem
- `warning`: ⚠️ Atenção necessária
- `critical`: ❌ Crítico

**Trends:**
- `up`: 📈 Aumentando
- `down`: 📉 Diminuindo
- `stable`: ➡️ Estável

---

### 6. **LogsViewer** (`logs-viewer.tsx`)
Visualizador de logs em tempo real.

```tsx
import { LogsViewer } from "@/components/sections/logs-viewer";

<LogsViewer
  logs={logs}
  maxHeight="h-96"
  showDetails={true}
/>
```

**Logs:**
```tsx
interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
  context?: string;
}
```

---

### 7. **StatusBar** (`status-bar.tsx`)
Barra de status com progresso e ações.

```tsx
import { StatusBar } from "@/components/sections/status-bar";

<StatusBar
  variant="default"
  title="Build em progresso"
  subtitle="feature/nova-feature"
  progress={65}
  estimatedTime="3 min"
  actions={[
    {
      label: "Ver logs",
      onClick: () => {}
    }
  ]}
/>
```

**Variantes:**
- `default`: Informação
- `success`: Sucesso
- `warning`: Aviso
- `error`: Erro

---

### 8. **Breadcrumb** (`breadcrumb.tsx`)
Navegação de breadcrumb.

```tsx
import { Breadcrumb } from "@/components/sections/breadcrumb";

<Breadcrumb
  items={[
    { label: "Dashboard" },
    { label: "Deployments" },
    { label: "Pipeline" }
  ]}
/>
```

---

### 9. **PipelineHeroSection** (`pipeline-hero-section.tsx`)
Seção hero com introdução aos pipelines.

```tsx
import { PipelineHeroSection } from "@/components/sections/pipeline-hero-section";

<PipelineHeroSection />
```

**Features:**
- Background animado com gradients
- Stats de performance
- CTA buttons
- Responsivo

---

## 🎨 Design System

### Cores
```css
--accent-amber: #ffc65c      /* Cor primária */
--accent-blue: #74c8fc       /* Cor secundária */
--accent-teal: #76e3dc       /* Cor terciária */
--accent-pink: #ff9caa       /* Cor de erro *)
```

### Background
```css
--bg-0: #000000              /* Background base */
--bg-100: #0d0d0d            /* Slightly lighter *)
--bg-200: #121212
--bg-300: #1a1a1a
```

### Texto
```css
--text-100: #ffffff          /* Texto primário *)
--text-200: #f2f5f5
--text-300: #bdbdbd
--text-400: #828282          /* Texto secundário *)
--text-500: #4f4f4f
```

### Superfícies
```css
--surface-1: rgba(255, 255, 255, 0.04)
--surface-2: rgba(255, 255, 255, 0.07)
--surface-3: rgba(255, 255, 255, 0.1)
```

---

## 📱 Responsividade

Todos os componentes são totalmente responsivos usando Tailwind CSS:

- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3-4 colunas

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* cards */}
</div>
```

---

## 🎯 Exemplos Práticos

### Exemplo 1: Dashboard Completo
```tsx
import PipelinesShowcase from "@/app/pipelines/page";

export default function Dashboard() {
  return <PipelinesShowcase />;
}
```

### Exemplo 2: Pipeline Status Page
```tsx
"use client";

import { PipelineFlow, StatusBar } from "@/components/sections";

export default function PipelineStatus() {
  return (
    <div className="space-y-8">
      <StatusBar
        variant="default"
        title="Deploy v1.2.5"
        progress={75}
        estimatedTime="2 min"
      />
      <PipelineFlow stages={stages} animated={true} />
    </div>
  );
}
```

### Exemplo 3: Real-time Monitoring
```tsx
"use client";

import { MetricsGrid, LogsViewer } from "@/components/sections";
import { useEffect, useState } from "react";

export default function Monitoring() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    // Fetch real-time data
    const interval = setInterval(() => {
      // Update logs and metrics
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <MetricsGrid metrics={metrics} />
      <LogsViewer logs={logs} />
    </div>
  );
}
```

---

## 🔄 Estado e Animações

### Animações Disponíveis
- Fade in/out
- Slide in/out
- Scale
- Pulse
- Rotate

### Transições
```css
transition-all duration-300     /* Suave */
transition-colors duration-200  /* Rápida */
transition-transform duration-500 /* Lenta */
```

---

## ♿ Acessibilidade

Todos os componentes:
- ✅ Suportam keyboard navigation
- ✅ Têm aria-labels apropriadas
- ✅ Alto contraste de cores
- ✅ Respondem a estados de foco

---

## 📖 Integração com Backend

### Tipo de dados para Pipeline
```typescript
interface PipelineStage {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failed";
  duration?: number;
  description?: string;
}
```

### Tipo de dados para Deployment
```typescript
interface DeploymentTimelineItem {
  id: string;
  environment: "staging" | "production";
  version: string;
  status: "pending" | "in-progress" | "success" | "failed";
  timestamp: Date;
  duration?: number;
  commitHash?: string;
  description?: string;
}
```

---

## 🚀 Performance

- Componentes otimizados para re-renders
- Uso de memo para componentes estáticos
- Lazy loading de imagens
- CSS classes pré-calculadas

---

## 📝 Notas

- Todos os componentes usam Tailwind CSS
- Cores seguem o design system Cronos Audit
- Totalmente customizáveis via props
- Suporte a tema dark (default) e light (extensível)

---

**Última atualização**: 01/06/2026
**Status**: ✅ Pronto para produção
