// ==========================================
// pages/api/analyze-demographics.js (FIXED - Better error handling)
// ==========================================
import { validateRequest, handleError } from '../../utils/apiHelpers'
import { analyzeGender } from './providers/genderize'
import { analyzeWithOpenRouter } from './providers/openrouter'
import { analyzeWithPerplexity } from './providers/perplexity'

const PROVIDERS = {
  gender: {
    genderize: analyzeGender,
    openrouter: analyzeWithOpenRouter,
    perplexity: analyzeWithPerplexity,
    simple: predictGenderSimple // Add simple as explicit option
  }
}

export default async function handler(req, res) {
  console.log(`🚀 API called: ${req.method} /api/analyze-demographics`)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { names, analysisTypes, providers, options = {} } = validateRequest(req.body)
    
    console.log(`📋 Analyzing ${names.length} names with types: ${analysisTypes.join(', ')}`)
    console.log(`🔧 Providers:`, providers)

    const results = []
    const batchSize = options.batchSize || 10

    // Process names in batches
    for (let i = 0; i < names.length; i += batchSize) {
      const batch = names.slice(i, i + batchSize)
      
      for (const name of batch) {
        console.log(`\n🔍 Processing: "${name}"`)
        
        const result = {
          name,
          firstName: extractFirstName(name),
          demographics: {}
        }

        // Analyze each requested type
        for (const analysisType of analysisTypes) {
          if (PROVIDERS[analysisType]) {
            const provider = providers[analysisType] || 'genderize'
            const analyzeFunction = PROVIDERS[analysisType][provider]
            
            console.log(`📊 Using ${provider} for ${analysisType} analysis`)

            if (analyzeFunction) {
              try {
                const analysis = await analyzeFunction(name, req)
                result.demographics[analysisType] = analysis
                
                console.log(`✅ ${analysisType} result:`, analysis)
              } catch (error) {
                console.error(`❌ ${analysisType} analysis failed:`, error.message)
                
                // If main provider fails, try simple fallback for gender
                if (analysisType === 'gender' && provider !== 'simple') {
                  console.log(`🔄 Falling back to simple prediction for "${name}"`)
                  try {
                    const fallbackResult = predictGenderSimple(name)
                    result.demographics[analysisType] = {
                      ...fallbackResult,
                      fallback: true,
                      originalError: error.message
                    }
                  } catch (fallbackError) {
                    result.demographics[analysisType] = {
                      value: 'unknown',
                      confidence: 0,
                      error: error.message,
                      provider: provider
                    }
                  }
                } else {
                  result.demographics[analysisType] = {
                    value: 'unknown',
                    confidence: 0,
                    error: error.message,
                    provider: provider
                  }
                }
              }
            }
          }
        }

        results.push(result)
      }

      // Rate limiting between batches
      if (i + batchSize < names.length) {
        console.log(`⏳ Waiting 500ms before next batch...`)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    const summary = {
      processed: results.length,
      failed: results.filter(r => Object.values(r.demographics).some(d => d.error)).length,
      fallbacks: results.filter(r => Object.values(r.demographics).some(d => d.fallback)).length,
      analysisTypes
    }

    console.log(`📈 Summary:`, summary)
    res.status(200).json({ results, summary })

  } catch (error) {
    console.error(`💥 API Error:`, error)
    handleError(error, res)
  }
}

// Simple fallback function
function predictGenderSimple(fullName) {
  console.log(`🔧 Using simple prediction for: "${fullName}"`)
  
  const firstName = extractFirstName(fullName).toLowerCase()
  
  // Common male and female names for basic prediction
  const maleNames = [
    'john', 'michael', 'david', 'james', 'robert', 'william', 'richard', 'charles',
    'joseph', 'thomas', 'christopher', 'daniel', 'paul', 'mark', 'donald', 'steven',
    'andrew', 'joshua', 'kenneth', 'matthew', 'alexander', 'patrick', 'jack', 'ryan'
  ]
  
  const femaleNames = [
    'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica',
    'sarah', 'karen', 'nancy', 'lisa', 'betty', 'helen', 'sandra', 'donna', 'carol',
    'ruth', 'sharon', 'michelle', 'laura', 'kimberly', 'deborah', 'dorothy', 'amy'
  ]
  
  let gender = 'unknown'
  let confidence = 50
  
  if (maleNames.includes(firstName)) {
    gender = 'male'
    confidence = 85
  } else if (femaleNames.includes(firstName)) {
    gender = 'female'
    confidence = 85
  } else {
    // Simple heuristics based on name endings
    if (firstName.endsWith('a') || firstName.endsWith('ia') || firstName.endsWith('ine')) {
      gender = 'female'
      confidence = 60
    } else if (firstName.endsWith('er') || firstName.endsWith('on') || firstName.endsWith('us')) {
      gender = 'male'
      confidence = 60
    }
  }
  
  return {
    value: gender,
    confidence: confidence,
    provider: 'simple',
    method: 'rule-based'
  }
}

function extractFirstName(fullName) {
  const titles = ['dr.', 'dr', 'prof.', 'prof', 'mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms']
  const parts = fullName.trim().split(/\s+/)
  
  for (const part of parts) {
    const cleanPart = part.toLowerCase().replace(/[.,]/g, '')
    if (!titles.includes(cleanPart) && part.length > 1) {
      return part.replace(/[.,]/g, '')
    }
  }
  
  return parts[0]?.replace(/[.,]/g, '') || fullName
}
