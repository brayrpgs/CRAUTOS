import React from 'react'

export const EyeOffIcon: React.FC<{ width?: number; height?: number }> = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
    />
    <circle cx={12} cy={12} r={3} stroke="currentColor" />
    <line x1={4} y1={4} x2={20} y2={20} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
)
