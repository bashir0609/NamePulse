// ==========================================
// pages/api/providers/genderize.js (FIXED - Better error handling and logging)
// ==========================================
export async function analyzeGender(name, req) {
  const firstName = extractFirstName(name)
  
  console.log(`🔍 Analyzing "${firstName}" with Genderize.io...`)
  
  try {
    const url = `https://api.genderize.io?name=${encodeURIComponent(firstName)}`
    console.log(`📡 Calling: ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'NameDemographicsAnalyzer/1.0',
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 seconds
    })
    
    console.log(`📊 Genderize response status: ${response.status}`)
    
    if (!response.ok) {
      throw new Error(`Genderize API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Genderize data:`, data)
    
    // Genderize returns null for unknown names
    const gender = data.gender || 'unknown'
    const confidence = data.probability ? Math.round(data.probability * 100) : 0
    
    console.log(`🎯 Result: ${gender} (${confidence}%)`)
    
    return {
      value: gender,
      confidence: confidence,
      provider: 'genderize',
      metadata: {
        count: data.count || 0,
        probability: data.probability || 0,
        country_id: data.country_id || null
      }
    }
  } catch (error) {
    console.error(`❌ Genderize error for "${firstName}":`, error.message)
    
    // Return specific error info instead of falling back silently
    return {
      value: 'unknown',
      confidence: 0,
      provider: 'genderize',
      error: error.message,
      fallback: true
    }
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