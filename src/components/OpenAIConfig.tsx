import React, { useState } from 'react';
import { Key, Settings, CheckCircle, AlertCircle, ExternalLink, Info } from 'lucide-react';

interface OpenAIConfigProps {
  isConfigured: boolean;
  currentModel: string;
  onConfigure: (apiKey: string, model: string) => void;
}

export const OpenAIConfig: React.FC<OpenAIConfigProps> = ({
  isConfigured,
  currentModel,
  onConfigure
}) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(currentModel || 'gpt-3.5-turbo');
  const [showConfig, setShowConfig] = useState(!isConfigured);

  const handleSave = () => {
    if (apiKey.trim()) {
      onConfigure(apiKey.trim(), model);
      setShowConfig(false);
      setApiKey(''); // Clear for security
    }
  };

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Latest GPT-4 with improved performance' }
  ];

  if (!showConfig && isConfigured) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>AI Ready ({currentModel})</span>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Configure OpenAI"
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Configure OpenAI</h3>
      </div>

      {!isConfigured && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">OpenAI API key required for AI responses</span>
          </div>
        </div>
      )}

      {/* CORS Information */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Setup Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Make sure your OpenAI API key has sufficient credits</li>
              <li>If you get CORS errors, the app will try alternative connection methods</li>
              <li>For production use, consider implementing a backend proxy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 inline-flex items-center"
            >
              OpenAI Platform <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.description}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Configuration
          </button>
          {isConfigured && (
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};