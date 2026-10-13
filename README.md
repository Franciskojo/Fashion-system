# 🧵 StitchFlow — Tailoring Business & Fashion School Management System

> **"One System. Many Possibilities."**  
> *Students, Workers, Customers and Your Entire Tailoring Business — All in One Place.*  
> *"More Than Tailoring, It's a Future" • Designing People • Creating Opportunities • Stitching the Future*

---

## 🌟 Overview

**StitchFlow** is a modern, unified Enterprise Resource Planning (ERP) and Academy Management System tailored specifically for bespoke fashion houses, tailoring workshops, and apparel design academies.

Built with **React, Next.js (App Router), TypeScript, Tailwind CSS, and MongoDB/Mongoose**.

---

## 🎯 5 Integrated Portals & User Roles

| Role | Target Persona | Key Capabilities & Workflows |
| :--- | :--- | :--- |
| **👑 Owner** | Madame Evelyn Osei | High-level KPI summary cards (`120` Students, `15` Staff present, `48` Active orders, `GH₵ 12,450` Revenue), Monthly Performance curves, Financial audits, Quick Action dispatchers. |
| **🏢 Admin / Reception** | Kwesi Darko | Student enrollment, staff management, workshop job distribution, daily master attendance log (QR / PIN check-in), tuition fee recording. |
| **🎓 Student Hub** | Ama Mensah | Personalized dashboard, QR code & PIN classroom check-in, syllabus & module tracker, tuition installment payments, verified digital diploma with printable certificate and gold seal. |
| **🪡 Worker Portal** | Akosua Boateng | Interactive Shift Terminal (**Clock In / Clock Out**), live garment cutting/sewing/finishing pipeline with commission earnings, transparent payroll calculation (Base + Per-piece commission), leave requests. |
| **👗 Customer Hub** | Nana Yaa Agyemang | Custom haute couture ordering wizard, interactive visual body measurement guide, and live 6-step progress tracker: **Received ➔ Designing ➔ Sewing ➔ Finishing ➔ Ready ➔ Delivered**. |

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 16 (App Router with Server Actions & API Handlers)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Database Layer**: MongoDB / Mongoose with dual-mode fallback (works seamlessly out of the box with zero external dependencies, or connects directly to MongoDB Atlas via `MONGODB_URI`)
- **Design System**: Rich purple/fuchsia brand palette, emerald academy accents, warm amber workshop tones, and rose haute couture accents.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. (Optional) Configure MongoDB
Create a `.env.local` file from `.env.example`:
```env
MONGODB_URI=mongodb://localhost:27017/stitchflow
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Reference

- `GET /api/students` — Retrieve student roster
- `POST /api/students` — Enroll a new fashion student
- `PUT /api/students` — Record tuition fee payments & module milestones
- `GET /api/workers` — Retrieve artisan and staff roster
- `POST /api/workers` — Register new tailor/staff member
- `PUT /api/workers` — Toggle clock in/out shift status
- `GET /api/orders` — List active bespoke garment orders
- `POST /api/orders` — Place bespoke custom order with measurements
- `PUT /api/orders` — Advance garment production status & record deposits
- `GET /api/attendance` — View check-in records
- `POST /api/attendance` — Submit QR or PIN attendance
- `GET /api/payroll` — View payroll and commission slips
- `POST /api/payroll` — Generate monthly payroll
- `GET /api/certificates` — View verified graduation diplomas
- `POST /api/certificates` — Issue official academy certificate
- `GET /api/courses` — Retrieve curriculum syllabi and course fees
- `GET /api/stats` — High-level enterprise operational KPIs
