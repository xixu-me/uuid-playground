/**
 * UUID generation and conversion utilities
 */

export type UUIDVersion = 'v4' | 'v1' | 'v7'

export interface UUIDFormats {
  canonical: string
  hex: string
  braced: string
  urn: string
  decimal: string
  binary: string
  base64: string
  base64url: string
}

/**
 * Generate a UUIDv4 using Web Crypto API
 */
export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback implementation
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return bytesToUUID(bytes)
}

/**
 * Generate a UUIDv1 (time-based)
 */
export function generateUUIDv1(): string {
  const now = Date.now()
  const timeHigh = BigInt(now) * 10000n + 0x01b21dd213814000n

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Set time fields
  const timeLow = Number(timeHigh & 0xffffffffn)
  const timeMid = Number((timeHigh >> 32n) & 0xffffn)
  const timeHighAndVersion = Number((timeHigh >> 48n) & 0x0fffn) | 0x1000

  bytes[0] = (timeLow >> 24) & 0xff
  bytes[1] = (timeLow >> 16) & 0xff
  bytes[2] = (timeLow >> 8) & 0xff
  bytes[3] = timeLow & 0xff
  bytes[4] = (timeMid >> 8) & 0xff
  bytes[5] = timeMid & 0xff
  bytes[6] = (timeHighAndVersion >> 8) & 0xff
  bytes[7] = timeHighAndVersion & 0xff

  // Set variant bits
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return bytesToUUID(bytes)
}

/**
 * Generate a UUIDv7 (time-ordered)
 */
export function generateUUIDv7(): string {
  const now = Date.now()
  const bytes = new Uint8Array(16)

  // Unix timestamp in milliseconds (48 bits)
  bytes[0] = (now >> 40) & 0xff
  bytes[1] = (now >> 32) & 0xff
  bytes[2] = (now >> 24) & 0xff
  bytes[3] = (now >> 16) & 0xff
  bytes[4] = (now >> 8) & 0xff
  bytes[5] = now & 0xff

  // Random bits
  crypto.getRandomValues(bytes.subarray(6))

  // Set version (7) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return bytesToUUID(bytes)
}

/**
 * Generate UUID based on version
 */
export function generateUUID(version: UUIDVersion = 'v4'): string {
  switch (version) {
    case 'v1':
      return generateUUIDv1()
    case 'v7':
      return generateUUIDv7()
    case 'v4':
    default:
      return generateUUIDv4()
  }
}

/**
 * Convert bytes to UUID canonical format
 */
function bytesToUUID(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

/**
 * Convert UUID string to bytes
 */
export function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/[^0-9a-f]/gi, '')
  if (hex.length !== 32) {
    throw new Error('Invalid UUID format')
  }

  const bytes = new Uint8Array(16)
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

/**
 * Validate and normalize UUID string
 */
export function normalizeUUID(input: string): string | null {
  try {
    // Remove common prefixes and wrappers
    let cleaned = input.trim()
    cleaned = cleaned.replace(/^urn:uuid:/i, '')
    cleaned = cleaned.replace(/^[{(]|[})]$/g, '')

    // Check if it's a valid hex string (with or without hyphens)
    const hex = cleaned.replace(/[^0-9a-f]/gi, '')
    if (hex.length !== 32) {
      return null
    }

    // Validate it's valid hex
    if (!/^[0-9a-f]{32}$/i.test(hex)) {
      return null
    }

    // Return canonical format
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Get all format representations of a UUID
 */
export function getAllFormats(uuid: string): UUIDFormats {
  const bytes = uuidToBytes(uuid)
  const hex = uuid.replace(/-/g, '')

  // Convert to decimal (128-bit number as string)
  const decimal = bytes.reduce((acc, byte, i) => {
    const shift = BigInt(15 - i) * 8n
    return acc + (BigInt(byte) << shift)
  }, 0n).toString()

  // Convert to binary (grouped by 32 bits for readability)
  const binaryStr = Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join('')
  const binary = [
    binaryStr.slice(0, 32),
    binaryStr.slice(32, 64),
    binaryStr.slice(64, 96),
    binaryStr.slice(96, 128),
  ].join(' ')

  // Convert to Base64
  const base64 = btoa(String.fromCharCode(...bytes))

  // Convert to URL-safe Base64
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return {
    canonical: uuid,
    hex: hex.toLowerCase(),
    braced: `{${uuid}}`,
    urn: `urn:uuid:${uuid}`,
    decimal,
    binary,
    base64,
    base64url,
  }
}

/**
 * Detect UUID version
 */
export function detectUUIDVersion(uuid: string): string {
  try {
    const bytes = uuidToBytes(uuid)
    const version = (bytes[6] >> 4) & 0x0f

    switch (version) {
      case 1:
        return 'v1 (Time-based)'
      case 2:
        return 'v2 (DCE Security)'
      case 3:
        return 'v3 (MD5 hash)'
      case 4:
        return 'v4 (Random)'
      case 5:
        return 'v5 (SHA-1 hash)'
      case 7:
        return 'v7 (Time-ordered)'
      default:
        return `v${version} (Unknown)`
    }
  } catch {
    return 'Unknown'
  }
}
