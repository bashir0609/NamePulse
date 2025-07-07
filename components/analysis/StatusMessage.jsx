// ==========================================
// components/analysis/StatusMessage.jsx
// ==========================================
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

const STATUS_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const STATUS_STYLES = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
}

export default function StatusMessage({ message, type = 'info' }) {
  const Icon = STATUS_ICONS[type]
  const styles = STATUS_STYLES[type]

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${styles}`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}