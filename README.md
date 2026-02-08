<p align="center">
  <img src="public/logo.svg" alt="LearnAI Logo" width="120" height="120" />
</p>

<h1 align="center">LearnAI</h1>

<p align="center">
  <strong>AI-Powered Tutoring Marketplace</strong><br/>
  Connecting students with expert professors — and AI interview coaches.
</p>

<p align="center">
  <a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License: Apache 2.0"/></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js 15"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6" alt="TypeScript"/></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deploy-Vercel-black" alt="Vercel"/></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-Enabled-6366F1" alt="MCP Enabled"/></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"/></a>
</p>

---

## About

**LearnAI** is a production-ready educational platform that leverages artificial intelligence to create perfect student-teacher matches. The platform handles everything from AI-powered recommendations to secure payments, video conferencing, collaborative whiteboards — and now, **AI professor agents** powered by the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) and [MCP Context Forge](https://github.com/ruslanmv/mcp-context-forge).

### Why LearnAI?

- **AI-Powered Matching** — OpenAI GPT-4o-mini analyzes student needs and recommends the best professors
- **AI Interview Coaches** — MCP-based professor agents conduct structured technical interviews with real-time feedback
- **Seamless Payments** — Integrated PayPal with automatic 90/10 revenue split
- **Video Integration** — Microsoft Teams for face-to-face learning
- **Interactive Whiteboard** — Real-time collaboration with tldraw
- **Analytics Dashboard** — Track top performers for recruitment
- **Enterprise Security** — NextAuth with Google OAuth and credentials authentication

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [MCP & A2A Integration](#mcp--a2a-integration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

### For Students

- AI-powered professor recommendations based on learning objectives
- Browse and filter professors by subject, rating, and price
- Book and manage 1-on-1 sessions
- **Start instant AI interview sessions** with MCP professor agents
- Secure payments with PayPal
- Interactive whiteboard and video sessions
- Track learning progress

### For Professors

- Easy registration and profile setup
- Set hourly rates and availability
- Receive 90% of session payments
- Manage bookings and students
- Build reputation through ratings

### For Administrators

- Dashboard with analytics
- User management
- Transaction monitoring
- Top performers leaderboard

---

## Architecture

LearnAI combines a traditional Next.js marketplace with an MCP-powered agent layer:

```
                    +------------------+
                    |   Next.js App    |
                    |  (App Router)    |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+       +----------v-----------+
    |  Human Teachers    |       |  AI Teacher Agents   |
    |  (Prisma/Postgres) |       |  (MCP / A2A)         |
    +--------------------+       +----------+-----------+
                                            |
                              +-------------+-------------+
                              |                           |
                    +---------v--------+       +----------v----------+
                    | MCP Professor    |       | MCP Context Forge   |
                    | Interview Server |       | (Agent Registry)    |
                    | (TypeScript)     |       | (Python Gateway)    |
                    +------------------+       +---------------------+
```

The **Explore** page merges human teachers from PostgreSQL with AI teacher agents from the ContextForge A2A catalog into a single unified grid.

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router), React 18 |
| **Language** | TypeScript 5.7 |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js (Google OAuth + Credentials) |
| **AI** | OpenAI GPT-4o-mini |
| **MCP Server** | `@modelcontextprotocol/sdk` (TypeScript), FastMCP (Python) |
| **Agent Registry** | MCP Context Forge (A2A protocol) |
| **Payments** | PayPal Checkout SDK |
| **Styling** | Tailwind CSS 3.4 |
| **Video** | Microsoft Teams Integration |
| **Whiteboard** | tldraw 2.6 |
| **Deployment** | Vercel |

---

## Quick Start

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

Visit [http://localhost:3000](http://localhost:3000)

---

## Installation

### Prerequisites

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0
- **Python** >= 3.10 (for MCP servers)
- **PostgreSQL** database (local or hosted)
- **OpenAI API Key** (for AI features)
- **PayPal Developer Account** (for payments)
- **Google Cloud Console** (for OAuth — optional but recommended)

### Step 1: Clone Repository

```bash
git clone https://github.com/ruslanmv/learnai.git
cd learnai
```

### Step 2: Install Dependencies

Using the Makefile (recommended — installs Node + MCP servers):

```bash
make install
```

Or Node.js only:

```bash
npm install
```

### Step 3: Install MCP Servers

```bash
make install-mcp
```

This creates a `.venv-mcp` Python virtual environment and installs:
- `mcp-server` — Python FastMCP server wrapping LearnAI REST API
- `mcp-context-forge` — Agent registry gateway
- `services/mcp-professor` — TypeScript interview agent (npm)

### Step 4: Environment Setup

```bash
cp .env.example .env.local
# or
make setup-env
```

---

## Configuration

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

# MCP Context Forge (optional — for AI teacher agents)
CONTEXTFORGE_URL="http://localhost:4444"
CONTEXTFORGE_TOKEN=""
CONTEXTFORGE_TEACHER_TAG="teacher"

# Professor MCP Server LLM (optional — for interview agent)
LLM_BASE_URL="http://localhost:11434/v1"
LLM_API_KEY="ollama"
LLM_MODEL="llama3:8b"
```

### Database Setup

#### Local PostgreSQL

```bash
# macOS
brew install postgresql && brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql && sudo service postgresql start
```

#### Hosted Database (Recommended for Production)

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| [Supabase](https://supabase.com) | 500 MB | Full-stack apps |
| [Neon](https://neon.tech) | 1 GB | Serverless, auto-scaling |
| [Vercel Postgres](https://vercel.com/storage/postgres) | 256 MB | Vercel integration |
| [Railway](https://railway.app) | 512 MB | Easy deployment |

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

### OpenAI Setup

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Generate an API key at [API Keys page](https://platform.openai.com/api-keys)

---

## MCP & A2A Integration

LearnAI integrates with [MCP Context Forge](https://github.com/ruslanmv/mcp-context-forge) to expose AI teacher agents alongside human professors.

### How It Works

1. **MCP Server** (`mcp-server/`) — A Python FastMCP server that wraps LearnAI's REST API as MCP tools: `search_professors`, `recommend_professors`, `create_booking`, `get_booking_status`, `list_subjects`.

2. **Professor Interview Server** (`services/mcp-professor/`) — A TypeScript MCP server using `@modelcontextprotocol/sdk` with 4 tools for running structured technical interviews: `create_interview_plan`, `start_interview`, `next_turn`, `wrap_up`.

3. **ContextForge A2A Catalog** (`mcp-catalog.yml`) — YAML catalog for bulk-registering MCP servers with the ContextForge gateway.

4. **Next.js Integration** (`lib/contextforge.ts`) — A client that queries ContextForge's `/a2a` endpoint to list AI teacher agents, which are then merged with human teachers on the Explore page.

### Running the MCP Stack

```bash
# Start the Python MCP server (port 9100)
make mcp-dev

# Start the ContextForge gateway (port 4444)
make contextforge-dev

# Start the Next.js app (port 3000)
make dev
```

### Registering Agents

```bash
# Register MCP servers from catalog
curl -X POST http://localhost:4444/catalog/load \
  -H "Content-Type: application/json" \
  -d '{"path": "mcp-catalog.yml"}'

# Register an A2A agent
curl -X POST http://localhost:4444/a2a \
  -H "Content-Type: application/json" \
  -d '{
    "name": "professor-nova",
    "url": "http://localhost:9100/a2a",
    "description": "AI technical interview coach",
    "tags": ["teacher", "interview"],
    "visibility": "public"
  }'
```

---

## Development

### Start Development Server

```bash
npm run dev
# or
make dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Database Operations

```bash
make prisma-generate      # Generate Prisma Client
make prisma-push          # Push schema to database (development)
make prisma-migrate       # Create migration (production)
make prisma-studio        # Open Prisma Studio (database GUI)
make prisma-reset         # Reset database (deletes all data)
```

### Code Quality

```bash
make lint                 # Run linter
make lint-fix             # Fix linting issues
make format               # Format code
make type-check           # TypeScript checking
make validate             # Run all checks
```

### Testing

```bash
make test                 # Run all MCP health tests (pytest)
```

The test suite validates:
- MCP server tool definitions and Pydantic models
- A2A agent health endpoint, agent card, and JSON-RPC methods
- ContextForge catalog YAML structure and agent config

### Build for Production

```bash
npm run build
# or
make build
```

---

## Deployment

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fruslanmv%2Flearnai&env=DATABASE_URL,NEXTAUTH_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,OPENAI_API_KEY,PAYPAL_CLIENT_ID,PAYPAL_CLIENT_SECRET,PAYPAL_ENVIRONMENT&envDescription=Required%20environment%20variables%20for%20LearnAI&envLink=https%3A%2F%2Fgithub.com%2Fruslanmv%2Flearnai%2Fblob%2Fmain%2F.env.example&project-name=learnai&repository-name=learnai)

### Production Deployment Guide

For comprehensive deployment instructions, see:

- [Complete Deployment Guide](./DEPLOYMENT.md)
- [Vercel-Specific Guide](./VERCEL_DEPLOYMENT.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)

### Quick Deploy Options

#### Git Integration (Recommended for Teams)

```bash
git push origin main
# Import to Vercel at https://vercel.com/new
# Configure environment variables and deploy
```

#### Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Using Makefile

```bash
make deploy-vercel          # Deploy to production
make deploy-vercel-preview  # Deploy preview
```

### Required Environment Variables

Add these in **Vercel Dashboard > Settings > Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Production domain URL |
| `NEXTAUTH_SECRET` | Yes | Random secret (32+ chars) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Secret |
| `OPENAI_API_KEY` | Yes | OpenAI API Key |
| `PAYPAL_CLIENT_ID` | Yes | PayPal Client ID (Live) |
| `PAYPAL_CLIENT_SECRET` | Yes | PayPal Secret (Live) |
| `PAYPAL_ENVIRONMENT` | Yes | `live` for production |

### Health Check

```bash
curl https://your-domain.com/api/health
# {"status":"healthy","timestamp":"...","checks":{...}}
```

---

## API Documentation

### Authentication

#### POST `/api/auth/register`

Register a new user.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### AI Endpoints

#### POST `/api/ai/recommend-professors`

Get AI-powered professor recommendations.

```json
{
  "query": "I need help with calculus and differential equations"
}
```

### Interview Endpoints

#### POST `/api/learn/plan`

Generate an interview plan via an A2A teacher agent.

```json
{
  "agentName": "professor-nova",
  "jobDescription": "Senior ML Engineer at ...",
  "seniority": "senior",
  "focusAreas": ["system design", "ML ops"],
  "language": "en"
}
```

#### POST `/api/learn/session`

Run an interview turn with feedback scoring.

```json
{
  "agentName": "professor-nova",
  "jobDescription": "Senior ML Engineer at ...",
  "history": [{"q": "...", "a": "...", "score": 7}],
  "userAnswer": "I would approach this by..."
}
```

### Booking Endpoints

#### POST `/api/bookings`

Create a new booking.

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

Create a PayPal payment order.

---

## Project Structure

```
learnai/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── ai/                   # AI recommendation endpoints
│   │   ├── bookings/             # Booking management
│   │   ├── learn/                # Interview plan & session (A2A)
│   │   └── payments/             # Payment processing
│   ├── dashboard/                # Dashboard page
│   ├── classroom/                # Classroom pages
│   ├── explore/                  # Unified teacher grid (Human + AI)
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth configuration
│   ├── ai.ts                     # OpenAI integration
│   ├── contextforge.ts           # ContextForge A2A client
│   ├── paypal.ts                 # PayPal integration
│   └── teams.ts                  # Microsoft Teams integration
├── mcp-server/                   # Python FastMCP server
│   └── src/learnai_mcp/
│       ├── server.py             # MCP tools (search, recommend, book)
│       └── a2a/agent.py          # A2A agent endpoint
├── services/
│   └── mcp-professor/            # TypeScript MCP interview server
│       └── src/index.ts          # Interview tools (plan, start, turn, wrap_up)
├── mcp-catalog.yml               # MCP Context Forge catalog
├── a2a-agent-config.yaml         # A2A agent registration config
├── tests/                        # Python health check tests
├── prisma/                       # Database schema
├── public/                       # Static assets (incl. logo.svg)
├── Makefile                      # Build automation
├── next.config.mjs               # Next.js configuration
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment config
```

---

## Scripts

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
| Test (MCP) | — | `make test` | Run MCP health tests |
| Install MCP | — | `make install-mcp` | Install all MCP servers |
| MCP Dev | — | `make mcp-dev` | Start MCP server (port 9100) |
| ContextForge | — | `make contextforge-dev` | Start gateway (port 4444) |
| Clean MCP | — | `make clean-mcp` | Remove MCP venv and cache |

View all Makefile commands:

```bash
make help
```

---

## Contributing

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
- Test your changes locally
- Update documentation as needed

---

## Security

For security concerns, please review [SECURITY.md](SECURITY.md).

**Important:**
- Never commit `.env.local` or any files containing secrets
- Use strong random secrets for `NEXTAUTH_SECRET`
- Keep dependencies updated
- Use HTTPS in production
- Enable rate limiting for API routes

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

```
Copyright 2025 ruslanmv.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

## Author

**Ruslan Magana**

- Website: [ruslanmv.com](https://ruslanmv.com)
- GitHub: [@ruslanmv](https://github.com/ruslanmv)
- LinkedIn: [Ruslan Magana](https://linkedin.com/in/ruslanmv)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [OpenAI](https://openai.com/) — AI capabilities
- [Model Context Protocol](https://modelcontextprotocol.io/) — AI tool interoperability
- [MCP Context Forge](https://github.com/ruslanmv/mcp-context-forge) — Agent registry gateway
- [Prisma](https://www.prisma.io/) — Database ORM
- [NextAuth.js](https://next-auth.js.org/) — Authentication
- [Vercel](https://vercel.com/) — Deployment platform
- [tldraw](https://tldraw.com/) — Collaborative whiteboard

---

## Support

- Issues: [GitHub Issues](https://github.com/ruslanmv/learnai/issues)
- Documentation: [Wiki](https://github.com/ruslanmv/learnai/wiki)

---

## Roadmap

### Version 1.1
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
- [ ] Expanded MCP agent catalog

---

<p align="center">
  <img src="public/logo.svg" alt="LearnAI" width="40" height="40" /><br/>
  <strong>Made with care by <a href="https://ruslanmv.com">Ruslan Magana</a></strong>
</p>
