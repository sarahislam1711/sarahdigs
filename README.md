# SarahDigs - Digital Marketing Agency Website

A modern digital marketing agency website with a full-featured CMS for managing blog posts, services, projects, and site content.

## Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS + Vite
- **Backend**: Express.js + Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: Password-based admin authentication

## Features

- 🎨 Modern, responsive design with dark theme
- ✍️ Full blog system with categories, tags, and rich text editor
- 📄 CMS for managing all site content
- 🖼️ Media library with image uploads
- 📊 Dynamic service pages
- 💼 Project portfolio
- 📧 Contact form with inquiry management

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database (recommend [Neon](https://neon.tech))

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd SarahDigs2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string
   - `ADMIN_PASSWORD`: Password for admin CMS access

5. Push database schema:
   ```bash
   npm run db:push
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

### Admin Access

Navigate to `/admin/login` and enter your admin password.

## Deployment to Railway

### 1. Prepare Your Repository

Make sure all changes are committed to your GitHub repository.

### 2. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the Node.js project

### 3. Add PostgreSQL (if not using Neon)

If you want Railway to manage your database:
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set `DATABASE_URL`

Or continue using your existing Neon database.

### 4. Configure Environment Variables

In your Railway project settings, add these variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-set if using Railway Postgres) |
| `SESSION_SECRET` | Secure random string for session encryption |
| `ADMIN_PASSWORD` | Password for admin CMS login |
| `NODE_ENV` | Set to `production` |

Railway automatically sets `PORT`.

### 5. Deploy

Railway will automatically:
1. Install dependencies (`npm install`)
2. Build the project (`npm run build`)
3. Start the server (`npm run start`)

### 6. Add Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Build Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema changes to database |
| `npm run check` | TypeScript type checking |

## Project Structure

```
SarahDigs2/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   └── admin/    # CMS admin pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities
│   └── index.html
├── server/               # Express backend
│   ├── auth.ts           # Authentication
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schema
│   └── schema.ts         # Drizzle database schema
├── public/               # Static files
│   └── uploads/          # Uploaded media
└── drizzle/              # Database migrations
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret for session cookies |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `NODE_ENV` | No | Environment (`development` or `production`) |
| `PORT` | No | Server port (default: 5000, Railway sets automatically) |

## Troubleshooting

### Database Connection Issues

Ensure your `DATABASE_URL` includes `?sslmode=require` for Neon:
```
postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### Session Not Persisting

1. Check `SESSION_SECRET` is set
2. Ensure cookies are secure in production (`NODE_ENV=production`)

### Build Fails on Railway

1. Check Node.js version compatibility
2. Ensure all dependencies are in `dependencies`, not `devDependencies`
3. Check build logs for specific errors

## License

MIT
