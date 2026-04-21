export function generateConversationHash() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `conv_${crypto.randomUUID().replace(/-/g, "")}`;
  }

  return `conv_${Math.random().toString(36).slice(2)}${Date.now().toString(
    36,
  )}`;
}

export function formatTimeLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "agora";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatConversationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Agora";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.\-]+/g, "_");
}

export function normalizeCnpj(value: string) {
  return value.replace(/[^\d./-]/g, "").trim();
}

export function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function buildFallbackAssistantReply(
  message: string,
  fileName?: string | null,
) {
  const lower = message.toLowerCase();

  if (fileName) {
    return `Recebi o arquivo "${fileName}" e ele já foi encaminhado para o fluxo de auditoria documental.

Vou considerar nesta análise:
- inconsistências relevantes
- riscos identificáveis
- lacunas documentais
- fragilidades de evidência
- pontos de ajuste para o relatório final`;
  }

  if (
    lower.includes("contrato") ||
    lower.includes("cláusula") ||
    lower.includes("clausula")
  ) {
    return `Análise inicial sugerida:

- revisar obrigações, penalidades e responsabilidades
- validar coerência entre cláusulas e anexos
- verificar prazos, aprovações e evidências de suporte
- identificar riscos jurídicos e operacionais`;
  }

  if (
    lower.includes("auditoria") ||
    lower.includes("risco") ||
    lower.includes("compliance")
  ) {
    return `Os pontos iniciais mais relevantes seriam:

- riscos materiais e operacionais
- falhas de controle
- ausência de evidências
- inconsistências processuais
- oportunidades de melhoria e governança`;
  }

  if (
    lower.includes("relatório") ||
    lower.includes("relatorio") ||
    lower.includes("documento")
  ) {
    return `Posso tratar isso como revisão inteligente de relatório.

Os focos principais seriam:
- coerência do conteúdo
- conclusões sem evidência suficiente
- inconsistências textuais ou numéricas
- riscos não tratados
- melhorias de estrutura e rastreabilidade`;
  }

  return `Entendi. Posso analisar isso sob a ótica de auditoria documental.

Os focos iniciais seriam:
- coerência das informações
- riscos e pontos de atenção
- falhas de documentação
- oportunidades de melhoria
- evidências complementares necessárias`;
}