import { useState, useCallback } from 'react';
import { ChatSession, Message } from '../types/chat';
import { useLanguage } from './useLanguage';

export const useChatSessions = () => {
  const { getTranslation } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: getTranslation('new_chat'),
      messages: [
        {
          id: '1',
          text: getTranslation('welcome_message'),
          isUser: false,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      isTyping: false
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, [getTranslation]);

  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const addMessageToSession = useCallback((
    sessionId: string, 
    messageText: string, 
    searchResults: any[] = [],
    isUser: boolean = true,
    skipTyping: boolean = false
  ) => {
    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: messageText,
      isUser,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedSession = {
          ...session,
          messages: [...session.messages, message],
          isTyping: isUser && !skipTyping
        };
        
        // Update title if it's the first user message
        if (isUser && session.messages.length === 1) {
          updatedSession.title = messageText.length > 50 
            ? messageText.substring(0, 50) + '...' 
            : messageText;
        }
        
        return updatedSession;
      }
      return session;
    }));

    // Clear typing indicator for AI responses
    if (!isUser || skipTyping) {
      setTimeout(() => {
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, isTyping: false }
            : session
        ));
      }, 100);
    }
  }, []);

  // Initialize with first session if none exist
  if (sessions.length === 0 && currentSessionId === null) {
    createNewSession();
  }

  return {
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    addMessageToSession
  };
};