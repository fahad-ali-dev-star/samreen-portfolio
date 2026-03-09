// Auth login endpoint - Vercel API route
// Simple password-based authentication

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminToken = process.env.ADMIN_TOKEN;

  // If no password configured, allow access for development
  if (!adminPassword || adminPassword === 'your-admin-password') {
    // Set a simple cookie for development
    res.setHeader('Set-Cookie', `admin_token=dev_token; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`);
    return res.json({ 
      success: true, 
      message: 'Logged in (development mode)' 
    });
  }

  // Check password
  if (password === adminPassword && adminToken) {
    res.setHeader('Set-Cookie', `admin_token=${adminToken}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`);
    return res.json({ success: true, message: 'Logged in successfully' });
  }

  res.status(401).json({ error: 'Invalid password' });
}

