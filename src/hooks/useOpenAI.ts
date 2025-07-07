import { useState, useCallback } from 'react';

interface OpenAIConfig {
  apiKey: string;
  model: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const useOpenAI = () => {
  const [config, setConfig] = useState<OpenAIConfig>({
    apiKey: '',
    model: 'gpt-3.5-turbo'
  });
  const [isConfigured, setIsConfigured] = useState(false);

  const configureOpenAI = useCallback((apiKey: string, model: string = 'gpt-3.5-turbo') => {
    setConfig({ apiKey, model });
    setIsConfigured(!!apiKey);
    localStorage.setItem('openai_config', JSON.stringify({ apiKey, model }));
  }, []);

  const generateResponse = useCallback(async (
    userMessage: string,
    pdfContext: string = '',
    conversationHistory: ChatMessage[] = [],
    targetLanguage: string = 'en'
  ): Promise<string> => {
    if (!isConfigured || !config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const languageInstruction = targetLanguage !== 'en' 
      ? `\n\nIMPORTANT: Respond in ${getLanguageName(targetLanguage)} language. Translate all content to ${getLanguageName(targetLanguage)} while maintaining the professional tone and structure.`
      : '';

    const systemPrompt = `You are an intelligent company policy assistant with access to company documents. 

CONTEXT FROM COMPANY DOCUMENTS:
${pdfContext}

INSTRUCTIONS:
1. Use the provided company document context to answer questions accurately
2. If the information is in the documents, cite specific policies and provide detailed answers
3. If information is not in the documents, clearly state this and provide general guidance
4. Always be helpful and provide recommendations when appropriate
5. Use a professional but friendly tone
6. Structure your responses with clear headings and bullet points when helpful
7. Provide actionable next steps when relevant${languageInstruction}

Remember: You have access to the company's actual policy documents, so provide specific, accurate information when available.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    try {
      // Use a CORS proxy service for development/demo purposes
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const openaiUrl = 'https://api.openai.com/v1/chat/completions';
      
      // Try direct API call first (works in some environments)
      let response;
      try {
        response = await fetch(openaiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'Origin': window.location.origin
          },
          body: JSON.stringify({
            model: config.model,
            messages,
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
          })
        });
      } catch (corsError) {
        console.log('Direct API call failed, trying alternative approach...');
        
        // Alternative approach: Use fetch with different headers
        response = await fetch(openaiUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            model: config.model,
            messages,
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'OpenAI API request failed';
        
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.error?.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to OpenAI API. This might be due to CORS restrictions or network issues. Please check your internet connection and API key.');
      }
      
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
      }
      
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      
      if (error.message.includes('insufficient_quota')) {
        throw new Error('OpenAI quota exceeded. Please check your OpenAI account billing.');
      }
      
      throw error;
    }
  }, [config, isConfigured]);

  // Load saved config on initialization
  useState(() => {
    const saved = localStorage.getItem('openai_config');
    if (saved) {
      try {
        const { apiKey, model } = JSON.parse(saved);
        if (apiKey) {
          setConfig({ apiKey, model });
          setIsConfigured(true);
        }
      } catch (error) {
        console.error('Error loading OpenAI config:', error);
      }
    }
  });

  return {
    config,
    isConfigured,
    configureOpenAI,
    generateResponse
  };
};

const getLanguageName = (code: string): string => {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'pl': 'Polish',
    'tr': 'Turkish',
    'th': 'Thai'
  };
  return languageNames[code] || 'English';
};