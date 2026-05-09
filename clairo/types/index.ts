export type Theme = 'light' | 'dark' | 'system';

export type UserType = 'personal' | 'family' | 'business' | 'student' | 'elderly';

export type Language =
  | 'english'
  | 'hindi'
  | 'hinglish'
  | 'tamil'
  | 'telugu'
  | 'bengali'
  | 'marathi'
  | 'kannada'
  | 'malayalam'
  | 'gujarati'
  | 'punjabi';

export type PersonaId =
  | 'office-assistant'
  | 'friendly-teacher'
  | 'legal-helper'
  | 'government-expert'
  | 'business-consultant'
  | 'patient-explainer';

export interface Persona {
  id: PersonaId;
  label: string;
  emoji: string;
  description: string;
}

export const PERSONAS: Persona[] = [
  { id: 'office-assistant', label: 'Office Assistant', emoji: '💼', description: 'Professional and concise' },
  { id: 'friendly-teacher', label: 'Friendly Teacher', emoji: '👩‍🏫', description: 'Warm and explanatory' },
  { id: 'legal-helper', label: 'Legal Helper', emoji: '⚖️', description: 'Precise and thorough' },
  { id: 'government-expert', label: 'Government Expert', emoji: '🏛️', description: 'Formal, official style' },
  { id: 'business-consultant', label: 'Business Consultant', emoji: '🤝', description: 'Strategic and confident' },
  { id: 'patient-explainer', label: 'Patient Explainer', emoji: '💬', description: 'Simple, step-by-step' },
];

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'hinglish', label: 'Hinglish' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'telugu', label: 'Telugu' },
  { id: 'bengali', label: 'Bengali' },
  { id: 'marathi', label: 'Marathi' },
  { id: 'kannada', label: 'Kannada' },
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'gujarati', label: 'Gujarati' },
  { id: 'punjabi', label: 'Punjabi' },
];

export type ToolId =
  | 'document-wizard'
  | 'email-helper'
  | 'receipt-scanner'
  | 'form-filler'
  | 'schedule-maker'
  | 'business-helper'
  | 'learn-anything'
  | 'doc-transcriber'
  | 'scheme-helper'
  | 'medical-simplifier'
  | 'resume-assistant'
  | 'whatsapp-assistant'
  | 'scam-detector';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  emoji: string;
  description: string;
  href: string;
  model: 'flash' | 'pro';
  category: 'popular' | 'all';
}

export const TOOLS: ToolDefinition[] = [
  { id: 'document-wizard', name: 'Document Wizard', emoji: '📄', description: 'Write letters, applications, and official documents', href: '/tools/document-wizard', model: 'flash', category: 'popular' },
  { id: 'email-helper', name: 'Email Assistant', emoji: '📧', description: 'Reply to emails or write new ones — without struggling for the right words', href: '/tools/email-helper', model: 'flash', category: 'popular' },
  { id: 'receipt-scanner', name: 'Receipt Scanner', emoji: '🧾', description: 'Scan receipts and organize your expenses', href: '/tools/receipt-scanner', model: 'pro', category: 'popular' },
  { id: 'form-filler', name: 'Form Filler', emoji: '📋', description: 'Fill out official forms without the confusion', href: '/tools/form-filler', model: 'flash', category: 'all' },
  { id: 'schedule-maker', name: 'Schedule Maker', emoji: '📅', description: 'Plan your day, week, or study schedule', href: '/tools/schedule-maker', model: 'flash', category: 'all' },
  { id: 'business-helper', name: 'Business Helper', emoji: '🏪', description: 'Create invoices, posts, and business content', href: '/tools/business-helper', model: 'flash', category: 'all' },
  { id: 'learn-anything', name: 'Learn Anything', emoji: '🎓', description: 'Understand any document or topic simply', href: '/tools/learn-anything', model: 'flash', category: 'all' },
  { id: 'doc-transcriber', name: 'Doc Transcriber', emoji: '📑', description: 'Turn paper documents into editable text', href: '/tools/doc-transcriber', model: 'pro', category: 'all' },
  { id: 'scheme-helper', name: 'Government Schemes', emoji: '🏛️', description: 'Find government schemes you qualify for', href: '/tools/scheme-helper', model: 'pro', category: 'all' },
  { id: 'medical-simplifier', name: 'Medical Simplifier', emoji: '🏥', description: 'Understand your medical reports in plain language', href: '/tools/medical-simplifier', model: 'pro', category: 'all' },
  { id: 'resume-assistant', name: 'Resume Assistant', emoji: '💼', description: 'Build and improve your resume and cover letters', href: '/tools/resume-assistant', model: 'flash', category: 'all' },
  { id: 'whatsapp-assistant', name: 'WhatsApp Assistant', emoji: '💬', description: 'Craft perfect WhatsApp messages for business', href: '/tools/whatsapp-assistant', model: 'flash', category: 'all' },
  { id: 'scam-detector', name: 'Scam Detector', emoji: '🔍', description: 'Check if a message or link might be a scam', href: '/tools/scam-detector', model: 'pro', category: 'popular' },
];

export type TrustLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface TrustInfo {
  level: TrustLevel;
  message: string;
}

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  type: 'options' | 'text' | 'textarea' | 'upload' | 'slider' | 'multi-select' | 'dynamic-list' | 'language' | 'tone';
  options?: WizardOption[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export interface WizardOption {
  id: string;
  label: string;
  emoji: string;
  description?: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  tool_name: ToolId;
  tool_display_name: string;
  inputs: Record<string, unknown>;
  output_text: string;
  file_url?: string;
  language: Language;
  persona?: PersonaId;
  confidence_score?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  language_preference: Language;
  theme: Theme;
  family_mode: boolean;
  persona: PersonaId;
  onboarding_complete: boolean;
  user_type: UserType;
  created_at: string;
}

export interface VoiceIntentResult {
  tool: ToolId;
  intent: string;
  prefill: Record<string, string>;
  language: Language;
}

export interface ActionChip {
  label: string;
  instruction: string;
}
