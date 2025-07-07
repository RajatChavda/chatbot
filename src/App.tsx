import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AdvancedPDFManager } from './components/AdvancedPDFManager';
import { OpenAIConfig } from './components/OpenAIConfig';
import { useChatSessions } from './hooks/useChatSessions';
import { useAdvancedPDFProcessor } from './hooks/useAdvancedPDFProcessor';
import { useOpenAI } from './hooks/useOpenAI';
import { useLanguage } from './hooks/useLanguage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPDFManager, setShowPDFManager] = useState(false);
  const [showOpenAIConfig, setShowOpenAIConfig] = useState(false);
  
  const { currentLanguage } = useLanguage();
  
  const { 
    sessions, 
    currentSessionId, 
    createNewSession, 
    switchSession, 
    deleteSession,
    addMessageToSession 
  } = useChatSessions();
  
  const { 
    documents, 
    isProcessing, 
    processingProgress,
    processDocuments, 
    searchDocuments,
    deleteDocument,
    clearAllDocuments
  } = useAdvancedPDFProcessor();

  const {
    config,
    isConfigured,
    configureOpenAI,
    generateResponse
  } = useOpenAI();

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleSendMessage = async (message: string) => {
    if (currentSessionId) {
      // Search documents for context
      const documentContext = searchDocuments(message);
      
      // Add user message immediately
      addMessageToSession(currentSessionId, message, [], true);
      
      // Generate AI response if configured
      if (isConfigured) {
        try {
          const response = await generateResponse(
            message, 
            documentContext, 
            [], 
            currentLanguage.code
          );
          addMessageToSession(currentSessionId, response, [], false, true);
        } catch (error) {
          console.error('AI response error:', error);
          
          // Provide helpful error messages based on error type
          let errorMessage = `❌ **AI Error**: ${error}`;
          
          if (error.toString().includes('Network error')) {
            errorMessage = `🌐 **Connection Issue**\n\nUnable to connect to OpenAI API. This could be due to:\n\n• **Network connectivity issues**\n• **CORS restrictions in your browser**\n• **Firewall or proxy blocking the request**\n\n**Solutions:**\n1. Check your internet connection\n2. Try refreshing the page\n3. Verify your API key is correct\n4. For production use, consider implementing a backend proxy\n\n*Note: Some browsers or networks may block direct API calls for security reasons.*`;
          } else if (error.toString().includes('Invalid API key')) {
            errorMessage = `🔑 **Invalid API Key**\n\nYour OpenAI API key appears to be invalid.\n\n**Please:**\n1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)\n2. Generate a new API key\n3. Update your configuration\n4. Make sure the key starts with 'sk-'`;
          } else if (error.toString().includes('quota')) {
            errorMessage = `💳 **Quota Exceeded**\n\nYour OpenAI account has exceeded its usage quota.\n\n**Please:**\n1. Check your [OpenAI billing](https://platform.openai.com/account/billing)\n2. Add credits to your account\n3. Verify your usage limits`;
          }
          
          addMessageToSession(
            currentSessionId, 
            errorMessage, 
            [], 
            false, 
            true
          );
        }
      } else {
        // Fallback response when AI is not configured
        const fallbackResponse = `🔧 **OpenAI Not Configured**\n\nTo get AI-powered responses:\n1. Click the settings icon to configure OpenAI\n2. Add your OpenAI API key\n3. Select your preferred model\n\nI found ${documents.length} documents in your knowledge base that I can search through once AI is configured.`;
        addMessageToSession(currentSessionId, fallbackResponse, [], false, true);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 flex-shrink-0`}>
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewSession={createNewSession}
          onSwitchSession={switchSession}
          onDeleteSession={deleteSession}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onShowPDFManager={() => setShowPDFManager(true)}
          onShowOpenAIConfig={() => setShowOpenAIConfig(true)}
          documentsCount={documents.length}
          isAIConfigured={isConfigured}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentSession && (
          <ChatArea
            session={currentSession}
            onSendMessage={handleSendMessage}
            hasDocuments={documents.length > 0}
            isAIConfigured={isConfigured}
            aiModel={config.model}
          />
        )}
      </div>

      {/* PDF Manager Modal */}
      {showPDFManager && (
        <AdvancedPDFManager
          onClose={() => setShowPDFManager(false)}
          onProcessDocuments={processDocuments}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
          documents={documents}
          onDeleteDocument={deleteDocument}
          onClearAll={clearAllDocuments}
        />
      )}

      {/* OpenAI Configuration */}
      {showOpenAIConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md mx-4">
            <div className="p-6">
              <OpenAIConfig
                isConfigured={isConfigured}
                currentModel={config.model}
                onConfigure={configureOpenAI}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowOpenAIConfig(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;