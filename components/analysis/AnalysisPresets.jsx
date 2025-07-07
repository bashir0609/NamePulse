/* ==========================================
// components/analysis/AnalysisPresets.jsx
// ========================================== */

import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ANALYSIS_PRESETS = [
  {
    id: 'basic_gender',
    name: 'Basic Gender Analysis',
    description: 'Quick gender prediction using free APIs',
    icon: '👥',
    config: {
      types: ['gender'],
      providers: { gender: 'genderize' },
      batchSize: 10
    }
  },
  {
    id: 'advanced_gender',
    name: 'Advanced Gender Analysis',
    description: 'High-accuracy gender prediction with AI models',
    icon: '🧠',
    config: {
      types: ['gender'],
      providers: { gender: 'openrouter' },
      batchSize: 5
    },
    requiresApiKey: true
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Analysis',
    description: 'Full demographic analysis (gender + origin + age)',
    icon: '📊',
    config: {
      types: ['gender', 'origin', 'age'],
      providers: {
        gender: 'openrouter',
        origin: 'nationalize',
        age: 'agify'
      },
      batchSize: 3
    },
    requiresApiKey: true,
    comingSoon: true
  },
  {
    id: 'bulk_processing',
    name: 'Bulk Processing',
    description: 'Optimized for large datasets (500+ names)',
    icon: '⚡',
    config: {
      types: ['gender'],
      providers: { gender: 'genderize' },
      batchSize: 20
    }
  }
]

export default function AnalysisPresets({ onPresetSelect, currentConfig }) {
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id)
    onPresetSelect(preset.config)
  }

  const isPresetActive = (preset) => {
    if (!currentConfig) return false
    
    return (
      JSON.stringify(preset.config.types.sort()) === JSON.stringify(currentConfig.types?.sort()) &&
      JSON.stringify(preset.config.providers) === JSON.stringify(currentConfig.providers)
    )
  }

  return (
    <Card className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        🎯 Quick Start Presets
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ANALYSIS_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isPresetActive(preset)
                ? 'border-blue-500 bg-blue-50'
                : preset.comingSoon
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onClick={() => !preset.comingSoon && handlePresetSelect(preset)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{preset.icon}</span>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">{preset.name}</h5>
                <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.config.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                {preset.requiresApiKey && (
                  <div className="flex items-center mt-2 text-xs text-orange-600">
                    🔑 Requires API key
                  </div>
                )}
              </div>
            </div>
            
            {preset.comingSoon && (
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}
            
            {isPresetActive(preset) && (
              <div className="absolute top-2 right-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  ✓ Active
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-blue-500">💡</span>
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Start with "Basic Gender Analysis" for quick results, 
            or use "Advanced Gender Analysis" with your API key for higher accuracy.
          </div>
        </div>
      </div>
    </Card>
  )
}