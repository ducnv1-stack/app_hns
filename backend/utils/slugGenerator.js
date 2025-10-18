/**
 * Slug generation utilities for tours
 */

/**
 * Generate a URL-friendly slug from a name
 * @param {string} name - The name to convert to slug
 * @param {number|string} id - Optional ID to append for uniqueness
 * @returns {string} - Generated slug
 */
function generateSlug(name, id = null) {
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required and must be a string');
  }

  let slug = name
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Ensure slug is not empty
  if (!slug) {
    slug = 'tour';
  }

  // Append ID for uniqueness if provided
  if (id) {
    slug = `${slug}-${id}`;
  }

  return slug;
}

/**
 * Generate a unique slug by checking database (optimized version)
 * @param {string} name - The name to convert to slug
 * @param {number} id - Tour ID
 * @param {object} client - Database client
 * @returns {Promise<string>} - Unique slug
 */
async function generateUniqueSlug(name, id, client) {
  const baseSlug = generateSlug(name, id);
  
  // Since we append ID to base slug, it should be unique by default
  // But let's do a quick check to be safe
  const checkQuery = `
    SELECT id FROM services 
    WHERE slug = $1 AND id != $2
    LIMIT 1
  `;
  
  const result = await client.query(checkQuery, [baseSlug, id]);
  
  if (result.rows.length === 0) {
    return baseSlug;
  }
  
  // If slug exists (very rare since we append ID), use timestamp
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

/**
 * Validate if a string is a valid slug
 * @param {string} slug - Slug to validate
 * @returns {boolean} - True if valid slug
 */
function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  
  // Slug should only contain lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}

/**
 * Extract ID from slug if it ends with -{id}
 * @param {string} slug - Slug to extract ID from
 * @returns {number|null} - Extracted ID or null
 */
function extractIdFromSlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

module.exports = {
  generateSlug,
  generateUniqueSlug,
  isValidSlug,
  extractIdFromSlug
};
