import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Local API middleware — mirrors /api/delete-cloudinary-image.js (Vercel fn)
// Runs ONLY during `npm run dev`. On Vercel, the real serverless fn handles it.
// ---------------------------------------------------------------------------
function localApiPlugin(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/delete-cloudinary-image', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
          return;
        }

        let rawBody = '';
        req.setEncoding('utf8');
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', async () => {
          try {
            let publicId;
            try {
              ({ publicId } = JSON.parse(rawBody));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
              return;
            }

            if (!publicId || typeof publicId !== 'string') {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing or invalid publicId.' }));
              return;
            }

            // Read from loadEnv() — guaranteed to have all .env vars
            const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;
            const API_KEY    = env.CLOUDINARY_API_KEY;
            const API_SECRET = env.CLOUDINARY_API_SECRET;

            console.log('[delete-api] Credentials check:', {
              hasCloudName: !!CLOUD_NAME,
              hasKey: !!API_KEY,
              hasSecret: !!API_SECRET,
              publicId,
            });

            if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Cloudinary server credentials missing in .env' }));
              return;
            }

            // Signed deletion: SHA1(public_id=X&timestamp=Y + API_SECRET)
            const timestamp = Math.round(Date.now() / 1000);
            const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
            const signature = crypto
              .createHash('sha1')
              .update(signaturePayload)
              .digest('hex');

            const formBody = new URLSearchParams({
              public_id: publicId,
              timestamp: String(timestamp),
              api_key: API_KEY,
              signature,
            }).toString();

            console.log('[delete-api] Calling Cloudinary destroy for:', publicId);

            const cloudinaryRes = await fetch(
              `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
              }
            );

            const result = await cloudinaryRes.json();
            console.log('[delete-api] Cloudinary response:', result);

            if (result.result === 'ok' || result.result === 'not found') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: `Deleted: ${publicId}`, result: result.result }));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Cloudinary deletion failed.', details: result }));
            }

          } catch (err) {
            console.error('[delete-api] Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error.', details: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load ALL env vars (including non-VITE_ prefixed) for use in plugins
  const env = loadEnv(mode, process.cwd(), ''); // '' prefix = load everything

  return {
    plugins: [react(), localApiPlugin(env)],
    server: {
      host: '127.0.0.1',
      port: 3000,
    },
  };
});
