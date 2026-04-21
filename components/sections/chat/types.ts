import type {
  ChangeEvent,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type ChatRole = "user" | "assistant";

export type ReportData = {
  id: string;
  reportHash: string;
  status: string;
  markdownContent: string | null;
  resultLink: string | null;
  generatedAt: string | null;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  fileName?: string | null;
  reportLink?: string | null;
  reportStatus?: string | null;
};

export type ChatConversation = {
  id: string;
  title: string;
  updatedAt: string;
  conversationHash: string;
  auditType?: string | null;
  status?: string;
};

export type ConversationFile = {
  id: string;
  originalFileName: string;
  storagePath: string;
  mimeType?: string | null;
  createdAt: string;
};

export type CompanySuggestion = {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  municipio: string | null;
  uf: string | null;
  situacao: string | null;
  abertura: string | null;
  label: string;
};

export type TaxRegime =
  | "simples_nacional"
  | "lucro_presumido"
  | "lucro_real"
  | "mei";

export type DocumentType =
  | "documento_contabil"
  | "razao_contabil"
  | "balancete"
  | "dre"
  | "livro_fiscal"
  | "outro";

export interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

export type AuditMetadataFormProps = {
  cnpj: string;
  setCnpj: Dispatch<SetStateAction<string>>;
  regimeTributario: TaxRegime;
  setRegimeTributario: Dispatch<SetStateAction<TaxRegime>>;
  anoFiscal: string;
  setAnoFiscal: Dispatch<SetStateAction<string>>;
  docType: DocumentType;
  setDocType: Dispatch<SetStateAction<DocumentType>>;
  companyQuery: string;
  setCompanyQuery: Dispatch<SetStateAction<string>>;
  companySuggestions: CompanySuggestion[];
  setCompanySuggestions: Dispatch<SetStateAction<CompanySuggestion[]>>;
  isSearchingCompanies: boolean;
  showCompanySuggestions: boolean;
  setShowCompanySuggestions: Dispatch<SetStateAction<boolean>>;
  compact?: boolean;
};

export type LandingProps = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  file: File | null;
  cnpj: string;
  setCnpj: Dispatch<SetStateAction<string>>;
  regimeTributario: TaxRegime;
  setRegimeTributario: Dispatch<SetStateAction<TaxRegime>>;
  anoFiscal: string;
  setAnoFiscal: Dispatch<SetStateAction<string>>;
  docType: DocumentType;
  setDocType: Dispatch<SetStateAction<DocumentType>>;
  isLoading: boolean;
  isGeneratingReport: boolean;
  hasMessage: boolean;
  activeConversation: ChatConversation | null;
  latestReport: ReportData | null;
  errorMessage: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  adjustHeight: (reset?: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleSubmit: () => void;
  handleGenerateReport: () => void;
  companyQuery: string;
  setCompanyQuery: Dispatch<SetStateAction<string>>;
  companySuggestions: CompanySuggestion[];
  setCompanySuggestions: Dispatch<SetStateAction<CompanySuggestion[]>>;
  isSearchingCompanies: boolean;
  showCompanySuggestions: boolean;
  setShowCompanySuggestions: Dispatch<SetStateAction<boolean>>;
};

export type ConversationProps = {
  conversations: ChatConversation[];
  activeConversationId: string;
  activeConversation: ChatConversation;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
  createConversation: () => void;
  deleteConversation: (conversationId: string) => void;
  setActiveConversationId: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  file: File | null;
  cnpj: string;
  setCnpj: Dispatch<SetStateAction<string>>;
  regimeTributario: TaxRegime;
  setRegimeTributario: Dispatch<SetStateAction<TaxRegime>>;
  anoFiscal: string;
  setAnoFiscal: Dispatch<SetStateAction<string>>;
  docType: DocumentType;
  setDocType: Dispatch<SetStateAction<DocumentType>>;
  messages: ChatMessage[];
  latestReport: ReportData | null;
  conversationFiles: ConversationFile[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  hasMessage: boolean;
  errorMessage: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  adjustHeight: (reset?: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleSubmit: () => void;
  handleGenerateReport: () => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  companyQuery: string;
  setCompanyQuery: Dispatch<SetStateAction<string>>;
  companySuggestions: CompanySuggestion[];
  setCompanySuggestions: Dispatch<SetStateAction<CompanySuggestion[]>>;
  isSearchingCompanies: boolean;
  showCompanySuggestions: boolean;
  setShowCompanySuggestions: Dispatch<SetStateAction<boolean>>;
};

export type QuickActionProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};