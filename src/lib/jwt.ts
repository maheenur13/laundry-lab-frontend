/**
 * JWT token decoding utility.
 * Extracts payload from JWT tokens without verification (for client-side role extraction).
 */

export interface JwtPayload {
  sub: string; // User ID
  phone: string; // Phone number
  role: string; // User role
  iat?: number; // Issued at
  exp?: number; // Expiration
}

/**
 * Decode JWT token and extract payload.
 * Note: This does NOT verify the token signature - it only decodes the payload.
 * Token verification is handled by the backend.
 *
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format');
      return null;
    }

    // Decode base64url encoded payload (second part)
    const payload = parts[1];
    
    // Replace base64url characters with base64 characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    // Decode from base64
    const decoded = atob(padded);
    
    // Parse JSON
    const parsed = JSON.parse(decoded) as JwtPayload;
    
    return parsed;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Extract role from JWT token.
 *
 * @param token - JWT token string
 * @returns User role or null if token is invalid
 */
export function getRoleFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.role ?? null;
}
