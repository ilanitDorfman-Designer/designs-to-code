/**
 * Icon metadata types and CDN fetch utilities
 * Metadata is loaded from CDN on demand to reduce bundle size
 */
import { ZAPPICONS_CDN_BASE_URL } from './get-icon-url';

// ============================================================================
// Types
// ============================================================================

export interface IconMetadata {
  name: string;
  category: string;
  keywords: string[];
}

export type IconMetadataRegistry = Record<string, IconMetadata>;

// ============================================================================
// Cache Management
// ============================================================================

let cache: IconMetadataRegistry | null = null;
let fetchPromise: Promise<IconMetadataRegistry> | null = null;

/**
 * Clear cached metadata (useful for testing or forcing refresh)
 */
export function clearIconMetadataCache(): void {
  cache = null;
  fetchPromise = null;
}

/**
 * Check if metadata is cached
 */
export function isMetadataCached(): boolean {
  return cache !== null;
}

// ============================================================================
// Core Fetch Function
// ============================================================================

/**
 * Fetch metadata from Zappicons CDN
 * Results are cached after first fetch
 */
export async function getOrFetchIconMetadata(): Promise<IconMetadataRegistry> {
  // Return cached data if available
  if (cache) {
    return cache;
  }

  // Return existing promise if fetch is in progress
  if (fetchPromise) {
    return fetchPromise;
  }

  const metadataUrl = `${ZAPPICONS_CDN_BASE_URL}/metadata.json`;

  // Start new fetch
  fetchPromise = (async () => {
    try {
      const response = await fetch(metadataUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch icon metadata: ${response.status}`);
      }

      const data = (await response.json()) as IconMetadataRegistry;
      cache = data;
      fetchPromise = null; // Allow GC after caching
      return data;
    } catch (error) {
      fetchPromise = null; // Reset on error to allow retry
      throw error;
    }
  })();

  return fetchPromise;
}

// ============================================================================
// Icon Lookup Functions
// ============================================================================

/**
 * Get metadata for an icon by name
 */
export async function getIconMetadata(name: string): Promise<IconMetadata | undefined> {
  const metadata = await getOrFetchIconMetadata();
  return metadata[name];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all icons in a category
 */
export async function getIconsByCategory(category: string): Promise<IconMetadata[]> {
  const metadata = await getOrFetchIconMetadata();
  return Object.values(metadata).filter((m) => m.category === category);
}

/**
 * Get all available icon names
 */
export async function getAllIconNames(): Promise<string[]> {
  const metadata = await getOrFetchIconMetadata();
  return Object.keys(metadata);
}

/**
 * Search icons by keyword
 */
export async function searchIcons(query: string): Promise<IconMetadata[]> {
  const metadata = await getOrFetchIconMetadata();
  const q = query.toLowerCase();
  return Object.values(metadata).filter((m) => m.name.toLowerCase().includes(q) || m.keywords.some((k) => k.toLowerCase().includes(q)));
}
