// ==========================================
// components/forms/APIConfiguration.jsx
// ==========================================
import { useState } from 'react'

const PROVIDERS = {
  gender: [
    { id: 'genderize', name: 'Genderize.io', requiresKey: false, description: 'Free API with good accuracy' },
    { id: 'openrouter', name: 'OpenRouter', requiresKey: true, description: 'AI models with high accuracy' },
    { id: 'perplexity', name: 'Perplexity AI', requiresKey: true, description: 'Advanced reasoning capabilities' }
  ]
}

export default function APIConfiguration({ config, onConfigChange }) {
  const [apiKeys, setApiKeys] = useState({})

  const handleProviderChange = (analysisType, provider) => {
    onConfigChange({
      providers: {
        ...config.providers,
        [analysisType]: provider
      }
    })
  }

  const handleApiKeyChange = (provider, key) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }))
    onConfigChange({
      apiKeys: {
        ...config.apiKeys,
        [provider]: key
      }
    })
  }

  return (
    <div className="card">
      {config.types.map(analysisType => (
        <div key={analysisType} className="mb-6 last:mb-0">
          <h4 className="font-semibold text-gray-900 mb-3 capitalize">
            {analysisType} Analysis Provider
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Provider:
              </label>
              <select
                value={config.providers[analysisType] || 'genderize'}
                onChange={(e) => handleProviderChange(analysisType, e.target.value)}
                className="form-select"
              >
                {PROVIDERS[analysisType]?.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} {!provider.requiresKey && '(Free)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {PROVIDERS[analysisType]?.find(p => p.id === config.providers[analysisType])?.description}
              </p>
            </div>

            {PROVIDERS[analysisType]?.find(p => p.id === config.providers[analysisType])?.requiresKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key:
                </label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKeys[config.providers[analysisType]] || ''}
                  onChange={(e) => handleApiKeyChange(config.providers[analysisType], e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}