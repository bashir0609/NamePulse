// ==========================================
// hooks/useExport.js (FINAL FIX for clipboard)
// ==========================================
import { useState } from 'react'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)

  const downloadCSV = async (results, filename = 'analysis_results') => {
    setIsExporting(true)
    
    try {
      const headers = ['Full Name', 'First Name', 'Gender', 'Confidence', 'Provider']
      const rows = results.map(result => [
        `"${result.name}"`,
        `"${result.firstName}"`,
        result.demographics?.gender?.value || 'unknown',
        result.demographics?.gender?.confidence || 0,
        result.demographics?.gender?.provider || 'unknown'
      ])
      
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
      downloadFile(csvContent, `${filename}.csv`, 'text/csv')
    } catch (error) {
      console.error('CSV export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  const downloadExcel = async (results, filename = 'analysis_results') => {
    setIsExporting(true)
    
    try {
      const headers = ['Full Name', 'First Name', 'Gender', 'Confidence', 'Provider']
      const rows = results.map(result => [
        result.name,
        result.firstName,
        result.demographics?.gender?.value || 'unknown',
        result.demographics?.gender?.confidence || 0,
        result.demographics?.gender?.provider || 'unknown'
      ])
      
      const tsvContent = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n')
      downloadFile(tsvContent, `${filename}.tsv`, 'text/tab-separated-values')
    } catch (error) {
      console.error('Excel export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  const copyToClipboard = async (results) => {
    setIsExporting(true)
    
    try {
      const headers = 'Full Name\tFirst Name\tGender\tConfidence\tProvider'
      const rows = results.map(result => 
        `${result.name}\t${result.firstName}\t${result.demographics?.gender?.value || 'unknown'}\t${result.demographics?.gender?.confidence || 0}%\t${result.demographics?.gender?.provider || 'unknown'}`
      )
      
      const textContent = [headers, ...rows].join('\n')
      
      // Try multiple clipboard methods
      const success = await attemptCopy(textContent)
      
      if (!success) {
        // Show manual copy dialog as last resort
        showManualCopyDialog(textContent)
      }
      
    } catch (error) {
      console.error('Copy failed:', error)
      throw new Error('Unable to copy to clipboard. Please try downloading instead.')
    } finally {
      setIsExporting(false)
    }
  }

  // Helper function to attempt multiple copy methods
  const attemptCopy = async (text) => {
    // Method 1: Modern Clipboard API (most reliable)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (e) {
        console.warn('Clipboard API failed:', e)
      }
    }
    
    // Method 2: execCommand (legacy but widely supported)
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      
      // Make textarea invisible but accessible
      Object.assign(textarea.style, {
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '-1'
      })
      
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, text.length)
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (successful) return true
    } catch (e) {
      console.warn('execCommand failed:', e)
    }
    
    // Method 3: Selection API (for modern browsers)
    try {
      const range = document.createRange()
      const div = document.createElement('div')
      div.textContent = text
      div.style.position = 'fixed'
      div.style.left = '-9999px'
      
      document.body.appendChild(div)
      range.selectNodeContents(div)
      
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      
      const successful = document.execCommand('copy')
      document.body.removeChild(div)
      selection.removeAllRanges()
      
      if (successful) return true
    } catch (e) {
      console.warn('Selection API failed:', e)
    }
    
    return false
  }

  // Helper function to show manual copy dialog
  const showManualCopyDialog = (text) => {
    const maxLength = 500
    const displayText = text.length > maxLength 
      ? text.substring(0, maxLength) + '...\n\n(Data truncated - please use download instead)'
      : text
    
    const userChoice = confirm(
      'Automatic copy failed. Would you like to see the data to copy manually?\n\n' +
      'Click OK to see the data, or Cancel to download instead.'
    )
    
    if (userChoice) {
      // Create a modal-like experience
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `
      
      const content = document.createElement('div')
      content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow: auto;
      `
      
      content.innerHTML = `
        <h3>Copy this data manually:</h3>
        <textarea readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 12px;">${text}</textarea>
        <div style="margin-top: 10px;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
      `
      
      modal.appendChild(content)
      document.body.appendChild(modal)
      
      // Auto-select text
      const textarea = content.querySelector('textarea')
      textarea.focus()
      textarea.select()
    }
  }

  // Helper function to download files
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    downloadCSV,
    downloadExcel,
    copyToClipboard,
    isExporting
  }
}