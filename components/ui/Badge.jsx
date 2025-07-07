// ==========================================
// components/ui/Badge.jsx
// ==========================================
import { forwardRef } from 'react'
import classNames from 'classnames'

const Badge = forwardRef(({ 
  children, 
  variant = 'default',
  size = 'md',
  className,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    primary: 'bg-blue-100 text-blue-900 hover:bg-blue-200',
    secondary: 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200',
    success: 'bg-green-100 text-green-900 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-900 hover:bg-red-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    solid: 'bg-gray-900 text-gray-50 hover:bg-gray-800'
  }
  
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs rounded-sm',
    md: 'px-2 py-1 text-xs rounded-md',
    lg: 'px-2.5 py-1.5 text-sm rounded-lg'
  }

  const badgeClasses = classNames(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  )

  return (
    <span ref={ref} className={badgeClasses} {...props}>
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

// Confidence Badge Component
export function ConfidenceBadge({ confidence, className, ...props }) {
  let variant = 'danger'
  let text = 'Low'
  
  if (confidence >= 80) {
    variant = 'success'
    text = 'High'
  } else if (confidence >= 60) {
    variant = 'warning'
    text = 'Medium'
  }

  return (
    <Badge variant={variant} className={className} {...props}>
      {text} ({confidence}%)
    </Badge>
  )
}

// Gender Badge Component
export function GenderBadge({ gender, className, ...props }) {
  const variants = {
    male: 'primary',
    female: 'danger',
    unknown: 'secondary'
  }

  const icons = {
    male: '👨',
    female: '👩',
    unknown: '❓'
  }

  return (
    <Badge variant={variants[gender] || 'secondary'} className={className} {...props}>
      <span className="mr-1">{icons[gender] || icons.unknown}</span>
      {(gender || 'unknown').toUpperCase()}
    </Badge>
  )
}

export default Badge