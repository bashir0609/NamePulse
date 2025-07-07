// ==========================================
// utils/validation.js
// ==========================================

/**
 * Validation schemas and functions for the demographics analyzer
 */

/**
 * Validate analysis configuration
 * @param {object} config - Configuration object to validate
 * @returns {object} Validation result with isValid and errors
 */
export function validateAnalysisConfig(config) {
  const errors = []
  
  if (!config || typeof config !== 'object') {
    return { isValid: false, errors: ['Configuration must be an object'] }
  }
  
  // Validate analysis types
  if (!config.types || !Array.isArray(config.types)) {
    errors.push('Analysis types must be an array')
  } else if (config.types.length === 0) {
    errors.push('At least one analysis type must be selected')
  } else {
    const validTypes = ['gender', 'origin', 'age']
    const invalidTypes = config.types.filter(type => !validTypes.includes(type))
    if (invalidTypes.length > 0) {
      errors.push(`Invalid analysis types: ${invalidTypes.join(', ')}`)
    }
  }
  
  // Validate providers
  if (!config.providers || typeof config.providers !== 'object') {
    errors.push('Providers configuration must be an object')
  } else {
    for (const type of config.types || []) {
      if (!config.providers[type]) {
        errors.push(`Provider not specified for ${type} analysis`)
      }
    }
  }
  
  // Validate names
  if (!config.names || !Array.isArray(config.names)) {
    errors.push('Names must be an array')
  } else if (config.names.length === 0) {
    errors.push('At least one name must be provided')
  } else if (config.names.length > 1000) {
    errors.push('Maximum 1000 names allowed per analysis')
  }
  
  // Validate batch size
  if (config.batchSize !== undefined) {
    if (!Number.isInteger(config.batchSize) || config.batchSize < 1 || config.batchSize > 50) {
      errors.push('Batch size must be an integer between 1 and 50')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate API request body
 * @param {object} body - Request body to validate
 * @returns {object} Validation result
 */
export function validateApiRequest(body) {
  const errors = []
  
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be an object'] }
  }
  
  // Validate names array
  if (!body.names || !Array.isArray(body.names)) {
    errors.push('Names array is required')
  } else {
    if (body.names.length === 0) {
      errors.push('At least one name is required')
    }
    
    if (body.names.length > 1000) {
      errors.push('Maximum 1000 names allowed per request')
    }
    
    // Validate individual names
    body.names.forEach((name, index) => {
      if (!name || typeof name !== 'string') {
        errors.push(`Invalid name at index ${index}: must be a non-empty string`)
      } else if (name.trim().length === 0) {
        errors.push(`Empty name at index ${index}`)
      } else if (name.length > 200) {
        errors.push(`Name at index ${index} is too long (max 200 characters)`)
      }
    })
  }
  
  // Validate analysis types
  if (!body.analysisTypes || !Array.isArray(body.analysisTypes)) {
    errors.push('Analysis types array is required')
  } else if (body.analysisTypes.length === 0) {
    errors.push('At least one analysis type is required')
  }
  
  // Validate providers
  if (!body.providers || typeof body.providers !== 'object') {
    errors.push('Providers configuration is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @param {string} provider - Provider name
 * @returns {object} Validation result
 */
export function validateApiKey(apiKey, provider) {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key must be a non-empty string' }
  }
  
  const key = apiKey.trim()
  
  // Provider-specific validation
  switch (provider) {
    case 'openrouter':
      if (!key.startsWith('sk-or-')) {
        return { isValid: false, error: 'OpenRouter API key must start with "sk-or-"' }
      }
      if (key.length < 20) {
        return { isValid: false, error: 'OpenRouter API key appears to be too short' }
      }
      break
      
    case 'perplexity':
      if (!key.startsWith('pplx-')) {
        return { isValid: false, error: 'Perplexity API key must start with "pplx-"' }
      }
      if (key.length < 20) {
        return { isValid: false, error: 'Perplexity API key appears to be too short' }
      }
      break
      
    case 'genderize':
      // Genderize doesn't require API key for basic usage
      return { isValid: true }
      
    default:
      if (key.length < 10) {
        return { isValid: false, error: 'API key appears to be too short' }
      }
  }
  
  return { isValid: true }
}

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input, options = {}) {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  const {
    maxLength = 1000,
    allowHtml = false,
    allowSpecialChars = true
  } = options
  
  let sanitized = input.trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Remove HTML tags if not allowed
  if (!allowHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  // Remove dangerous special characters if not allowed
  if (!allowSpecialChars) {
    sanitized = sanitized.replace(/[<>{}[\]\\|`~]/g, '')
  }
  
  return sanitized
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export function validateFileUpload(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    allowedExtensions = ['.csv', '.xls', '.xlsx']
  } = options
  
  const errors = []
  
  if (!file) {
    return { isValid: false, errors: ['No file provided'] }
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size too large. Maximum ${Math.round(maxSize / 1024 / 1024)}MB allowed`)
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      errors.push(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`)
    }
  }
  
  // Check file name
  if (file.name.length > 255) {
    errors.push('File name too long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}