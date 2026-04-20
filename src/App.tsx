import { useEffect, useState } from 'react'
import { FormatCard } from './components/FormatCard'
import { InfoPanel } from './components/InfoPanel'
import { ToastContainer } from './components/Toast'
import { ValidationPanel } from './components/ValidationPanel'
import { useKeyboard } from './hooks/useKeyboard'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { generateUUID, getAllFormats, UUIDFormats, UUIDVersion } from './lib/uuid'
import './styles/App.css'

function App() {
  const [currentUUID, setCurrentUUID] = useState<string>(() => generateUUID('v4'))
  const [formats, setFormats] = useState<UUIDFormats | null>(() => getAllFormats(currentUUID))
  const [isLocked, setIsLocked] = useState(false)
  const [version, setVersion] = useState<UUIDVersion>('v4')
  const [autoGenerate, setAutoGenerate] = useState(false)
  const [autoInterval, setAutoInterval] = useState(5)

  const { theme, toggleTheme } = useTheme()
  const { toasts, showToast, removeToast } = useToast()

  const handleGenerate = () => {
    if (isLocked) {
      showToast('UUID is locked', 'info')
      return
    }

    const uuid = generateUUID(version)
    setCurrentUUID(uuid)
    setFormats(getAllFormats(uuid))
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      showToast('Copied to clipboard!', 'success')
    } catch (error) {
      showToast('Failed to copy', 'error')
      console.error('Copy failed:', error)
    }
  }

  const handleValidated = (validatedFormats: UUIDFormats) => {
    if (isLocked) {
      showToast('UUID is locked', 'info')
      return
    }

    setCurrentUUID(validatedFormats.canonical)
    setFormats(validatedFormats)
    showToast('UUID loaded successfully', 'success')
  }

  // Auto-generate functionality
  useEffect(() => {
    if (!autoGenerate || isLocked) return

    const interval = setInterval(() => {
      handleGenerate()
    }, autoInterval * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, autoInterval, isLocked])

  // Keyboard shortcuts
  useKeyboard(handleGenerate, [' ', 'Space', 'Enter'])

  const formatLabels: Record<string, string> = {
    canonical: 'Canonical',
    hex: 'Hex',
    braced: 'Braced',
    urn: 'URN',
    decimal: 'Decimal',
    binary: 'Binary',
    base64: 'Base64',
    base64url: 'Base64URL',
  }

  const formatDescriptions: Record<string, string> = {
    canonical: 'Standard hyphenated format',
    hex: 'Hexadecimal without hyphens',
    braced: 'Microsoft GUID style',
    urn: 'Uniform Resource Name format',
    decimal: '128-bit integer representation',
    binary: '128 bits grouped by 32',
    base64: 'Standard Base64 encoding',
    base64url: 'URL-safe Base64 encoding',
  }

  return (
    <div className="app">
      <div className="background-gradient"></div>

      <header className="header">
        <div className="header-content">
          <h1 className="title">
            <span className="title-icon">🔑</span>
            UUID Playground
          </h1>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Main UUID Card */}
          <div className="uuid-main-card">
            <div className="uuid-display">
              <div className="uuid-value">{currentUUID}</div>
            </div>

            <div className="controls">
              <div className="control-group">
                <label htmlFor="version-select" className="control-label">
                  Version:
                </label>
                <select
                  id="version-select"
                  className="version-select"
                  value={version}
                  onChange={e => setVersion(e.target.value as UUIDVersion)}
                  disabled={isLocked}
                >
                  <option value="v4">UUID v4 (Random)</option>
                  <option value="v1">UUID v1 (Time-based)</option>
                  <option value="v7">UUID v7 (Time-ordered)</option>
                </select>
              </div>

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={isLocked}
                aria-label="Generate new UUID"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17.5 5L10 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Generate
              </button>

              <button
                className={`lock-button ${isLocked ? 'locked' : ''}`}
                onClick={() => setIsLocked(!isLocked)}
                aria-label={isLocked ? 'Unlock UUID' : 'Lock UUID'}
                title={isLocked ? 'Unlock to allow changes' : 'Lock to prevent changes'}
              >
                {isLocked ? '🔒' : '🔓'}
              </button>
            </div>

            <div className="auto-generate">
              <label className="auto-generate-label">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={e => setAutoGenerate(e.target.checked)}
                  disabled={isLocked}
                />
                <span>Auto-generate every</span>
              </label>
              <input
                type="number"
                className="auto-interval-input"
                min="1"
                max="60"
                value={autoInterval}
                onChange={e => setAutoInterval(Math.max(1, Math.min(60, parseInt(e.target.value) || 5)))}
                disabled={!autoGenerate || isLocked}
                aria-label="Auto-generate interval in seconds"
              />
              <span>seconds</span>
            </div>
          </div>

          {/* Format Cards Grid */}
          {formats && (
            <div className="formats-grid">
              {Object.entries(formats).map(([key, value]) => (
                <FormatCard
                  key={key}
                  label={formatLabels[key]}
                  value={value}
                  description={formatDescriptions[key]}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}

          {/* Validation Panel */}
          <ValidationPanel onValidated={handleValidated} />

          {/* Info Panel */}
          <InfoPanel />
        </div>
      </main>

      <footer className="footer">
        <p>
          Built with React + TypeScript •{' '}
          <a
            href="https://github.com/xixu-me/UUID-Playground"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            View Source
          </a>
        </p>
      </footer>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default App
