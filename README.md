# LearnAI – AI Tutor Marketplace

Production-ready Next.js 14 project for an AI-orchestrated tutoring marketplace:

- Students & professors login with Google or email/password
- AI assistant recommends the best professors
- Book 1:1 sessions, join via Microsoft Teams, collaborate on a whiteboard (tldraw)
- Pay per session with PayPal – 10% platform fee for the portal
- Dashboard with top professors and students (useful for recruiting)

## Tech stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Tailwind CSS, Inter font, React Icons
- **Auth**: NextAuth (Google + Credentials)
- **Database**: PostgreSQL + Prisma
- **AI**: OpenAI (chat-based explanation & matching)
- **Payments**: PayPal Checkout SDK (server-side)
- **Whiteboard**: tldraw
- **Deployment**: Vercel

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root based on this template:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/learnai"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-very-strong-random-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_ENVIRONMENT="sandbox" # or "live"
```

### 3. Setup database

Run Prisma:

```bash
npm run prisma:generate
npm run prisma:push
```

Connect it to a Postgres instance (Supabase, Neon, etc.) for production.

### 4. Run dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Key pages

- `/` – Landing page (matches the provided LearnAI UI)
- `/login` – Login (Google + email/password)
- `/register` – Register as student
- `/dashboard` – Student/teacher/admin dashboard with top professors/students
- `/classroom/[id]` – Classroom with Teams link + tldraw whiteboard

---

## Deployment on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Create a new project on Vercel and import the repo.
3. Set the environment variables in **Vercel → Settings → Environment Variables**.
4. Set your Postgres database URL.
5. Deploy – Vercel will automatically detect Next.js and build.

For schema updates in production, run `npx prisma db push` via a CI step or a one-time Vercel build command against your production database.

---

## Notes

- OpenAI is optional. If `OPENAI_API_KEY` is missing, the app will still return DB-based professor matches, just without a natural-language explanation.
- PayPal integration includes **order creation**. You should add a webhook endpoint for capture and payouts in a real marketplace.
- Admin role must currently be granted manually in the database (`User.role = ADMIN`).

Enjoy building on top of LearnAI 🚀
