/**
 * Service for fetching website logos/favicons
 */

export interface LogoData {
  url: string;
  source: 'google' | 'clearbit' | 'favicon' | 'default';
}

/**
 * Get website logo/favicon URL
 * Uses multiple fallback strategies for reliability
 */
export function getWebsiteLogo(hostname: string): LogoData {
  const cleanHostname = hostname.replace(/^www\./, '');

  // Strategy 1: Google's favicon service (most reliable)
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${cleanHostname}&sz=128`;

  // Return Google's service as primary (most reliable)
  return {
    url: googleFavicon,
    source: 'google'
  };
}

/**
 * Get multiple logo options for fallback
 */
export function getLogoFallbacks(hostname: string): string[] {
  const cleanHostname = hostname.replace(/^www\./, '');

  return [
    `https://www.google.com/s2/favicons?domain=${cleanHostname}&sz=128`,
    `https://logo.clearbit.com/${cleanHostname}`,
    `https://${cleanHostname}/favicon.ico`,
    `https://www.google.com/s2/favicons?domain=${cleanHostname}&sz=64`,
  ];
}

/**
 * Get optimized logo URL with size parameter
 */
export function getOptimizedLogo(hostname: string, size: number = 128): string {
  const cleanHostname = hostname.replace(/^www\./, '');
  return `https://www.google.com/s2/favicons?domain=${cleanHostname}&sz=${size}`;
}
