# AcadRisk: AI-Based Student Performance Prediction & Academic Risk Analysis System

AcadRisk is an explainable, deterministic Academic Risk Prediction and Student Trajectory platform.
**CRITICAL ARCHITECTURAL GUARANTEE: ZERO BLACK-BOX MACHINE LEARNING.**
All performance predictions, early warning triggers, and intervention recommendations are computed using transparent weighted scoring formulas, hand-coded Ordinary Least Squares (OLS) linear regression, and rule-based pedagogical intervention trees written in pure TypeScript.

---

## ⚡ Quick Start & Setup Commands

### 1. Prerequisites
- Node.js v18+ or v20+ (v24 supported)
- npm or pnpm

### 2. Installation & Database Setup
```bash
# 1. Install dependencies
npm install

# 2. Push SQLite database schema (dev.db)
npx prisma db push

# 3. Seed 150 realistic synthetic students & 3 demo accounts
npx tsx scripts/seed.ts

# 4. Run unit tests verifying engine math & regression logic
npx tsx --test tests/engine.test.ts

# 5. Start the development server
npm run dev
```

The application is now live at `http://localhost:3000`.

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Faculty Advisor** | `teacher@acadrisk.edu` | `Teacher@123` | Full dashboard, student dossiers, what-if simulator |
| **Dean / Admin** | `admin@acadrisk.edu` | `Admin@123` | Full institutional cohort telemetry, batch CSV analysis |
| **Student** | `student@acadrisk.edu` | `Student@123` | Personal academic hub, improvement plan checklist |

*(Clickable one-touch role selectors are provided on the `/login` page for instant evaluation).*

---

## 🏛 System Architecture & Mathematical Engine

```mermaid
graph TD
    A[Student Telemetry: Attendance, Internals, GPA, Study Hours, Backlogs] --> B[Smart Analysis Engine /lib/engine]
    B --> C[1. Weighted Scoring Formula 0-100]
    B --> D[2. Hand-Coded OLS Linear Regression Trend]
    C --> E[3. Blended Exam Projection: 70% Trend + 30% Score]
    E --> F[4. Risk Level: Low >=70 | Med 50-69 | High <50]
    F --> G[5. Early Warning Flags: Att <75% or 3 Drops]
    G --> H[6. Factor Attribution: Top 3 Negative Drivers]
    H --> I[7. Prioritized Pedagogical Recovery Blueprint]
```

### 1. Multi-Factor Formula ($S_{current}$)
$$S_{current} = \min\Big(100, \max\big(0, \sum w_i \cdot x_i^{norm} - P\big)\Big)$$

- **Attendance (20%)**: Direct percentage (0-100%)
- **Internal Marks (30%)**: 3 internal tests averaged across 5 core subjects (0-100%)
- **Assignment Submissions (15%)**: Completion rate (0-100%)
- **Prior GPA (15%)**: Linearly scaled $(GPA / 10.0) \times 100$
- **Study Hours (10%)**: Scaled against 20h target: $\min(100, (Hours / 20) \times 100)$
- **Participation (5%)**: Scaled $(Participation / 5) \times 100$
- **Penalties ($P \le 5.0$)**: $\min(5.0, 2.0 \times Backlogs + 0.75 \times LateSubmissions)$

### 2. Hand-Coded Linear Regression (OLS)
Given 6-month historical evaluation points $(x_i, y_i)$:
$$m = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \quad c = \bar{y} - m\bar{x}$$

Exam month projection blends **70% linear trend forecast** + **30% current weighted score**.

---

## 🧭 Page Sitemap

- `/` — Cinematic Landing Page with GSAP ScrollTrigger storytelling and Lenis smooth scrolling.
- `/login` — One-click role selector (Student / Teacher / Admin) with bcrypt hashed verification.
- `/dashboard` — Faculty console: KPIs, risk donut, 6-month cohort trend line, attendance scatter plot, class-subject heatmap, and filterable student registry.
- `/student/[id]` — Student Risk Dossier: OLS trajectory chart, top 3 negative drivers, what-if sliders, and printable report.
- `/analyze` — Stateless sandbox to test any custom student metrics instantly.
- `/batch` — High-throughput CSV batch scanner with instant export.
- `/how-it-works` — Visual formula inspector, OLS derivation, and ethical AI safeguards.
- `/student-view` — Student self-service portal with personal goal simulator and improvement checklist.
- `/report/[id]` — Formal academic dossier formatted for printing or saving as PDF.

---

## 🎨 Items to Supply (Per User Request)

1. **Figma Link**: If a design link is provided, update colors/spacing according to Figma tokens.
2. **Higgsfield Video Media**: Production-ready prompts and specs are located in [`/docs/higgsfield-prompts.md`](./docs/higgsfield-prompts.md). Once generated, place `hero-loop.mp4`, `data-stream.mp4`, and `risk-alert.mp4` into [`/public/media/`](./public/media/). Until added, the application operates seamlessly with built-in SVG gradient fallbacks.

---

## 🛡 Ethical Disclaimer
AcadRisk is an assistive decision-support framework designed for educators and academic counselors. It does not replace human faculty judgment, and must never be used to penalize, rank publicly, or stigmatize students.
>>>>>>> 9b35ca1 (feat: AcadRisk university portal with Nordic Slate & Frost Blue theme)
