import { useState } from 'react'

interface FormatCardProps {
  label: string
  value: string
  description?: string
  onCopy: (value: string) => void
}

export function FormatCard({ label, value, description, onCopy }: FormatCardProps) {
  const [copying, setCopying] = useState(false)

  const handleCopy = async () => {
    setCopying(true)
    onCopy(value)

    setTimeout(() => {
      setCopying(false)
    }, 300)
  }

  return (
    <div className="format-card">
      <div className="format-card-header">
        <div>
          <h3 className="format-label">{label}</h3>
          {description && <p className="format-description">{description}</p>}
        </div>
        <button
          className={`copy-button ${copying ? 'copying' : ''}`}
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
        >
          {copying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4L6 11.5L2.5 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="5.5"
                y="5.5"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3.5 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H9.5C10.0523 1.5 10.5 1.94772 10.5 2.5V3.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="format-value">{value}</div>
    </div>
  )
}
