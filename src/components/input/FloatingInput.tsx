import React, { useState, useId } from 'react'
import '../../styles/input/styles.css'
import type { InputHTMLAttributes } from 'react'

// Props for the FloatingInput component
interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string // The label to display above the input
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, ...props }) => {
  // Local state to track the input's value
  const [value, setValue] = useState('')

  // Generate a unique ID if no `id` is provided
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className='floating-input'>
      {/* Input element */}
      <input
        id={inputId} // Associate input with label
        autoComplete='off' // Disable autocomplete
        value={value} // Controlled value
        onChange={(e) => {
          setValue(e.target.value) // Update local state
          props.onChange?.(e) // Call external onChange if provided
        }}
        placeholder=' ' // Required for floating label effect
        {...props}
      />
      {/* Floating label */}
      <label htmlFor={inputId}>{label}</label>
    </div>
  )
}

export default FloatingInput
