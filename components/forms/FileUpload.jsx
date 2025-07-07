// ==========================================
// components/forms/FileUpload.jsx
// ==========================================
import { useFileUpload } from '../../hooks/useFileUpload'
import { Upload, FileText, AlertCircle } from 'lucide-react'

export default function FileUpload({ onNamesLoaded }) {
  const {
    isDragOver,
    isProcessing,
    error,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    loadSampleData
  } = useFileUpload(onNamesLoaded)

  return (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
          )}
          
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {isProcessing ? 'Processing file...' : 'Upload CSV or Excel file'}
            </p>
            <p className="text-gray-600">
              Drag and drop or click to browse files
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports .csv, .xlsx, .xls files
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Data Button */}
      <div className="flex justify-center">
        <button
          onClick={loadSampleData}
          disabled={isProcessing}
          className="btn btn-secondary"
        >
          <FileText className="h-4 w-4" />
          Load Sample Data
        </button>
      </div>
    </div>
  )
}