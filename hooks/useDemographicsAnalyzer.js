// ==========================================
// hooks/useDemographicsAnalyzer.js
// ==========================================
import { useState, useContext } from 'react'
import { DemographicsContext } from '../context/DemographicsContext'

export function useDemographicsAnalyzer() {
  const context = useContext(DemographicsContext)
  
  if (!context) {
    throw new Error('useDemographicsAnalyzer must be used within DemographicsProvider')
  }

  const {
    analysisConfig,
    results,
    isProcessing,
    progress,
    status,
    updateConfig,
    startAnalysis,
    stopAnalysis
  } = context

  return {
    analysisConfig,
    results,
    isProcessing,
    progress,
    status,
    updateConfig,
    startAnalysis,
    stopAnalysis
  }
}