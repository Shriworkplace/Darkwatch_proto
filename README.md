# 🛡️ DARKWATCH

**AI-Powered Data Breach Intelligence & Real-Time Alert System**

DARKWATCH monitors simulated threat intelligence feeds, detects leaked organizational credentials or sensitive data, calculates risk, generates AI-powered incident analysis, and alerts security analysts in real time. 

> ⚠️ **Disclaimer:** This project is currently a **PROTOTYPE** and is **NOT** production ready. It is intended for demonstration, portfolio, and proof-of-concept purposes only.
> ⚠️ **Ethical scope:** This project consumes ONLY simulated datasets. It does NOT scrape the dark web or perform any real hacking.

---

## ✨ Core Features

- **Real-Time SOC Dashboard** — "Art Gallery" aesthetic bento grid, live incident tables, and threat feeds using Next.js App Router and Supabase WebSockets. No manual refreshes required.
- **Supabase Authentication & RBAC** — Secure analyst registration and login. Team-based Role-Based Access Control (Admin, Analyst, Viewer).
- **Organization Management** — Monitor specific domains, emails, and usernames for your clients.
- **Threat Intelligence Engine** — Ingest simulated leaked-credential records and map them to monitored assets.
- **Risk Engine** — Computes a 0–100 risk score and assigns a severity (LOW / MEDIUM / HIGH / CRITICAL).
- **Gemini AI Analyst** — Generates executive summaries, business impact analysis, and remediation steps.
- **Webhook Alert Engine** — Automatically dispatches Slack/Discord notifications for CRITICAL severity incidents.
- **Compliance Exporting** — Download one-click CSV reports of all organization incidents and underlying threat data.
- **Incident Lifecycle** — Track incidents from NEW → INVESTIGATING → CONTAINED → RESOLVED.

### Non-Functional Requirements
- **Performance:** Next.js App Router + SSR + React Server Components.
- **Security:** Strict Supabase Row Level Security (RLS) ensures zero cross-tenant data leakage. Secure Cron via API secrets.
- **Scalability:** Serverless ingestion endpoints capable of massive simultaneous inserts without blocking main database reads.

---

## 🚀 How to Deploy to Production

DARKWATCH is designed to be easily deployed to **Vercel** with a **Supabase** backend. 

### 1. Database & Auth Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the schema file located at `supabase/supabase_schema.sql`.
3. Go to **Authentication -> Providers** and enable the Email provider (disable email confirmations if you want frictionless testing, or set up a custom SMTP like Resend/SendGrid for production).

### 2. Environment Variables
You will need to configure the following environment variables in your Vercel dashboard:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration
GEMINI_API_KEY=your-google-gemini-key

# Cron & Webhook Configuration
CRON_SECRET=your-random-secure-string
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 3. Vercel Deployment
1. Import your GitHub repository into Vercel.
2. Add the environment variables listed above.
3. Deploy! Vercel will automatically read the `vercel.json` file to configure the hourly `/api/cron/scan` background job.

### 4. Setting up Roles (RBAC)
Because DARKWATCH uses Role-Based Access Control, the first user to register an organization will automatically become the `ADMIN` in the `team_members` table. Admins can then invite other Analysts and Viewers to the organization.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js v18+
- A Supabase Project
- A Google Gemini API Key

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
```

### 3. Start the server
```bash
npm run dev
```

---

## 🧠 Risk Scoring Rules

| Factor                    | Points |
| ------------------------- | ------ |
| Password exposed          | +40    |
| Email exposed             | +10    |
| Phone exposed             | +10    |
| Admin/privileged account  | +30    |
| Recent breach (<30 days)  | +20    |
| Multiple credentials      | +20    |

**Max score:** 100 (capped)

| Score   | Severity |
| ------- | -------- |
| 0–25    | LOW      |
| 26–50   | MEDIUM   |
| 51–75   | HIGH     |
| 76–100  | CRITICAL |

---

## 🤖 AI Analyst (Gemini)

Uses the Gemini API (`gemini-pro`) to ingest raw threat data and output structured JSON detailing:
1. **Executive Summary:** 1-2 sentences on the threat.
2. **Business Impact:** Potential consequences for the organization.
3. **Recommended Actions:** 3 concrete steps to remediate.

---

## 🔮 Under Development (Future Integrations)

The following features are slated for future releases and require third-party API configurations:
1. **Real Threat Intelligence Feed Integrations:**
   - Integration with HaveIBeenPwned API for domain breach monitoring.
   - Integration with AlienVault OTX / ThreatFox for live IOC (Indicators of Compromise) streaming.
2. **Dark Web Monitoring:**
   - Automated polling of specialized paid APIs (e.g., DeHashed, Searchlight) or custom Tor scrapers to monitor specific client assets on the deep/dark web.
