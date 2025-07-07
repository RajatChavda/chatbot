import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Settings,
  Shield,
  Clock,
  Brain,
  Key
} from 'lucide-react';
import { ChatSession } from '../types/chat';
import { useLanguage } from '../hooks/useLanguage';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onShowPDFManager: () => void;
  onShowOpenAIConfig: () => void;
  documentsCount: number;
  isAIConfigured: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  collapsed,
  onToggleCollapse,
  onShowPDFManager,
  onShowOpenAIConfig,
  documentsCount,
  isAIConfigured
}) => {
  const { getTranslation } = useLanguage();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return getTranslation('today');
    if (days === 1) return getTranslation('yesterday');
    if (days < 7) return `${days} ${getTranslation('days_ago')}`;
    return date.toLocaleDateString();
  };

  const groupedSessions = sessions.reduce((groups, session) => {
    const date = formatDate(session.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <h1 className="font-semibold">{getTranslation('ai_policy_assistant')}</h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>{getTranslation('new_chat')}</span>}
        </button>
      </div>

      {/* Management Buttons */}
      <div className="px-4 pb-4 space-y-2">
        {/* PDF Management */}
        <button
          onClick={onShowPDFManager}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 flex items-center justify-center space-x-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <span>{getTranslation('manage_documents')}</span>
              {documentsCount > 0 && (
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full">
                  {documentsCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* OpenAI Configuration */}
        <button
          onClick={onShowOpenAIConfig}
          className={`w-full rounded-lg p-3 flex items-center justify-center space-x-2 transition-colors ${
            isAIConfigured 
              ? 'bg-green-700 hover:bg-green-600' 
              : 'bg-orange-700 hover:bg-orange-600'
          }`}
        >
          {isAIConfigured ? <Brain className="w-4 h-4" /> : <Key className="w-4 h-4" />}
          {!collapsed && (
            <span>{isAIConfigured ? getTranslation('ai_configured') : getTranslation('setup_openai')}</span>
          )}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-4">
            <h2 className="text-sm font-medium text-gray-400 mb-3">{getTranslation('recent_chats')}</h2>
            
            {Object.entries(groupedSessions).map(([date, sessionGroup]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs text-gray-500 mb-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {date}
                </h3>
                
                {sessionGroup.map((session) => (
                  <div
                    key={session.id}
                    className={`group relative mb-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-gray-700 border border-gray-600'
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => onSwitchSession(session.id)}
                  >
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {session.messages.length} messages
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{getTranslation('no_chat_history')}</p>
                <p className="text-xs mt-1">{getTranslation('start_conversation')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center space-x-2 p-2 hover:bg-gray-700 rounded transition-colors">
          <Settings className="w-4 h-4" />
          {!collapsed && <span className="text-sm">{getTranslation('settings')}</span>}
        </button>
      </div>
    </div>
  );
};