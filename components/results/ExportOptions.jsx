// ==========================================
// components/results/ExportOptions.jsx
// ==========================================
import { Download, Copy, FileSpreadsheet } from 'lucide-react'
import { useExport } from '../../hooks/useExport'

export default function ExportOptions({ results }) {
  const { downloadCSV, downloadExcel, copyToClipboard, isExporting } = useExport()

  const handleDownloadCSV = () => {
    downloadCSV(results, 'name_demographics_analysis')
  }

  const handleDownloadExcel = () => {
    downloadExcel(results, 'name_demographics_analysis')
  }

  const handleCopyToClipboard = () => {
    copyToClipboard(results)
  }

  return (
    <div className="card mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">💾 Export Results</h4>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadCSV}
          disabled={isExporting}
          className="btn btn-success"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </button>
        
        <button
          onClick={handleDownloadExcel}
          disabled={isExporting}
          className="btn btn-secondary"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download Excel
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="btn btn-outline"
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-3 text-sm text-gray-600">
          Preparing export...
        </div>
      )}
    </div>
  )
}