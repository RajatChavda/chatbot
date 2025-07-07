import React, { useState } from 'react';
import { Send, Brain, Upload, Key } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  hasDocuments: boolean;
  isAIConfigured: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled,
  hasDocuments,
  isAIConfigured
}) => {
  const [message, setMessage] = useState('');
  const { getTranslation } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const getStatusInfo = () => {
    if (!isAIConfigured) {
      return {
        icon: Key,
        text: getTranslation('configure_ai'),
        color: "orange",
        message: getTranslation('configure_openai_first')
      };
    }
    if (!hasDocuments) {
      return {
        icon: Upload,
        text: getTranslation('upload_docs'),
        color: "blue",
        message: getTranslation('upload_documents_first')
      };
    }
    return {
      icon: Brain,
      text: getTranslation('ai_ready_status'),
      color: "green",
      message: getTranslation('ai_will_search')
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            !isAIConfigured 
              ? getTranslation('configure_openai_first')
              : !hasDocuments
              ? getTranslation('upload_documents_first')
              : getTranslation('ask_about_policies')
          }
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
        />
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
          status.color === 'green' ? 'bg-green-50 text-green-600' :
          status.color === 'blue' ? 'bg-blue-50 text-blue-600' :
          'bg-orange-50 text-orange-600'
        }`}>
          <StatusIcon className="w-3 h-3" />
          <span>{status.text}</span>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{status.message}</span>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status.color === 'green' ? 'bg-green-400' :
            status.color === 'blue' ? 'bg-blue-400' :
            'bg-orange-400'
          }`}></div>
          <span>{isAIConfigured && hasDocuments ? getTranslation('ready') : getTranslation('setup_required')}</span>
        </div>
      </div>
    </form>
  );
};