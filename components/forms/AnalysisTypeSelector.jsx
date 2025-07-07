// ==========================================
// components/forms/AnalysisTypeSelector.jsx
// ==========================================
import { useState } from 'react'

const ANALYSIS_TYPES = [
  {
    id: 'gender',
    label: 'Gender Analysis',
    description: 'Predict gender from names',
    icon: '👥',
    available: true
  },
  {
    id: 'origin',
    label: 'Name Origin',
    description: 'Predict cultural/geographical origin',
    icon: '🌍',
    available: false,
    comingSoon: true
  },
  {
    id: 'age',
    label: 'Age Demographics',
    description: 'Predict age ranges and generational cohorts',
    icon: '📊',
    available: false,
    comingSoon: true
  }
]

export default function AnalysisTypeSelector({ selectedTypes, onTypeChange }) {
  const handleTypeToggle = (typeId) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId]
    
    onTypeChange(newTypes)
  }

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ANALYSIS_TYPES.map((type) => (
          <div
            key={type.id}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              type.available
                ? selectedTypes.includes(type.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
            onClick={() => type.available && handleTypeToggle(type.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{type.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{type.label}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              {type.available && (
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                  className="w-5 h-5 text-blue-600"
                />
              )}
            </div>
            {type.comingSoon && (
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}