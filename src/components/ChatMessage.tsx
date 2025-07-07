import React from 'react';
import { User, Bot, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gray-600 ml-3' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 mr-3'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>
          </div>
          
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}>
            <Clock className="w-3 h-3 mr-1" />
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};