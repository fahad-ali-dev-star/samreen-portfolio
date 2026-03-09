// Auth logout endpoint - Vercel API route

export default function handler(req, res) {
  // Clear the auth cookie
  res.setHeader('Set-Cookie', 'admin_token=; Path=/; HttpOnly; Max-Age=0');
  res.json({ message: 'Logged out successfully' });
}

