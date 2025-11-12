export function InfoPanel() {
  return (
    <div className="info-panel">
      <h3>About UUIDs</h3>
      <p>
        A <strong>Universally Unique Identifier (UUID)</strong> is a 128-bit number used to
        uniquely identify information in computer systems. The probability of generating duplicate
        UUIDs is extremely low, making them ideal for distributed systems.
      </p>

      <h4>UUID Versions</h4>
      <ul>
        <li>
          <strong>v1:</strong> Time-based, includes timestamp and MAC address
        </li>
        <li>
          <strong>v4:</strong> Random, most commonly used
        </li>
        <li>
          <strong>v7:</strong> Time-ordered, sortable by creation time
        </li>
      </ul>

      <h4>Format Representations</h4>
      <p>
        All formats shown represent the <strong>same 128-bit value</strong>, just encoded
        differently. You can convert between any format while preserving the underlying UUID.
      </p>

      <div className="keyboard-shortcuts">
        <h4>Keyboard Shortcuts</h4>
        <kbd>Space</kbd> or <kbd>Enter</kbd> - Generate new UUID
      </div>
    </div>
  )
}
