# Portfolio React - Samreen Shafqat

A modern, high-performance React portfolio website with admin panel for managing projects.

## Features

- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and optimized production builds
- 🎨 **Modern UI** - Clean, responsive design with smooth animations using Framer Motion
- 🔐 **Secure Admin Panel** - Google OAuth authentication for admin access
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🖼️ **Project Management** - Add, edit, and delete projects from the admin dashboard
- 🔍 **Project Filtering** - Filter projects by category
- 🎬 **Smooth Animations** - Beautiful transitions and micro-interactions

## Tech Stack

### Frontend
- React 18
- React Router v6
- Framer Motion
- Axios
- React Icons
- Vite

### Backend
- Node.js
- Express.js
- Passport.js (Google OAuth)
- Multer (File uploads)

## Project Structure

```
portfolio-react/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── admin/         # Admin panel components
│   │   ├── common/        # Reusable components (Button, Modal, etc.)
│   │   ├── home/          # Home page sections
│   │   └── layout/        # Header, Footer
│   ├── context/           # React Context (Auth)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── styles/            # CSS files
├── server/
│   ├── middleware/        # Auth, Upload middleware
│   ├── routes/            # API routes
│   ├── utils/             # Database utilities
│   └── server.js          # Express server
├── data/                   # JSON database
└── uploads/               # Uploaded images
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Cloud Console account for OAuth setup

### Installation

1. **Clone the repository** (or navigate to the project folder)

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables:**
   
   Copy `.env.example` to `.env` in the `server` folder:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Then edit `server/.env` with your values:
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `ADMIN_EMAIL` - Your admin email address
   - `SESSION_SECRET` - Random string for session encryption

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth Client ID**
5. Select **Web application**
6. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

### Running the Application

**Development mode (both frontend and backend):**
```bash
npm start
```

**Or run separately:**

Frontend only:
```bash
npm run dev
```

Backend only:
```bash
npm run server
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

### Public Site
- Visit `http://localhost:5173` to view the portfolio
- Navigate through sections: Home, About, Projects, Contact
- Click on any project to view details

### Admin Panel
- Visit `http://localhost:5173/admin`
- Login with Google (must be the admin email)
- Add, edit, or delete projects
- Upload images or use external URLs

## API Endpoints

### Public
- `GET /api/projects` - Get all projects

### Protected (Admin)
- `GET /api/admin/projects` - Get all projects (admin)
- `POST /api/admin/projects` - Create new project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

### Auth
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/status` - Check authentication status
- `GET /auth/logout` - Logout

## License

MIT License

## Author

Samreen Shafqat - Graphic & UI/UX Designer
