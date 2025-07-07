// ==========================================
// components/forms/NameInput.jsx
// ==========================================
import { useState } from 'react'

export default function NameInput({ names, onNamesChange }) {
  const [inputValue, setInputValue] = useState(names?.join('\n') || '')

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    const nameList = value
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)
    
    onNamesChange(nameList)
  }

  const handleClear = () => {
    setInputValue('')
    onNamesChange([])
  }

  return (
    <div className="card mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Manual Entry (one name per line):
          </label>
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
        
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter names here, one per line:&#10;John Smith&#10;Maria Garcia&#10;Alexander Wang"
          className="form-textarea min-h-[200px] font-mono"
          rows={10}
        />
        
        <div className="text-sm text-gray-600">
          {names?.length || 0} names entered
        </div>
      </div>
    </div>
  )
}