// ==========================================
// hooks/useFileUpload.js
// ==========================================
import { useState } from 'react'
import Papa from 'papaparse'

export function useFileUpload(onNamesLoaded) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const processFile = async (file) => {
    setIsProcessing(true)
    setError(null)

    try {
      if (file.name.toLowerCase().endsWith('.csv')) {
        await processCsvFile(file)
      } else if (file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
        setError('Excel files require server-side processing. Please convert to CSV.')
        return
      } else {
        throw new Error('Unsupported file format. Please use CSV files.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const processCsvFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const names = extractNamesFromCsv(results.data)
            onNamesLoaded(names)
            resolve()
          } catch (err) {
            reject(err)
          }
        },
        error: (err) => {
          reject(new Error(`CSV parsing failed: ${err.message}`))
        }
      })
    })
  }

  const extractNamesFromCsv = (data) => {
    if (!data || data.length === 0) {
      throw new Error('No data found in CSV file')
    }

    const headers = Object.keys(data[0])
    const possibleNameColumns = [
      'name', 'full name', 'fullname', 'full_name',
      'ceo', 'ceo name', 'ceo_name', 'ceoname',
      'executive', 'leader', 'person', 'individual'
    ]

    let nameColumn = null
    for (const col of possibleNameColumns) {
      const found = headers.find(h => h.toLowerCase().includes(col.toLowerCase()))
      if (found) {
        nameColumn = found
        break
      }
    }

    if (!nameColumn) {
      // If no obvious name column, use the first column
      nameColumn = headers[0]
    }

    const names = data
      .map(row => row[nameColumn])
      .filter(name => name && name.trim())
      .map(name => name.trim())

    if (names.length === 0) {
      throw new Error('No valid names found in the selected column')
    }

    return names
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const loadSampleData = () => {
    const sampleNames = [
      'Dr. Alexander Bethke-Jaenicke',
      'Prof. Maria Rodriguez',
      'Mr. John Smith Jr.',
      'Ms. Sarah Johnson',
      'Alexander Wang',
      'Anna Bauer',
      'Michael Chen',
      'Lisa Anderson',
      'Patricia Williams',
      'Robert Johnson',
      'Jennifer Davis',
      'Christopher Miller',
      'Elizabeth Wilson',
      'Daniel Moore',
      'Michelle Taylor'
    ]
    
    onNamesLoaded(sampleNames)
  }

  return {
    isDragOver,
    isProcessing,
    error,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    loadSampleData
  }
}