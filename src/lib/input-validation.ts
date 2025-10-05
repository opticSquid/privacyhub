/**
 * Input validation and sanitization utilities for security
 */

/**
 * Validate URL format and ensure it's safe
 */
export function validateUrl(url: string): { valid: boolean; error?: string; sanitized?: string } {
  // Basic string validation
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string' };
  }

  // Length check to prevent extremely long URLs
  if (url.length > 2048) {
    return { valid: false, error: 'URL is too long (max 2048 characters)' };
  }

  // Trim and sanitize
  const sanitized = url.trim();

  // Check for obvious malicious patterns
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /file:/i,
    /<script/i,
    /on\w+=/i, // Event handlers like onclick=
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, error: 'URL contains potentially malicious content' };
    }
  }

  // Try to parse URL
  try {
    const urlObj = new URL(sanitized);

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Check for localhost/internal IPs to prevent SSRF attacks
    const hostname = urlObj.hostname.toLowerCase();
    const forbiddenHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '[::1]',
      '169.254.169.254', // AWS metadata endpoint
      'metadata.google.internal', // GCP metadata endpoint
    ];

    if (forbiddenHosts.includes(hostname)) {
      return { valid: false, error: 'Cannot analyze localhost or internal URLs' };
    }

    // Check for private IP ranges (SSRF prevention)
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Pattern);
    if (match) {
      const octets = match.slice(1, 5).map(Number);

      // Private IP ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
      if (
        octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168) ||
        octets[0] === 127 // Loopback
      ) {
        return { valid: false, error: 'Cannot analyze private IP addresses' };
      }
    }

    return { valid: true, sanitized: urlObj.toString() };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Sanitize domain name to prevent injection attacks
 */
export function sanitizeDomain(domain: string): string {
  if (!domain || typeof domain !== 'string') {
    return '';
  }

  // Remove any non-alphanumeric characters except dots and hyphens
  return domain
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/^www\./, '')
    .substring(0, 253); // Max domain length
}

/**
 * Validate and sanitize limit/offset parameters
 */
export function validatePaginationParams(
  limit: string | number,
  offset: string | number
): { limit: number; offset: number } {
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  const parsedOffset = typeof offset === 'string' ? parseInt(offset, 10) : offset;

  // Validate and clamp limit
  const validLimit = Math.max(1, Math.min(parsedLimit || 24, 100)); // Min 1, Max 100

  // Validate and clamp offset
  const validOffset = Math.max(0, Math.min(parsedOffset || 0, 10000)); // Min 0, Max 10000

  return { limit: validLimit, offset: validOffset };
}

/**
 * Sanitize search query to prevent injection attacks
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Remove special characters that could be used for injection
  return query
    .trim()
    .replace(/[<>\"'`;(){}[\]]/g, '')
    .substring(0, 200); // Max query length
}

/**
 * Validate content hash format
 */
export function validateContentHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') {
    return false;
  }

  // MD5 hash should be exactly 32 hexadecimal characters
  return /^[a-f0-9]{32}$/i.test(hash);
}

/**
 * Rate limit key sanitization
 */
export function sanitizeRateLimitKey(key: string): string {
  if (!key || typeof key !== 'string') {
    return 'unknown';
  }

  // Only allow alphanumeric, dots, colons, and hyphens (valid for IPs and identifiers)
  return key.replace(/[^a-zA-Z0-9.:_-]/g, '').substring(0, 100);
}
