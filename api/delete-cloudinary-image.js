/**
 * Vercel Serverless Function: DELETE Cloudinary Image
 *
 * This function runs SERVER-SIDE only. The Cloudinary API Secret
 * never reaches the browser. It is stored securely as a Vercel
 * environment variable.
 *
 * Endpoint: POST /api/delete-cloudinary-image
 * Body: { publicId: "mech_corner_products/abc123" }
 */

const crypto = require('crypto');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Validate env vars are configured
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('Missing Cloudinary environment variables on server.');
    return res.status(500).json({ error: 'Server misconfiguration: Cloudinary credentials missing.' });
  }

  const { publicId } = req.body;

  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid publicId in request body.' });
  }

  try {
    // Generate Cloudinary signed deletion request
    // Signature = SHA1(public_id=xxx&timestamp=xxx + API_SECRET)
    const timestamp = Math.round(Date.now() / 1000);
    const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto
      .createHash('sha1')
      .update(signaturePayload)
      .digest('hex');

    // Call Cloudinary Destroy API
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
    const formData = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: API_KEY,
      signature: signature,
    });

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const result = await cloudinaryResponse.json();

    if (result.result === 'ok') {
      return res.status(200).json({ success: true, message: `Image "${publicId}" deleted from Cloudinary.` });
    } else if (result.result === 'not found') {
      // Image already gone — treat as success (idempotent)
      return res.status(200).json({ success: true, message: 'Image was already deleted or not found.' });
    } else {
      console.error('Cloudinary delete error:', result);
      return res.status(500).json({ error: 'Cloudinary deletion failed.', details: result });
    }
  } catch (err) {
    console.error('Unexpected error during Cloudinary deletion:', err);
    return res.status(500).json({ error: 'Internal server error.', details: err.message });
  }
};
