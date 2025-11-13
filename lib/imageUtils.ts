/**
 * Validates and normalizes image URLs for Next.js Image component
 */
export function validateImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  // Reject file:// URLs
  if (trimmed.startsWith('file://')) {
    return null;
  }

  // If it's already a relative path starting with /, it's valid
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // If it's a full URL (http:// or https://), it's valid
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it doesn't start with / or http, assume it's a relative path
  return `/${trimmed}`;
}

/**
 * Filters out invalid image URLs
 */
export function filterValidImages(images: string[]): string[] {
  return images
    .map(validateImageUrl)
    .filter((url): url is string => url !== null);
}

