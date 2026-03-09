// Auth status endpoint - Vercel API route
// Returns authentication status based on session cookie

export default function handler(req, res) {
  // Check for auth token in cookies
  const authToken = req.cookies?.admin_token;
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (authToken && expectedToken && authToken === expectedToken) {
    res.json({
      authenticated: true,
      user: {
        name: 'Admin',
        email: 'admin@portfolio.com',
        photo: ''
      }
    });
  } else {
    res.json({ authenticated: false });
  }
}

