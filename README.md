<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=200&section=header&text=FinFlow%20Dashboard&fontSize=48&fontColor=ffffff&fontAlignY=35&desc=Freelancer%20Revenue%20%26%20Analytics%20Platform&descAlignY=55&descSize=18" width="100%"/>

<br/>

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-6366f1?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

> **A full-featured freelancer analytics dashboard** — track revenue, manage clients, monitor projects, and visualize business performance. Built from scratch with Next.js 14, Tailwind CSS, and Recharts.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-6366f1?style=for-the-badge)](https://finflow-dashboard.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/📁_View_Repo-gray?style=for-the-badge)](https://github.com/AchintyaCodes/finflow-dashboard)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Revenue Overview** | Area chart showing 6-month billing history with gradient fill |
| 🎯 **Radar Chart** | Mobile vs Desktop usage breakdown across 5 feature categories |
| 🗂️ **Project Pipeline** | Kanban-style tracker — Proposal → In Progress → Review → Paid |
| 🧾 **Invoice Manager** | Filter invoices by status, track paid/outstanding amounts |
| 👥 **Client Directory** | Searchable client table with ratings, revenue, and status |
| 📈 **Reports Page** | Bar chart, line chart, and donut chart — all animated |
| ⚙️ **Settings** | Save profile, currency preference, notification toggles |
| 🎨 **Premium UI** | Dark slate sidebar, indigo accents, rounded cards, hover effects |

---

## 🖥️ Screenshots

<div align="center">

### Dashboard
![Dashboard](https://placehold.co/900x500/f8fafc/6366f1?text=Dashboard+Overview)

### Reports
![Reports](https://placehold.co/900x500/f8fafc/6366f1?text=Reports+Page)

### Clients
![Clients](https://placehold.co/900x500/f8fafc/6366f1?text=Clients+Page)

</div>

> 💡 **Tip:** Replace the placeholder images above with real screenshots once deployed.

---

## 🛠️ Tech Stack

```bash
├── Framework     → Next.js 14 (App Router)
├── Language      → TypeScript
├── Styling       → Tailwind CSS
├── Charts        → Recharts (Area, Bar, Line, Pie, Radar)
├── Icons         → Lucide React
├── Utilities     → clsx
└── Deployment    → Vercel
```
---

## 📁 Project Structure

```bash
finflow-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── clients/page.tsx      # Client directory
│   │   ├── projects/page.tsx     # Project tracker
│   │   ├── invoices/page.tsx     # Invoice manager
│   │   ├── reports/page.tsx      # Analytics & charts
│   │   └── settings/page.tsx     # User settings
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       # Dark nav with active states
│   │   │   └── TopBar.tsx        # Header with greeting & bell
│   │   └── dashboard/
│   │       ├── StatCard.tsx      # KPI metric card
│   │       ├── RevenueChart.tsx  # Area chart
│   │       ├── UsageRadar.tsx    # Radar chart
│   │       ├── ClientTable.tsx   # Invoice table
│   │       └── ProjectPipeline.tsx # Pipeline tracker
│   ├── lib/
│   │   ├── data.ts               # Mock data
│   │   └── utils.ts              # cn() helper
│   └── types/
│       └── index.ts              # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/AchintyaCodes/finflow-dashboard.git

# Navigate into the project
cd finflow-dashboard

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## 📚 What I Learned

Building this project pushed me across several areas of modern frontend development:

- **Next.js App Router** — understanding how layouts, pages, and routing work in the new app directory structure
- **TypeScript in React** — defining types for components, props, and data models to catch bugs at compile time
- **Tailwind CSS utility patterns** — building complex responsive layouts and hover states without writing custom CSS
- **Recharts library** — integrating Area, Bar, Line, Pie, and Radar charts with custom styling and responsive containers
- **Component architecture** — separating layout, UI, and feature components into a scalable folder structure
- **Git workflow** — committing feature-by-feature with meaningful messages to maintain a clean history
- **Data modelling** — structuring mock data with TypeScript interfaces to simulate real API responses

---

## 🔭 Scope for Future Improvement

- [ ] **Authentication** — add login/signup with NextAuth.js or Clerk
- [ ] **Database integration** — connect to Supabase or PlanetScale for real data
- [ ] **Dark mode** — full dark theme toggle using Tailwind's dark variant
- [ ] **Animations** — add Framer Motion for page transitions and chart entrance effects
- [ ] **Invoice PDF export** — generate downloadable PDFs using react-pdf
- [ ] **Real-time updates** — live invoice status changes with Supabase subscriptions
- [ ] **Mobile responsive** — fully optimised layout for tablet and phone screens
- [ ] **Search & filters** — global search across clients, projects, and invoices
- [ ] **Email notifications** — send invoice reminders via Resend or SendGrid
- [ ] **Multi-currency support** — live exchange rates via API

---

## 👨‍💻 My Growth

This was one of my most complete frontend builds. Starting from a blank repo, I scaffolded the entire project, designed my own component architecture, and built 6 fully functional pages with real interactivity.

The biggest shift was thinking in **systems** rather than individual files — how data flows from `lib/data.ts` into typed components, how layout components wrap page components, and how a design language (indigo + slate) stays consistent across every page. It gave me a much clearer picture of how real production codebases are structured.

---

## 📄 License

MIT — free to use, fork, and build on.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=100&section=footer" width="100%"/>

Made with 💙 by [Achintya](https://github.com/AchintyaCodes)

</div>
