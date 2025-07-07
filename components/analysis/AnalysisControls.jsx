// ==========================================
// components/analysis/AnalysisControls.jsx
// ==========================================
import { Play, Square } from 'lucide-react'
import ProgressBar from './ProgressBar'
import StatusMessage from './StatusMessage'

export default function AnalysisControls({
  isProcessing,
  progress,
  status,
  onStart,
  onStop
}) {
  return (
    <div className="card text-center space-y-6">
      <div className="flex justify-center space-x-4">
        {!isProcessing ? (
          <button
            onClick={onStart}
            className="btn btn-primary"
            disabled={!onStart}
          >
            <Play className="h-5 w-5" />
            Start Analysis
          </button>
        ) : (
          <button
            onClick={onStop}
            className="btn btn-danger"
          >
            <Square className="h-5 w-5" />
            Stop Analysis
          </button>
        )}
      </div>

      {isProcessing && progress && (
        <ProgressBar current={progress.current} total={progress.total} />
      )}

      {status && (
        <StatusMessage message={status.message} type={status.type} />
      )}
    </div>
  )
}