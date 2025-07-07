// ==========================================
// components/ui/Card.jsx
// ==========================================
import { forwardRef } from 'react'
import classNames from 'classnames'

const Card = forwardRef(({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white transition-all duration-200'
  
  const variants = {
    default: 'border-gray-200',
    primary: 'border-blue-200 bg-blue-50',
    secondary: 'border-cyan-200 bg-cyan-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
    dark: 'bg-gray-800 border-gray-700 text-white'
  }
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  const roundings = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  const cardClasses = classNames(
    baseClasses,
    variants[variant],
    paddings[padding],
    shadows[shadow],
    roundings[rounded],
    {
      'border': border,
      'hover:shadow-lg hover:-translate-y-1': hover && shadow !== 'none',
      'cursor-pointer': hover
    },
    className
  )

  return (
    <div ref={ref} className={cardClasses} {...props}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = ({ children, className, ...props }) => (
  <div className={classNames('border-b border-gray-200 pb-3 mb-3', className)} {...props}>
    {children}
  </div>
)

// Card Body Component
export const CardBody = ({ children, className, ...props }) => (
  <div className={classNames('', className)} {...props}>
    {children}
  </div>
)

// Card Footer Component
export const CardFooter = ({ children, className, ...props }) => (
  <div className={classNames('border-t border-gray-200 pt-3 mt-3', className)} {...props}>
    {children}
  </div>
)

export default Card