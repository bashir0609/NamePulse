// ==========================================
// hooks/useGenderAnalyzer.js
// ==========================================
import { useState } from 'react'

export function useGenderAnalyzer() {
  const [results, setResults] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const startAnalysis = async (names, config) => {
    setIsProcessing(true)
    setProgress({ current: 0, total: names.length })

    try {
      const response = await fetch('/api/analyze-demographics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names,
          analysisTypes: ['gender'],
          providers: config.providers,
          apiKeys: config.apiKeys
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    results,
    isProcessing,
    progress,
    startAnalysis
  }
}
