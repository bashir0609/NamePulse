// ==========================================
// utils/csvParser.js
// ==========================================

/**
 * Parse CSV line handling quotes and commas properly
 * @param {string} line - CSV line to parse
 * @returns {Array<string>} Array of parsed fields
 */
export function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  let i = 0
  
  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote inside quoted field
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field delimiter
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Parse entire CSV content
 * @param {string} csvContent - CSV content to parse
 * @param {object} options - Parsing options
 * @returns {Array<object>} Array of row objects
 */
export function parseCSV(csvContent, options = {}) {
  const {
    hasHeader = true,
    delimiter = ',',
    skipEmptyLines = true,
    trimFields = true
  } = options
  
  if (!csvContent || typeof csvContent !== 'string') {
    throw new Error('Invalid CSV content')
  }
  
  const lines = csvContent.split(/\r?\n/)
  
  if (lines.length === 0) {
    return []
  }
  
  // Parse header
  let headers = []
  let dataStartIndex = 0
  
  if (hasHeader) {
    const headerLine = lines[0]
    if (!headerLine?.trim()) {
      throw new Error('CSV header is empty')
    }
    headers = parseCSVLine(headerLine).map(h => trimFields ? h.trim() : h)
    dataStartIndex = 1
  }
  
  const data = []
  
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i]
    
    if (skipEmptyLines && !line?.trim()) {
      continue
    }
    
    const fields = parseCSVLine(line).map(f => trimFields ? f.trim() : f)
    
    if (hasHeader) {
      const row = {}
      headers.forEach((header, index) => {
        row[header] = fields[index] || ''
      })
      
      // Only add row if it has at least one non-empty field
      if (Object.values(row).some(val => val)) {
        data.push(row)
      }
    } else {
      if (fields.some(f => f)) {
        data.push(fields)
      }
    }
  }
  
  return data
}

/**
 * Find potential name columns in CSV data
 * @param {Array<object>} data - Parsed CSV data
 * @returns {Array<string>} Array of potential name column names
 */
export function findNameColumns(data) {
  if (!data || data.length === 0) {
    return []
  }
  
  const headers = Object.keys(data[0])
  const namePatterns = [
    /^name$/i,
    /^full\s*name$/i,
    /^fullname$/i,
    /^full_name$/i,
    /^ceo\s*name$/i,
    /^ceoname$/i,
    /^ceo_name$/i,
    /^ceo$/i,
    /^executive$/i,
    /^leader$/i,
    /^person$/i,
    /^individual$/i,
    /first.*name/i,
    /last.*name/i,
    /employee/i,
    /staff/i
  ]
  
  const potentialColumns = []
  
  for (const header of headers) {
    for (const pattern of namePatterns) {
      if (pattern.test(header)) {
        potentialColumns.push(header)
        break
      }
    }
  }
  
  // If no obvious columns found, check column content
  if (potentialColumns.length === 0) {
    for (const header of headers) {
      const sample = data.slice(0, 5).map(row => row[header]).filter(val => val)
      
      if (sample.length > 0) {
        // Check if values look like names
        const looksLikeName = sample.every(val => {
          if (typeof val !== 'string') return false
          
          const words = val.trim().split(/\s+/)
          return words.length >= 1 && words.length <= 5 && 
                 words.every(word => /^[a-zA-Z]/.test(word))
        })
        
        if (looksLikeName) {
          potentialColumns.push(header)
        }
      }
    }
  }
  
  return potentialColumns
}

/**
 * Extract names from CSV data
 * @param {Array<object>} data - Parsed CSV data
 * @param {string} nameColumn - Column name containing names
 * @returns {Array<string>} Array of extracted names
 */
export function extractNamesFromCSV(data, nameColumn = null) {
  if (!data || data.length === 0) {
    throw new Error('No data provided')
  }
  
  // Auto-detect name column if not provided
  if (!nameColumn) {
    const potentialColumns = findNameColumns(data)
    if (potentialColumns.length === 0) {
      throw new Error('No name column found in CSV data')
    }
    nameColumn = potentialColumns[0]
  }
  
  // Validate column exists
  const headers = Object.keys(data[0])
  if (!headers.includes(nameColumn)) {
    throw new Error(`Column "${nameColumn}" not found in CSV data`)
  }
  
  // Extract names
  const names = data
    .map(row => row[nameColumn])
    .filter(name => name && typeof name === 'string' && name.trim())
    .map(name => name.trim())
    .filter(name => name.length > 0)
  
  if (names.length === 0) {
    throw new Error(`No valid names found in column "${nameColumn}"`)
  }
  
  return names
}

/**
 * Generate CSV content from data
 * @param {Array<object>} data - Data to convert to CSV
 * @param {Array<string>} headers - Optional custom headers
 * @returns {string} CSV content
 */
export function generateCSV(data, headers = null) {
  if (!data || data.length === 0) {
    return ''
  }
  
  const actualHeaders = headers || Object.keys(data[0])
  const csvLines = []
  
  // Add header row
  csvLines.push(actualHeaders.map(header => `"${header}"`).join(','))
  
  // Add data rows
  for (const row of data) {
    const fields = actualHeaders.map(header => {
      const value = row[header] || ''
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvLines.push(fields.join(','))
  }
  
  return csvLines.join('\n')
}