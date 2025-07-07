// ==========================================
// pages/api/providers/perplexity.js
// ==========================================
export async function analyzeWithPerplexity(name, req) {
  const apiKey = process.env.PERPLEXITY_API_KEY
  
  if (!apiKey) {
    throw new Error('Perplexity API key not configured')
  }

  const firstName = extractFirstName(name)
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [{
          role: 'user',
          content: `What is the most likely gender for the first name "${firstName}"? Consider etymology, cultural origins, and statistical patterns. Respond with only: male, female, or unknown`
        }],
        temperature: 0,
        max_tokens: 10
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.toLowerCase().trim()
    
    let gender = 'unknown'
    let confidence = 80
    
    if (content.includes('male') && !content.includes('female')) {
      gender = 'male'
    } else if (content.includes('female')) {
      gender = 'female'
    }
    
    return {
      value: gender,
      confidence,
      provider: 'perplexity',
      metadata: {
        model: 'llama-3.1-sonar-large-128k-online',
        rawResponse: content
      }
    }
  } catch (error) {
    throw new Error(`Perplexity analysis failed: ${error.message}`)
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