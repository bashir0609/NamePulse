// ==========================================
// pages/api/health.js
// ==========================================
export default function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    apis: {
      genderize: 'available',
      openrouter: process.env.OPENROUTER_API_KEY ? 'configured' : 'not_configured',
      perplexity: process.env.PERPLEXITY_API_KEY ? 'configured' : 'not_configured'
    },
    features: {
      genderAnalysis: true,
      originAnalysis: process.env.ENABLE_ORIGIN_ANALYSIS === 'true',
      ageAnalysis: process.env.ENABLE_AGE_ANALYSIS === 'true'
    }
  }

  res.status(200).json(health)
}