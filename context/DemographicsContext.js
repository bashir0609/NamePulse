// ==========================================
// context/DemographicsContext.js (COMPLETE)
// ==========================================
import { createContext, useReducer, useCallback } from 'react'

const DemographicsContext = createContext()

const initialState = {
  analysisConfig: {
    types: ['gender'],
    providers: {
      gender: 'genderize'
    },
    apiKeys: {},
    names: [],
    batchSize: 10
  },
  results: [],
  isProcessing: false,
  progress: { current: 0, total: 0 },
  status: null
}

function demographicsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return {
        ...state,
        analysisConfig: {
          ...state.analysisConfig,
          ...action.payload
        }
      }
    
    case 'START_PROCESSING':
      return {
        ...state,
        isProcessing: true,
        progress: { current: 0, total: action.payload.total },
        status: { message: 'Starting analysis...', type: 'info' },
        results: []
      }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.payload,
        status: { 
          message: `Processing ${action.payload.current}/${action.payload.total}...`, 
          type: 'info' 
        }
      }
    
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isProcessing: false,
        status: { 
          message: `Analysis complete! Processed ${action.payload.length} names.`, 
          type: 'success' 
        }
      }
    
    case 'ADD_RESULT':
      return {
        ...state,
        results: [...state.results, action.payload]
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        isProcessing: false,
        status: { message: action.payload.message, type: 'error' }
      }
    
    case 'STOP_PROCESSING':
      return {
        ...state,
        isProcessing: false,
        status: { 
          message: `Analysis stopped. Processed ${state.results.length} names.`, 
          type: 'warning' 
        }
      }
    
    case 'CLEAR_STATUS':
      return {
        ...state,
        status: null
      }
    
    case 'CLEAR_RESULTS':
      return {
        ...state,
        results: [],
        progress: { current: 0, total: 0 }
      }
    
    default:
      return state
  }
}

export function DemographicsProvider({ children }) {
  const [state, dispatch] = useReducer(demographicsReducer, initialState)

  const updateConfig = useCallback((updates) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: updates })
  }, [])

  const startAnalysis = useCallback(async () => {
    if (!state.analysisConfig.names || state.analysisConfig.names.length === 0) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { message: 'Please enter names to analyze' } 
      })
      return
    }

    dispatch({ 
      type: 'START_PROCESSING', 
      payload: { total: state.analysisConfig.names.length } 
    })

    try {
      const response = await fetch('/api/analyze-demographics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names: state.analysisConfig.names,
          analysisTypes: state.analysisConfig.types,
          providers: state.analysisConfig.providers,
          apiKeys: state.analysisConfig.apiKeys,
          options: {
            batchSize: state.analysisConfig.batchSize
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      dispatch({ type: 'SET_RESULTS', payload: data.results })

    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { message: error.message } 
      })
    }
  }, [state.analysisConfig])

  const stopAnalysis = useCallback(() => {
    dispatch({ type: 'STOP_PROCESSING' })
  }, [])

  const clearResults = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULTS' })
  }, [])

  const clearStatus = useCallback(() => {
    dispatch({ type: 'CLEAR_STATUS' })
  }, [])

  const value = {
    ...state,
    updateConfig,
    startAnalysis,
    stopAnalysis,
    clearResults,
    clearStatus
  }

  return (
    <DemographicsContext.Provider value={value}>
      {children}
    </DemographicsContext.Provider>
  )
}

export { DemographicsContext }