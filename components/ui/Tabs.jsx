// ==========================================
// components/ui/Tabs.jsx
// ==========================================
import { useState, createContext, useContext } from 'react'
import classNames from 'classnames'

const TabsContext = createContext()

export function Tabs({ children, defaultValue, value, onValueChange, className, ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  const contextValue = {
    value: currentValue,
    onValueChange: handleValueChange
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={classNames('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className, ...props }) {
  return (
    <div 
      className={classNames(
        'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, disabled = false, className, ...props }) {
  const context = useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }

  const { value: currentValue, onValueChange } = context
  const isActive = currentValue === value

  return (
    <button
      type="button"
      className={classNames(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-white text-gray-950 shadow-sm': isActive,
          'hover:bg-gray-200 hover:text-gray-900': !isActive && !disabled,
        },
        className
      )}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className, ...props }) {
  const context = useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }

  const { value: currentValue } = context

  if (currentValue !== value) {
    return null
  }

  return (
    <div 
      className={classNames(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}