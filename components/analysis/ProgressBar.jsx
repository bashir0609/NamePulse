// ==========================================
// components/analysis/ProgressBar.jsx
// ==========================================
export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{current} / {total} ({percentage}%)</span>
      </div>
      <div className="progress">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}