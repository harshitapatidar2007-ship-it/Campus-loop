# CampusLoop ⟲
### University Circular Economy & Academic Resource Exchange Platform
> *"Give resources another semester."*

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_RLS-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_%2B_Local_NLP-orange?style=flat&logo=google)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Tests-9_Passing-brightgreen)](https://nodejs.org/)

---

## 1. Executive Summary & Problem Statement

Every academic semester, undergraduate students spend thousands of rupees on core curriculum textbooks, reference manuals, mini-drafters, scientific calculators, lab coats, and electronics project kits. 

These resources are heavily used for only **14 to 16 weeks**, after which they sit idle in hostel cupboards while the incoming junior batch is forced to purchase brand-new copies at full retail price.

**CampusLoop** is a campus-verified peer-to-peer resource circulation platform that connects the supply and demand of academic gear within verified university boundaries.

### Core Value Proposition
- **Buy Less. Learn More:** Reduces average semester resource expenses by 70%+.
- **Zero Postage / Zero Waste:** Exchanges happen face-to-face at monitored campus landmarks.
- **Two-Sided Handover Security:** Transactions are confirmed with cryptographic 6-digit one-time codes (OTP) upon in-person physical inspection.
- **Pass Knowledge Forward:** Knowledge and equipment stay in active circulation semester after semester.

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Client Layer
        A[Next.js App Router Web App]
        B[Interactive Demo Bar & Role Switcher]
        C[CampusLoop Intelligence AI Modal]
    end

    subgraph Business Logic & State Engine
        D[Campus Store & State Machine]
        E[Concurrency & Lock Controller]
        F[Two-Sided Handover OTP Engine]
        G[Demand Matching & Wishlist Detector]
    end

    subgraph AI Intelligence Layer
        H[Gemini 1.5 Flash API]
        I[Semantic NLP & Academic Acronym Engine Fallback]
    end

    subgraph Persistence Layer
        J[(Supabase PostgreSQL + RLS)]
        K[(Local Client Storage)]
    end

    A --> D
    B --> D
    C --> H
    C --> I
    D --> E
    D --> F
    D --> G
    D --> J
    D --> K
```

---

## 3. Database Schema & Concurrency Safety

The database schema (`supabase/migrations/01_initial_schema.sql`) implements strict Row-Level Security (RLS), foreign key cascades, and unique conditional indexes to guarantee **zero double-reservations**:

```mermaid
erDiagram
    CAMPUSES ||--o{ DEPARTMENTS : contains
    CAMPUSES ||--o{ PICKUP_POINTS : designates
    CAMPUSES ||--o{ PROFILES : verifies
    PROFILES ||--o{ LISTINGS : owns
    LISTINGS ||--o{ REQUESTS : targets
    PROFILES ||--o{ REQUESTS : initiates
    REQUESTS ||--o{ CHAT_MESSAGES : contextualizes
    REQUESTS ||--o{ REVIEWS : concludes
    PROFILES ||--o{ WISHLISTS : monitors

    PROFILES {
        uuid id PK
        string name
        string email
        string student_id
        boolean is_verified
        numeric rating
        int completed_exchanges
    }

    LISTINGS {
        uuid id PK
        uuid owner_id FK
        string title
        string category
        string condition
        string listing_type
        numeric price
        numeric original_price
        string availability_status
    }

    REQUESTS {
        uuid id PK
        uuid listing_id FK
        uuid requester_id FK
        uuid owner_id FK
        string status
        string handover_code
        int handover_attempts
        string return_due_date
    }
```

### State Machine Lifecycle
```text
REQUESTED ──> ACCEPTED ──> HANDOVER_PENDING ──> COMPLETED (Sell/Donate)
    │             │                               │
    │             ├──> CANCELLED                  └──> RETURN_PENDING ──> RETURNED (Borrow)
    └──> REJECTED
```

---

## 4. Live Hackathon Demonstration (2–3 Minutes)

The application features a built-in **Judge Walkthrough Toolbar** with instant 1-click persona switching.

### Step-by-Step Scenario:

| Step | Persona | Action | Expected Output |
| :--- | :--- | :--- | :--- |
| **1. The Need** | 👨‍🎓 **Aarav** (2nd Yr CSE) | Opens Marketplace, searches `"DBMS"`. | Real seeded listing appears: *Database System Concepts (6th Ed)* by Priya Patel for **₹250** (New: ₹900). |
| **2. Reserve** | 👨‍🎓 **Aarav** | Clicks listing & submits request with pickup at **Central Library Entrance**. | Status becomes `REQUESTED`. Owner receives in-app alert. |
| **3. Accept** | 👩‍🎓 **Priya** (3rd Yr CSE) | Click **"Priya (Seller)"** on the top Demo Bar. Opens Requests & clicks **"Accept Request"**. | System locks the listing atomically (`reserved`) and generates a cryptographic **6-digit handover OTP code**. |
| **4. Handover** | 👨‍🎓 **Aarav** | Switch to **Aarav**. Opens Transaction Tracker. | Aarav sees his secret OTP code: `492817`. |
| **5. Verification** | 👩‍🎓 **Priya** | Switch back to **Priya**. Enters `492817` and clicks **"Verify Handover"**. | **Confetti celebration triggers!** Transaction marked `COMPLETED`. |
| **6. Real Impact** | Anyone | Navigate to **Campus Impact Dashboard** (`/impact`). | Aarav saved **₹650**; total university savings and CO₂ offsets update dynamically in real time. |

---

## 5. Demo Accounts

| Role | Name | Email | Badges | Focus Area |
| :--- | :--- | :--- | :--- | :--- |
| **Student Buyer** | Aarav Sharma | `aarav.23cse@aitr.ac.in` | Campus Verified, Fast Responder | 2nd Year CSE (Sem 4) looking for DBMS & OS resources |
| **Student Seller** | Priya Patel | `priya.22cse@aitr.ac.in` | Top Circulator, 14 Exchanges | 3rd Year CSE (Sem 6) passing down textbooks & lab kits (WA: `+919876543210`) |
| **Campus Moderator** | Prof. K. Ramanathan | `k.ramanathan@aitr.ac.in` | Faculty Advisor, Official Mod | Inspects reports, disputes, and student safety |
| **Administrator** | Harshita Patidar | `harshita.patidar@aitr.ac.in` | Dean Office, System Admin | Manages campus pickup points, departments & audit log at AITR |

---

## 6. WhatsApp Instant Borrow Integration

CampusLoop includes direct **WhatsApp messaging integration**:
- **Owner WhatsApp on Listing**: When students post a book or instrument, they specify their direct WhatsApp contact number.
- **Instant "Borrow Now" Direct Message**: Clicking **"Borrow Now"** or requesting a resource immediately dispatches a formatted message directly to the real user's WhatsApp number.
- **Dual Mode (Cloud API & Direct wa.me Link)**:
  - Supports **WhatsApp Cloud API** (`WHATSAPP_API_KEY`, `WHATSAPP_PHONE_NUMBER_ID`) via `/api/whatsapp/send`.
  - Automatically falls back to high-conversion direct browser WhatsApp links (`https://wa.me/...`) for instant one-click chatting on both mobile phones and desktop WhatsApp Web.

---

## 6. Environmental & Affordability Methodology

CampusLoop adheres to open sustainability reporting standards and does **not** invent speculative carbon numbers:

1. **Carbon Offset (~2.5 kg CO₂e / item):**
   - Incorporates avoidance of industrial virgin papermaking, toxic bleaching, synthetic binding glues, long-haul freight transit, and packaging.
2. **Water Conservation (~50 Liters / item):**
   - Derived from standard paper mill water consumption requirements per 800-page academic textbook.
3. **Forest Conservation (1 Tree / 24 Textbooks):**
   - Based on standard 30-foot commercial pulpwood pine yield estimates.

---

## 7. Quickstart & Installation (Under 60 Seconds)

### Prerequisites
- Node.js v18.0 or higher
- npm v9.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/your-org/campusloop.git
cd campusloop
npm install
```

### 2. Configure Environment (Optional)
CampusLoop runs immediately out-of-the-box in zero-config demo mode! To enable live Gemini AI or cloud Supabase:
```bash
cp .env.example .env.local
```
Add your optional keys:
- `NEXT_PUBLIC_GEMINI_API_KEY`: For live Gemini 1.5 Flash conversational queries.
- `NEXT_PUBLIC_SUPABASE_URL`: For hosted Supabase cloud database.

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Unit & Workflow Tests
```bash
npm test
```
All 9 unit and integration tests execute in under 300ms using the high-performance Node test runner.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 8. License & University Adoption
Built with 💚 for university students worldwide. Released under the MIT License.
Give resources another semester.
