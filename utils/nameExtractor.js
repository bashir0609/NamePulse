// ==========================================
// utils/nameExtractor.js
// ==========================================

/**
 * Common titles and prefixes to remove from names
 */
const TITLES = [
  // Academic titles
  'dr.', 'dr', 'prof.', 'prof', 'professor',
  'phd', 'ph.d', 'md', 'm.d', 'dds', 'd.d.s',
  
  // Social titles
  'mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms', 'miss',
  'sir', 'lord', 'lady', 'duke', 'duchess',
  
  // Religious titles
  'rev.', 'rev', 'reverend', 'father', 'fr.',
  'sister', 'sr.', 'brother', 'br.',
  
  // Military titles
  'capt.', 'capt', 'captain', 'col.', 'col', 'colonel',
  'maj.', 'maj', 'major', 'lt.', 'lt', 'lieutenant',
  'gen.', 'gen', 'general', 'admiral', 'adm.',
  'sgt.', 'sgt', 'sergeant', 'cpl.', 'cpl', 'corporal',
  
  // Professional titles
  'ceo', 'cfo', 'cto', 'coo', 'president', 'vp',
  'director', 'manager', 'supervisor',
  
  // Suffixes
  'jr.', 'jr', 'sr.', 'sr', 'esq.', 'esq',
  'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'
]

/**
 * Extract first name from a full name string
 * @param {string} fullName - The full name to parse
 * @returns {string} The extracted first name
 */
export function extractFirstName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return ''
  }

  // Clean and split the name
  const cleanName = fullName.trim().replace(/\s+/g, ' ')
  const parts = cleanName.split(' ')
  
  if (parts.length === 0) return cleanName

  // Find the first part that isn't a title or initial
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const cleanPart = part.toLowerCase().replace(/[.,]/g, '')
    
    // Skip if it's a title
    if (TITLES.includes(cleanPart)) {
      continue
    }
    
    // Skip if it's clearly an initial (single letter or letter with period)
    if (part.length === 1 || part.match(/^[a-zA-Z]\.?$/)) {
      continue
    }
    
    // Skip if it's all uppercase and short (likely an acronym)
    if (part.length <= 3 && part === part.toUpperCase()) {
      continue
    }
    
    // This should be the first name
    return part.replace(/[.,]/g, '')
  }
  
  // Fallback: return the first part if no valid name found
  return parts[0]?.replace(/[.,]/g, '') || fullName
}

/**
 * Extract last name from a full name string
 * @param {string} fullName - The full name to parse
 * @returns {string} The extracted last name
 */
export function extractLastName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return ''
  }

  const cleanName = fullName.trim().replace(/\s+/g, ' ')
  const parts = cleanName.split(' ')
  
  if (parts.length <= 1) return ''
  
  // Look for the last meaningful part (not a suffix)
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i]
    const cleanPart = part.toLowerCase().replace(/[.,]/g, '')
    
    // Skip common suffixes
    const suffixes = ['jr', 'jr.', 'sr', 'sr.', 'esq', 'esq.', 'i', 'ii', 'iii', 'iv', 'v']
    if (!suffixes.includes(cleanPart) && part.length > 1) {
      return part.replace(/[.,]/g, '')
    }
  }
  
  return parts[parts.length - 1]?.replace(/[.,]/g, '') || ''
}

/**
 * Parse a full name into components
 * @param {string} fullName - The full name to parse
 * @returns {object} Object with firstName, lastName, title, suffix properties
 */
export function parseFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return {
      firstName: '',
      lastName: '',
      title: '',
      suffix: '',
      fullName: fullName || ''
    }
  }

  const cleanName = fullName.trim().replace(/\s+/g, ' ')
  const parts = cleanName.split(' ')
  
  let title = ''
  let firstName = ''
  let lastName = ''
  let suffix = ''
  
  // Identify title (usually first part)
  if (parts.length > 1) {
    const firstPart = parts[0].toLowerCase().replace(/[.,]/g, '')
    if (TITLES.includes(firstPart)) {
      title = parts[0]
    }
  }
  
  // Identify suffix (usually last part)
  if (parts.length > 2) {
    const lastPart = parts[parts.length - 1].toLowerCase().replace(/[.,]/g, '')
    const suffixes = ['jr', 'sr', 'esq', 'i', 'ii', 'iii', 'iv', 'v', 'vi']
    if (suffixes.includes(lastPart)) {
      suffix = parts[parts.length - 1]
    }
  }
  
  firstName = extractFirstName(fullName)
  lastName = extractLastName(fullName)
  
  return {
    firstName,
    lastName,
    title,
    suffix,
    fullName: cleanName
  }
}

/**
 * Validate if a string looks like a person's name
 * @param {string} name - The name to validate
 * @returns {boolean} True if it looks like a valid name
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false
  }
  
  const cleanName = name.trim()
  
  // Must be at least 2 characters
  if (cleanName.length < 2) {
    return false
  }
  
  // Should contain at least one letter
  if (!/[a-zA-Z]/.test(cleanName)) {
    return false
  }
  
  // Should not be mostly numbers
  const numbers = cleanName.match(/\d/g) || []
  if (numbers.length > cleanName.length / 2) {
    return false
  }
  
  // Should not contain certain special characters
  if (/[<>{}[\]\\|`~!@#$%^&*()+=]/.test(cleanName)) {
    return false
  }
  
  return true
}

/**
 * Clean and normalize a name string
 * @param {string} name - The name to clean
 * @returns {string} The cleaned name
 */
export function cleanName(name) {
  if (!name || typeof name !== 'string') {
    return ''
  }
  
  return name
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/["""]/g, '"') // Normalize quotes
    .replace(/['']/g, "'") // Normalize apostrophes
    .replace(/[–—]/g, '-') // Normalize dashes
}