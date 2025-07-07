import React, { useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { ChatSession } from '../types/chat';

interface ChatAreaProps {
  session: ChatSession;
  onSendMessage: (message: string) => void;
  hasDocuments: boolean;
  isAIConfigured: boolean;
  aiModel: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  session, 
  onSendMessage, 
  hasDocuments,
  isAIConfigured,
  aiModel
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, session.isTyping]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <ChatHeader 
          sessionTitle={session.title}
          hasDocuments={hasDocuments}
          isAIConfigured={isAIConfigured}
          aiModel={aiModel}
        />
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Message & Quick Actions */}
          {session.messages.length === 1 && (
            <div className="mb-6">
              <QuickActions onActionClick={onSendMessage} />
            </div>
          )}
          
          {/* Messages */}
          <div className="space-y-4">
            {session.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {session.isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput 
            onSendMessage={onSendMessage} 
            disabled={session.isTyping}
            hasDocuments={hasDocuments}
            isAIConfigured={isAIConfigured}
          />
        </div>
      </div>
    </div>
  );
};