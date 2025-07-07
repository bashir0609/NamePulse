// ==========================================
// utils/constants.js
// ==========================================

/**
 * Application constants and configuration
 */

// Analysis types
export const ANALYSIS_TYPES = {
  GENDER: 'gender',
  ORIGIN: 'origin',
  AGE: 'age'
}

// API providers
export const PROVIDERS = {
  GENDER: {
    GENDERIZE: 'genderize',
    OPENROUTER: 'openrouter',
    PERPLEXITY: 'perplexity',
    SIMPLE: 'simple'
  },
  ORIGIN: {
    NATIONALIZE: 'nationalize',
    OPENROUTER: 'openrouter'
  },
  AGE: {
    AGIFY: 'agify',
    OPENROUTER: 'openrouter'
  }
}

// Provider configurations
export const PROVIDER_CONFIG = {
  [PROVIDERS.GENDER.GENDERIZE]: {
    name: 'Genderize.io',
    requiresKey: false,
    description: 'Free API with good accuracy for common names',
    url: 'https://genderize.io',
    rateLimit: { requests: 1000, period: 'day' }
  },
  [PROVIDERS.GENDER.OPENROUTER]: {
    name: 'OpenRouter',
    requiresKey: true,
    description: 'AI models with high accuracy and reasoning',
    url: 'https://openrouter.ai',
    keyFormat: 'sk-or-*'
  },
  [PROVIDERS.GENDER.PERPLEXITY]: {
    name: 'Perplexity AI',
    requiresKey: true,
    description: 'Advanced reasoning with real-time data',
    url: 'https://perplexity.ai',
    keyFormat: 'pplx-*'
  },
  [PROVIDERS.GENDER.SIMPLE]: {
    name: 'Simple Rules',
    requiresKey: false,
    description: 'Basic rule-based gender prediction (fallback)',
    url: null
  }
}

// File upload constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ALLOWED_EXTENSIONS: ['.csv', '.xls', '.xlsx'],
  MAX_NAMES: 1000
}

// API rate limits
export const RATE_LIMITS = {
  DEFAULT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100
  },
  PREMIUM: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000
  }
}

// Gender prediction confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 0
}

// Common name titles and prefixes
export const NAME_TITLES = [
  // Academic
  'dr', 'dr.', 'prof', 'prof.', 'professor',
  'phd', 'ph.d', 'md', 'm.d', 'dds', 'd.d.s',
  
  // Social
  'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'miss',
  'sir', 'lord', 'lady', 'duke', 'duchess',
  
  // Religious
  'rev', 'rev.', 'reverend', 'father', 'fr.',
  'sister', 'sr.', 'brother', 'br.',
  
  // Military
  'capt', 'capt.', 'captain', 'col', 'col.', 'colonel',
  'maj', 'maj.', 'major', 'lt', 'lt.', 'lieutenant',
  'gen', 'gen.', 'general', 'admiral', 'adm.',
  
  // Professional
  'ceo', 'cfo', 'cto', 'coo', 'president', 'vp'
]

// Common name suffixes
export const NAME_SUFFIXES = [
  'jr', 'jr.', 'sr', 'sr.', 'esq', 'esq.',
  'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'
]

// Error messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    NO_NAMES: 'Please enter at least one name to analyze',
    TOO_MANY_NAMES: 'Maximum 1000 names allowed per analysis',
    INVALID_NAME: 'Invalid name format',
    NO_ANALYSIS_TYPES: 'Please select at least one analysis type',
    INVALID_PROVIDER: 'Invalid provider selected',
    MISSING_API_KEY: 'API key required for selected provider'
  },
  API: {
    RATE_LIMIT: 'Rate limit exceeded. Please try again later',
    INVALID_KEY: 'Invalid API key format',
    PROVIDER_ERROR: 'Provider service unavailable',
    NETWORK_ERROR: 'Network error. Please check your connection',
    UNKNOWN_ERROR: 'An unexpected error occurred'
  },
  FILE: {
    INVALID_FORMAT: 'Invalid file format. Please use CSV or Excel files',
    FILE_TOO_LARGE: 'File size too large. Maximum 10MB allowed',
    NO_DATA: 'No valid data found in file',
    PARSE_ERROR: 'Error parsing file. Please check format'
  }
}

// Success messages
export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Analysis completed successfully',
  FILE_LOADED: 'File loaded successfully',
  DATA_EXPORTED: 'Data exported successfully',
  COPIED_TO_CLIPBOARD: 'Results copied to clipboard'
}

// UI constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  POLLING_INTERVAL: 1000,
  MAX_DISPLAY_NAMES: 50
}

// Default configurations
export const DEFAULT_CONFIG = {
  analysisTypes: [ANALYSIS_TYPES.GENDER],
  providers: {
    [ANALYSIS_TYPES.GENDER]: PROVIDERS.GENDER.GENDERIZE
  },
  batchSize: 10,
  includeConfidence: true,
  autoRetry: true,
  maxRetries: 3
}

// Feature flags
export const FEATURES = {
  ORIGIN_ANALYSIS: process.env.ENABLE_ORIGIN_ANALYSIS === 'true',
  AGE_ANALYSIS: process.env.ENABLE_AGE_ANALYSIS === 'true',
  ADVANCED_FEATURES: process.env.ENABLE_ADVANCED_FEATURES === 'true',
  DARK_MODE: true,
  EXPORT_PDF: false,
  REAL_TIME_ANALYSIS: false
}