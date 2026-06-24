/**
 * Cloudinary Image Utility
 * Handles image upload to Cloudinary using unsigned upload preset.
 * No API Secret required for uploads from the frontend.
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload an image file to Cloudinary.
 * @param {File} file - The image file to upload
 * @param {string} [folder='mech_corner_products'] - Optional Cloudinary folder
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImageToCloudinary(file, folder = 'mech_corner_products') {
  if (!file) throw new Error('No file provided');
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials are not configured in .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Build an optimized Cloudinary URL with transformations.
 * @param {string} publicId - The Cloudinary public_id of the image
 * @param {object} [options] - Transformation options
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  if (!publicId || !CLOUDINARY_CLOUD_NAME) return '';

  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
}

/**
 * Validate that a file is an image and within size limits.
 * @param {File} file
 * @param {number} [maxSizeMB=5]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) return { valid: false, error: 'No file selected' };

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, or AVIF images are allowed' };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * Delete an image from Cloudinary via the secure server-side API endpoint.
 * The API Secret is NEVER exposed to the browser — it lives in the
 * Vercel serverless function (/api/delete-cloudinary-image).
 *
 * @param {string} publicId - The Cloudinary public_id to delete (e.g. "mech_corner_products/abc123")
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId || typeof publicId !== 'string') {
    // No publicId means the product used a local/default image — nothing to delete
    return { success: true, message: 'No Cloudinary image to delete.' };
  }

  try {
    const response = await fetch('/api/delete-cloudinary-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    // If running locally with npm run dev (no serverless function), gracefully skip
    if (response.status === 404) {
      console.info('ℹ️ Cloudinary delete API not available locally. Image will be deleted on Vercel deployment.');
      return { success: true, message: 'Skipped (local dev mode).' };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete image from Cloudinary');
    }

    return data;
  } catch (err) {
    // Network error (e.g. running locally) — don't block product deletion
    if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
      console.info('ℹ️ Cloudinary delete skipped (local dev — no serverless endpoint).');
      return { success: true, message: 'Skipped (local dev mode).' };
    }
    throw err;
  }
}


