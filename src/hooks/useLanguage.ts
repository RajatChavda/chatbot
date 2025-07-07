import { useState, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' }
];

const STORAGE_KEY = 'chatbot_language';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedLang = JSON.parse(saved);
        return SUPPORTED_LANGUAGES.find(lang => lang.code === savedLang.code) || SUPPORTED_LANGUAGES[0];
      } catch {
        return SUPPORTED_LANGUAGES[0];
      }
    }
    return SUPPORTED_LANGUAGES[0];
  });

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(language));
  }, []);

  const getTranslation = useCallback((key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    getTranslation,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};

// Translations object
const translations: Record<string, Record<string, string>> = {
  en: {
    // Header
    'ai_policy_assistant': 'AI Policy Assistant',
    'company_policy_assistant': 'AI-Powered Company Policy Assistant',
    'ai_ready': 'AI Ready',
    'configure_openai': 'Configure OpenAI',
    'documents_loaded': 'Documents Loaded',
    'upload_documents': 'Upload Documents',
    'hr_system': 'HR System',
    'online': 'Online',
    
    // Sidebar
    'new_chat': 'New Chat',
    'manage_documents': 'Manage Documents',
    'setup_openai': 'Setup OpenAI',
    'ai_configured': 'AI Configured',
    'recent_chats': 'Recent Chats',
    'settings': 'Settings',
    'no_chat_history': 'No chat history yet',
    'start_conversation': 'Start a new conversation',
    
    // Chat Input
    'configure_openai_first': 'Configure OpenAI first to enable AI responses...',
    'upload_documents_first': 'Upload documents, then ask about company policies...',
    'ask_about_policies': 'Ask about your company policies, benefits, procedures...',
    'configure_ai': 'Configure AI',
    'upload_docs': 'Upload Docs',
    'ai_ready_status': 'AI Ready',
    'ai_will_search': 'AI will search your documents and provide intelligent answers',
    'setup_required': 'Setup Required',
    'ready': 'Ready',
    
    // Welcome Message
    'welcome_message': "👋 Welcome! I'm your AI-powered company policy assistant. I can analyze your uploaded documents and provide intelligent, contextual answers about HR policies, benefits, procedures, and more. Upload your company documents and configure OpenAI to get started!",
    
    // Quick Actions
    'welcome_title': 'Welcome to Policy Assistant',
    'welcome_subtitle': 'Get instant answers to your company policy questions',
    'hr_policies': 'HR Policies',
    'leave_policy': 'Leave Policy',
    'code_of_conduct': 'Code of Conduct',
    'it_security': 'IT Security',
    'benefits': 'Benefits',
    'working_hours': 'Working Hours',
    
    // Document Manager
    'ai_document_manager': 'AI Document Manager',
    'advanced_pdf_processing': 'Advanced PDF processing with intelligent content extraction',
    'upload_company_documents': 'Upload Company Documents',
    'ai_will_extract': 'AI will extract and analyze content intelligently',
    'choose_pdf_files': 'Choose PDF Files',
    'files_to_process': 'Files to Process',
    'process_with_ai': 'Process with AI',
    'processing': 'Processing...',
    'processed_documents': 'Processed Documents',
    'no_documents_processed': 'No Documents Processed',
    'upload_pdf_files': 'Upload PDF files to get started',
    'clear_all': 'Clear All',
    'delete_document': 'Delete document',
    'select_document': 'Select a Document',
    'click_document_details': 'Click on a document to view its details and extracted sections',
    'extracted_sections': 'Extracted Sections',
    'pages': 'Pages',
    'words': 'Words',
    'file_size': 'File Size',
    'quality': 'Quality',
    'keywords': 'keywords',
    'documents': 'Documents',
    'pages_total': 'pages total',
    'sections_extracted': 'sections extracted',
    
    // OpenAI Config
    'configure_openai_title': 'Configure OpenAI',
    'openai_api_key_required': 'OpenAI API key required for AI responses',
    'openai_api_key': 'OpenAI API Key',
    'get_api_key': 'Get your API key from',
    'openai_platform': 'OpenAI Platform',
    'model': 'Model',
    'save_configuration': 'Save Configuration',
    'cancel': 'Cancel',
    'close': 'Close',
    
    // Language Selector
    'language': 'Language',
    'select_language': 'Select Language',
    'change_language': 'Change Language',
    
    // Common
    'today': 'Today',
    'yesterday': 'Yesterday',
    'days_ago': 'days ago',
    'excellent': 'excellent',
    'good': 'good',
    'fair': 'fair',
    'poor': 'poor',
    'delete_all': 'Delete All',
    'confirm_delete': 'This will permanently delete all documents. This action cannot be undone.',
    'error': 'Error',
    'success': 'Success',
    'loading': 'Loading...',
    'search': 'Search',
    'send': 'Send'
  },
  
  es: {
    // Header
    'ai_policy_assistant': 'Asistente de Políticas IA',
    'company_policy_assistant': 'Asistente de Políticas Empresariales con IA',
    'ai_ready': 'IA Listo',
    'configure_openai': 'Configurar OpenAI',
    'documents_loaded': 'Documentos Cargados',
    'upload_documents': 'Subir Documentos',
    'hr_system': 'Sistema RRHH',
    'online': 'En línea',
    
    // Sidebar
    'new_chat': 'Nuevo Chat',
    'manage_documents': 'Gestionar Documentos',
    'setup_openai': 'Configurar OpenAI',
    'ai_configured': 'IA Configurada',
    'recent_chats': 'Chats Recientes',
    'settings': 'Configuración',
    'no_chat_history': 'Aún no hay historial de chat',
    'start_conversation': 'Iniciar una nueva conversación',
    
    // Chat Input
    'configure_openai_first': 'Configure OpenAI primero para habilitar respuestas de IA...',
    'upload_documents_first': 'Suba documentos, luego pregunte sobre políticas de la empresa...',
    'ask_about_policies': 'Pregunte sobre las políticas, beneficios, procedimientos de su empresa...',
    'configure_ai': 'Configurar IA',
    'upload_docs': 'Subir Docs',
    'ai_ready_status': 'IA Listo',
    'ai_will_search': 'La IA buscará en sus documentos y proporcionará respuestas inteligentes',
    'setup_required': 'Configuración Requerida',
    'ready': 'Listo',
    
    // Welcome Message
    'welcome_message': "👋 ¡Bienvenido! Soy su asistente de políticas empresariales con IA. Puedo analizar sus documentos cargados y proporcionar respuestas inteligentes y contextuales sobre políticas de RRHH, beneficios, procedimientos y más. ¡Suba sus documentos empresariales y configure OpenAI para comenzar!",
    
    // Quick Actions
    'welcome_title': 'Bienvenido al Asistente de Políticas',
    'welcome_subtitle': 'Obtenga respuestas instantáneas a sus preguntas sobre políticas empresariales',
    'hr_policies': 'Políticas RRHH',
    'leave_policy': 'Política de Permisos',
    'code_of_conduct': 'Código de Conducta',
    'it_security': 'Seguridad TI',
    'benefits': 'Beneficios',
    'working_hours': 'Horario Laboral'
  },
  
  fr: {
    // Header
    'ai_policy_assistant': 'Assistant Politique IA',
    'company_policy_assistant': 'Assistant de Politique d\'Entreprise IA',
    'ai_ready': 'IA Prêt',
    'configure_openai': 'Configurer OpenAI',
    'documents_loaded': 'Documents Chargés',
    'upload_documents': 'Télécharger Documents',
    'hr_system': 'Système RH',
    'online': 'En ligne',
    
    // Sidebar
    'new_chat': 'Nouveau Chat',
    'manage_documents': 'Gérer Documents',
    'setup_openai': 'Configurer OpenAI',
    'ai_configured': 'IA Configurée',
    'recent_chats': 'Chats Récents',
    'settings': 'Paramètres',
    'no_chat_history': 'Pas encore d\'historique de chat',
    'start_conversation': 'Commencer une nouvelle conversation',
    
    // Chat Input
    'configure_openai_first': 'Configurez OpenAI d\'abord pour activer les réponses IA...',
    'upload_documents_first': 'Téléchargez des documents, puis posez des questions sur les politiques d\'entreprise...',
    'ask_about_policies': 'Posez des questions sur les politiques, avantages, procédures de votre entreprise...',
    'configure_ai': 'Configurer IA',
    'upload_docs': 'Télécharger Docs',
    'ai_ready_status': 'IA Prêt',
    'ai_will_search': 'L\'IA recherchera dans vos documents et fournira des réponses intelligentes',
    'setup_required': 'Configuration Requise',
    'ready': 'Prêt',
    
    // Welcome Message
    'welcome_message': "👋 Bienvenue ! Je suis votre assistant de politique d'entreprise alimenté par l'IA. Je peux analyser vos documents téléchargés et fournir des réponses intelligentes et contextuelles sur les politiques RH, les avantages, les procédures et plus encore. Téléchargez vos documents d'entreprise et configurez OpenAI pour commencer !",
    
    // Quick Actions
    'welcome_title': 'Bienvenue dans l\'Assistant Politique',
    'welcome_subtitle': 'Obtenez des réponses instantanées à vos questions sur les politiques d\'entreprise',
    'hr_policies': 'Politiques RH',
    'leave_policy': 'Politique de Congé',
    'code_of_conduct': 'Code de Conduite',
    'it_security': 'Sécurité IT',
    'benefits': 'Avantages',
    'working_hours': 'Heures de Travail'
  },
  
  de: {
    // Header
    'ai_policy_assistant': 'KI-Richtlinien-Assistent',
    'company_policy_assistant': 'KI-gestützter Unternehmensrichtlinien-Assistent',
    'ai_ready': 'KI Bereit',
    'configure_openai': 'OpenAI Konfigurieren',
    'documents_loaded': 'Dokumente Geladen',
    'upload_documents': 'Dokumente Hochladen',
    'hr_system': 'HR-System',
    'online': 'Online',
    
    // Sidebar
    'new_chat': 'Neuer Chat',
    'manage_documents': 'Dokumente Verwalten',
    'setup_openai': 'OpenAI Einrichten',
    'ai_configured': 'KI Konfiguriert',
    'recent_chats': 'Letzte Chats',
    'settings': 'Einstellungen',
    'no_chat_history': 'Noch kein Chat-Verlauf',
    'start_conversation': 'Neue Unterhaltung beginnen',
    
    // Chat Input
    'configure_openai_first': 'Konfigurieren Sie zuerst OpenAI, um KI-Antworten zu aktivieren...',
    'upload_documents_first': 'Laden Sie Dokumente hoch und fragen Sie dann nach Unternehmensrichtlinien...',
    'ask_about_policies': 'Fragen Sie nach Ihren Unternehmensrichtlinien, Vorteilen, Verfahren...',
    'configure_ai': 'KI Konfigurieren',
    'upload_docs': 'Docs Hochladen',
    'ai_ready_status': 'KI Bereit',
    'ai_will_search': 'Die KI durchsucht Ihre Dokumente und liefert intelligente Antworten',
    'setup_required': 'Einrichtung Erforderlich',
    'ready': 'Bereit',
    
    // Welcome Message
    'welcome_message': "👋 Willkommen! Ich bin Ihr KI-gestützter Unternehmensrichtlinien-Assistent. Ich kann Ihre hochgeladenen Dokumente analysieren und intelligente, kontextuelle Antworten zu HR-Richtlinien, Vorteilen, Verfahren und mehr liefern. Laden Sie Ihre Unternehmensdokumente hoch und konfigurieren Sie OpenAI, um zu beginnen!",
    
    // Quick Actions
    'welcome_title': 'Willkommen beim Richtlinien-Assistenten',
    'welcome_subtitle': 'Erhalten Sie sofortige Antworten auf Ihre Fragen zu Unternehmensrichtlinien',
    'hr_policies': 'HR-Richtlinien',
    'leave_policy': 'Urlaubsrichtlinie',
    'code_of_conduct': 'Verhaltenskodex',
    'it_security': 'IT-Sicherheit',
    'benefits': 'Vorteile',
    'working_hours': 'Arbeitszeiten'
  },
  
  zh: {
    // Header
    'ai_policy_assistant': 'AI政策助手',
    'company_policy_assistant': 'AI驱动的公司政策助手',
    'ai_ready': 'AI就绪',
    'configure_openai': '配置OpenAI',
    'documents_loaded': '文档已加载',
    'upload_documents': '上传文档',
    'hr_system': '人力资源系统',
    'online': '在线',
    
    // Sidebar
    'new_chat': '新聊天',
    'manage_documents': '管理文档',
    'setup_openai': '设置OpenAI',
    'ai_configured': 'AI已配置',
    'recent_chats': '最近聊天',
    'settings': '设置',
    'no_chat_history': '暂无聊天记录',
    'start_conversation': '开始新对话',
    
    // Chat Input
    'configure_openai_first': '请先配置OpenAI以启用AI响应...',
    'upload_documents_first': '上传文档，然后询问公司政策...',
    'ask_about_policies': '询问您的公司政策、福利、程序...',
    'configure_ai': '配置AI',
    'upload_docs': '上传文档',
    'ai_ready_status': 'AI就绪',
    'ai_will_search': 'AI将搜索您的文档并提供智能答案',
    'setup_required': '需要设置',
    'ready': '就绪',
    
    // Welcome Message
    'welcome_message': "👋 欢迎！我是您的AI驱动的公司政策助手。我可以分析您上传的文档，并提供关于人力资源政策、福利、程序等的智能、上下文相关的答案。上传您的公司文档并配置OpenAI即可开始！",
    
    // Quick Actions
    'welcome_title': '欢迎使用政策助手',
    'welcome_subtitle': '获得公司政策问题的即时答案',
    'hr_policies': '人力资源政策',
    'leave_policy': '请假政策',
    'code_of_conduct': '行为准则',
    'it_security': 'IT安全',
    'benefits': '福利',
    'working_hours': '工作时间'
  }
};