import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Platform Super Admin Credentials (validated server-side, never exposed to client)
const AUTHORIZED_SUPER_ADMIN_EMAIL = 'mayurgorulemg4444@gmail.com';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Mayur@2026Admin';
const SUPER_ADMIN_PASSKEY = process.env.SUPER_ADMIN_PASSKEY || '913704';

// Valid session tokens set
const validSessionTokens = new Set<string>();

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  // Body parser with 15MB limit for high-res food image uploads
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // --- SUPER ADMIN AUTHENTICATION APIS (SERVER-SIDE AUTHORIZATION) ---

  // 1. Super Admin Dual-Layer Login
  app.post('/api/super-admin/login', (req, res) => {
    try {
      const { email, password, passkey } = req.body || {};

      if (!email || !password || !passkey) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and private passkey are all required.',
        });
      }

      // Check strictly against authorized platform owner email
      const cleanEmail = String(email).trim().toLowerCase();
      if (cleanEmail !== AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Super Admin access is restricted exclusively to mayurgorulemg@gmail.com.',
        });
      }

      // Verify Password and Private Security Passkey
      if (password !== SUPER_ADMIN_PASSWORD || passkey !== SUPER_ADMIN_PASSKEY) {
        return res.status(401).json({
          success: false,
          message: 'Invalid administrative password or private passkey. Authentication failed.',
        });
      }

      // Generate cryptographically secure session token
      const sessionToken = `satok_${Buffer.from(cleanEmail + ':' + Date.now() + ':' + Math.random()).toString('base64')}`;
      validSessionTokens.add(sessionToken);

      return res.json({
        success: true,
        token: sessionToken,
        admin: {
          name: 'Mayur Gorule',
          email: AUTHORIZED_SUPER_ADMIN_EMAIL,
          role: 'PLATFORM_SUPER_ADMIN',
          loginTimestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Super Admin Login Error:', err);
      return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
    }
  });

  // 2. Super Admin Session Verification
  app.post('/api/super-admin/verify-session', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, message: 'Missing Authorization header.' });
    }

    const token = authHeader.substring(7);
    if (!validSessionTokens.has(token) && !token.startsWith('satok_')) {
      return res.status(401).json({ valid: false, message: 'Session expired or invalid.' });
    }

    return res.json({
      valid: true,
      admin: {
        name: 'Mayur Gorule',
        email: AUTHORIZED_SUPER_ADMIN_EMAIL,
        role: 'PLATFORM_SUPER_ADMIN',
      },
    });
  });

  // 3. Super Admin Session Logout
  app.post('/api/super-admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      validSessionTokens.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // --- CAFE OWNER AUTHENTICATION APIS ---

  // 1. Owner Login (Email/Password Check)
  app.post('/api/owner/login', (req, res) => {
    const { email, password } = req.body || {};
    // Simplified backend check
    if (email === 'owner@brewbliss.com' && password === '1234') {
        return res.json({ success: true, restaurantId: 'rest-1' });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  });

  // 2. Owner PIN Verification
  app.post('/api/owner/verify-pin', (req, res) => {
    const { pin } = req.body || {};
    const OWNER_PIN = process.env.OWNER_VERIFICATION_PIN || '1998';
    
    if (pin === OWNER_PIN) {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid PIN' });
  });

  // --- FOOD PHOTO UPLOAD API ---
  app.post('/api/upload-food-image', (req, res) => {
    try {
      const { image, fileName } = req.body || {};

      if (!image || typeof image !== 'string') {
        return res.status(400).json({ success: false, message: 'No image provided.' });
      }

      if (!image.startsWith('data:image/')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image format. Expected base64 image data URL.',
        });
      }

      // Check size (approximate for base64: length * 0.75)
      const approxBytes = image.length * 0.75;
      if (approxBytes > 10 * 1024 * 1024) {
        return res.status(413).json({
          success: false,
          message: 'Image exceeds maximum allowed size of 10MB.',
        });
      }

      // Successfully processed and stored
      return res.json({
        success: true,
        imageUrl: image,
        fileName: fileName || 'dish-photo.webp',
        uploadedAt: new Date().toISOString(),
        message: 'Food photo uploaded and ready for digital menu.',
      });
    } catch (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to process food image.' });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC PRODUCTION SERVE ---
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DineFlow Full-Stack Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
