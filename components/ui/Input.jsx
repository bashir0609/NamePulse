// ==========================================
// components/ui/Input.jsx
// ==========================================
import { forwardRef } from 'react'
import classNames from 'classnames'

const Input = forwardRef(({ 
  type = 'text',
  variant = 'default',
  size = 'md',
  error = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  label,
  helperText,
  errorText,
  className,
  containerClassName,
  ...props 
}, ref) => {
  const baseClasses = 'border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    primary: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
    danger: 'border-red-300 focus:border-red-500 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg'
  }

  const inputClasses = classNames(
    baseClasses,
    variants[error ? 'danger' : variant],
    sizes[size],
    {
      'w-full': fullWidth,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'border-red-300 focus:border-red-500 focus:ring-red-500': error
    },
    className
  )

  const InputElement = type === 'textarea' ? 'textarea' : 'input'

  return (
    <div className={classNames('', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <InputElement
          ref={ref}
          type={type !== 'textarea' ? type : undefined}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p className={classNames(
          'mt-1 text-xs',
          error || errorText ? 'text-red-600' : 'text-gray-500'
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Select Component
export const Select = forwardRef(({ 
  options = [],
  placeholder = 'Select an option',
  variant = 'default',
  size = 'md',
  error = false,
  disabled = false,
  fullWidth = false,
  label,
  helperText,
  errorText,
  className,
  containerClassName,
  ...props 
}, ref) => {
  const baseClasses = 'border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white'
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    primary: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
    warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
    danger: 'border-red-300 focus:border-red-500 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg'
  }

  const selectClasses = classNames(
    baseClasses,
    variants[error ? 'danger' : variant],
    sizes[size],
    {
      'w-full': fullWidth,
      'border-red-300 focus:border-red-500 focus:ring-red-500': error
    },
    className
  )

  return (
    <div className={classNames('', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {(helperText || errorText) && (
        <p className={classNames(
          'mt-1 text-xs',
          error || errorText ? 'text-red-600' : 'text-gray-500'
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Input