# Portfolio Admin Panel

A secure admin panel for managing your portfolio projects with Google OAuth authentication.

![Admin Panel](https://img.shields.io/badge/Admin-Panel-6366f1)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Google OAuth](https://img.shields.io/badge/Auth-Google%20OAuth-red)

## ✨ Features

- 🔐 **Secure Google Authentication** - Only authorized email can access
- 📊 **Project Management** - Add, edit, and delete projects
- 🖼️ **Image Upload** - Upload images or use URLs
- 🎨 **Modern UI** - Beautiful, responsive admin interface
- 💾 **Simple Database** - JSON-based storage (easy to backup)
- 🚀 **Easy Setup** - Quick start in minutes

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=youremail@gmail.com
SESSION_SECRET=your_random_secret_key
```

### 3. Start Server
```bash
npm start
```

### 4. Access Admin Panel
Open `http://localhost:5500/admin.html` and login with Google!

## 📚 Documentation

For detailed setup instructions, see **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## 🏗️ Project Structure

```
├── server.js           # Backend API
├── admin.html          # Admin interface
├── admin-style.css     # Admin styles
├── admin-script.js     # Admin logic
├── script-updated.js   # Portfolio with API integration
└── projects.json       # Database (auto-created)
```

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

**Full instructions in [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## 🎯 Usage

### Adding Projects
1. Login to admin panel
2. Click "Add New Project"
3. Fill in project details
4. Upload image or provide URL
5. Save!

### Managing Projects
- ✏️ **Edit**: Click pencil icon
- 🗑️ **Delete**: Click trash icon
- 👁️ **View**: Changes reflect instantly on portfolio

## 🛡️ Security

- Only specified Google account can login
- Session-based authentication
- CORS protection
- Environment variables for sensitive data
- No passwords stored

## 📦 What's Included

- ✅ Express.js backend with REST API
- ✅ Google OAuth 2.0 integration
- ✅ Modern admin dashboard
- ✅ Image upload functionality
- ✅ Responsive design
- ✅ CRUD operations for projects
- ✅ Updated portfolio integration

## 🔧 API Endpoints

### Public
- `GET /api/projects` - Get all projects

### Protected (Admin only)
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

## 🎨 Customization

### Change Admin Email
Edit `.env`:
```env
ADMIN_EMAIL=newemail@gmail.com
```

### Change Port
Edit `.env`:
```env
PORT=5000
```

### Styling
Edit `admin-style.css` to customize colors and layout

## 📝 License

MIT License - feel free to use for your own portfolio!

## 💡 Tips

- Backup `projects.json` regularly
- Use strong SESSION_SECRET
- Don't commit `.env` to git
- Test locally before deploying

## 🆘 Need Help?

Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Detailed setup instructions
- Troubleshooting guide
- Production deployment tips
- Security best practices

---

Made with ❤️ for easy portfolio management
