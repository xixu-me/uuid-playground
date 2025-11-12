import { describe, expect, it } from 'vitest'
import {
  detectUUIDVersion,
  generateUUID,
  generateUUIDv4,
  getAllFormats,
  normalizeUUID,
  uuidToBytes,
} from './uuid'

describe('UUID Generation', () => {
  it('should generate valid UUIDv4', () => {
    const uuid = generateUUIDv4()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUIDv4()
    const uuid2 = generateUUIDv4()
    expect(uuid1).not.toBe(uuid2)
  })

  it('should generate UUIDv1', () => {
    const uuid = generateUUID('v1')
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('should generate UUIDv7', () => {
    const uuid = generateUUID('v7')
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })
})

describe('UUID Normalization', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000'

  it('should normalize canonical format', () => {
    expect(normalizeUUID(validUUID)).toBe(validUUID)
  })

  it('should normalize uppercase UUID', () => {
    expect(normalizeUUID(validUUID.toUpperCase())).toBe(validUUID)
  })

  it('should normalize hex format without hyphens', () => {
    const hex = validUUID.replace(/-/g, '')
    expect(normalizeUUID(hex)).toBe(validUUID)
  })

  it('should normalize braced format', () => {
    expect(normalizeUUID(`{${validUUID}}`)).toBe(validUUID)
  })

  it('should normalize URN format', () => {
    expect(normalizeUUID(`urn:uuid:${validUUID}`)).toBe(validUUID)
  })

  it('should return null for invalid UUID', () => {
    expect(normalizeUUID('not-a-uuid')).toBeNull()
    expect(normalizeUUID('550e8400-e29b-41d4-a716')).toBeNull()
    expect(normalizeUUID('')).toBeNull()
  })

  it('should handle whitespace', () => {
    expect(normalizeUUID(`  ${validUUID}  `)).toBe(validUUID)
  })
})

describe('UUID Format Conversion', () => {
  const testUUID = '550e8400-e29b-41d4-a716-446655440000'

  it('should convert to all formats', () => {
    const formats = getAllFormats(testUUID)

    expect(formats.canonical).toBe(testUUID)
    expect(formats.hex).toBe('550e8400e29b41d4a716446655440000')
    expect(formats.braced).toBe(`{${testUUID}}`)
    expect(formats.urn).toBe(`urn:uuid:${testUUID}`)
    expect(formats.decimal).toBe('113059749145936325402354257176981405696')
    expect(formats.binary).toMatch(/^[01 ]+$/)
    expect(formats.base64).toBeTruthy()
    expect(formats.base64url).toBeTruthy()
  })

  it('should generate valid base64', () => {
    const formats = getAllFormats(testUUID)
    // Base64 should be decodable
    expect(formats.base64.length).toBeGreaterThan(0)
    expect(formats.base64url.length).toBeGreaterThan(0)
  })

  it('should generate correct binary format', () => {
    const formats = getAllFormats(testUUID)
    // Should have 4 groups of 32 bits
    const groups = formats.binary.split(' ')
    expect(groups).toHaveLength(4)
    groups.forEach(group => {
      expect(group).toHaveLength(32)
      expect(group).toMatch(/^[01]+$/)
    })
  })
})

describe('UUID Version Detection', () => {
  it('should detect UUIDv4', () => {
    const uuid = generateUUIDv4()
    expect(detectUUIDVersion(uuid)).toBe('v4 (Random)')
  })

  it('should detect UUIDv1', () => {
    const uuid = generateUUID('v1')
    expect(detectUUIDVersion(uuid)).toBe('v1 (Time-based)')
  })

  it('should detect UUIDv7', () => {
    const uuid = generateUUID('v7')
    expect(detectUUIDVersion(uuid)).toBe('v7 (Time-ordered)')
  })
})

describe('UUID to Bytes Conversion', () => {
  it('should convert UUID to bytes', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const bytes = uuidToBytes(uuid)

    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(16)
    expect(bytes[0]).toBe(0x55)
    expect(bytes[1]).toBe(0x0e)
    expect(bytes[2]).toBe(0x84)
  })

  it('should throw on invalid UUID', () => {
    expect(() => uuidToBytes('invalid')).toThrow()
  })
})
