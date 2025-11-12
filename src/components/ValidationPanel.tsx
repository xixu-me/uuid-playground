import { useState } from 'react'
import { detectUUIDVersion, getAllFormats, normalizeUUID, UUIDFormats } from '../lib/uuid'

interface ValidationPanelProps {
  onValidated: (formats: UUIDFormats) => void
}

export function ValidationPanel({ onValidated }: ValidationPanelProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)

  const handleValidate = () => {
    if (!input.trim()) {
      setError('Please enter a UUID')
      setVersion(null)
      return
    }

    const normalized = normalizeUUID(input)
    if (!normalized) {
      setError('Invalid UUID format')
      setVersion(null)
      return
    }

    setError(null)
    const detectedVersion = detectUUIDVersion(normalized)
    setVersion(detectedVersion)
    onValidated(getAllFormats(normalized))
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidate()
    }
  }

  return (
    <div className="validation-panel">
      <h3>Validate UUID</h3>
      <p className="validation-description">
        Paste a UUID string (canonical, hex, braced, or URN) to normalize and view all representations
      </p>

      <div className="validation-input-group">
        <input
          type="text"
          className="validation-input"
          placeholder="Paste UUID here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="UUID validation input"
        />
        <button className="validate-button" onClick={handleValidate}>
          Validate
        </button>
      </div>

      {error && <div className="validation-error">{error}</div>}
      {version && <div className="validation-success">Valid UUID: {version}</div>}
    </div>
  )
}
