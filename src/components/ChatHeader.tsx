import React from 'react';
import { Shield, FileCheck, Building2, AlertCircle, Brain, Key } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';

interface ChatHeaderProps {
  sessionTitle: string;
  hasDocuments: boolean;
  isAIConfigured: boolean;
  aiModel: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  sessionTitle, 
  hasDocuments, 
  isAIConfigured,
  aiModel 
}) => {
  const { getTranslation } = useLanguage();

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">{sessionTitle}</h1>
            <p className="text-sm text-gray-500">{getTranslation('company_policy_assistant')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <LanguageSelector />

          {/* AI Status */}
          {isAIConfigured ? (
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              <Brain className="w-4 h-4" />
              <span>{getTranslation('ai_ready')} ({aiModel})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
              <Key className="w-4 h-4" />
              <span>{getTranslation('configure_openai')}</span>
            </div>
          )}

          {/* Documents Status */}
          {hasDocuments ? (
            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <FileCheck className="w-4 h-4" />
              <span>{getTranslation('documents_loaded')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{getTranslation('upload_documents')}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Building2 className="w-4 h-4" />
            <span>{getTranslation('hr_system')}</span>
          </div>
          
          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{getTranslation('online')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};