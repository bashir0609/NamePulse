// ==========================================
// utils/apiHelpers.js (COMPLETED)
// ==========================================

/**
 * API helper functions for the demographics analyzer
 */

/**
 * Rate limiting storage (in-memory for demo, use Redis in production)
 */
const rateLimitStore = new Map()

/**
 * Check rate limit for IP address
 * @param {string} ip - IP address
 * @param {object} limits - Rate limit configuration
 * @returns {object} Rate limit result
 */
export function checkRateLimit(ip, limits = {}) {
  const {
    windowMs = 60 * 60 * 1000, // 1 hour
    maxRequests = 100
  } = limits
  
  const now = Date.now()
  const key = `rate_limit_${ip}`
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }
  
  const record = rateLimitStore.get(key)
  
  // Reset if window has expired
  if (now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }
  
  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    }
  }
  
  // Increment count
  record.count++
  rateLimitStore.set(key, record)
  
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetTime: record.resetTime 
  }
}

/**
 * Get client IP address from request
 * @param {object} req - Next.js request object
 * @returns {string} IP address
 */
export function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  )
}

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {object} res - Response object
 * @param {string} context - Error context
 */
export function handleError(error, res, context = 'API') {
  console.error(`${context} Error:`, error)
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: isDevelopment ? error.message : 'Invalid request data'
    })
  }
  
  if (error.name === 'RateLimitError') {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: error.retryAfter || 3600
    })
  }
  
  if (error.message?.includes('API key')) {
    return res.status(401).json({
      error: 'Authentication failed',
      details: isDevelopment ? error.message : 'Invalid or missing API key'
    })
  }
  
  if (error.message?.includes('quota') || error.message?.includes('limit')) {
    return res.status(429).json({
      error: 'Service quota exceeded',
      details: 'Please try again later'
    })
  }
  
  // Generic server error
  return res.status(500).json({
    error: 'Internal server error',
    details: isDevelopment ? error.message : 'Something went wrong'
  })
}

/**
 * Validate request and return sanitized data
 * @param {object} body - Request body
 * @returns {object} Validated and sanitized data
 */
export function validateRequest(body) {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object')
  }
  
  const { names, analysisTypes, providers, apiKeys, options } = body
  
  // Validate and sanitize names
  if (!names || !Array.isArray(names)) {
    throw new Error('Names array is required')
  }
  
  const sanitizedNames = names
    .filter(name => name && typeof name === 'string')
    .map(name => name.trim())
    .filter(name => name.length > 0 && name.length <= 200)
  
  if (sanitizedNames.length === 0) {
    throw new Error('No valid names provided')
  }
  
  if (sanitizedNames.length > 1000) {
    throw new Error('Maximum 1000 names allowed')
  }
  
  // Validate analysis types
  if (!analysisTypes || !Array.isArray(analysisTypes)) {
    throw new Error('Analysis types array is required')
  }
  
  const validTypes = ['gender', 'origin', 'age']
  const invalidTypes = analysisTypes.filter(type => !validTypes.includes(type))
  if (invalidTypes.length > 0) {
    throw new Error(`Invalid analysis types: ${invalidTypes.join(', ')}`)
  }
  
  // Validate providers
  if (!providers || typeof providers !== 'object') {
    throw new Error('Providers configuration is required')
  }
  
  return {
    names: sanitizedNames,
    analysisTypes,
    providers,
    apiKeys: apiKeys || {},
    options: options || {}
  }
}

/**
 * Create standardized API response
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @param {object} metadata - Additional metadata
 * @returns {object} Standardized response
 */
export function createApiResponse(data, message = 'Success', metadata = {}) {
  return {
    success: true,
    message,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata
    }
  }
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {object} options - Retry options
 * @returns {Promise} Promise that resolves with function result
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options
  
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }
      
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}