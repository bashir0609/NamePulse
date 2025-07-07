// ==========================================
// pages/api/providers/openrouter.js
// ==========================================
export async function analyzeWithOpenRouter(name, req) {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured')
  }

  const firstName = extractFirstName(name)
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Advanced Name Demographics Analyzer'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{
          role: 'user',
          content: `Analyze the first name "${firstName}" and predict the most likely gender. Consider cultural context and global name patterns. Respond with only: male, female, or unknown`
        }],
        temperature: 0,
        max_tokens: 10
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.toLowerCase().trim()
    
    let gender = 'unknown'
    let confidence = 75
    
    if (content.includes('male') && !content.includes('female')) {
      gender = 'male'
      confidence = 85
    } else if (content.includes('female')) {
      gender = 'female'
      confidence = 85
    }
    
    return {
      value: gender,
      confidence,
      provider: 'openrouter',
      metadata: {
        model: 'anthropic/claude-3.5-sonnet',
        rawResponse: content
      }
    }
  } catch (error) {
    throw new Error(`OpenRouter analysis failed: ${error.message}`)
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