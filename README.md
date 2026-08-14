# 🛡️ DARKWATCH

**AI-Powered Data Breach Intelligence & Real-Time Alert System**

DARKWATCH monitors simulated threat intelligence feeds, detects leaked organizational credentials or sensitive data, calculates risk, generates AI-powered incident analysis, and alerts security analysts in real time.

> ⚠️ **Ethical scope:** This project consumes ONLY simulated datasets. It does NOT scrape the dark web or perform any real hacking.

---

## ✨ Features

- **Supabase Authentication** — secure analyst registration, login, and session management.
- **Organization Management** — monitor domains, emails, and usernames.
- **Threat Intelligence Feed** — import simulated leaked-credential records.
- **Matching Engine** — matches threats against your monitored assets.
- **Risk Engine** — computes 0–100 risk score with severity (LOW/MEDIUM/HIGH/CRITICAL).
- **AI Analyst** — generates impact, reasoning, and recommendations using the Gemini API.
- **Alert Engine** — real-time dashboard alerts for new incidents.
- **Incident Lifecycle** — NEW → INVESTIGATING → CONTAINED → RESOLVED with timeline.
- **Modern SOC Dashboard** — "Art Gallery" aesthetic bento grid, incident tables, and threat feeds using Next.js App Router.

### Non-Functional Requirements
- **Performance:** App Router + SSR for < 1s initial load times.
- **Security:** RLS to ensure zero cross-tenant data leakage. Secure Cron via API secrets.
- **Scalability:** Serverless ingestion endpoints capable of massive simultaneous inserts without blocking main DB reads.

## Under Development (Future Integrations)
The following features are slated for future releases and require third-party API configurations:
1. **Real Threat Intelligence Feed Integrations:**
   - Integration with HaveIBeenPwned API for domain breach monitoring.
   - Integration with AlienVault OTX / ThreatFox for live IOC (Indicators of Compromise) streaming.
2. **Dark Web Monitoring:**
   - Automated polling of specialized paid APIs (e.g., DeHashed, Searchlight) or custom Tor scrapers to monitor specific client assets on the deep/dark web.

---

## 🧱 Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | Next.js 15 (App Router), React, Tailwind CSS 4, Phosphor Icons |
| Backend   | Next.js Server Actions & API Routes |
| Database  | Supabase (PostgreSQL)               |
| Auth      | Supabase Auth (SSR)                 |
| AI        | Google Gemini API                   |

---

## 📁 Project Structure

```
darkwatch-web/
├── app/
│   ├── dashboard/          # Protected SOC interface
│   │   ├── incidents/      # Incident management table
│   │   ├── threats/        # Threat intelligence feed
│   │   └── settings/       # Workspace & org config
│   ├── login/              # Auth pages
│   ├── register/
│   ├── layout.tsx          # Root layout & fonts
│   └── page.tsx            # Cinematic Landing Page
├── components/             # Reusable UI (Sidebar, Header)
├── utils/
│   └── supabase/           # Supabase client/server/middleware clients
├── lib/
│   ├── engine/             # Core logic (Matchers, Risk, AI)
│   └── types/              # TypeScript definitions
├── supabase/               # Database migrations & schema
└── .env.local              # Environment variables
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- A Supabase Project
- A Google Gemini API Key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## 🤖 AI Analyst

Uses the Gemini API (`gemini-pro`) to ingest raw threat data and output structured JSON detailing:
1. **Executive Summary:** 1-2 sentences on the threat.
2. **Business Impact:** Potential consequences for the organization.
3. **Recommended Actions:** 3 concrete steps to remediate.
