// ==========================================
// pages/index.js (UPDATED - Fixed imports and structure)
// ==========================================
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import AnalysisTypeSelector from '../components/forms/AnalysisTypeSelector'
import APIConfiguration from '../components/forms/APIConfiguration'
import FileUpload from '../components/forms/FileUpload'
import NameInput from '../components/forms/NameInput'
import AnalysisControls from '../components/analysis/AnalysisControls'
import AnalysisPresets from '../components/analysis/AnalysisPresets'
import ResultsDisplay from '../components/results/ResultsDisplay'
import { useDemographicsAnalyzer } from '../hooks/useDemographicsAnalyzer'

export default function Home() {
  const {
    analysisConfig,
    results,
    isProcessing,
    progress,
    status,
    startAnalysis,
    stopAnalysis,
    updateConfig
  } = useDemographicsAnalyzer()

  const handleNamesLoaded = (names) => {
    updateConfig({ names })
  }

  const handleNamesChange = (names) => {
    updateConfig({ names })
  }

  const handlePresetSelect = (presetConfig) => {
    updateConfig(presetConfig)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="header">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">
                🧬 Advanced Name Demographics Analyzer
              </h1>
              <p className="text-xl opacity-90">
                AI-powered demographic analysis for names and identities
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Quick Start Presets */}
            <AnalysisPresets 
              onPresetSelect={handlePresetSelect}
              currentConfig={analysisConfig}
            />

            {/* Analysis Type Selection */}
            <section className="section">
              <h3 className="section-title">🎯 Analysis Type</h3>
              <AnalysisTypeSelector
                selectedTypes={analysisConfig.types}
                onTypeChange={(types) => updateConfig({ types })}
              />
            </section>

            {/* API Configuration */}
            <section className="section">
              <h3 className="section-title">⚙️ API Configuration</h3>
              <APIConfiguration
                config={analysisConfig}
                onConfigChange={updateConfig}
              />
            </section>

            {/* Data Input */}
            <section className="section">
              <h3 className="section-title">📁 Data Input</h3>
              <FileUpload onNamesLoaded={handleNamesLoaded} />
              <NameInput
                names={analysisConfig.names}
                onNamesChange={handleNamesChange}
              />
            </section>

            {/* Analysis Controls */}
            <section className="section">
              <h3 className="section-title">🚀 Analysis</h3>
              <AnalysisControls
                isProcessing={isProcessing}
                progress={progress}
                status={status}
                onStart={startAnalysis}
                onStop={stopAnalysis}
              />
            </section>

            {/* Results */}
            {results.length > 0 && (
              <ResultsDisplay 
                results={results} 
                analysisTypes={analysisConfig.types} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}