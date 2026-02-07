# 🎓 LearnAI - AI-Powered Tutoring Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green.svg)](./DEPLOYMENT.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

> **Production-ready AI-orchestrated tutoring marketplace connecting students with expert professors**

Transform education with intelligent matchmaking, seamless payments, and interactive learning experiences.

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 About

**LearnAI** is a next-generation educational platform that leverages artificial intelligence to create perfect student-teacher matches. Our platform handles everything from AI-powered recommendations to secure payments, video conferencing, and collaborative whiteboards.

### Why LearnAI?

- **🤖 AI-Powered Matching**: OpenAI GPT-4 analyzes student needs and recommends the best professors
- **💳 Seamless Payments**: Integrated PayPal with automatic 90/10 revenue split
- **📹 Video Integration**: Microsoft Teams integration for face-to-face learning
- **🎨 Interactive Whiteboard**: Real-time collaboration with tldraw
- **📊 Analytics Dashboard**: Track top performers for recruitment opportunities
- **🔒 Enterprise Security**: NextAuth with Google OAuth and credentials authentication

---

## ✨ Features

### For Students
- ✅ AI-powered professor recommendations based on learning objectives
- ✅ Browse and filter professors by subject, rating, and price
- ✅ Book and manage 1-on-1 sessions
- ✅ Secure payments with PayPal
- ✅ Interactive whiteboard and video sessions
- ✅ Track learning progress

### For Professors
- ✅ Easy registration and profile setup
- ✅ Set hourly rates and availability
- ✅ Receive 90% of session payments
- ✅ Manage bookings and students
- ✅ Build reputation through ratings

### For Administrators
- ✅ Dashboard with analytics
- ✅ User management
- ✅ Transaction monitoring
- ✅ Top performers leaderboard

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router), React 18 |
| **Language** | TypeScript 5.3 |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js (Google OAuth + Credentials) |
| **AI** | OpenAI GPT-4 Mini |
| **Payments** | PayPal Checkout SDK |
| **Styling** | Tailwind CSS 3.4 |
| **Video** | Microsoft Teams Integration |
| **Whiteboard** | tldraw 2.6 |
| **Deployment** | Vercel |
| **Linting** | ESLint + Prettier |
| **Type Checking** | TypeScript |

---

## 🚀 Quick Start

Get started in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/ruslanmv/learnai.git
cd learnai

# Install dependencies and setup
make setup

# Configure environment variables
# Edit .env.local with your credentials

# Setup database
make prisma-push

# Start development server
make dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0
- **PostgreSQL** database (local or hosted)
- **OpenAI API Key** (for AI features)
- **PayPal Developer Account** (for payments)
- **Google Cloud Console** (for OAuth - optional but recommended)

### Step 1: Clone Repository

```bash
git clone https://github.com/ruslanmv/learnai.git
cd learnai
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using the Makefile:
```bash
make install
```

### Step 3: Environment Setup

Create `.env.local` from template:
```bash
cp .env.example .env.local
```

Or use:
```bash
make setup-env
```

---

## ⚙️ Configuration

### Required Environment Variables

Edit `.env.local` with your credentials:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/learnai"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-strong-random-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_ENVIRONMENT="sandbox"
```

### Database Setup

#### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL locally
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start    # Linux
```

#### Option 2: Hosted Database (Recommended for Production)

Choose a managed PostgreSQL provider:

- **[Supabase](https://supabase.com)** - Free tier available
- **[Neon](https://neon.tech)** - Serverless PostgreSQL
- **[Railway](https://railway.app)** - Easy deployment
- **[Vercel Postgres](https://vercel.com/storage/postgres)** - Integrated with Vercel

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### PayPal Setup

1. Visit [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a Sandbox app for testing
3. Copy Client ID and Secret
4. For production, create a Live app

### OpenAI Setup

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account
3. Generate an API key at [API Keys page](https://platform.openai.com/api-keys)

---

## 💻 Development

### Start Development Server

```bash
npm run dev
# or
make dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Database Operations

```bash
# Generate Prisma Client
make prisma-generate

# Push schema to database (development)
make prisma-push

# Create migration (production)
make prisma-migrate

# Open Prisma Studio (database GUI)
make prisma-studio

# Reset database (⚠️ deletes all data)
make prisma-reset
```

### Code Quality

```bash
# Run linter
make lint

# Fix linting issues
make lint-fix

# Format code
make format

# Type checking
make type-check

# Run all checks
make validate
```

### Build for Production

```bash
npm run build
# or
make build
```

---

## 🌐 Deployment

### One-Click Deploy to Vercel ⚡

The fastest way to get started:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fruslanmv%2Flearnai&env=DATABASE_URL,NEXTAUTH_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,OPENAI_API_KEY,PAYPAL_CLIENT_ID,PAYPAL_CLIENT_SECRET,PAYPAL_ENVIRONMENT&envDescription=Required%20environment%20variables%20for%20LearnAI&envLink=https%3A%2F%2Fgithub.com%2Fruslanmv%2Flearnai%2Fblob%2Fmain%2F.env.example&project-name=learnai&repository-name=learnai)

**Note**: You'll need to configure environment variables after clicking the button.

### Production Deployment Guide

For comprehensive deployment instructions, see our detailed guides:

- 📘 **[Complete Deployment Guide](./DEPLOYMENT.md)** - Covers all platforms
- 🚀 **[Vercel-Specific Guide](./VERCEL_DEPLOYMENT.md)** - Step-by-step Vercel setup
- ✅ **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-deployment verification

### Quick Deploy Options

#### Method 1: Git Integration (Recommended for Teams)

```bash
# Push to GitHub
git push origin main

# Import to Vercel
1. Visit https://vercel.com/new
2. Import your repository
3. Configure environment variables
4. Deploy (auto-deploys on every push)
```

#### Method 2: Vercel CLI (Recommended for Developers)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

#### Method 3: Using Makefile

```bash
# Deploy to production
make deploy-vercel

# Deploy preview
make deploy-vercel-preview
```

### Required Environment Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Production domain URL |
| `NEXTAUTH_SECRET` | ✅ | Random secret (32+ chars) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth Secret |
| `OPENAI_API_KEY` | ✅ | OpenAI API Key |
| `PAYPAL_CLIENT_ID` | ✅ | PayPal Client ID (Live) |
| `PAYPAL_CLIENT_SECRET` | ✅ | PayPal Secret (Live) |
| `PAYPAL_ENVIRONMENT` | ✅ | `live` for production |

**📝 Tip**: Use `.env.production.example` as a template for all variables.

### Database Setup for Production

Recommended managed PostgreSQL providers:

| Provider | Free Tier | Best For | Setup Time |
|----------|-----------|----------|------------|
| **[Supabase](https://supabase.com)** | ✅ 500MB | Full-stack apps | 5 min |
| **[Neon](https://neon.tech)** | ✅ 1GB | Serverless, auto-scaling | 3 min |
| **[Vercel Postgres](https://vercel.com/storage/postgres)** | ✅ 256MB | Vercel integration | 2 min |
| **[Railway](https://railway.app)** | ✅ 512MB | Easy deployment | 5 min |

After setting up your database:

```bash
# Set DATABASE_URL locally (temporarily)
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma db push

# Or create migration
npx prisma migrate deploy
```

### Health Check

After deployment, verify your application is running:

```bash
curl https://your-domain.com/health

# Expected response:
# {"status":"healthy","timestamp":"...","checks":{...}}
```

### Post-Deployment

- ✅ Test all critical features (login, payments, AI recommendations)
- ✅ Set up monitoring (Sentry, Vercel Analytics)
- ✅ Configure custom domain
- ✅ Enable SSL/HTTPS
- ✅ Set up uptime monitoring
- ✅ Review [Production Checklist](./PRODUCTION_CHECKLIST.md)

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "john@example.com"
}
```

### AI Endpoints

#### POST `/api/ai/recommend-professors`
Get AI-powered professor recommendations

**Request Body:**
```json
{
  "query": "I need help with calculus and differential equations"
}
```

**Response:**
```json
{
  "teachers": [
    {
      "id": "teacher_id",
      "name": "Dr. Smith",
      "subjects": ["mathematics", "calculus"],
      "rating": 4.9,
      "hourlyRate": 45
    }
  ],
  "explanation": "AI explanation of matches..."
}
```

### Booking Endpoints

#### POST `/api/bookings`
Create a new booking

**Request Body:**
```json
{
  "teacherId": "teacher_id",
  "subject": "Mathematics",
  "topic": "Calculus",
  "scheduledFor": "2025-01-15T10:00:00Z",
  "durationMinutes": 60,
  "priceTotal": 45.00
}
```

### Payment Endpoints

#### POST `/api/payments/create-order`
Create PayPal payment order

---

## 📂 Project Structure

```
learnai/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── ai/                   # AI recommendation endpoints
│   │   ├── bookings/             # Booking management
│   │   └── payments/             # Payment processing
│   ├── dashboard/                # Dashboard page
│   ├── classroom/                # Classroom pages
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── HomeSearchClient.tsx      # Home search component
│   ├── SessionProviderWrapper.tsx # NextAuth wrapper
│   └── WhiteboardClient.tsx      # Whiteboard component
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth configuration
│   ├── ai.ts                     # OpenAI integration
│   ├── paypal.ts                 # PayPal integration
│   └── teams.ts                  # Microsoft Teams integration
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── Makefile                      # Build automation
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment config
```

---

## 📜 Scripts

All scripts are available via npm or Makefile:

| Command | npm | Makefile | Description |
|---------|-----|----------|-------------|
| Development | `npm run dev` | `make dev` | Start dev server |
| Build | `npm run build` | `make build` | Build for production |
| Start | `npm start` | `make start` | Start production server |
| Lint | `npm run lint` | `make lint` | Run ESLint |
| Format | `npm run format` | `make format` | Format with Prettier |
| Type Check | `npm run type-check` | `make type-check` | Run TypeScript check |
| Validate | `npm run validate` | `make validate` | Run all checks |
| Prisma Generate | `npm run prisma:generate` | `make prisma-generate` | Generate Prisma Client |
| Prisma Push | `npm run prisma:push` | `make prisma-push` | Push schema to DB |
| Clean | `npm run clean` | `make clean` | Clean build artifacts |

View all Makefile commands:
```bash
make help
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow TypeScript and ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for functions
- Test your changes locally
- Update documentation as needed

---

## 🔒 Security

For security concerns, please review [SECURITY.md](SECURITY.md)

**Important Security Notes:**
- Never commit `.env.local` or any files containing secrets
- Use strong random secrets for `NEXTAUTH_SECRET`
- Keep dependencies updated
- Use HTTPS in production
- Enable rate limiting for API routes

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
Apache 2.0 

---

## 👨‍💻 Author

**Ruslan Magana**

- Website: [ruslanmv.com](https://ruslanmv.com)
- GitHub: [@ruslanmv](https://github.com/ruslanmv)
- LinkedIn: [Ruslan Magana](https://linkedin.com/in/ruslanmv)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - AI capabilities
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Vercel](https://vercel.com/) - Deployment platform
- [tldraw](https://tldraw.com/) - Collaborative whiteboard

---

## 📞 Support

Need help? Here's how to get support:

- 📧 Email: support@ruslanmv.com
- 🐛 Issues: [GitHub Issues](https://github.com/ruslanmv/learnai/issues)
- 📖 Documentation: [Wiki](https://github.com/ruslanmv/learnai/wiki)

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Professor availability calendar
- [ ] Student reviews and ratings

### Version 1.2
- [ ] Mobile apps (iOS/Android)
- [ ] Group sessions
- [ ] Course packages
- [ ] Subscription plans

### Version 2.0
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Webhooks for automated workflows

---

<div align="center">

**Made with ❤️ by [Ruslan Magana](https://ruslanmv.com)**

⭐ Star this project if you find it helpful!

</div>
